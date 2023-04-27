const express = require('express')
const { SearchEngine } = require('portable-search-engine')
const searchEngineInstance = new SearchEngine()

const app = express()
const port = 3000

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/index', (req, res) => {
  searchEngineInstance.index(req.body.text)

  res.render('success', {content: req.body.text})
})

app.get('/search', (req, res) => {
  let results = searchEngineInstance.search(req.query.query)
  res.render('results', results)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})