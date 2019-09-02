var router = require("express").Router();
var product = require("../models/products-DB.js");
var order = require("../models/order-DB.js");
var contact = require("../models/contact");
let user = require("../models/user");
var cart = require("../models/cart");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
var multer = require("multer");
// var upload = multer({ dest: 'uploads/' })
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
// cloudinary and multer setup
cloudinary.config({
  cloud_name: "dmjvm8vzc",
  api_key: "717595512962757",
  api_secret: "2LsmxPROeuHRGWRGIdepMFDj8iQ"
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "Frames",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.render("home.ejs", {
    url: req.url,
    req: req
  });
});

router.get("/products/:style", function(req, res) {
  var style = req.params.style;
  // serach in database for men products
  product.find({ category: style }, (err, doc) => {
    res.render("products.ejs", {
      array: doc,
      gender: "CITY",
      url: req.url,
      req: req
    });
  });
});

router.get("/product-details/:id", (req, res) => {
  var id = req.params.id;
  product.findOne({ _id: id }, (err, doc) => {
    // console.log("product value", doc);
    res.render("product-detail", {
      product: doc,
      url: req.url,
      req: req
    });
  });
});

router.get("/add-to-cart/:id", (req, res) => {
  bag = new cart(req.session.cart ? req.session.cart : {});
  // find product from Database using id and inserting in cart object
  var a = callback => {
    product.findOne({ _id: req.params.id }, (err, product) => {
      bag.add(product, product._id);
      req.session.cart = bag;
      callback();
    });
  };
  // find product from Database using id
  var b = () => {
    product.findOne({ _id: req.params.id }, (err, doc) => {
      // console.log(req.session.cart);
      res.render("product-detail", {
        product: doc,
        url: req.url,
        req: req
      });
    });
  };
  a(b);
});

router.get("/shopping-cart", (req, res) => {
  if (!req.session.cart) {
    res.redirect("/");
  } else {
    var carts = new cart(req.session.cart);
    // console.log(carts.generateArray());
    res.render("shopping-cart", {
      array: carts.generateArray(),
      req: req,
      url: req.url
    });
  }
});

router.get("/checkLogin", (req, res) => {
  if (req.user) {
    res.redirect("/pay");
  } else {
    res.redirect("/login?referer=/pay");
  }
});

router.get("/pay", (req, res) => {
  // console.log(req.user);
  contact.findOne({ userId: req.user._id }, (err, data) => {
    // console.log(data);
    if (data == null) {
      return res.render("contact", { req: req, url: req.url });
    } else {
      return res.render("pay", {
        orderId: new mongoose.Types.ObjectId(),
        orderAmount: req.session.cart.totalPrice,
        data: data,
        emailId: req.user.username,
        array: new cart(req.session.cart).generateArray(),
        req: req,
        url: req.url
      });
    }
  });
});

router.post("/contact", (req, res) => {
  var address = {
    flatHouse: req.body.flatHouse,
    areaColony: req.body.areaColony,
    landmark: req.body.landmark,
    townCity: req.body.townCity,
    state: req.body.state,
    pincode: req.body.pinCode
  };
  new contact({
    userId: req.user._id,
    name: req.body.name,
    surname: req.body.surname,
    gender: req.body.gender,
    address: address,
    mobileNo: req.body.mobileNo,
    emailId: req.body.emailId
  }).save((err, data) => {
    return res.redirect("/pay");
  });

  // res.send("pay");
});

router.post("/orderPlaced", function(req, res) {
  var orderAmount = "";
  var orderId = "";
  new order({
    orderId: req.query.orderId,
    userId: req.query.userId,
    orderAmount: req.query.orderAmount
  })
    .save()
    .then(data => {
      orderAmount = data.orderAmount;
      orderId = data.orderId;
      return user.findById(data.userId);
    })
    .then(data => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "shashankauthorisation@gmail.com",
          pass: "9971441252"
        }
      });

      const mailOptions = {
        from: "shashankauthorisation@gmail.com", // sender address
        to: data.username, // list of receivers
        subject: "EKart", // Subject line
        text: `Thank you for purchasing from Ekart Your amount ${orderAmount} Your orderId ${orderId}`
        // html: `<p>Your orderId ${orderId}</p>` // plain text body
      };

      return transporter.sendMail(mailOptions).then(info => {
        console.log(info.response);
        res.send("Thanks");
      });
    })
    .catch(err => {
      // console.log(err);
    });
});

