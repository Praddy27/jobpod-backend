var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200'
});

/** Check the ES connection status */
function checkConnection () {
    let isConnected = false
    elasticClient.ping({
        requestTimeout: 30000
    },function(error){
        if(error){
            return isConnected;
        } else {
            isConnected = true;
            return isConnected;
        }
    });
}

module.exports = {
    elasticClient, checkConnection
};