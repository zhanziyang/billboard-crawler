const Crawler = require('crawler')
const moment = require('moment')
const { string2Route, splitArtists } = require('./utils')

class BillboardCrawler {
  constructor () {
    this.crawler = new Crawler()
    this.baseUrl = 'https://www.billboard.com'
  }

  getChart (chartName = 'Hot 100', date) {
    return new Promise((resolve, reject) => {
      this.crawler.direct({
        uri: `${this.baseUrl}/charts/${string2Route(chartName)}/${date || ''}`,
        callback: function (err, res, done) {
          if (err) {
            reject(err)
          } else {
            const $ = res.$
            const chartName = $('.chart-name')
              .find('img')
              .eq(0)
              .attr('alt')
            const currentDate = $('.chart-nav')
              .find('time[datetime]')
              .attr('datetime')
            const $rows = $('article.chart-row')
            const prevLink = $("a[title='Previous Week']").attr('href')
            const nextLink = $("a[title='Next Week']").attr('href')
            const entries = $rows.map(function (i) {
              const $row = $(this)
              const tendency = $row
                .find('.chart-row__history')
                .attr('class')
                .match(/chart-row__history--(rising|falling|steady|none)/)[1]
              const rank = +$row.find('.chart-row__current-week').text()
              const lastPosMatch = $row
                .find('.chart-row__last-week')
                .text()
                .match(/\d+/)
              const lastPos = lastPosMatch ? +lastPosMatch[0] : null
              const title = $row
                .find('.chart-row__song')
                .text()
                .trim()
              const displayArtist = $row
                .find('.chart-row__artist')
                .text()
                .trim()
              const artistNames = splitArtists(displayArtist)
              const topSpot = +$row.find('.chart-row__top-spot .chart-row__value').text()
              const weeksOnChart = +$row.find('.chart-row__weeks-on-chart .chart-row__value').text()
              const isNew = !!$row.find('.chart-row__new-indicator').length

              return {
                rank,
                lastPos,
                tendency,
                title,
                displayArtist,
                artistNames,
                topSpot,
                weeksOnChart,
                isNew
              }
            })
            resolve({
              chartName,
              entries: entries.get(),
              currentDate,
              prevDate: prevLink ? prevLink.match(/\/(\d\d\d\d-\d\d-\d\d)/)[1] : null,
              nextDate: nextLink ? nextLink.match(/\/(\d\d\d\d-\d\d-\d\d)/)[1] : null,
              prevLink,
              nextLink,
              fetchTime: Date.now()
            })
          }
        }
      })
    })
  }

  getYearEndChart (chartName = 'Hot 100 Songs', year = moment().year() - 1) {
    return new Promise((resolve, reject) => {
      this.crawler.direct({
        uri: `${this.baseUrl}/charts/year-end/${year}/${string2Route(chartName)}`,
        callback: function (err, res, done) {
          if (err) {
            reject(err)
          } else {
            const $ = res.$
            const chartName = $('.chart-detail-header__chart-name').text()
            const $rows = $('article.ye-chart-item')
            const entries = $rows.map(function (i) {
              const $row = $(this)
              const rank = +$row.attr('data-item-rank')
              const title = $row
                .find('.ye-chart-item__title')
                .text()
                .trim()
              const displayArtist = $row
                .find('.ye-chart-item__artist')
                .text()
                .trim()
              const artistNames = displayArtist.split(/, | & | Featuring | Or | x /).map(item => item.trim())

              return {
                rank,
                title,
                displayArtist,
                artistNames
              }
            })
            resolve({
              year,
              chartName,
              entries: entries.get(),
              fetchTime: Date.now()
            })
          }
        }
      })
    })
  }

  getArtistChartHistory (artist, chartName = 'Hot 100') {
    return new Promise((resolve, reject) => {
      this.crawler.direct({
        uri: `${this.baseUrl}/music/${string2Route(artist)}/chart-history/${string2Route(chartName)}/`,
        callback: (err, res, done) => {
          if (err) {
            reject(err)
          } else {
            const $ = res.$
            const stats = $('.artist-section--chart-history__stats__stat')
              .map(function () {
                return $(this)
                  .text()
                  .trim()
              })
              .get()
            var no1Hits = 0
            var top10Hits = 0
            var totalSongs = 0
            stats.forEach(stat => {
              let result
              if ((result = stat.match(/(\d+) No. 1 Hits/i))) {
                no1Hits = +result[1]
              }

              if ((result = stat.match(/(\d+) Top 10 Hits/i))) {
                top10Hits = +result[1]
              }

              if ((result = stat.match(/(\d+) Songs/i))) {
                totalSongs = +result[1]
              }
            })
            const totalPages = Math.ceil(totalSongs / 10)
            const entries = []
            getArtistHistoryEntriesOfPage($, entries)
            const promises = []
            for (var i = 2; i <= totalPages; i++) {
              promises.push(
                new Promise((resolve, reject) => {
                  this.crawler.direct({
                    uri: `${this.baseUrl}/music/${string2Route(artist)}/chart-history/${string2Route(chartName)}/${i}`,
                    callback: function (err, res, done) {
                      if (err) {
                        reject(err)
                      } else {
                        getArtistHistoryEntriesOfPage(res.$, entries)
                        resolve()
                      }
                    }
                  })
                })
              )
            }

            Promise.all(promises).then(() => {
              resolve({
                no1Hits,
                top10Hits,
                totalSongs,
                entries: entries.sort((a, b) => a.index - b.index)
              })
            }, reject)
          }
        }
      })
    })
  }
}

function getArtistHistoryEntriesOfPage ($, arr) {
  const $rows = $('.artist-section--chart-history__title-list__title')
  $rows.each(function () {
    const title1 = $(this)
      .attr('data-title')
      .trim()
    const title2 = $(this)
      .find('.artist-section--chart-history__title-list__title__text--title')
      .text()
      .trim()
    const href = $(this)
      .find('.artist-section--chart-history__title-list__title__text--title')
      .attr('href')
    const artist = $(this)
      .find('.artist-section--chart-history__title-list__title__text--artist-name')
      .text()
      .trim()
    const peakInfo = $(this)
      .find('.artist-section--chart-history__title-list__title__text--peak-rank')
      .text()
      .trim()
    const [, peakRank, month, date, year] = peakInfo.match(/#(\d+).*on (\d+).(\d+).(\d+)/)
    const indexInfo = $(this)
      .find('.artist-section--chart-history__title-list__title__chevron-and-index-holder__index')
      .text()
      .trim()
    arr.push({
      title: title1 === title2 ? title1 : title2,
      songId: href.substring(href.lastIndexOf('/') + 1),
      displayArtist: artist,
      artists: splitArtists(artist),
      peakRank: +peakRank,
      peakDate: `${year}-${month}-${date}`,
      index: +indexInfo.slice(0, indexInfo.search(' of'))
    })
  })
}

module.exports = BillboardCrawler
