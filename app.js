const express = require('express')
const fetch = require('node-fetch')
const pajaify = require('./pajaify')

const app = express()
app.set('x-powered-by', false)

const sourceUrl = 'http://www.iltalehti.fi'
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14'
const expireTime = new Date()
expireTime.setFullYear(expireTime.getFullYear() + 1)
const preventMobileSiteCookie = `ILChooseMobile=false; expires=${expireTime.toUTCString()}; domain=.iltalehti.fi; path=/`

app.all('*', (req, res, next) => {
  fetch(sourceUrl + req.originalUrl, { headers: { 'User-Agent': userAgent, Cookie: preventMobileSiteCookie } })
    .then((res) => res.text())
    .then(pajaify)
    .then((pajareissa) => {
      res.header('Set-Cookie', preventMobileSiteCookie)
      res.cookie('ILChooseMobile', 'false', { domain: req.hostname, expires: expireTime })
      res.send(pajareissa)
    })
    .catch((err) => next(err))
})

app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(500).send('Everything broke :(')
})

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000
const server = app.listen(port, host, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('Listening at http://%s:%s', host, port)
})
