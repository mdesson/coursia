var express = require('express')
var router = express.Router()
var Course = require('../models/course')

const allCourses = async res => {
  const courses = await Course.find({}).exec()
  res.send(courses)
}

/* GET all courses. */
router.get('/courses', function(req, res, next) {
  allCourses(res)
})

module.exports = router
