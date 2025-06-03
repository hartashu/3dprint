const express = require('express');
const router = require('./routers');
const app = express();
session = require('express-session');
const port = 3000;

app.use(session({
  secret: 'bambang',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true  
  }
}));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})