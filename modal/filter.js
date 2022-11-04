const mongoose = require("mongoose");

const FilterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
  },
  mileage: {
    type: Number,
    default: 0,
  },
  class: {
    type: Number,
    default: 0,
  },
},{timestamps:true});

const Filter = mongoose.model("Filter", FilterSchema);

module.exports = Filter;