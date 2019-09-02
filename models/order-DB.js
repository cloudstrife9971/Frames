const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://shashank:g9971441252@ds139341.mlab.com:39341/cart",
  { useNewUrlParser: true }
);
var Schema = mongoose.Schema;
var schema = new Schema({
  orderId: { type: String },
  userId: { type: String },
  orderAmount: { type: Number }
  // cart: { type: Object },
  // dateTime: { type: String },
  // status: { type: String }
});

var order = mongoose.model("order", schema);

module.exports = order;
