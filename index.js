var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var app = express();
app.use(bodyParser.json());

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    res.redirect('/en/home');
});

app.get('/:language/:pageName', function(req,res){
    app.set('language', req.params.language);
    res.sendFile(__dirname + "/public/" + req.params.language + "/" + req.params.pageName + ".html");
});

app.post('/sendcontentform', urlencodedParser, function(req,res){
    var firstname = req.body.firstname,
        lastname = req.body.lastname,
        email = req.body.email,
        phone = req.body.phoneno || 'Number not submitted', 
        message = req.body.message || 'No message send';
    var resObj = {};
    if(firstname && lastname && email) {
      contentFormSendMail(firstname, lastname, email, phone, message, resObj);
      resObj.status = 'ok';
      resObj.message = 'Our team will get in touch with you shortly.';
    } else {
      var errorMessage = '';
      if(!firstname) {
        errorMessage += "First Name is missing<br>";
      } 
      if (!lastname) {
        errorMessage += "Last Name is missing<br>";
      } 
      if (!email) {
        errorMessage += "Email is missing";
      } 
      resObj.status = 'error';
      resObj.message = errorMessage;
    }
    res.send(resObj);
})

app.post('/sendbuyerform', urlencodedParser, function(req,res){
  var name = req.body.name,
      business_name = req.body.businessname,
      email = req.body.email,
      dob = req.body.dob || 'Date of Birth not submitted';
  var resObj = {};
  if(name && business_name && email) {
    buyerFormSendMail(name, business_name, email, dob, resObj);
    resObj.status = 'ok';
    resObj.message = 'Our team will get in touch with you shortly.';
  } else {
    var errorMessage = '';
    if(!name) {
      errorMessage += "Name is missing<br>";
    } 
    if (!business_name) {
      errorMessage += "Business Name is missing<br>";
    } 
    if (!email) {
      errorMessage += "Email is missing";
    } 
    resObj.status = 'error';
    resObj.message = errorMessage;
  }
  res.send(resObj);
});

app.post('/sendbuyerform', urlencodedParser, function(req,res){
  console.log(JSON.stringify(req.body));
});

app.listen(3000,"localhost", function(){
    console.log("Server is running on localhost:3000");
})


var contentFormSendMail = (firstname, lastname, email, phone, message, resObj) => {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure:false,
        requireTLS:true,
        auth: {
          user: '', // enter your email address
          pass: ''  // enter your visible/encripted password
        }
    });

    var mailOptions = {
        from: '',
        to: "",
        subject: "Content Form submitted by " + firstname + ' ' + lastname,
        text: "Query submited by: " + email,
        html: '<table style="width:100%;border: 1px solid black;border-collapse: collapse;"> <tr> <th style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Field Name</th> <th style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Responded Values</th> </tr> <tr> <td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">First Name</td> <td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">' + firstname + '</td> </tr> <tr> <td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Last Name</td> <td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">' + lastname + '</td> </tr> <tr> <td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Email ID Name</td> <td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">' + email + '</td> </tr> <tr> <td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Phone No.</td> <td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">' + phone + '</td> </tr> <tr> <td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Message</td> <td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">' + message + '</td> </tr> </table>'
    };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          resObj.status = 'error';
          resObj.message = 'Fail to send capture your details, please try again';
        } else {
          resObj.status = 'ok';
          resObj.message = 'Our team will get in touch with you shortly.';
        }
        console.log("For Customer " + firstname + " " + lastname + "( " + email +" )" + ", mail status is :" + resObj.status );
      });
}

var buyerFormSendMail = (name, business_name, email, dob, resObj) => {
  var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure:false,
      requireTLS:true,
      auth: {
        user: '', // enter your email address
        pass: ''  // enter your visible/encripted password
      }
  });

  var mailOptions_owner = {
      from: '',
      to: "",
      subject: "Buyer Form submitted by " + name,
      text: "Query submited by: " + email,
      html: '<table style="width: 100%; border: 1px solid black; border-collapse: collapse;"> <tr> <th style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Field Name</th> <th style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Responded Values</th> </tr> <tr> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Name</td> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">' + name + '</td> </tr> <tr> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Business Name</td> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">' + business_name + '</td> </tr> <tr> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Email ID</td> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">' + email + '</td> </tr> <tr> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Date of Birth</td> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">' + dob + '</td> </tr> </table>'
  };

  var mailOptions_buyer = {
    from: '',
    to: email,
    subject: "Thanks for your interest",
    text: "Thank You for your interest, our team will get in touch with you shortly"  
};
  
    
    transporter.sendMail(mailOptions_owner, function(error, info){  
      if (error) {
        resObj.status = 'error';
      } else {
        resObj.status = 'ok';
        transporter.sendMail(mailOptions_buyer, function(error, info){
          if (error) {
            resObj.status = 'error';
          } else {
            resObj.status = 'ok';
          }
          console.log( "Mail sending status for customer, mail status is :" + resObj.status );
        });
      }
      console.log("Mail status to the team for buyer interest for customer " + name + "( " + email +" )" + ", mail status is :" + resObj.status );
    });
}