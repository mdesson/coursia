import mongoose from 'mongoose'

const Schema = mongoose.Schema

const TermSchema = new Schema({
  year: { type: Number, required: true, min: 1900, max: 9999 },
  season: { type: String, required: true, max: 6 },
  code: { type: Number, required: true, max: 9999 }
})

TermSchema.virtual('description').get(() => `${this.season} ${this.year}`)

module.exports = mongoose.model('Term', TermSchema)
