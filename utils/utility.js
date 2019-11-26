var search = require('../server/search');
var insertData = require('../server/insertData');

function mergeObject(source, dest) {
    return Object.assign(source, dest);
}

function addPodId(email_id, pod_id) {
    return new Promise(function (resolve, reject) {
        search.getId("company", { "email_id.keyword": email_id })
            .then(function (resp) {
                console.log(resp);
                resp["pod_id"].push(pod_id);
                insertData.upsertData("company", resp, resp["id"])
                    .then(function (response) {
                        resolve("success")
                    })
            })
    })
}
function updatePerson(email_id, pod_id, company) {
    return new Promise(function (resolve, reject) {
        console.log(email_id, pod_id,company)
        search.getId("candidate", { "email_id.keyword": email_id })
            .then(function (user) {
                let _temp = {}
                _temp["company"] = company
                _temp["pod_id"] = pod_id
                user["pod_id"].push(_temp);
                user["status"] = "WL"
                insertData.upsertData("candidate", user, user["id"])
                    .then(function (resp) {
                        resolve("success")
                    })
            })
    })
}

function addPerson(email_id, pod_id, company) {
    return new Promise(function (resolve, reject) {
        if (email_id.length === 0) {
            resolve("success")
        } else {
            var promises = [];
            for (let _data in email_id) {
                promises.push(updatePerson(email_id[_data], pod_id, company))
            }

            Promise.all(promises)
                .then(function (resp) {
                    resolve("success");
                })

        }
    })
}

function getPodDetails( pod_id ){
    return new Promise(function(resolve, reject){
        console.log(pod_id)
        //resolve("sadasd")
        // //var _details = {}
        // let _cmny = Object.keys(pod_id)
        // //_details['company_id'] = _cmny[0]
        // //_details['pod_id'] = pod_id[_cmny[0]]
        search.getId("pod",{ "id.keyword": pod_id["pod_id"] })
        .then(function(resp){
            resolve(resp)
        })
    })
}
function getUserPod(pod_id){
    return new Promise(function(resolve, reject){
        var promises = [];
        for (let data = 1; data < pod_id.length; data ++   ){
            promises.push(getPodDetails(pod_id[data]))
        }
        Promise.all(promises)
        .then(function(resp){
            resolve(resp)
        })
    })
}

function getDetails(pod_id){
    return new Promise(function(resolve,reject){
        search.getId("pod",{ "id.keyword": pod_id })
        .then(function(resp){
            resolve(resp)
        })
    })
}
function getCompanyPod(pod_id){
    return new Promise(function(resolve,reject){
        var promises = [];
        for (let _data in pod_id){
	    	promises.push(getDetails(pod_id[_data]))
        }
        Promise.all(promises)
        .then(function(resp){
            resolve(resp)
        })
    })
}

function getDashboardDetails(pod_id){
    return new Promise(function(resolve,reject){
        search.getLimitedId("pod",{ "id.keyword": pod_id })
        .then(function(resp){
            getDates(new Date(resp["startDate"]), new Date(resp["endDate"]), resp["pod_name"])
            .then(function(res){
                resolve(res)
            })
        })
    })
}
function getDashboardCompanyPod(pod_id){
    return new Promise(function(resolve,reject){
        var promises = [];
        for (let _data in pod_id){
	    	promises.push(getDashboardDetails(pod_id[_data]))
        }
        Promise.all(promises)
        .then(function(resp){
            console.log(resp)
            var merged = [].concat.apply([], resp);
            resolve(merged)
            
        })
    })
}

function createObject( date, pod_name){
    return new Promise(function(resolve,reject){
        console.log(typeof(date))
        _date = new Date(date)

        let _temp = {}
        //{ title: 'event 1', date: '2019-11-01' },
        _temp["title"] = pod_name
        _temp["date"] = _date.toISOString().split('T')[0]
        resolve(_temp)
    })
}

function getDates(startDate, stopDate, pod_name) {
    return new Promise(function(resolve, reject){
        console.log(startDate,stopDate)
        var dateArray = [];
        
        for(let currentDate = startDate; currentDate <= stopDate; currentDate.setDate(currentDate.getDate()+1)){
            console.log("co")
            dateArray.push(createObject(currentDate, pod_name));
        }
        
        Promise.all(dateArray)
        .then(function(resp){
            console.log("asdguas",resp)
            resolve(resp)
            
        })
    })
  
 }

module.exports = {
    mergeObject, addPodId, addPerson, getUserPod, getCompanyPod, getDashboardCompanyPod
}