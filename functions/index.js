const functions = require("firebase-functions");

const admin = require("firebase-admin");

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { user } = require("firebase-functions/lib/providers/auth");
const { firebase } = require("googleapis/build/src/apis/firebase");


const path = require("path");
const spawn = require("child-process-promise").spawn;
const os = require("os");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const csvtojsonV2 = require("csvtojson");

// const express = require('express');


const cors = require('cors')({origin: true});   

// const app = express();

// app.use(cors({ origin: true }));
// app.use(myMiddleware);


admin.initializeApp();

// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
// app.post('/', (req, res) => res.send(Widgets.create()));
// app.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));
// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
// app.get('/', (req, res) => res.send(Widgets.list()));




exports.createTen  = functions.https.onRequest((req, res) => {



  cors(req, res, () => {
    res.set('Access-Control-Allow-Origin', '*');
    admin.auth().tenantManager().createTenant({
   

      displayName: req.query.name,
      emailSignInConfig: {
        enabled: true,
        passwordRequired: true, }// Email link sign-in enabled.
    }).then(tData => {
      console.log(tData.tenantId)
      res.send(tData.tenantId)
     
    })


  })
 
  

})


//-------------------> TimeFunction <--------------------------

exports.timerFunction =
functions.pubsub.schedule('16 35 * * *').timeZone('India Standard Time').onRun((context) => {
   
    admin.firestore().collection('Company').doc('Timer').set({
      ran:new Date(),
      ranb:true,
    })
});




//-------------------> SendMailFunction <--------------------------

const CLIENT_ID = '1017760632379-jl3t0np9uh62o9vma0anlucpm009a334.apps.googleusercontent.com';
const CLEINT_SECRET = '34l40PnXcO_FjK2c0_wYiMrV';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04p71w8w_VSZrCgYIARAAGAQSNwF-L9Ir9SmdBfVuEf9UR3c0lnBRTYxQ7TL_znJWd8LIuiPJ6DIpp3LebkhY5BLB0Az5soKpD9c';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const accessToken =  oAuth2Client.getAccessToken();
let transporter = nodemailer.createTransport({

    service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'odineyetechnologies@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,

  },
});

exports.sendEmail = functions.firestore
    .document('Company/{orderId}/non-active/{userId}')
    .onCreate((snap, context) => {

      const mailOptions = {
        from: 'odineyetechnologies@gmail.com', 
        to: snap.data().email,
        subject: 'Invitation', // email subject
        html: 'Hi '+ snap.data().name+',' +
              ' You are invited for the role of '+ snap.data().role + ' at '+ snap.data().last + ' Your invitation code is ' + snap.data().ref +
             `<br /> <p style="font-size: 16px; color: red;"> {{snap.data().cid}} Copy the Invitation Code and Paste it in Invitation Code field in the form </p>
              <br /> <button> <a href="http://localhost:8100/">Click Here To Start</button> <br />

             <p style="font-size: 16px;">Thank You</p>
             <br /> ` // email content in HTML
    };

        return transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
                console.log(error)
                return
            }
            console.log("Sent!")
        });
    });
