const findOrCreate = require("mongoose-findorcreate");
const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://shashank:g9971441252@ds139341.mlab.com:39341/cart",
  { useNewUrlParser: true }
);

let schema = mongoose.Schema;

let userSchema = new schema({
  username: String,
  password: String
});

// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("user", userSchema);
