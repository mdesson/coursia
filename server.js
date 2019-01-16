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
    res.render('index', {catalog: null, error: null})
})

app.post('/', function (req, res) {
    // form data
    let subject = req.body.subject
    let catalog = req.body.catalog
    
    // get courseid from courseids.json
    let courseid = id.filter(course => course.subject == subject && course.catalog == catalog)[0].ID
    
    // request URLs for open data portal
    let sched_url = `https://opendata.concordia.ca/API/v1/course/schedule/filter/${courseid}/*/*`
    let cat_url = `https://opendata.concordia.ca/API/v1/course/catalog/filter/${subject}/${catalog}/*`
    let desc_url = `https://opendata.concordia.ca/API/v1/course/description/filter/${courseid}`
    
    // basic authorization using data from config.json
    let auth = "Basic " + new Buffer(config.apiUser + ":" + config.apiKey).toString("base64");
    
    // requests to open data api
    let cat = request( {url: cat_url, headers: {"Authorization": auth}}, function (err, response, body) {
        console.log("REQUEST: course catalog")
        return JSON.parse(body)
    })
    let sched = request( {url: sched_url, headers: {"Authorization": auth}}, function (err, response, body) {
        console.log("REQUEST: schedule") 
        return JSON.parse(body)
    })
    let desc = request( {url: desc_url, headers: {"Authorization": auth}}, function (err, response, body) {
        console.log("REQUEST: description")
        return JSON.parse(body).description
    })

    // render search results
    res.render('index', {catalog: cat[0], schedule: sched, description: desc, error: null})
    console.log("RENDER: index, search results")
})

app.listen(3000, function () {
    console.log('Coursia listening on port 3000')
})