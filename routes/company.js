var express = require('express');
var router = express.Router();
var search = require('../server/search');
var initialize = require('../utils/initialize');
var utility = require('../utils/utility');
var insertData = require('../server/insertData');

router.post('/login', function (req, res, next) {
  search.getId("company", { "email_id.keyword": req.body.email_id })
    .then(function (resp) {
      if (resp == false) {
        res.status(401);
        res.json("failed");
      }
      if (req.body.password == "password")
        res.json(resp);
      else {
        res.status(401);
        res.json("failed 1");
      }
    });
});

router.post('/register', function (req, res, next) {
  console.log(req.body);
  if (req.body.hasOwnProperty('password'))
    delete req.body['password'];
  var _initialize = initialize.initialize_company();
  var _object = utility.mergeObject(_initialize, req.body);
  insertData.upsertData("company", _object, _object["id"])
    .then(function (resp) {
      if (resp.hasOwnProperty("result"))
        res.json(req.body)
      else {
        res.status(304);
        res.json("failed");
      }
    });
});

router.post('/update', function (req, res, next) {
  search.getId("company", { "email_id.keyword": req.body.email_id })
    .then(function (resp) {
      if (resp == false) {
        res.status(401);
        res.json("failed");
      }
      else {
        var _object = utility.mergeObject(resp, req.body);
        insertData.upsertData("company", _object, _object["id"])
          .then(function (response) {
            if (response.hasOwnProperty("result"))
              res.json("success")
            else {
              res.status(304);
              res.json("failed");
            }
          })
      }
    })
});

router.get('/details', function (req, res, next) {
  search.getId("company", { "email_id.keyword": req.query.email_id })
    .then(function (resp) {
      if (resp == false) {
        res.status(401);
        res.json("failed");
      }
      else {
        res.json(resp);
      }
    })
});

router.get('/get-pod', function (req, res, next) {
  console.log(req.query.email_id)
  search.getId("company", { "email_id.keyword": req.query.email_id })
    .then(function (resp) {
      console.log(resp["pod_id"]. length)
      if (resp["pod_id"].length == 0) {
        res.json("No pod")
      }
      else {
        console.log("asdas")
        utility.getCompanyPod(resp["pod_id"])
          .then(function (_values) {
            res.json(_values)
          })
      }
      //res.json(resp["pod_id"])
    })
});

router.post('/get-user', function (req, res, next) {
  console.log(req.body);
  search.getMultipleUsers("candidate", { "skill.keyword": req.body.skill.split(',') }, req.body.pod_id)
    .then(function (resp) {
      let _data = [];

      _data.push({"pod_id": req.body.pod_id})
      _data.push({"user": resp})
      res.json(_data)
    })

}) 


router.post('/get-added-user', function(req, res, next){
  search.getAddedUser("candidate", req.body.email_id, req.body.pod_id)
  .then(function(resp){
    res.json(resp)
  })
}) 

router.get('/get-dashboard', function(req, res, next){
  search.getId("company", { "email_id.keyword": req.query.email_id })
    .then(function (resp) {
      console.log(resp["pod_id"]. length)
      if (resp["pod_id"].length == 0) {
        res.json("[]")
      }
      else {
        console.log("asdas")
        utility.getDashboardCompanyPod(resp["pod_id"])
          .then(function (_values) {
            res.json(_values)
          })
      }
      //res.json(resp["pod_id"])
    })
})


module.exports = router;