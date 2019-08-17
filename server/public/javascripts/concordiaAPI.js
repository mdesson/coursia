var axios = require('axios')
var fs = require('fs')

// set up auth credentials
const rawConfig = fs.readFileSync('config.json')
const config = JSON.parse(rawConfig)
const auth = { username: config.apiUser, password: config.apiKey }

// query URLs
const descriptionURL =
  'https://opendata.concordia.ca/API/v1/course/description/filter/*'
const termURL =
  'https://opendata.concordia.ca/API/v1/course/session/filter/*/*/*'
const scheduleURL =
  'https://opendata.concordia.ca/API/v1/course/schedule/filter/*/*/*'
const courseURL =
  ' https://opendata.concordia.ca/API/v1/course/catalog/filter/*/*/*'

const concordiaAPI = async () => {
  try {
    descriptionRes = await axios.get(descriptionURL, { auth })
    termRes = await axios.get(termURL, { auth })
    scheduleRes = await axios.get(scheduleURL, { auth })
    courseRes = await axios.get(courseURL, { auth })

    data = {
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

module.exports = concordiaAPI
