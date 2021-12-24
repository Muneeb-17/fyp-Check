const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser);
var cookieParser = require('cookie-parser')
app.use(express.json());
const jwt = require('jsonwebtoken');
const router = express.Router();
require('../app.js');
const User = require('../models/userSchema');
const Driver = require('../models/userSchemaRide');
const Ride = require('../models/DetailsSchema')
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
app.use(cookieParser());
const authenticate = require('../middleware/authenticate');
app.use(express.urlencoded({ extended: true }));
var dateTime = require('node-datetime');



router.post('/register', async (req, res) => {
  console.log('-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=--==-=----------------- register');
  const { name, email, password, cpassword, number } = req.body;
  if (!name || !email || !password || !cpassword || !number) {
    return res.status(422).json({ error: "plz filled the field" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email is Already is Registed" });
    }
    else if (password != cpassword) {
      return res.status(422).json({ error: "password are not matching" });
    }
    else {
      const user = new User({ name, email, password, cpassword, number });


      await user.save();
      res.status(201).json({ message: "user registed successfully" });

    }

  } catch (err) {
    console.log(err);
  }
  //res.json({message: req.body}); 
});

//login 
router.post('/login', async (req, res) => {
  console.log('-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=--==-=----------------- login');
  try {
    let token;
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(422).json({ error: "please filled the field" });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {

      const isMatch = await bcrypt.compare(password, userLogin.password);
      token = await userLogin.generateAuthToken();
      console.log("the token part " + token);

      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 360000),
        httpOnly: true
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credientials " });
      } else {
        res.json({ message: "User Login Successfully" });
      }
    }
    else {
      res.status(400).json({ error: "Invalid Credientials " });
    }
  }
  catch (err) {
    console.log(err);
  }
});





router.post('/rideDetails', authenticate, async (req, res) => {
  try {

    console.log('-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=--==-=----------------- rideDetails post');

    const { userName, departure, destination, date, time, number, registration, color, meetupPoint, charges } = req.body;

    if (!departure || !destination || !date || !time || !number || !registration || !color || !meetupPoint || !charges) {
      return res.status(422).json({ error: "plz filled the field" });
    }
    else {
      const loginData = await req['rootUser'].id;
      const loginUserName = await req['rootUser'].name;
      console.log(loginUserName);
      console.log("=========================");
      const userData = new Ride({ loginId: loginData, loginName: loginUserName, userName, departure, destination, date, time, number, registration, color, meetupPoint, charges });
      const allAds = new Driver({ userName: loginUserName, departure, destination, date, time, number, registration, color, meetupPoint, charges });
      console.log("=====================12121====");
      //const data = await User.findOneAndUpdate(loginData,userData);
      //console.log(data);
      await userData.save();
      await allAds.save();
      res.status(201).json({ message: "Added" });

    }
  } catch (e) {
    console.log('-=-=-=-=-=-=-=-=- Eror =-=-=--=-=-=-=-==--==-=-');
    console.log(e);
    res.send(e);
  }
});

router.get('/rideDetails', authenticate, async (req, res) => {
  console.log('-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=--==-=----------------- rideDetails');
  try {
    const driverData = await Ride.find();
    res.send(driverData);
    console.log(driverData);

  } catch (e) {
    res.send(e);
  }
});
router.get('/myRide', authenticate, async (req, res) => {
  console.log('-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=--==-=----------------- myRide');
  try {
    const loginData = await req['rootUser'].id;
    const userData = await req['rootUser'].name;
    console.log(userData);
    const driverData = await Ride.find({ loginId: loginData });
    console.log(driverData)
    res.send(driverData);

  } catch (e) {
    res.send(e);
  }
});

router.put('/update', async (req, res) => {
  console.log("=================update");
  const newDeparture = req.body.newDeparture;
  const id = req.body.id;

  try {
    await Ride.findById(id, (err, updatedRide) => {
      updatedRide.departure = newDeparture;
      updatedRide.save();
      res.send('upDated');
    });

  } catch (err) {
    console.log(err);
  }

});

router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id
  console.log(id);
  //await Driver.findByIdAndDelete(id)
  await Ride.findByIdAndDelete(id).then(user => {
    if (user) {
      return res.status(200).json({ success: true, message: 'the User is deleted' })
    } else {
      return res.status(404).json({ success: true, message: 'User not found' })
    }
  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
});
router.get('/home', authenticate, async (req, res) => {
  try {
    console.log('-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=--==-=----------------- hello');
    // console.log(req)

    res.send({ rootUser: req['rootUser'] })
    console.log(req['rootUser'].email)
    // res.send('hello world');
  } catch (e) {
    console.log('-=-=-=-=-=-=-=-=- Eror =-=-=--=-=-=-=-==--==-=-');
    //console.log(e);
    // res.send(e);
  }
});

router.get('/logout', (req, res) => {
  console.log('-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=--==-=----------------- logout');
  res.clearCookie("jwt");
  res.redirect("/home");
});
function withoutTime(dateTime) {
  var date = new Date(dateTime.getTime());
  date.setHours(0, 0, 0, 0);
  return date;
}

router.get('/getData', async (req, res) => {
  console.log('-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=--==-=----------------- getData');
  const date = new Date().tolocaleDateString();
  console.log(date);
  const driverData = await Ride.find( );
  res.send(driverData);
});




module.exports = router;