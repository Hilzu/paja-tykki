import express from 'express'
import fetch from 'node-fetch'
import pajaify from './pajaify'

const app = express()
app.set('x-powered-by', false)

const sourceUrl = 'http://www.iltalehti.fi'
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/601.5.17 (KHTML, like Gecko) Version/9.1 Safari/601.5.17'
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

const server = app.listen(3000, 'localhost', () => {
  const host = server.address().address
  const port = server.address().port

  console.log('Listening at http://%s:%s', host, port)
})
