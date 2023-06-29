const mongoose = require("mongoose");

const RowSchema = new mongoose.Schema({
  table: String,
  line: String,
  customer: String,
  fluig_number: Number,
  count_number: Number,
  counter: { type: Boolean, default: true },
  material: { type: Boolean, default: false },
  planing_date: {
    type: Date,
  },
  observation: String,
  team: String,
  revision: {
    R0: {
      date: { type: Date, default: Date.now },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: true },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: true },
    },
    R30: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
    R55: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
    R80: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
    R105: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Row", RowSchema);
