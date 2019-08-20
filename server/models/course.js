var mongoose = require('mongoose')

const Schema = mongoose.Schema

const CourseSchema = new Schema({
  name: { type: String, required: true, max: 1 },
  subjectCode: { type: String, required: true, max: 1 },
  numberCode: { type: String, required: true, max: 1 },
  description: { type: String, required: true },
  degreeLevel: {
    type: String,
    required: true,
    enum: ['UGRAD', 'GRAD', 'PDEV', 'CCCE']
  },
  credits: { type: Number, required: true },
  components: { type: [String], required: true },
  instructionMode: { type: String, required: true, max: 1 },
  prerequisites: { type: [Schema.Types.ObjectId] },
  equivalencies: { type: [Schema.Types.ObjectId] }
})

CourseSchema.virtual('courseCode').get(() => `${this.subjectCode} ${this.numberCode}`)

module.exports = mongoose.model('Course', CourseSchema)
