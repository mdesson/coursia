import mongoose from 'mongoose'

const Schema = mongoose.Schema

const SectionSchema = new Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  weekDays: { type: [Boolean], required: true },
  startTime: { type: String },
  startTime: { type: String },
  room: { type: String },
  building: { type: String },
  campus: { type: String },
  status: { type: String, required: true },
  classNumber: { type: Number, required: true },
  component: { type: String, required: true },
  section: { type: String, required: true },
  courseId: { type: Number, required: true },
  classEnrollmentCap: { type: Number, required: true },
  classEnrollmentTotal: { type: Number, required: true },
  classWaitCap: { type: Number, required: true },
  classWaitTotal: { type: Number, required: true },
  combinedWaitTotal: { type: Number, required: true },
  combinedWaitCap: { type: Number, required: true },
  combinedEnrollmentTotal: { type: Number, required: true },
  combinedEnrollmentCap: { type: Number, required: true },
  combinedSectionsId: { type: Number, required: true },
  termCode: { type: Number, required: true },
  sessionCode: { type: String, required: true }
})

module.exports = mongoose.model('Section', SectionSchema)
