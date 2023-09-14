import express from 'express';
import nodemailer from 'nodemailer';
import nedb from 'nedb';



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

// testmail()
// var transporter = nodemailer.createTransport({
//   service: "mail",
//   auth: {
//     user: "voltonsender@mail.com",
//     pass: "NotSafe123",
//   },
// });
// var transporter = nodemailer.createTransport('smtp://voltonsender%40hotmail.com:NotSafeAtAll6969@smtp-mail.hotmail.com');
var transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "148a6cc4ce27f4d4645511a19ca1374d"
  }
});
// var transporter = nodemailer.createTransport({
//   service: "hotmail",
//   auth: {
//     user: "voltonsender@hotmail.com",
//     pass: "NotSafeAtAll6969",
//   },
// });
const database = new nedb("database.db");
// database.loadDatabase();

app.post("/api", (request, response) => {
  console.log("i got a request");
  const data = request.body;
  //database.insert({data});
  let str = "";
  let str2='';
  str += "Name: " + data.info.name + "<br>";
  str += "Email: " + data.info.email + "<br>";
  str += "Phone: " + data.info.phone + "<br>";
  str += "Company: " + data.info.company + "<br>";
  str += "Message: " + data.info.message + "<br>";
  str2=str;
  data.items.forEach((item) => {
    const ring = item.ring;
    let temp = ''
    temp += "<br>================================== "+item.type+" ============================================<br>";
    temp += "Quantity:" + item.quantity + "<br>";
    temp += "Voltage:" + item.voltage + "V<br>";
    temp += "Power:" + item.power + "W<br>";
    temp += "Diameter:" + ring.radius * 2 * 3 + "inch<br>";
    temp += "Width:" + ring.width * 3 + "inch<br>";
    temp += "Type:" + item.type + "<br>";
    temp += "Holes:" + ring.holes.length + "<br>";
    temp += "Connectors:" + ring.terminals.length + "<br>";
    //str += "id:"+num+'<br>';
    temp += "Additional Notes: " + item.text + "<br>";
    str += temp;
    str += '<a href="' + item.url + '">' + item.url + "</a>";
    str2 += temp
    console.log(JSON.stringify(item))
    ////////////////////////////////////////////////////
    let constr = "<br><br>|Serrage|<br>";
    ring.connectors.forEach((e) => {
      constr += "== Type: " + e.t + "<br>";
      constr += "---- Angle: " + e.angle + "<br>";
      constr += "---- Offset: " + e.angle + "<br>";
      constr += "---- Facing: " + (e.Flipped ? "Right " : "Left ") + "<br>";
    });

    let holestr = "<br><br>|Trous|<br>";
    if (ring.holes!=undefined && ring.holes.length != 0)
      ring.holes.forEach((e) => {
        if(e.id!=undefined){
          if (e.id[0] == "h" && e.id[1] == "s" && e.t == "rect"){
            //hslot
            holestr += "== Type: " + "Hslot" + "<br>";
            holestr += "---- Angle: " + e.angle + "<br>";
            holestr += "---- Offset: " + e.angle + "<br>";
          }
          else if (e.id[0] == "s" && e.id[1] == "s" && e.t == "rect"){
            //vslot
            holestr += "== Type: " + "Vslot" + "<br>";
            holestr += "---- Angle: " + e.angle + "<br>";
            holestr += "---- Offset: " + e.angle + "<br>";
          }
        }
        else{
          //other
          holestr += "---- Angle: " + e.angle + "<br>";
          holestr += "---- Offset: " + e.angle + "<br>";
          holestr += "== Type: " + e.t + "<br>";
      
          if (e.t == "circle") holestr += "---- Width: " + e.r + "<br>";
          else {
            holestr += "---- Width: " + e.r.w + "<br>";
            holestr += "---- Height: " + e.r.h + "<br>";
          }
        }
      });
    let gapstr = "<br><br>|Gaps|<br>";
    if (ring.gaps.length != 0)
      ring.gaps.forEach((e) => {
        gapstr += "== Type: " + e.t + "<br>";
        gapstr += "---- Begin: " + e.begin + "<br>";
        gapstr += "---- End: " + e.end + "<br>";
      });
    let termstr = "<br><br>|Terminals|<br>";
    if (ring.terminals.length != 0)
      ring.terminals.forEach((e) => {
        termstr += "== Type: " + e.t + "<br>";
        termstr += "---- Angle: " + e.angle + "<br>";
        termstr += "---- Offset: " + e.offset + "<br>";
        termstr += "---- Rotation: " + e.rotation + "<br>";
      });
      str2 += "<br><br>==== Details ======<br>" + termstr + gapstr + holestr + constr;
  });
  console.log(str);
  console.log(str2)
  sendMail(str, data.info.email, str2);
  //response.json(data);
  response.end();
});

function sendMail(text = "nothing was inserted", clientmail, mailinfo) {
  console.log("Email sending with mailtrap");
  var mailOptions = {
    from: "no-reply@voltondesign.com",
    //to: ["info@volton.com", clientmail],
    to: ["charles.simon1999@hotmail.com", clientmail],
    subject: "Submission Volton Design",
    html:
      "<p>" +
      "Click on the submission to view the order. Click on the links to review any item designed in the submission" +
      "</p> <br><br><div>"+mailinfo+'</div>',
    attachments: {
      // utf-8 string as an attachment
      filename: "submission.html",
      content: text,
    },
  };
  console.log("something is happening");
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}


// function testmail() {
//   var transport = nodemailer.createTransport({
//     host: "live.smtp.mailtrap.io",
//     port: 587,
//     auth: {
//       user: "api",
//       pass: "148a6cc4ce27f4d4645511a19ca1374d"
//     }
//   });
//   var mailOptions = {
//     from: "no-reply@voltondesign.com",
//     //to: ["info@volton.com", clientmail],
//     to: ["charles.simon1999@hotmail.com"],
//     subject: "Submission Volton Design",
//     html:
//       "<p>" +
//       "Click on the submission to view the order. Click on the links to review any item designed in the submission" +
//       "</p> <br><br><div>"+"mailinfo"+'</div>',
//   };
//   console.log("something is happening");
//   transport.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
// }