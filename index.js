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
    let str = '';
    str+= 'Name: '+ data.info.name + '<br>';
    str+= 'Email: '+ data.info.email + '<br>';
    str+= 'Phone: '+ data.info.phone +'<br>';
    str+= 'Company: '+ data.info.company +'<br>';
    str+= 'Message: '+ data.info.message + '<br>';

    data.items.forEach(item=>{
        const ring = item.ring;
        str +='<br><br>';
        str += "Quantity:"+item.quantity+'<br>';
        str += "Voltage:"+item.voltage+'V<br>';
        str += "Power:"+item.power+'W<br>';
        str += "Diameter:"+ring.radius*2*3+'inch<br>';
        str += "Width:"+ring.width*3+'inch<br>';
        str += "Type:"+item.type+'<br>';
        str += "Holes:"+ring.holes.length+'<br>';
        str += "Connectors:"+ring.terminals.length+'<br>';
        //str += "id:"+num+'<br>';
        str += 'Additional Notes: '+ item.text + '<br>'
        str += '<a href="'+item.url+'">'+item.url+'</a>'
    }) 
    console.log(str);
    sendMail(str, data.info.email)
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




function sendMail(text = 'nothing was inserted', clientmail){

    var mailOptions = {
        from: 'testvolton2021@gmail.com',
        to: ['csimon9999@gmail.com', clientmail],
        subject: 'Submission Volton Design',
        html: '<p>'+'Click on the submission to view the order. Click on the links to review any item designed in the submission'+'</p>',
        attachments: {   // utf-8 string as an attachment
            filename: 'submission.html',
            content: text
        }
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
    console.log('something is happening')
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
