import 'babel-core/register'
import express from 'express'
import fetch from 'node-fetch'

const app = express()
app.set('x-powered-by', false)

const sourceUrl = 'http://www.iltalehti.fi'
const userAgent = 'User-Agent	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/601.2.7 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.7'

app.all('*', (req, res, next) => {
  fetch(sourceUrl, { headers: { 'User-Agent': userAgent } })
    .then((res) => res.text())
    .then(body => {
      res.send(body)
    })
    .catch((err) => next(err))
})

app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(500).send('Everything broke :(')
})

const server = app.listen(3000, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('Listening at http://%s:%s', host, port)
})
