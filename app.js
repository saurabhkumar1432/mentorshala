// import mongoose from 'mongoose';
const express = require('express');
const app = express();
const port = 5500; //port number 5500
const path = require('path');
const bodyParser = require('body-parser')
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname)));

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
  res.render('settings');
 });

 app.get('/mentee-registration', (req, res) => {
  res.render('mentee-registration');
 });

 app.get('/mentor-registration', (req, res) => {
  res.render('mentor-registration');
 });




var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://saurabhkumar1432001:Saurabh%40mongodb@mentorshala.3gffj.mongodb.net/test";

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
app.get('/CommunityPage', (req, res) => {
  res.status(200).render("CommunityPage");
})
app.post('/card', (req, res) => {
  console.log(req.body);
  res.redirect('/card')
  insertion_in_personalInfo(req.body);
})
app.post('/CommunityPage', (req, res) => {
 
  console.log(req.body);
  const style = `<style>#QuestionAskWindow{display="none";}#QuestionAskedCard{display="block";}</style>`
  const params = {
    'style': style
  };
  res.status(200).render("CommunityPage", params);
  insertion_in_CommunityCollection(req.body);
})
app.listen(port, '127.0.0.1', () => {
  console.log(`The application started successfully on port ${port}`);
})