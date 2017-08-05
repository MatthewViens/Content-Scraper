# Content Scraper

Command line tool made in node that uses the scrape-it package in order to scrape
product information from the example website http://shirts4mike.com.

The app scrapes the product links off the main website and then visits those
links in order to get more detailed information about each product. The app
then uses the json2csv package to generate a CSV file containing the product
information. The CSV will be stored in the data directory and the filename will
by named by date. Subsequent scrapes done on the same day will overwrite the
current CSV.

If there is an error connecting to http://shirts4mike.com, the app will append a
log containing a timestamp and error message to the scraper-error file in the
data directory.

## How To Use
```npm install```

```npm start```

## Built With

* Javascript
* Node JS
* [scrape-it](https://github.com/IonicaBizau/scrape-it)
* [json2csv](https://github.com/zemirco/json2csv)

## Acknowledgments

* [Team Treehouse](https://teamtreehouse.com)
