// import mongoose from 'mongoose';
const express = require('express');
const app = express();
const port = 5500; //port number 5500
const path = require('path');
let alert=require('alert')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const res = require('express/lib/response');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname)));

let usernameLogedIn;
let typeLogedIn;
let firstNameLogedIn;
let lastNameLogedIn;
let emailLogedIn;
let imgUrlLogedIn;

app.get('/', (req, res) => {
  res.render('index');
 });

app.get('/card', (req, res) => {
  res.render('card');
 });

 app.get('/login-mentor', (req, res) => {
  res.render('login-mentor');
 });

 app.get('/login-mentee', (req, res) => {
  res.render('login-mentee');
 });

 app.get('/chatbot', (req, res) => {
  res.render('chatbot');
 });

 app.get('/settings', (req, res) => {
  const params={
    'imgURL': imgUrlLogedIn,
    'userName': usernameLogedIn,
     'firstName': firstNameLogedIn,
     'lastName': lastNameLogedIn,
     'email' : emailLogedIn
  }
 res.render('settings',params);
 });

 app.get('/mentee-registration', (req, res) => {
  res.render('mentee-registration');
 });



 app.get('/mentor-registration', (req, res) => {
  res.render('mentor-registration');
 });

 app.get('/login-admin', (req, res) => {
  res.render('login-admin');

 });


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://saurabhkumar1432001:Saurabh%40mongodb@mentorshala.3gffj.mongodb.net/test";


app.get('/admin', async (req, res) => {
  MongoClient.connect(url,async function  (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    const mentor_coun=await dbo.collection("personalInfo").find({PersonType:"Mentor"}).count();
    const mentee_coun=await dbo.collection("personalInfo").find({PersonType:"Mentee"}).count();
    console.log(mentor_coun);
    db.close();
      
 

res.render('admin',{"mentor_count":mentor_coun,"mentee_count":mentee_coun});
});
     
});


function insertion_in_personalInfo(myobj) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("personalInfo").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

function insertion_in_CommunityCollection(myobj) {
  
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("CommunityCollection").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}
function Questions_in_CommunityCollection() {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    const query={QuestionAsked : "What is mentor shala?"};
    dbo.collection("CommunityCollection").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
}

app.get('/CommunityPage', (req, res) => {
  
 Questions_in_CommunityCollection()
  // const params={result};
  res.status(200).render("CommunityPage");
})
app.post('/CommunityPage', (req, res) => {
  console.log(req.body);
  res.status(200).render("CommunityPage");
  req.body.answers=[];
  insertion_in_CommunityCollection(req.body);
})
let emailGlobal;
let passwordGlobal;
app.post('/card', (req, res) => {
  console.log(req.body);
  res.redirect('/card')
  // console.log(emailGlobal);
  // console.log(passwordGlobal);
  req.body.email=emailGlobal;
  req.body.password=passwordGlobal;
  req.body.image="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
  console.log(req.body);
  insertion_in_personalInfo(req.body);
})
app.post('/registration',(req,res)=>{
  console.log(req.body);
  const email=req.body.email;
  emailGlobal=email;
  const password=req.body.password;
  passwordGlobal=password;
  console.log(password);
  const passwordRepeat=req.body.passwordRepeat;
  console.log(passwordRepeat);
  if (passwordRepeat==password) {
    res.render("mentor-registration");
  }
  else{
    res.redirect("index")
  }
})

app.post('/loginToCard',async (req,res)=>{
  console.log(req.body);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("personalInfo").findOne({email:req.body.email ,password:req.body.password},function(err,result){
      if (err) throw err;
      if (result==null) {
        res.redirect("index")
      }
      else{
        usernameLogedIn=result.userName;
        typeLogedIn=result.PersonType;
        firstNameLogedIn=result.firstName;
        lastNameLogedIn=result.lastName;
        emailLogedIn=result.email;
        imgUrlLogedIn=result.image;
        console.log(usernameLogedIn);
        console.log(result);
        res.render("card");
      }
      db.close();
    })
  });
})

app.post('/setting',(req,res)=>{
  console.log(req.body);
  usernameLogedIn=req.body.userName;
  imgUrlLogedIn=req.body.imgUrl;
  firstNameLogedIn=req.body.fname;
  lastNameLogedIn=req.body.lname;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { email: emailLogedIn };
    var newvalues = { $set: {userName: usernameLogedIn, firstName: firstNameLogedIn,lastName: lastNameLogedIn,image: imgUrlLogedIn}};
    // const query={{"email":emailLogedIn},{"$set":{"userName":req.body.userName},{"firstName":req.body.fname},{"lastName":req.body.lname},{"image":req.body.imgUrl}}};
    dbo.collection("personalInfo").updateOne(myquery,newvalues,function (err,res){
      if (err) throw err;
      console.log(res);
      db.close();
    });
  });
  res.redirect('settings');
})

app.listen(port, '127.0.0.1', () => {
  console.log(`The application started successfully on port ${port}`);
})
// function searchQuestion() {

// }