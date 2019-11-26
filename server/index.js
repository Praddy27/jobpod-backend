var es = require('./connection');

var elasticClient = es.elasticClient;

function checkIndex(indexName){
    elasticClient.indices.exists({
        index: indexName
    }).then(function(resp){
        return resp;
    })
}

// function createIndex(indexName){
//     elasticClient.indices.create({
//         index: indexName
//     })
// }
module.exports = {
    checkIndex
};