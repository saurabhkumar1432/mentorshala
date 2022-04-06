// import mongoose from 'mongoose';
const express=require('express');
const app=express();
const port=5500;           //port number 5500
const path = require('path');
const fs=require('fs');
const { send } = require('process');
const { Script } = require('vm');
// const { hostname } = require('os');



// app.use(express.static(staticpath))
// app.set('view engine','pug');
// app.set('views',path.join(__dirname,'views'));
// app.use(express.static(__dirname + "/../../CSS"));

// app.use('/static',express.static('static'));//for serving static files
const mongoose = require('mongoose');
const bodyparser=require('body-parser')
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/registered_User_info');    //mentor_info is my database name
}

var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log("we are connected");
})
const { Schema } = mongoose;

const mentor_registrator = new Schema({
    firstName:  String, 
    lastName: String,
    userName:   String,
    city: String,
    educationInfo: String,
    preferdlang: String,
    skills: String,
    shortDescription: String,
});

const mentor_register = mongoose.model('mentor_registration',mentor_registrator );     //mentor_registration is collection name
const mentee_registrator = new Schema({
    firstName:  String, 
    lastName: String,
    userName:   String,
    city: String,
    educationInfo: String,
    preferedLanguage: String,
    Interest: String,
    shortDescription: String,
});

const mentee_register = mongoose.model('mentee_registration',mentee_registrator );     //mentor_registration is collection name
// app.use('/static',express.static('static'));
// app.use(express.urlencoded());
// app.set('view engine','pug');


app.use(express.static(path.join(__dirname,"../../")));
app.get('/HTML/mentor-registration.html',(req,res)=>{ 
    const mentor_registration_file=fs.readFileSync('../../HTML/mentor-registration.html');
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(mentor_registration_file)
    // res.sendFile(path.join(__dirname,"public","mentor-registration.html"));

    // res.set({
    //     'Access-control-Allow-Origin': '*'
    // });
    // res.redirect('rgistration.html');
    // res.status(200).render('mentor_registration.pug');
})
app.get('/HTML/mentee-registration.html',(req,res)=>{ 
    const mentee_registration_file=fs.readFileSync('../../HTML/mentee-registration.html');
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(mentee_registration_file)
})   
app.get('/index.html',(req,res)=>{ 
    const Home=fs.readFileSync('index.html');
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(Home)
})
app.get('/HTML/login-mentor.html',(req,res)=>{ 
    const Home=fs.readFileSync('../../HTML/login-mentor.html');
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(Home)
})
app.get('HTML/login-mentee.html',(req,res)=>{ 
    const Home=fs.readFileSync('../../HTML/login-mentee.html');
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(Home)
})
app.get('HTML/login-admin.html',(req,res)=>{ 
    const Home=fs.readFileSync('../../HTML/login-admin.html');
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(Home)
})
app.post('/mentor_regis',(req,res)=>{
    console.log(req.body);
    // var mydata=new mentor_register(req.body)
    // mydata.save().then(()=>{
    //     res.send("This item has been saved")
    // }).catch(()=>{
    //     res.status(400).send("Error")
    // })
    // const mentee_registration_file=fs.readFileSync('../../HTML/card.html');
    // res.writeHead(200,{'Content-Type':'text/html'});
    // res.end(mentee_registration_file)
})
app.post('/mentee_regis',(req,res)=>{
    console.log(req.body);
    // var mydata=new mentee_register(req.body)
    // mydata.save().then(()=>{
    //     res.send("This item has been saved")
    // }).catch(()=>{
    //     res.status(400).send("Error")
    // })
    // const mentee_registration_file=fs.readFileSync('../../HTML/card.html');
    // res.writeHead(200,{'Content-Type':'text/html'});
    // res.end(mentee_registration_file)
})
app.listen(port,'127.0.0.1',()=>{
    console.log(`The application started successfully on port ${port}`);
})