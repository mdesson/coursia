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

const updateClassRegistration = async () => {
  console.log('Update Class registration')
}

const requestData = async () => {
  try {
    console.log('Querying API for all data')
    console.log('This typically takes approximately two minutes')

    const descriptionRes = await axios.get(descriptionURL, { auth })
    const termRes = await axios.get(termURL, { auth })
    const scheduleRes = await axios.get(scheduleURL, { auth })
    const courseRes = await axios.get(courseURL, { auth })

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

const concordiaAPI = {
  buildCollections: async () => {
    const data = await requestData()
    console.log('Processing term data and saving to mongo')
    Promise.all([updateTerms(data)])
  }
}

module.exports = concordiaAPI
