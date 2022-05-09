// import mongoose from 'mongoose';
const express = require('express');
const app = express();
// const port = process.env.PORT || 5500; //port number 5500
const path = require('path');
let alert = require('alert');
const bodyparser = require('body-parser');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const res = require('express/lib/response');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname)));
const multer = require('multer')
const upload = multer({ dest: 'imgUpload/' })

let usernameLogedIn;
let typeLogedIn;
let firstNameLogedIn;
let lastNameLogedIn;
let emailLogedIn;
let imgUrlLogedIn;
let passwordLogedIn;
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
let bioLogedIn;
let birthdateLogedIn;
let phoneLogedIn;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.render('index');
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
  const params = {
    'imgURL': imgUrlLogedIn,
    'userName': usernameLogedIn,
    'firstName': firstNameLogedIn,
    'lastName': lastNameLogedIn,
    'email': emailLogedIn,
    'bio': bioLogedIn,
    'birthdate': birthdateLogedIn,
    'phone': phoneLogedIn
  }
  res.render('settings', params);
});

app.get('/mentee-registration', (req, res) => {
  res.render('mentee-registration');
});

app.get('/chat', (req, res) => {
  res.render('chat');
})

app.get('/mentor-registration', (req, res) => {
  res.render('mentor-registration');
});

app.get('/login-admin', (req, res) => {
  res.render('login-admin');

});


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://saurabhkumar1432001:Saurabh%40mongodb@mentorshala.3gffj.mongodb.net/test";


app.get('/admin', async (req, res) => {
  
  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    const mentor_coun = await dbo.collection("personalInfoMentor").find().count();
     const mentee_coun = await dbo.collection("personalInfoMentee").find().count();
     const rep = dbo.collection("report").find().toArray((err,resu)=>{
          if(err) throw err;
          dbo.collection("personalInfoMentee").find({}).toArray(function (err, result) {
            if (err) throw err;
            
            dbo.collection("personalInfoMentor").find({}).toArray(function (err, mento) {
              if (err) throw err;
        
              
              res.render('admin', { "mentor_count": mentor_coun, "mentee_count": mentee_coun,"reports":resu,"k":0,"mentees": result, "mentors": mento });
              db.close();
            });
            
        
          });
          
    
        });
     
  });

app.post('/notremove',(req, res) => {

  MongoClient.connect(url, (err, db)=> {
    if (err)
    throw err;
    var dbo = db.db("mydb");
    var myquery = {userName:req.body.cross};
  dbo.collection("report").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
   
  });
  res.redirect("admin");
});
});

app.post('/remove', async (req, res) => {

  MongoClient.connect(url, async function (err, db) {
    if (err)
    throw err;
    var dbo = db.db("mydb");
    var myquery = {userName:req.body.tick};
   dbo.collection("personalInfoMentee").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    dbo.collection("report").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
     
    });

  });
  res.redirect("admin");
});
});


//   app.get('/:id',(req,res)=>{
//     const id=req.params.id;
//     MongoClient.connect(url, async function (err, db) {
//       if (err) throw err;
//       var dbo = db.db("mydb");
//      await dbo.collection("report").deleteOne({username:id});
//       // dbo.collection("personalInfoMentee").deleteOne({username:id});
//      res.redirect("admin");
     
//       db.close();
//   });
// });

  // let result;
  // MongoClient.connect(url, async function (err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("mydb");
  //   const mentor_coun = dbo.collection("report").find().toArray((err,res)=>{
  //     if(err) throw err;
  //     result=res;
  //   });
  //   db.close();
  // });
  // res.render('admin', { "mentor_count": mentor_coun, "mentee_count": mentee_coun,"reports":result,"k":0 });
});


app.get('/card', async (req, res) => {
  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    let dbo = db.db("mydb");
    var collName;
      if (typeLogedIn == "Mentor") {
        collName = "personalInfoMentee"
      }
      else {
        collName = "personalInfoMentor"
      }
    dbo.collection(collName).find({}).toArray(function (err, result) {
      if (err) throw err;

      res.render('card', { "mentee": result, "k": 0 });
      db.close();
    });
  });
});

