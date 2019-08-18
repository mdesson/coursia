var axios = require('axios')
var fs = require('fs')

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
    const descriptionRes = await axios.get(descriptionURL, { auth })
    const termRes = await axios.get(termURL, { auth })
    const scheduleRes = await axios.get(scheduleURL, { auth })
    const courseRes = await axios.get(courseURL, { auth })

    const data = {
      descriptions: { ...descriptionRes.data },
      terms: { ...termRes.data },
      schedules: { ...scheduleRes.data },
      courses: { ...courseRes.data }
    }

    return data
  } catch (error) {
    console.log(error)
  }
}

const updateData = async () => {
  console.log('Requesting new data')
  console.log('Saving to Mongo')
}

const rebuildDatabase = async () => {
  console.log('Dropping all collections')
  console.log('Requesting new data')
  console.log('Saving to mongo')
}

const concordiaAPI = {
  buildCollections: async () => {
    console.log('Querying API for all data')
    console.log('This typically takes approximately two minutes')
    const data = await requestData()

    console.log('Request complete')
    console.log('Processing data and saving to mongo')
  }
}

module.exports = concordiaAPI
