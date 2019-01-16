'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const fs = require('fs');
const app = express()

// load API keys and local settings
let rawdata = fs.readFileSync('config.json');  
let config = JSON.parse(rawdata);  
let id = JSON.parse(fs.readFileSync('./data/courseids.json', 'utf8'));

// Set up app
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index', {course: null, error: null})
})

app.post('/', function (req, res) {
    let subject = req.body.subject
    let catalog = req.body.catalog
    let courseid = id.filter(course => course.subject == subject && course.catalog == catalog)[0].ID
    let sched_url = `https://opendata.concordia.ca/API/v1/course/schedule/filter/${courseid}/${subject}/${catalog}`
    let cat_url = `https://opendata.concordia.ca/API/v1/course/catalog/filter/${subject}/${catalog}/*`
    let desc_url = `https://opendata.concordia.ca/API/v1/course/description/filter/${courseid}}*`
    let auth = "Basic " + new Buffer(config.apiUser + ":" + config.apiKey).toString("base64");
    
    request( {url: cat_url, headers: {"Authorization": auth}}, function (err, response, body) {
        cat = JSON.parse(body)
        courseid = cat[0].ID
        console.log("CAT\n" + cat)
    })
    request( {url: sched_url, headers: {"Authorization": auth}}, function (err, response, body) {
        sched = JSON.parse(body)
        console.log("SCHED\n" + sched)    
    })
    request( {url: desc_url, headers: {"Authorization": auth}}, function (err, response, body) {
        desc = JSON.parse(body).description
        console.log("SCHED\n" + desc)    
    })
    
    res.render('index', {catalog: cat[0], schedule: sched, description: desc, error: null})

})

app.listen(3000, function () {
    console.log('Coursia listening on port 3000')
})