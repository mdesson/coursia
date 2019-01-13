'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const fs = require('fs');
const app = express()

// load API keys and local settings
let rawdata = fs.readFileSync('config.json');  
let config = JSON.parse(rawdata);  

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
    let career, courseid = "*"
    let sched_url = `https://opendata.concordia.ca/API/v1/course/schedule/filter/${courseid}/${subject}/${catalog}`
    let cat_url = `https://opendata.concordia.ca/API/v1/course/catalog/filter/${subject}/${catalog}/${career}`
    let auth = "Basic " + new Buffer(config.apiUser + ":" + config.apiKey).toString("base64");
    request( {url: cat_url, headers: {"Authorization": auth}}, function (err, response, body) {
        let courses = JSON.parse(body)
        console.log(courses)

        if (err) {res.render('index', {course: null, error: "Error, please try again"})}
        if (courses == undefined) {res.render('index', {course: null, error: "Course not found. Please try again."})}
        else {
            res.render('index', {course: courses, error: null})
        }
    })

})

app.listen(3000, function () {
    console.log('Coursia listening on port 3000')
})