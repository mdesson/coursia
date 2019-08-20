var mongoose = require('mongoose')

const Schema = mongoose.Schema

const TermSchema = new Schema({
  code: { type: Number, required: true, max: 9999 },
  startDate: { type: String, required: true },
  endDate: { type: String },
  dateDescription: { type: String, required: true },
  session: { type: String, required: true },
  sessionDescription: { type: String, required: true }
})

module.exports = mongoose.model('Term', TermSchema)
