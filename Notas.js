var con = require('./Connection')();


var __getNotas = function(req, res){

	var id_estabelecimento = req.params.id_estabelecimento;

	con.getConnection(function(connection){
		connection.query("SELECT * FROM lista_notas WHERE id_estabelecimento = ?",[id_estabelecimento],function(err,rows){
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

var __checkNota = function(chave,response){

	con.getConnection(function(connection){
		connection.query("SELECT * FROM nota_fiscal WHERE chave = ?",chave,function(err,rows){
            connection.release();
            if(!err) {
            	if(rows.length > 0){
            		response({status:true,nota:rows[0]});
            	}else{
            		response({status:false,nota:''});
            	}
                
            }           
        });

        connection.on('error', function(err) {      
              response({"code" : 100, "status" : "Erro ao se conectar ao banco de dados"});
              return;     
        });

	});
}

var __cadastrarNota = function(req,res,novaNota){
	
	//Convertendo a data para que seja recohecido no formato date do sql
	data = novaNota.dataEmissao.split("/");
	novaNota.dataEmissao = new Date(data[1] + "-" + data[0] + "-" + data[2]);

	con.getConnection(function(connection){
		 connection.query(
			"INSERT INTO nota_fiscal(estabelecimento,chave,data_emissao,emissor,cnpj_emissor,valor) VALUES(?,?,?,?,?,?)",
			[
				req.params.id_estabelecimento,
				novaNota.chave,
				novaNota.dataEmissao,
				novaNota.emissor,
				novaNota.cnpj,
				novaNota.valor1

			],

			function(err,rows){
            connection.release();
            if(!err) {
            	console.log(rows);
                res.json({
                	cadastrado: true,
                	msg: 'Nota cadastrada com sucesso'
                });
            }else{
            	res.json({
            		cadastrado: false,
            		msg: 'Falha no cadastro de nota',
            		erro: err
            	});
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Erro ao se conectar ao banco de dados"});
              return;     
        });

	});
}


var __updateNota = function(req,res,novaNota){
	
	//Convertendo a data para que seja recohecido no formato date do sql
	data = novaNota.dataEmissao.split("/");
	novaNota.dataEmissao = new Date(data[1] + "-" + data[0] + "-" + data[2]);
	con.getConnection(function(connection){
		 connection.query(
			"UPDATE nota_fiscal set emissor = ?, data_emissao = ?, valor = ? WHERE id_nota = ?",
			[
				novaNota.emissor,
				novaNota.dataEmissao,
				novaNota.valor1,
				req.params.id_nota

			],

			function(err,rows){
            connection.release();
            if(!err) {
            	console.log(rows);
                res.json({
                	atualizado: true,
                	msg: 'Nota atualizada com sucesso'
                });
            }else{
            	res.json({
            		atualizado: false,
            		msg: 'Falha na atualizacao de nota',
            		erro: err
            	});
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Erro ao se conectar ao banco de dados"});
              return;     
        });

	});
}


module.exports = function(){

	return {
		getNotas : function(req,res){
			__getNotas(req,res);
		},
		cadastrarNota: function(req,res,nota){
			__cadastrarNota(req,res,nota);
		},
		updateNota: function(req,res,nota){
			__updateNota(req,res,nota);
		},
		checkNota: function(chave, response){
			__checkNota(chave,response);
		}
	}
}
