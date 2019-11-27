var express = require('express');
var router = express.Router();
var search = require('../server/search');
var initialize = require('../utils/initialize');
var utility = require('../utils/utility');
var insertData = require('../server/insertData');


router.post('/login', function (req, res, next) {
  console.log(req.body)
//   var a = {"id": "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
//   "company_name": "pradeep",
//   "country": "kumar",
//   "email_id": "pradeepkuamr.m@genesys.com",
//   "phone_no": "9788034166",
//   "description": "DSfasdf"
// }
//   res.json(a);
  search.getId("candidate", { "email_id.keyword": req.body.email_id })
    .then(function (resp) {
      if (resp == false) {
        res.status(401);
        res.json("failed");
      } else{
        res.json(resp);
      }
      // if (req.body.password == "password")
      //   res.json(resp);
      // else {
      //   res.status(401);
      //   res.json("failed 1");
      // }
    });
});

router.post('/register', function (req, res, next) {
  console.log(req.body);
  if (req.body.hasOwnProperty('password'))
    delete req.body['password'];
  var _initialize = initialize.initialize_candidate();
  var _object = utility.mergeObject(_initialize, req.body);
  insertData.upsertData("candidate", _object, _object["id"])
    .then(function (resp) {
      if (resp.hasOwnProperty("result"))
        res.json(_object)
      else {
        res.status(304);
        res.json("failed");
      }
    });
});

router.post('/update', function (req, res, next) {
  search.getId("candidate", { "email_id.keyword": req.body["email_id"] })
    .then(function (resp) {
      if (resp == false) {
        res.status(401);
        res.json("failed");
      }
      else {
        var _object = utility.mergeObject(resp, req.body);
        insertData.upsertData("candidate", _object, _object["id"])
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

router.get('/details', function(req, res, next){
  console.log(req.query)
  search.getId("candidate", {"email_id.keyword": req.query.email_id})
    .then(function (resp){
      if(resp == false){
        res.status(401);
        res.json("failed");
      }
      else{
        res.json(resp);
      }
    })
});

router.get('/get-pod', function(req, res, next){
  console.log(req.query)
  search.getId("candidate", {"email_id.keyword": req.query.email_id})
    .then(function(resp) {
      if(resp["status"] == "success"){

        search.getId("pod",{ "id.keyword": resp["pod_id"][0]["pod_id"]})
        .then(function(_values){
          var pod = {}
          pod["details"] = resp["status"]
          pod["pod"] = [_values]
          res.json(pod)
        })
      }
      else if(resp["pod_id"].length == 1) {
        var pod = {}
        pod["details"] = ""
        pod["pod"] = []
        res.json(pod)
      } else {
        utility.getUserPod(resp["pod_id"])
        .then(function(_values){
          var pod = {}
          pod["details"] = resp["status"]
          pod["pod"] = _values
          res.json(pod)
        })
      }
    })
})

router.post('/add-pod', function(req, res, next){
  search.getId("candidate", {"email_id.keyword": req.body.email_id})
    .then(function(resp) {
      let _user = {}
      _user["status"] = "success" 
      let _temp = {}
      _temp["company"] = req.body.company
      _temp["pod_id"] = req.body.pod_id
      _user["pod_id"] = []
      _user["pod_id"].push(_temp) 
      var _object = utility.mergeObject(resp, _user);
      insertData.upsertData("candidate",_object, _object["id"])
      .then(function(resp){
        res.json(resp);
      })
      
    })
}) 
 




module.exports = router;