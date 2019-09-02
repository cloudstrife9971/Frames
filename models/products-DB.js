const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://shashank:g9971441252@ds145484.mlab.com:45484/frames",
  { useNewUrlParser: true }
);
var Schema = mongoose.Schema;
var schema = new Schema({
  img: { type: String },
  name: { type: String },
  details: { type: String },
  price: { type: Number },
  category: { type: String }
});

var product = mongoose.model("product", schema);

module.exports = product;
