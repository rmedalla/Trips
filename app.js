const express = require('express')
const app = express()
//npm install mustache --save
const mustacheExpress = require('mustache-express')
//npm install body-parser --save
var bodyParser = require('body-parser')
//npm install express
//npm install express-session --save
var session = require('express-session')
// middleware to use the session
app.use(session({
	secret: 'cat', //this is called a hash, case sensitive, 
	resave: false,
	saveUninitialized: false
}))

let usersList =[]
let trips = []

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// setting the templating engine to use mustache
app.engine('mustache',mustacheExpress())
// setting the mustache pages directory
app.set('views','./views')
// set the view engine to mustache
app.set('view engine','mustache')

//------USER REGISTRATION------
//create REGISTER page
app.get('/register', function(req,res){
    res.render('register')
    // console.log(req.body.username)
})
//post from register to home
app.post('/register', function(req,res){

   

        let username = req.body.username
        let password = req.body.password


        usersList.push({username : username, password : password})
        res.render('login',{username, password})
        // console.log(usersList)

        
    })  
// -------USER REGISTRATION------

// ------WELCOME PAGE-------
app.get('/welcome', function(req,res){
    res.render('welcome',{username : req.session.username})
  
})

//-----USER LOGIN-----------

//create LOGIN page
app.get('/login',function(req,res){
    res.render('login')
})

//MAKE VALIDATE LOGIN
function validateLogin(req,res,next) {
    if(req.session.username) {
        next()
      } else {
        res.redirect('/login')
      }

    }

app.all('/views/*',validateLogin,function(req,res,next){
    next()
  })

app.post('/login',function(req,res){
    let username = req.body.username
    // let password = req.body.password

    if(req.session) {
        req.session.username = username
        // req.session.password = password
        res.redirect('/welcome', {username : req.session.username})
        var hour = 3600000

    } else{
        res.redirect('/login')
    }
})

app.get('/home',function(req,res){
    res.render('home', {username : req.session.username})
})



app.get('/',function(req,res){
    res.render('home')
})




app.get('/trips',function(req,res){
    // index is the index.mustache page
    res.render('trips',{username : req.session.username, triplist: trips})
  })

app.post('/updatedTrips', function(req, res){
    let tripId = req.body.tripId
    trips = trips.filter(function(trip){
        return trip.tripIp != tripId
    })

    res.render('index',{tripListing : trips})
})

app.post('/trips',function(req,res){

    let city = req.body.city
    let departureDate = req.body.departureDate
    let returnDate = req.body.returnDate

    // pushing to the array 'trips'
    trips.push({tripId : guid(),
        city: city,
        departureDate : departureDate,
        returnDate : returnDate

    })
  
    res.render('index',{triplist: trips})

})  
    
  
    // go to a different page
    //res.render('trips',{tripList : trips})
// })



function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }



app.listen(3000, () => console.log('TURN IT UP!'))