var mongoose = require('mongoose')

const Schema = mongoose.Schema

const SectionSchema = new Schema({
  weekDays: { type: [Boolean], required: true },
  startTime: { type: String },
  endTime: { type: String },
  room: { type: String },
  building: { type: String },
  campus: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  classNumber: { type: Number, required: true },
  component: {
    type: String,
    required: true
  },
  section: { type: String, required: true },
  courseId: { type: Number, required: true },
  enrollmentCapacity: { type: Number },
  enrollmentTotal: { type: Number },
  waitCapacity: { type: Number },
  waitTotal: { type: Number },
  termCode: { type: Number, required: true },
  sessionCode: { type: String, required: true, enum: ['13W', '26W'] },
  term: { type: Schema.Types.ObjectId, ref: 'Term', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true }
})

module.exports = mongoose.model('Section', SectionSchema)