router.get("/testing", (req, res) => {
  var orderAmount = "";
  var orderId = "";
  new order({
    orderId: "1234",
    userId: "5c4e381544e51041e88c66d2",
    orderAmount: "1234"
  })
    .save()
    .then(data => {
      orderAmount = data.orderAmount;
      orderId = data.orderId;
      return user.findById(data.userId);
    })
    .then(data => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "shashankauthorisation@gmail.com",
          pass: "9971441252"
        }
      });

      const mailOptions = {
        from: "shashankauthorisation@gmail.com", // sender address
        to: "shashanksingh42@gmail.com", // list of receivers
        subject: "EKart", // Subject line
        text: "Thank you for purchasing from Ekart",
        text: `Your amount ${orderAmount}`,
        html: `<p>Your orderId ${orderId}</p>` // plain text body
      };

      return transporter.sendMail(mailOptions).then(info => {
        console.log(info.response);
        res.send("test");
      });
    })
    .catch(err => {
      // console.log(err);
    });
});

router.post("/order", (req, res) => {
  var id = "";
  // date time function
  function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return (
      date.getMonth() +
      1 +
      "/" +
      date.getDate() +
      "/" +
      date.getFullYear() +
      "  " +
      strTime
    );
  }
  var d = new Date();
  var e = formatDate(d);
  console.log(e);

  // saving order details in database
  var a = callback => {
    var orderObject = new order({
      name: req.body.name,
      surname: req.body.surname,
      gender: req.body.gender,
      address: {
        HouseNo: req.body.FlatHouse,
        AreaColony: req.body.AreaColony,
        Landmark: req.body.Landmark,
        TownCity: req.body.TownCity,
        State: req.body.State
      },
      mobileNo: req.body.mobileNo,
      emailId: req.body.emailId,
      // cart: req.body.cart,
      price: req.body.price,
      dateTime: formatDate(d),
      status: "not delivered"
    });
    orderObject.save((err, doc) => {
      // console.log(doc)
      id = doc._id;
      console.log(doc);
      callback();
    });
  };

  // sending order details to Email Id
  var b = () => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shashankauthorisation@gmail.com",
        pass: "9971441252"
      }
    });

    const mailOptions = {
      from: "shashankauthorisation@gmail.com", // sender address
      to: req.body.emailId, // list of receivers
      subject: "EKart", // Subject line
      text: "Thank you for purchasing from Ekart",
      text: `Your amount ${req.body.price}`,
      html: `<p>Your product ID ${id}</p>` // plain text body
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) console.log(err);
      else console.log(info.response);
    });
  };

  a(b);
  res.send("Thank you Bhen Ke GHODE");
});

// ----------------------------------admin panel------------------------------------------

// uploading product in admin panel
router.post("/admin/upload", upload.array("photo", 1), function(req, res) {
  // console.log(req.files)
  var mainImage = req.files[0].url;
  console.log(req.body);
  new product({
    img: mainImage,
    name: req.body.name,
    details: req.body.details,
    price: req.body.price,
    category: req.body.category
  }).save((err, doc) => {
    if (doc) {
      console.log(doc);
      res.send("saved");
    }
  });
});
// router.get("/admin/test", (req, res) => {
//   res.send("test");
// });
router.delete("/delete", (req, res) => {
  product.deleteMany({ category: "city" }, (err, doc) => {
    if (doc) {
      res.send("done");
    }
  });
});

// sending product details
router.get("/admin/view", (req, res) => {
  product.find((err, doc) => {
    res.json(doc);
  });
});

// make it AJAX call
router.get("/admin/view/edit/:id", (req, res) => {
  var id = req.params.id;
  product.findOne({ _id: id }, (err, doc) => {
    res.json(doc);
  });
});

// update data
router.post("/admin/view/edit/:id", (req, res) => {
  var updateData = req.body;
  product.findByIdAndUpdate(req.params.id, req.body, (err, doc) => {
    res.json(doc);
  });
});

// sending order details
router.get("/admin/order", (req, res) => {
  order.find((err, doc) => {
    res.json(doc);
  });
});

module.exports = router;
