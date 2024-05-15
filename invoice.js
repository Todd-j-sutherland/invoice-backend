const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  debt: {
    type: Number,
    required: true,
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
