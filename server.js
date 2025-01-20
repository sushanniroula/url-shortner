const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config()
const ShortUrl = require('./models/shortUrl')

mongoose.connect(process.env.DB)

const app = express()

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    const allUrls = await ShortUrl.find()
    res.render('index', { allUrls: allUrls })
})

app.post('/createShortUrl', async (req, res) => {
    await ShortUrl.create({
        full: req.body.fullUrl
    })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl })
    if(shortUrl == null) return res.status(500)
    
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})



app.listen(process.env.PORT || 5000, () => console.log(`connected to ${process.env.PORT}`))