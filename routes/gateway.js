var router = require("express").Router();
var createError = require("http-errors");
var path = require("path");
// var cookieParser = require("cookie-parser");
var crypto = require("crypto");
var order = require("../models/order-DB.js");

router.post("/request", function(req, res, next) {
  var postData = {
      appId: req.body.appId,
      orderId: req.body.orderId,
      orderAmount: req.body.orderAmount,
      orderCurrency: req.body.orderCurrency,
      orderNote: req.body.orderNote,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      returnUrl: req.body.returnUrl
      // notifyUrl: req.body.notifyUrl
    },
    mode = "TEST",
    secretKey = "98da4695167d5de4f788cc7cef0d970f824885ee",
    sortedkeys = Object.keys(postData),
    url = "",
    signatureData = "";
  sortedkeys.sort();
  for (var i = 0; i < sortedkeys.length; i++) {
    k = sortedkeys[i];
    signatureData += k + postData[k];
  }
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureData)
    .digest("base64");
  postData["signature"] = signature;
  if (mode == "PROD") {
    url = "https://www.cashfree.com/checkout/post/submit";
  } else {
    url = "https://test.cashfree.com/billpay/checkout/post/submit";
  }
  res.render("request", { postData: JSON.stringify(postData), url: url });
});

router.post("/response", function(req, res, next) {
  var postData = {
      orderId: req.body.orderId,
      orderAmount: req.body.orderAmount,
      referenceId: req.body.referenceId,
      txStatus: req.body.txStatus,
      paymentMode: req.body.paymentMode,
      txMsg: req.body.txMsg,
      txTime: req.body.txTime
    },
    secretKey = "98da4695167d5de4f788cc7cef0d970f824885ee",
    signatureData = "";
  for (var key in postData) {
    signatureData += postData[key];
  }
  var computedsignature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureData)
    .digest("base64");
  postData["signature"] = req.body.signature;
  postData["computedsignature"] = computedsignature;
  res.render("response", { postData: JSON.stringify(postData) });
});

// catch 404 and forward to error handler
// router.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// router.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = router;
