const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  mesa: String,
  linha: String,
  cliente: String,
  nFluig: Number,
  nCiclos: Number,
  contador: Boolean,
  materialDisp: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Table", TableSchema);
