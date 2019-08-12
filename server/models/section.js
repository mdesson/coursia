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
  campus: {
    type: String,
    enum: ['loyola', 'sirGeorgeWilliam', 'online', 'power']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'cancelled', 'tentative', 'stopEnrollment']
  },
  classNumber: { type: Number, required: true },
  component: {
    type: String,
    required: true,
    enum: [
      'collector',
      'conference',
      'lecture',
      'modular',
      'online',
      'practicum',
      'research',
      'seminar',
      'studio',
      'tutorialLab',
      'tutorial',
      'workStudy',
      'lab',
      'fieldWord',
      'fieldStudy',
      'independentStudy',
      'reading',
      'thesisResearch',
      'regular',
      'workshop'
    ]
  },
  section: { type: String, required: true },
  courseId: { type: Number, required: true },
  classEnrollmentCap: { type: Number },
  classEnrollmentTotal: { type: Number },
  classWaitCap: { type: Number },
  classWaitTotal: { type: Number },
  combinedWaitTotal: { type: Number },
  combinedWaitCap: { type: Number },
  combinedEnrollmentTotal: { type: Number },
  combinedEnrollmentCap: { type: Number },
  combinedSectionsId: { type: Number },
  termCode: { type: Number, required: true },
  sessionCode: { type: String, required: true, enum: ['13W', '26W'] },
  term: { type: Schema.Types.ObjectId, ref: 'Term', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true }
})

module.exports = mongoose.model('Section', SectionSchema)