// app.get('/card/mentee', async (req, res) => {
//   MongoClient.connect(url, async function (err, db) {
//     if (err) throw err;
//     let dbo = db.db("mydb");
//     dbo.collection("personalInfoMentor").find({}).toArray(function (err, result) {
//       if (err) throw err;

//       res.render('card', { "mentee": result, "k": 0 });
//       db.close();
//     });


//   });

// });



function insertion_in_personalInfoMentor(myobj,res) {
  usernameLogedIn=myobj.userName;
  typeLogedIn="Mentor";
  firstNameLogedIn=myobj.firstName;
  lastNameLogedIn=myobj.lastName;
  bioLogedIn=myobj.shortDescription;
  birthdateLogedIn=myobj.birthdate;
  phoneLogedIn=myobj.phone;
  console.log(usernameLogedIn);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("personalInfoMentor").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  res.redirect('card')
}

function insertion_in_personalInfoMentee(myobj,res) {
  usernameLogedIn=myobj.userName;
  typeLogedIn="Mentee";
  firstNameLogedIn=myobj.firstName;
  lastNameLogedIn=myobj.lastName;
  bioLogedIn=myobj.shortDescription;
  birthdateLogedIn=myobj.birthdate;
  phoneLogedIn=myobj.phone;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("personalInfoMentee").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  res.redirect('card')
}

// function insertion_in_CommunityCollection(myobj) {
  
//   MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.collection("CommunityCollection").insertOne(myobj, function (err, res) {
//       if (err) throw err;
//       console.log("1 document inserted");
//       db.close();
      
//     });
//   });
// }

function Questions_in_CommunityCollection() {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    const query = { QuestionAsked: "What is mentor shala?" };
    dbo.collection("CommunityCollection").find(query).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
}

app.get('/CommunityPage', (req, res) => {
  MongoClient.connect(url,async function  (err, db) {
    if (err) throw err;
    let dbo = db.db("mydb");
      const mentors= dbo.collection("CommunityCollection").find({}).toArray(function(err, result) {
        if (err) throw err;
        // console.log(result);
        res.render('CommunityPage',{"profilepic":imgUrlLogedIn,"username":usernameLogedIn,"data":result});
        db.close();
      });
  });
})

app.post('/CommunityPage', (req, res) => {
  console.log(req.body);
  // res.redirect('CommunityPage');
  req.body.answers=[];
  req.body.AskedPerson=usernameLogedIn;
  req.body.profileAskedPerson=imgUrlLogedIn;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("CommunityCollection").insertOne(req.body, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  res.redirect('CommunityPage');
})

app.post('/answerToQuestion',(req,res)=>{
  console.log(req.body);
  
})

let emailGlobal;
let passwordGlobal;

app.post('/cardMentor', (req, res) => {
  console.log(req.body);
  // res.redirect('index')
  // res.redirect('/card')
  // console.log(emailGlobal);
  // console.log(passwordGlobal);
  req.body.email = emailGlobal;
  req.body.password = passwordGlobal;
  emailLogedIn=req.body.email;
  passwordLogedIn=req.body.password;
  req.body.image = "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
  imgUrlLogedIn=req.body.image;
  req.body.liked=[];
  req.body.matched=[];
  req.body.verified=false;
  console.log(req.body);
  insertion_in_personalInfoMentor(req.body,res);
})

app.post('/cardMentee', (req, res) => {
  console.log(req.body);
  // res.redirect('index')
  // console.log(emailGlobal);
  // console.log(passwordGlobal);
  req.body.email = emailGlobal;
  emailLogedIn=req.body.email;
  passwordLogedIn=req.body.password;
  req.body.password = passwordGlobal;
  req.body.image = "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
  imgUrlLogedIn=req.body.image;
  req.body.liked=[];
  req.body.matched=[];
  console.log(req.body);
  insertion_in_personalInfoMentee(req.body,res);
})
var otp = Math.random();
otp = otp * 10000;
otp = parseInt(otp);
console.log(otp);

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: 'gmail',

  auth: {
    user: 'chaturvedi.a20@iiits.in',
    pass: 'iiits@2020',
  }

});


