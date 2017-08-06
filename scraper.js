// Include npm packages and node modules.
const fs = require('fs'),
      scrapeIt = require('scrape-it'),
      json2csv = require('json2csv');

// Global variables.
let fields = ['title', 'price', 'image', 'url', 'time'],
    fieldNames = ['Title', 'Price', 'ImageURL', 'URL', 'Time'],
    date = new Date(),
    year = date.getFullYear().toString(),
    month = editTime(date.getMonth() + 1),
    day = editTime(date.getDate()),
    today = `${year}-${month}-${day}`,
    timestamp = `${today} ${date.getHours()}:${date.getMinutes()}`,
    result = [];

// Helper function to format time to two digits.
function editTime(time){
  if((time.toString()).length === 1){
    return '0' + time;
  } else{
    return time.toString();
  }
}

// If data directory doesn't exist, create it.
if (!fs.existsSync('./data')) {fs.mkdirSync('./data')}

// Pass in url to scrapeIt and get the href attribute values from the products div.
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
  // Map full url from uri's retrieved from scraping links.
  shirts = shirts.map(shirt => { return {url:`http://shirts4mike.com/${shirt.url}`}});
  // For each url, visit and scrape needed data.
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
    // Save data on shirt object.
      shirt.title = data.title;
      shirt.price = data.price;
      shirt.image = data.image;
      shirt.time = timestamp;
      result.push(shirt);
    }).then(() => {
    // Use json2csv to create a CSV with data stored in results array.
      let csv = json2csv({data: result, fields: fields, fieldNames: fieldNames});
      let fileName = `./data/${today}.csv`;
    // Use node fs package to write csv to data directory with today's date as filename.
      fs.writeFile(fileName, csv, (err) => {
        if (err) throw err;
      });
    });
  });
  // Give error if program  is unable to connect to http://shirts4mike.com.
}).catch(error => {
  let errorMessage = `[${timestamp}] Cannot connect to http://shirts4mike.com.\n`;
  let fileName = `./data/scraper-error.log`;
  // Create logfile of error if one does not exist, append error to logfile.
  fs.appendFile(fileName, errorMessage, (err) => {
    if (err) throw err;
    console.error(errorMessage);
  });
});
