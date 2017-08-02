const fs = require('fs');
const http = require('http');
const scrapeIt = require('scrape-it');

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
  console.log(shirts);
  shirts = shirts.map(shirt => { return {url:`http://shirts4mike.com/${shirt.url}`}});
  console.log(shirts);
  shirts.forEach(shirt => {
    let data = scrapeIt(shirt.url, {
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
      console.log(shirt);
    });
  });
});
