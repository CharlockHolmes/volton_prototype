var nodemailer = require('nodemailer');
const express = require('express');
const Datastore = require('nedb'); 
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static('public'));
//app.use(express.static('three.js'));
app.use(express.json({
    limit: '10mb'
}));


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'testvolton2021@gmail.com',
      pass: 'TESTUNSECURE2021'
    }
  });
  
const database = new Datastore('database.db');
// database.loadDatabase();

app.post('/api', (request, response) => {
    console.log("i got a request");
    const data = request.body;
    //database.insert({data}); 
    console.log(data.url);
    sendMail(data.url)
    //response.json(data);
    response.end(); //bare minimum require to make it work, needs to send something back
});

// app.get('/api', (request, response)=>{ 
//     database.find({}, (err, data) => {
//         if(err){
//             response.end();
//             return;
//         }
//         response.json(data);
//     });
    
// });




function sendMail(text = 'nothing was inserted'){

    var mailOptions = {
        from: 'testvolton2021@gmail.com',
        to: 'charles.simon1999@hotmail.com',
        subject: 'Sending Email using Node.js',
        html: '<a href="'+text+'">'+"https://voltondesign.com"+'</a><p>Click on the attatchment and open link</p>',
        attachments: {   // utf-8 string as an attachment
            filename: 'link.html',
            content: '<a href="'+text+'">link</a>'
        }
    };
    console.log('something is happening')
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
