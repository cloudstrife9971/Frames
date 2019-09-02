const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://shashank:g9971441252@ds139341.mlab.com:39341/cart",
  { useNewUrlParser: true }
);
var Schema = mongoose.Schema;
var schema = new Schema({
  userId: { type: String },
  name: { type: String },
  surname: { type: String },
  gender: { type: String },
  address: { type: Object },
  mobileNo: { type: Number },
  emailId: { type: String }
  // cart: { type: Object },
  //   price: { type: String },
  //   dateTime: { type: String },
  //   status: { type: String }
});

var contact = mongoose.model("contact", schema);

module.exports = contact;
