const express = require("express");
const app = express();
const path = require('path');
//const bodyParser = require("body-parser");
const mongoose = require("mongoose");
app.use(express.json());
const config = require('config');

const db = config.get('mongoURI');
  
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex:true
})
.then(() => console.log("MongoDB Connected...."))
.catch(err => console.log(err));

const items = require('./routes/api/items')
const users = require('./routes/api/users')
const auth = require('./routes/api/auth')
app.use('/api/items', items)
app.use('/api/users', users)
app.use('/api/auth', auth)

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client' ,'build', 'index.html'))
  })
}

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
