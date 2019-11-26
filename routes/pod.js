var express = require('express');
var router = express.Router();
var search = require('../server/search');
var initialize = require('../utils/initialize');
var utility = require('../utils/utility');
var insertData = require('../server/insertData');

router.post('/create', function (req, res, next) {
    console.log(req.body);
    var _initialize = initialize.initialize_pod();
    var _object = utility.mergeObject(_initialize, req.body);
    insertData.upsertData("pod", _object, _object["id"])
        .then(function (resp) {
            utility.addPodId(_object['email_id'], _object['id'])
                .then(function (pod) {
                    res.json(pod)
                })
        });
});

router.post('/addUser', function (req, res, next) {
    console.log(req.body["id"])
    search.getId("pod", { "id.keyword": req.body["id"] })
        .then(function (resp) {
            //res.json(resp)
            var _object = utility.mergeObject(resp, req.body);
            insertData.upsertData("pod", _object, _object["id"])
                .then(function (response) {
                    console.log(response)
                    //res.json(_object)
                    utility.addPerson(_object['user_id'], _object["id"], _object["email_id"])
                        .then(function (status) {
                            res.json(_object)
                        })
                })
        })
})

module.exports = router;