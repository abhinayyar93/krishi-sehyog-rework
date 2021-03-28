var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var path = require('path');
var multer = require('multer');
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

var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, "./upload");
  },
  filename: function(req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({
  storage: Storage
}).fields([ { name: "upload-address-proof", maxCount: 1 }, { name: "upload-identity-proof", maxCount: 1 }]);


app.post('/sendsellerform', upload, function(req, res, next) {
  var name = req.body.name;
  var business_name = req.body.business_name;
  var email = req.body.email;
  var dob = req.body.dob || 'Date of Birth not submitted';
  var address = req.body.address || 'Address is not submitted';
  var crop = req.body.crop || 'Crop name is not submitted';
  var address_proof = req.files["upload-address-proof"] ? req.files["upload-address-proof"][0]:'';
  var identity_proof = req.files["upload-identity-proof"] ? req.files["upload-identity-proof"][0]:'';
  var errorMessage = '';
  var resObj = {};
  if(name && business_name && email) {
    if (address_proof) {
      if(!validFile(address_proof)) {
        resObj.status = 'error';
        resObj.message = 'Please upload valid address proof!';
        res.send(resObj);
        return;
      }
    }
    if(identity_proof) {
      if(!validFile(identity_proof)) {
        resObj.status = 'error';
        resObj.message = 'Please upload valid identity proof!';
        res.send(resObj);
        return;
      }
    }
    senderFormSendMail(name, business_name, email, dob, address, crop, address_proof, identity_proof, resObj);
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
      errorMessage += "Email is missing<br>";
    } 
    resObj.status = 'error';
    resObj.message = errorMessage;
  }
  res.send(resObj);
})

var senderFormSendMail = (name, business_name, email, dob, address, crop, address_proof, identity_proof, resObj) => {
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
      html: '<table style="width: 100%; border: 1px solid black; border-collapse: collapse;"> <tr> <th style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Field Name</th> <th style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Responded Values</th> </tr> <tr> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Name</td> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">' + name + '</td> </tr> <tr> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Business Name</td> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">' + business_name + '</td> </tr> <tr> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Email ID</td> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">' + email + '</td> </tr> <tr> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Date of Birth</td> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">' + dob + '</td> </tr> <tr> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Address</td> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">' + address + '</td> </tr> <tr> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">Crop Names</td> <td style="border: 1px solid black; border-collapse: collapse; padding: 15px;">' + crop + '</td> </tr> </table>'
  };

  var mailOptions_buyer = {
    from: '',
    to: email,
    subject: "Thanks for your interest",
    text: "Thank You for your interest, our team will get in touch with you shortly"  
  };

  var attachments = [];
  if (identity_proof) {
    attachments.push({
      filename: identity_proof.originalname,
      path: "./upload/" + identity_proof.filename
    });
  }

  if (address_proof) {
    attachments.push({
      filename: address_proof.originalname,
      path: "./upload/" + address_proof.filename
    });
  }

  if (attachments.length) {
    mailOptions_owner.attachments = attachments;
  }
  
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

function validFile(fileName) {
  if (!fileName) return false;
  // Allowed ext
  const filetypes = /pdf|jpg|png|jpeg/;
  // Check ext
  return filetypes.test(path.extname(fileName.originalname).toLowerCase());
}