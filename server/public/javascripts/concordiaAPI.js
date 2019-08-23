// external libraries
var axios = require('axios')
var fs = require('fs')
var moment = require('moment')

// models
var Term = require('../../models/term')
var Course = require('../../models/course')
var Section = require('../../models/section')

// set up auth credentials
const rawConfig = fs.readFileSync('config.json')
const config = JSON.parse(rawConfig)
const auth = { username: config.apiUser, password: config.apiKey }

// query URLs
const descriptionURL = 'https://opendata.concordia.ca/API/v1/course/description/filter/*'
const termURL = 'https://opendata.concordia.ca/API/v1/course/session/filter/*/*/*'
const scheduleURL = 'https://opendata.concordia.ca/API/v1/course/schedule/filter/*/*/*'
const courseURL = ' https://opendata.concordia.ca/API/v1/course/catalog/filter/*/*/*'

const requestData = async collections => {
  try {
    console.log('Querying API for all data')
    console.log('This typically takes approximately two minutes')

    let termRes = collections.includes('terms') ? await axios.get(termURL, { auth }) : { data: [] }
    const descriptionRes = collections.includes('courses') ? await axios.get(descriptionURL, { auth }) : { data: [] }
    const courseRes = collections.includes('courses') ? await axios.get(courseURL, { auth }) : { data: [] }
    const scheduleRes = collections.includes('sections') ? await axios.get(scheduleURL, { auth }) : { data: [] }

    console.log('Request complete')

    const data = {
      descriptions: [...descriptionRes.data],
      terms: [...termRes.data],
      schedules: [...scheduleRes.data],
      courses: [...courseRes.data]
    }

    return data
  } catch (error) {
    console.log(error)
  }
}

const updateClassRegistration = async () => {
  console.log('Update Class registration')
}

const updateTerms = async data => {
  console.log('Creating term objects')
  const terms = data.terms
    .filter(term => term.career === 'UGRD')
    .map(
      term =>
        new Term({
          code: term.termCode,
          startDate: moment(term.sessionBeginDate, 'MM/DD/YYYY').format('YYYY-MM-DDTHH:mm:ss'),
          endDate: moment(term.sessionEndDate, 'MM/DD/YYYY').format('YYYY-MM-DDTHH:mm:ss'),
          dateDescription: term.termDescription,
          session: term.sessionCode,
          sessionDescription: term.sessionDescription
        })
    )
  console.log('Saving to Mongo')
  for (let term of terms) {
    const query = await Term.find({ code: term.code }).exec()
    if (query.length) {
      Term.updateOne({ code: term.code }, term)
    } else {
      term.save(err => {
        if (err) console.log(err)
      })
    }
  }
}

const updateCourses = async data => {
  console.log('Creating course objects')
  // Create map of descriptions by Id
  let descriptions = new Object()
  data.descriptions.map(description => (descriptions[description.ID] = description.description))

  // create instatiate objects
  const courses = data.courses
    .filter(course => course.career === 'UGRD')
    .map(
      course =>
        new Course({
          courseId: course.ID,
          name: course.title,
          subjectCode: course.subject,
          numberCode: course.catalog,
          description: descriptions[course.ID],
          degreeLevel: course.career,
          credits: Number(course.classUnit),
          components: ['array of strings: Not in json, will have to be gathered from sections']
          // prerequisites: ['array of ObjectIds? Will have to go in second iteration'],
          // equivalencies: ['array of ObjectIds? Will have to go in second iteration']
        })
    )

  console.log('Saving to Mongo')
  for (let course of courses) {
    const query = await Course.find({ courseId: Number(course.ID) }).exec()
    if (query.length) {
      Course.updateOne({ courseId: Number(course.ID) }, course)
    } else {
      course.save(err => {
        if (err) console.log(err)
      })
    }
  }
}

const concordiaAPI = {
  updateAll: async () => {
    const data = await requestData(['terms', 'courses', 'sections'])
    Promise.all([updateTerms(data), updateCourses(data)])
  },
  updateTerms: async () => {
    const data = await requestData(['terms'])
    await updateTerms(data)
  },
  updateCourses: async () => {
    const data = await requestData(['courses'])
    await updateCourses(data)
  },
  updateSections: async () => {
    const data = await requestData(['sections'])
    // await updateSections(data)
  }
}

module.exports = concordiaAPI
