const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  mesa: String,
  linha: String,
  cliente: String,
  nFluig: Number,
  nCiclos: Number,
  contador: Boolean,
  materialDisp: Boolean,
  datePlan: {
    type: Date,
  },
  observation: String,
  team: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

TableSchema.pre("findByIdAndUpdate", function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model("Table", TableSchema);
