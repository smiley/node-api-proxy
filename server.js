
const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

const apiUrl = "replace with url to your api";

app.use(cors());

app.use('/', function(req, res) {

  //take the baseurl from your api and also supply whatever route you use 
  //with that url
  let url =  apiUrl + req.url;

  //Pipe is through request, this will just redirect everything from the api
  //to your own server at localhost
  req.pipe(request({ qs:req.query, uri: url })).pipe(res);
});


app.listen(port, () => {
  console.log('\x1b[36m%s\x1b[0m', 'Listening on port:' + port);
});