const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify=require('slugify');
const replaceTemplate=require('./modules/replaceTemplate')
///////////////////////////

// blocking synchronous
// const textIn=fs.readFileSync('input.txt','utf-8');
// console.log(textIn);

// const textOut=`this is what we know about sister: ${textIn}.\n Created on ${Date.now()}`;
// fs.writeFileSync('output.txt',textOut);
// console.log('File written');

// non blocking asynchronous
// fs.readFile('start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.error('Error reading start.txt:', err);

//   const filename = data1.trim(); // Removes spaces/newlines
//   fs.readFile(`${filename}.txt`, 'utf-8', (err, data2) => {
//     if (err) return console.error(`Error reading ${filename}.txt:`, err);

//     console.log(data2);
//     fs.readFile('append.txt','utf-8',(err,data3)=>{
//         console.log(data3);
//         fs.writeFile('final.txt',`${data2}\n${data3}`,'utf-8',(err)=>{
//             console.log("your file has been written");
//         })
//     })
//   });
// });

// console.log("will read file");

///////////////////////////


const tempOverview = fs.readFileSync("overview.html", "utf-8");
const tempCard = fs.readFileSync("card.html", "utf-8");
const tempProduct = fs.readFileSync("product.html", "utf-8");
const data = fs.readFileSync("data.json", "utf-8");
const dataObj = JSON.parse(data);
const slugs=dataObj.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs);

const server = http.createServer((req, res) => {
    const {query,pathname}=url.parse(req.url,true)
  
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cards = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output=tempOverview.replace('{%PRODUCT_CARDS%}',cards)
    res.end(output);
  } else if (pathname === "/product") {
    const product=dataObj[query.id];
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const output=replaceTemplate(tempProduct,product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
    // res.end('API');
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
