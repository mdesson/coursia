import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CourseSchema = new Schema({
  name: { type: String, required: true, max: 1 },
  subjectCode: { type: String, required: true, max: 1 },
  numberCode: { type: String, required: true, max: 1 },
  description: { type: String, required: true },
  degreeLevel: { type: String, required: true, max: 1 },
  credits: { type: Number, required: true },
  components: { type: [String], required: true },
  instructionMode: { type: String, required: true, max: 1 }
})

CourseSchema.vurtial('courseCode').get(
  () => `${this.subjectCode} ${this.numberCode}`
)

module.exports = mongoose.model('Course', CourseSchema)
