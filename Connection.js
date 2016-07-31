var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit : 20, //20 conexoes simultaneas
    host     : 'localhost',
    user     : 'igor',
    password : 'igor1994',
    database : 'invoice_manager',
    debug    :  false
});


var __getConnection = function(callback){
	pool.getConnection(function(error, connection){
		if(error){
			console.log("ERRO: " + error);
			return;
		}else{
			callback(connection);
		}
	});
}

module.exports = function(){

	return {
		getConnection: function(callback){
			__getConnection(callback);
		}
	}

}