app.post('/registrationMentor', (req, res) => {
  console.log(req.body);
  const email = req.body.email;
    emailGlobal = email;
    const password = req.body.password;
    passwordGlobal = password;
    console.log(password);
    const passwordRepeat = req.body.passwordRepeat;
    console.log(passwordRepeat);
  var mailOptions = {
    from: 'chaturvedi.a20@iiits.in',
    to: emailGlobal,
    subject: "Otp for registering is: ",
    html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // if (passwordRepeat == password) {
  //   res.render("login-mentor");
  // }
  // else {
  //   res.redirect("index")
  // }
})
app.post('/send',(req,res)=>{
    if (req.body.otp == otp)
      res.render("mentor-registration");
    else
      alert("Wrong OTP or password");
  })
})
  // app.post('/registrationMentor', (req, res) => {
  //   console.log(req.body);
  //   emailGlobal = email;
  //   const password = req.body.password;
  //   passwordGlobal = password;
  //   console.log(password);
  //   const passwordRepeat = req.body.passwordRepeat;
  //   console.log(passwordRepeat);
  //   if (passwordRepeat == password && req.body.otp == otp) {
  //     res.render("mentor-registration");
  //   }
  //   else {
  //     res.redirect("index")
  //   }
  // });


app.post('/registrationMentee', (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  emailGlobal = email;
  const password = req.body.password;
  passwordGlobal = password;
  console.log(password);
  const passwordRepeat = req.body.passwordRepeat;
  console.log(passwordRepeat);
  var mailOptions = {
    from: 'chaturvedi.a20@iiits.in',
    to: emailGlobal,
    subject: "Otp for registering is: ",
    html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // if (passwordRepeat == password) {
  //   res.render("login-mentee");
  // }
  // else {
  //   res.redirect("index")
  // }
})
app.post('/send1',(req,res)=>{
  if (req.body.otp == otp)
    res.render("mentee-registration");
  else
  alert("Wrong OTP or password");
})
})

app.post('/loginToCardMentor', async (req, res) => {
  console.log(req.body);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("personalInfoMentor").findOne({ email: req.body.email, password: req.body.password }, function (err, result) {
      if (err) throw err;
      if (result == null) {
        res.redirect("index")
      }
      else {
        usernameLogedIn = result.userName;
        typeLogedIn = "Mentor";
        firstNameLogedIn = result.firstName;
        lastNameLogedIn = result.lastName;
        emailLogedIn = result.email;
        passwordLogedIn = result.password;
        imgUrlLogedIn = result.image;
        imgCoverUrlLoggedIn = result.imageCover
        bioLogedIn = result.shortDescription;
        phoneLogedIn = req.body.phoneNumber;
        birthdateLogedIn = req.body.dob;
        console.log(usernameLogedIn);
        console.log(result);
        res.redirect("card");
      }
      db.close();
    })
  });
})

app.post('/loginToCardMentee', async (req, res) => {
  console.log(req.body);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("personalInfoMentee").findOne({ email: req.body.email, password: req.body.password }, function (err, result) {
      if (err) throw err;
      if (result == null) {
        res.redirect("index")
      }
      else {
        usernameLogedIn = result.userName;
        typeLogedIn = "Mentee";
        firstNameLogedIn = result.firstName;
        lastNameLogedIn = result.lastName;
        emailLogedIn = result.email;
        passwordLogedIn = result.password;
        imgUrlLogedIn = result.image;
        imgCoverUrlLoggedIn = result.imageCover
        bioLogedIn = result.shortDescription;
        phoneLogedIn = req.body.phoneNumber;
        birthdateLogedIn = req.body.dob;
        console.log(usernameLogedIn);
        console.log(result);
        res.redirect("card");
      }
      db.close();
    })
  });
})


