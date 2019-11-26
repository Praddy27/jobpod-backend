var es = require('./connection');

var elasticClient = es.elasticClient;

function upsertData(_index, _data, _id) {
    return new Promise(function(resolve, reject){
		elasticClient.index({
            index: _index,
            id: _id,
			body: _data
		}).then(function(res){
			console.log(res);
			resolve(res);
		}).catch(function(res){
			reject(res);
		});
	});
};

function deleteData(_index, _id) {
	return new Promise(function(resolve, reject){
		elasticClient.delete({
			index: _index,
			id: _id
		}).then(function(resp){
			res.json(resp)
		}).catch(function(err){
			res.json(err)
		});
	})
};

module.exports = {
	upsertData, deleteData
};

