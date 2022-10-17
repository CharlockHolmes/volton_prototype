var nodemailer = require("nodemailer");
const express = require("express");
const Datastore = require("nedb");
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static("public"));
//app.use(express.static('three.js'));
app.use(
  express.json({
    limit: "10mb",
  })
);


// var transporter = nodemailer.createTransport({
//   service: "mail",
//   auth: {
//     user: "voltonsender@mail.com",
//     pass: "NotSafe123",
//   },
// });
// var transporter = nodemailer.createTransport('smtp://voltonsender%40hotmail.com:NotSafeAtAll6969@smtp-mail.hotmail.com');
var transporter = nodemailer.createTransport({
  host: "outlook.office365.com",
  auth: {
    user: "voltonsender@hotmail.com",
    pass: "NotSafeAtAll6969",
  }
});
// var transporter = nodemailer.createTransport({
//   service: "hotmail",
//   auth: {
//     user: "voltonsender@hotmail.com",
//     pass: "NotSafeAtAll6969",
//   },
// });
const database = new Datastore("database.db");
// database.loadDatabase();

app.post("/api", (request, response) => {
  console.log("i got a request");
  const data = request.body;
  //database.insert({data});
  let str = "";
  str += "Name: " + data.info.name + "<br>";
  str += "Email: " + data.info.email + "<br>";
  str += "Phone: " + data.info.phone + "<br>";
  str += "Company: " + data.info.company + "<br>";
  str += "Message: " + data.info.message + "<br>";

  data.items.forEach((item) => {
    const ring = item.ring;
    str += "<br><br>";
    str += "Quantity:" + item.quantity + "<br>";
    str += "Voltage:" + item.voltage + "V<br>";
    str += "Power:" + item.power + "W<br>";
    str += "Diameter:" + ring.radius * 2 * 3 + "inch<br>";
    str += "Width:" + ring.width * 3 + "inch<br>";
    str += "Type:" + item.type + "<br>";
    str += "Holes:" + ring.holes.length + "<br>";
    str += "Connectors:" + ring.terminals.length + "<br>";
    //str += "id:"+num+'<br>';
    str += "Additional Notes: " + item.text + "<br>";
    str += '<a href="' + item.url + '">' + item.url + "</a>";

    ////////////////////////////////////////////////////////
    // constr = "<br><br>|Serrage|<br>";
    // ring.connectors.forEach((e) => {
    //   constr += "== Type: " + e.t + "<br>";
    //   constr += "---- Angle: " + e.angle + "<br>";
    //   constr += "---- Offset: " + e.angle + "<br>";
    //   constr += "---- Facing: " + (e.Flipped ? "Right " : "Left ") + "<br>";
    // });

    //     holestr = "<br><br>|Trous|<br>";
    //     if (ring.holes.length != 0)
    //       ring.holes.forEach((e) => {
    //         if (e.id[0] == "h" && e.id[1] == "s" && e.t == "rect")
    //           //hslot
    //           holestr += "== Type: " + "Hslot" + "<br>";
    //         else if (e.id[0] == "s" && e.id[1] == "s" && e.t == "rect")
    //           //vslot
    //           holestr += "== Type: " + "Vslot" + "<br>";
    //         else if (e.id[0] == "s" && e.id[1] == "s" && e.t == "rect")
    //           //other
    //           holestr += "== Type: " + e.t + "<br>";
    //         holestr += "---- Angle: " + e.angle + "<br>";
    //         holestr += "---- Offset: " + e.angle + "<br>";
    //         if (e.t == "circle") holestr += "---- Width: " + e.r + "<br>";
    //         else {
    //           holestr += "---- Width: " + e.r.w + "<br>";
    //           holestr += "---- Height: " + e.r.h + "<br>";
    //         }
    //       });
    //     gapstr = "<br><br>|Gaps|<br>";
    //     if (ring.gaps.length != 0)
    //       ring.gaps.forEach((e) => {
    //         gapstr += "== Type: " + e.t + "<br>";
    //         gapstr += "---- Begin: " + e.begin + "<br>";
    //         gapstr += "---- End: " + e.end + "<br>";
    //       });
    //     termstr = "<br><br>|Terminals|<br>";
    //     if (ring.terminals.length != 0)
    //       ring.terminals.forEach((e) => {
    //         termstr += "== Type: " + e.t + "<br>";
    //         termstr += "---- Angle: " + e.angle + "<br>";
    //         termstr += "---- Offset: " + e.offset + "<br>";
    //         termstr += "---- Rotation: " + e.rotation + "<br>";
    //       });
    //     str +=
    //       "<br><br>==== Details ======<br>" + termstr + gapstr + holestr + constr;
  });
  console.log(str);
  sendMail(str, data.info.email);
  //response.json(data);
  response.end();
});

function sendMail(text = "nothing was inserted", clientmail) {
  var mailOptions = {
    from: "voltonsender@hotmail.com",
    //to: ["info@volton.com", clientmail],
    to: ["charles.simon1999@hotmail.com", clientmail],
    subject: "Submission Volton Design",
    html:
      "<p>" +
      "Click on the submission to view the order. Click on the links to review any item designed in the submission" +
      "</p>",
    attachments: {
      // utf-8 string as an attachment
      filename: "submission.html",
      content: text,
    },
  };
  // var mailOptions2 = {
  //     from: 'testvolton2021@gmail.com',
  //     to: clientmail,
  //     subject: 'Submission copy - Volton',
  //     html: '<p>'+'You may find a copy of your submission in the link.html file attached to this document.<br> A representative will contact you to confirm the order.'+'</p>',
  //     attachments: {   // utf-8 string as an attachment
  //         filename: 'link.html',
  //         content: text
  //     }
  // };
  console.log("something is happening");
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// const fs = require('fs').promises;
// const path = require('path');
// const process = require('process');
// const {authenticate} = require('@google-cloud/local-auth');
// const {google} = require('googleapis');

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://mail.google.com/'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// /**
//  * Reads previously authorized credentials from the save file.
//  *
//  * @return {Promise<OAuth2Client|null>}
//  */
// async function loadSavedCredentialsIfExist() {
//   try {
//     const content = await fs.readFile(TOKEN_PATH);
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     return null;
//   }
// }

// /**
//  * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: 'authorized_user',
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }

// /**
//  * Load or request or authorization to call APIs.
//  *
//  */
// async function authorize() {
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   if (client.credentials) {
//     await saveCredentials(client);
//   }
//   return client;
// }

// /**
//  * Lists the labels in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// async function listLabels(auth) {
//   const gmail = google.gmail({version: 'v1', auth});
//   const res = await gmail.users.labels.list({
//     userId: 'me',
//   });
//   const labels = res.data.labels;
//   if (!labels || labels.length === 0) {
//     console.log('No labels found.');
//     return;
//   }
//   console.log('Labels:');
//   labels.forEach((label) => {
//     console.log(`- ${label.name}`);
//   });
// }

// authorize().then(listLabels).catch(console.error);