app.post('/setting', upload.single('imgUrl'), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  // console.log(req.files.imgUrl[0].path);
  // console.log(req.files[1].path);
  usernameLogedIn = req.body.userName;
  if(req.file!=undefined){
    imgUrlLogedIn = req.file.path;
  }
  // imgCoverUrlLoggedIn = req.files.imgUrl_cover[0].path;
  firstNameLogedIn = req.body.fname;
  lastNameLogedIn = req.body.lname;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { email: emailLogedIn };
    var newvalues = {
      $set: {
        userName: usernameLogedIn, firstName: firstNameLogedIn, lastName: lastNameLogedIn, image: imgUrlLogedIn,
      }
    };
    // const query={{"email":emailLogedIn},{"$set":{"userName":req.body.userName},{"firstName":req.body.fname},{"lastName":req.body.lname},{"image":req.body.imgUrl}}}
    var collName;
    if (typeLogedIn == "Mentor") {
      collName = "personalInfoMentor"
    }
    else {
      collName = "personalInfoMentee"
    }
    dbo.collection(collName).updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log(res);
      db.close();
    });
  });
  res.redirect('settings');
})


let flag=0;
app.post('/ReportButton', (req, res) => {
  console.log(req.body);
  // MongoClient.connect(url, function (err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("mydb");
  //   var collName;
  //   console.log(typeLogedIn);
  //   if(typeLogedIn=="Mentor"){
  //     collName="personalInfoMentee"
  //   }
  //   else{
  //     collName="personalInfoMentor"
  //   }
  //   dbo.collection(collName).findOne({ userName: req.body.username}, function (err, result) {
  //     if (err) throw err;
  //     if (result == null) {
  //       flag=0;
  //       console.log(result); 
  //     }
  //     else {
  //       flag=1;
  //       console.log(result);
  //     }
  //     db.close();
  //   })
  // });

  
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("report").insertOne(req.body, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
  
  res.redirect('card');
})


app.post('/settingChange', (req, res) => {
  console.log(req.body);
  if (passwordLogedIn == req.body.currentPassword) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myquery = { email: emailLogedIn };
      var newvalues = { $set: { password: req.body.newPassword } };
      var collName;
      if (typeLogedIn == "Mentor") {
        collName = "personalInfoMentor"
      }
      else {
        collName = "personalInfoMentee"
      }
      dbo.collection(collName).updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log(res);
        db.close();
      });
    });
    res.redirect('settings');
  }
  else {
    res.redirect('settings');
  }
})

app.post('/Info', (req, res) => {
  console.log(req.body);
  phoneLogedIn = req.body.phone;
  birthdateLogedIn = req.body.birthday;
  bioLogedIn = req.body.bio;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { email: emailLogedIn };
    var newvalues = { $set: { phoneNumber: phoneLogedIn, dob: birthdateLogedIn, shortDescription: bioLogedIn } };
    var collName;
    if (typeLogedIn == "Mentor") {
      collName = "personalInfoMentor"
    }
    else {
      collName = "personalInfoMentee"
    }
    dbo.collection(collName).updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log(res);
      db.close();
    });
  });
  res.redirect('settings');
})

app.post('/adminlogin',(req,res)=>{
  const adminUsername=req.body.Username;
  const adminPassword=req.body.Pass;
  if(adminUsername=="Admin@MentorShala" && adminPassword=="Mentoradmin123"){
    res.redirect('admin')
  }
  else{
    res.redirect('login-admin');
  }
})


let googleobj = require('./js/google-config.js');
console.log(googleobj.name);


var port_number = app.listen(process.env.PORT || 5500);
app.listen(port_number);
console.log("Server is running");
