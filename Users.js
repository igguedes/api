var con = require('./Connection')();


var __getUsers = function(req, res){

	con.getConnection(function(connection){
		connection.query("select * from usuario",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Erro ao se conectar ao banco de dados"});
              return;     
        });

	});
}

var __authenticate = function(req,res,login, senha){

	con.getConnection(function(connection){
		var sql = 	`SELECT usuario.*, estabelecimento.id_estabelecimento 
						FROM usuario JOIN estabelecimento ON
		 					usuario.id_usuario = estabelecimento.responsavel 
		 			WHERE login = ? and senha = ?`;

		connection.query(sql,[login,senha],function(err,rows){
            connection.release();
            if(!err) {
                if(rows.length < 1){
                	res.json(
                	{
                		authenticated : false,
                		msg: 'Usuario ou senha incorretos',
                		token: ''
                		
                	});
                }else{
                	res.json(
                	{
                		
                		authenticated : true,
                		msg: 'Usuario autenticado com sucesso',
                		token: rows[0].token,
                		idUsuario: rows[0].id_usuario,
                		usuario: rows[0].login,
                		idEstabelecimento: rows[0].id_estabelecimento
                		
                	});
                }
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Erro ao se conectar ao banco de dados"});
              return;     
        });

	});

}

var __validateToken = function(token, response){
	con.getConnection(function(connection){
		connection.query("select token from usuario WHERE token = ?",[token],function(err,rows){
            connection.release();
            if(!err) {
              if(rows.length < 1){
                 response(false);
              }else{
              	 response(true);
              }
            }           
        });

        connection.on('error', function(err) {      
              response({"code" : 100, "status" : "Erro ao se conectar ao banco de dados"});
              return;     
        });

	});
}


module.exports = function(){

	return {
		getUsers : function(req,res){
			__getUsers(req,res);
		},
		authenticate: function(req,res,login, senha){
			__authenticate(req,res,login, senha);
		},
		validateToken: function(token,response){
			__validateToken(token,response);
		}
	}
}