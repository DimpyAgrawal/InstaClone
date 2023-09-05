const express = require('express');
const cors = require('cors');
// const data = require('./data')
const app =express();
const PORT = 5000;
const mongoose =require('mongoose');
const {mongoUrl} = require('./Keys');

require('./models/model');
require('./models/post')
app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'));
app.use(require('./routes/CreatePost'));
app.use(require("./routes/user"));
mongoose.connect(mongoUrl);
// app.use(require("./routes/user"))
mongoose.connection.on('connected',()=>{
    console.log('successfully connected to mongoose');
})

mongoose.connection.on('error',()=>{
    console.log('not connected to mongodb');   
})

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({ credentials: true }));

// app.get('/',(req,res)=>{
//     res.json({data})
// })




app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})









// created a server with the help of nodejs without using express

// const http = require('http');

// const server = http.createServer((req, res)=>{
//     console.log("server created");
//     res.end("working")
    
// })

// server.listen(5000,"localhost",()=>{
//     console.log("server is running on 5000");
// })