var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/user');
var companyRouter = require('./routes/company');
var index = require('./server/index');
var insertData = require('./server/insertData');
var queryGenerator = require('./utils/queryGenerator');
var search = require('./server/search');
var initialize = require('./utils/initialize');
var utility = require('./utils/utility');

var app = express();

var checkIndex = index.checkIndex('test1');
var podRouter = require('./routes/pod'); 
//console.log(checkIndex);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/user', usersRouter);
app.use('/company',companyRouter);
app.use('/pod', podRouter); 
 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// var testJson = {
//   "configuration": {
//     "size": 50,
//     "sort": [
//       {
//         "data": "asc"
//       },
//       {
//         "asdgi": "Asd"
//       }
//     ]
//   }
// }
// var c = {"id": "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
// "first_name": "pradeep",
// "last_name": "kumar",
// "email_id": "pradeepkuamr.m@genesys.com",
// "phone_no": "9788034166",
// "education": [{"btech" : "cs"}, {"mtech" : "it"}],
// "experience" : [{"visual bi":"3"}],
// "role": "Developer",
// "skill": [{"android":"2"},{"java":"3"}],
// "language":["english","tamil"],
// "country": "india",
// "billing": "3"}
// var d = initialize.initialize_candidate();
// console.log(c,d);
// var e = utility.mergeObject(d,c);
// console.log(e)

// var a = {
//   "id": "3",
//   "name": "pradeepkumar",
//   "position": "Manager"
// }
// insertData.upsertData("test",a,a["id"]).then(function(resp){
//   console.log("asdgasygfdi",resp.hasOwnProperty("result"));
// }) 


//let _test = queryGenerator.generateQuery(testJson); 
//console.log(_test)
// error handler

// search.getId("test",{"name":"Peter"}).then(function(resp){
//   console.log(resp);
// })
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
