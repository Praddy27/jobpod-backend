var es = require('./connection');

var elasticClient = es.elasticClient;

function getId(_index, _data){
	return new Promise(function(resolve, reject){
		elasticClient.search({
			index: _index,
			body: {
		    	query: {
		      		term: _data		    
		  		}
	  		}
		})
		.then(function(resp){
			resolve(resp.hits.hits[0]["_source"]);
		})
		.catch(function(resp){
			resolve(false);
		})
	});
}


function getMultipleUsers(_index, _data, pod_id) {
	return new Promise(function (resolve, reject) {
		console.log(_data,pod_id)
		elasticClient.search({
			index: _index,
			body: {
				query: {
					bool: {
						must_not: [
							{
								term: {
									"status.keyword": "success"
								}
							},
							{
								term: {
									"pod_id.pod_id.keyword": pod_id
								}
							}
						],
						filter: {
							bool: {
								must: [
									{
										match_all: {}
									},
									{
										bool: {
											should: [{
												terms: _data
											}
											]
										}
									}
								]

							}
						}
					}

				}
			}
		})
			.then(function (resp) {
				console.log(resp)
				//resolve(resp.hits.hits);
				var allRecords = [];
				resp.hits.hits.forEach(function (hit) {
					console.log(hit["_source"])
					allRecords.push(hit["_source"]);
				})
				Promise.all(allRecords)
					.then(function (value) {
						resolve(value)
					})

			})
			.catch(function (resp) {
				console.log(resp)
				resolve([])
			})
	})
} 
 


function getAddedUser(_index, _email, _pod){
	return new Promise(function(resolve, reject){


		elasticClient.search({
			index: _index,
			body: {
				query: {
					bool: {
						must: [
							{
								term: {
									"pod_id.company.keyword": _email
								}
							},
							{
								term: {
									"pod_id.pod_id.keyword": _pod
								}
							}
						]
					}

				}
			}
		})
		.then(function(resp){
			var allRecords = [];
			resp.hits.hits.forEach(function (hit) {
				console.log(hit["_source"])
				allRecords.push(hit["_source"]);
			})
			Promise.all(allRecords)
				.then(function (value) {
					resolve(value)
				})
		})
		.catch(function (resp) {
			console.log(resp)
			resolve([])
		})
	});
} 
 





module.exports = {
    getId, getMultipleUsers, getAddedUser
}