
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

const database = new Datastore('database.db');
// database.loadDatabase();

// app.post('/api', (request, response) => {
//     console.log("i got a request");
//     const data = request.body;
//     database.insert({data});
//     console.log(data);
//     response.json(data);
//     //response.end(); //bare minimum require to make it work, needs to send something back
// });

// app.get('/api', (request, response)=>{
//     database.find({}, (err, data) => {
//         if(err){
//             response.end();
//             return;
//         }
//         response.json(data);
//     });
    
// });