function generateQuery(parameters) {
    console.log("paramteres",parameters)
    var body = {};
    if(parameters.configuration.size !== undefined && parameters.configuration.size) {
        body.size = parseInt(parameters.configuration.size);
    }
    else {
        body.size = 100
    }
    if(parameters.configuration.sort !== undefined && parameters.configuration.sort) { 
        body.sort = parameters.configuration.sort
    }

    if(parameters.configuration.query !== undefined && parameters.configuration.query){
        
    }
    return body;
}

module.exports = {
    generateQuery
}
