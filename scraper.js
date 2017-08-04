const fs = require('fs');
const http = require('http');
const scrapeIt = require('scrape-it');
const json2csv = require('json2csv');
let fields = ['title', 'price', 'image', 'url', 'time'];
let fieldNames = ['Title', 'Price', 'ImageURL', 'URL', 'Time'];
let date = new Date();
let today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
let timestamp = `${today} ${date.getHours()}:${date.getMinutes()}`;
let result = [];

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

scrapeIt('http://shirts4mike.com/shirts.php', {
  shirts: {
    listItem: '.products li',
    data: {
      url: {
        selector: 'a',
        attr: 'href'
      }
    }
  }
}).then(shirts => {
  shirts = shirts.shirts;
  shirts = shirts.map(shirt => { return {url:`http://shirts4mike.com/${shirt.url}`}});
  shirts.forEach(shirt => {
    scrapeIt(shirt.url, {
      title: {
        selector: 'title'
      },
      price: {
        selector: '.price'
      },
      image: {
        selector: '.shirt-picture img',
        attr: 'src'
      }
    }).then(data => {
      shirt.title = data.title;
      shirt.price = data.price;
      shirt.image = data.image;
      shirt.time = timestamp;
      result.push(shirt);
    }).then(() => {
      let csv = json2csv({data: result, fields: fields, fieldNames: fieldNames});
      let fileName = `./data/${today}.csv`;
      fs.writeFile(fileName, csv, (err) => {
        if (err) throw err;
        console.log('CSV saved!');
      });
    });
  });
}).catch(error => {
  let errorMessage = `[${timestamp}] Cannot connect to http://shirts4mike.com.\n`;
  let fileName = `./data/scraper-error.log`;
  fs.appendFile(fileName, errorMessage, (err) => {
    if (err) throw err;
    console.error(errorMessage);
  });
});
