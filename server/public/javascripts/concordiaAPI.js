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
  // TODO: Add class registration update
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
  console.log('Creating array of existing courseIds')
  let existingCourseIds = await Course.find({}, 'courseId').exec()
  existingCourseIds = existingCourseIds.map(course => course.courseId)

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
          // TODO: prerequisites: ['array of ObjectIds? Will have to go in second iteration'],
          // TODO: equivalencies: ['array of ObjectIds? Will have to go in second iteration']
        })
    )

  console.log('Saving to Mongo')
  for (let course of courses) {
    if (existingCourseIds.includes(course.courseId)) {
      Course.updateOne({ courseId: course.courseId }, course)
    } else {
      course.save(err => {
        if (err) console.log(err)
      })
    }
  }
}

const updateSections = async data => {
  console.log('Creating Term Map')
  let terms = await Term.find({}, '_id code', (err, res) => {
    if (err) console.log(err)
    else return res
  })
  let termMap = {}
  terms.map(term => (termMap[term.code] = term._id))

  console.log('Creating Course Map')
  let courses = await Course.find({}, '_id courseId', (err, res) => {
    if (err) console.log(err)
    else return res
  })
  let courseMap = {}
  courses.map(course => (courseMap[course.courseId] = course._id))

  console.log('Creating array of existing class numbers')
  let existingClassNumbers = await Section.find({}, 'classNumber', (err, res) => {
    if (err) console.log(err)
    else return res
  })

  existingClassNumbers = existingClassNumbers.map(section => section.classNumber)

  console.log('Creating section objects')
  let sections = new Array()
  const schedules = data.schedules.filter(schedule => schedule.career === 'Undergraduate')

  for (let schedule of schedules) {
    if (courseMap[schedule.courseID]) {
      const section = await new Section({
        weekDays: [
          schedule.mondays === 'Y',
          schedule.tuesdays === 'Y',
          schedule.wednesdays === 'Y',
          schedule.thursdays === 'Y',
          schedule.fridays === 'Y',
          schedule.saturdays === 'Y',
          schedule.sundays === 'Y'
        ],
        startTime: schedule.classStartTime.replace('.', ':'),
        endTime: schedule.classEndTime.replace('.', ':'),
        room: schedule.room,
        building: schedule.buildingCode,
        campus: schedule.locationCode,
        status: schedule.classStatus,
        classNumber: schedule.classNumber,
        component: schedule.componentCode,
        section: schedule.section,
        courseId: schedule.courseID,
        enrollmentCapacity: schedule.enrollmentCapacity,
        enrollmentTotal: schedule.currentEnrollment,
        waitCapacity: schedule.waitlistCapacity,
        waitTotal: schedule.currentWaitlistTotal,
        termCode: schedule.termCode,
        sessionCode: schedule.session,
        term: termMap[schedule.termCode],
        course: courseMap[schedule.courseID]
      })
      sections.push(section)
    }
  }

  console.log('Saving to Mongo')
  for (let section of sections) {
    if (existingClassNumbers.includes(section.classNumber)) {
      Section.updateOne({ classNumber: section.classNumber }, section)
    } else {
      section.save(err => {
        if (err) console.log(err)
      })
    }
  }
}

const concordiaAPI = {
  updateAll: async () => {
    const data = await requestData(['terms', 'courses', 'sections'])
    Promise.all([updateTerms(data), updateCourses(data), updateSections(data)])
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
    await updateSections(data)
  }
}

module.exports = concordiaAPI
