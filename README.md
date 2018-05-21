# billboard-crawler

Billboard music chart unofficial API in Node.js

## Install

```bash
$ npm install billboard-crawler
```

## Usage

## `new BillboardCrawler()`

### Constructor

```javascript
// import the npm module as a class constructor
const BillboardCrawler = require('billboard-crawler')

// new it up
const billboard = new BillboardCrawler()
```

### Methods

```js
billboard.getChart(chartName?, date?)
```

* `chartName`: The chart name, e.g. `'Hot 100'` or `'Pop Songs'`. You can browse the Charts page on Billboard.com to find valid chart names; the URL of a chart will look like http://www.billboard.com/charts/CHART-NAME (example). By default `'Hot 100'` chart is fetched.
* `date`: The chart date as a string, in `YYYY-MM-DD` format. By default, the latest chart is fetched.

```js
billboard.getYearEndChart(chartName?, year?)
```

* `chartName`: The chart name, e.g. `'Hot 100 Songs'` or `'Top Artists'`. You can browse the Charts page https://www.billboard.com/charts/year-end. By default `'Hot 100 Songs'` chart is fetched.
* `year`: For example `2008`. By default, last year's year-end chart is fetched.

```js
billboard.getArtistChartHistory(artist, chartName?)
```

* `artist`: Arist's name, e.g. `'Rihanna'` or `'Taylor Swift'`.
* `chartName`: Same as the `chartName` argument in `getChart` method.
