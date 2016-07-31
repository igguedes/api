var express = require("express");
var users = require('./Users')();
var notas = require('./Notas')();
var app = express();
require('events').EventEmitter.prototype._maxListeners = 100;
var bodyParser = require('body-parser');

app.use(bodyParser.json());


app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});




var validarAutorizacao = function(req, res, next) {

	var token;
    var headers = req.headers["authorization"];
    if (typeof headers !== 'undefined') {
        var bearer = headers.split(" ");
        token = bearer[1];
        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
}


app.post('/authenticate', function(req,res){
	var login = req.body.login;
	var senha = req.body.pass;
	users.authenticate(req,res,login,senha);
});

app.get('/users', validarAutorizacao, function(req,res){
	users.validateToken(req.token,function(response){
		if(response == true){
			users.getUsers(req,res);
		}else{
			res.sendStatus(403);
		}
	});
	
});

app.get('/notas/estabelecimento/:id_estabelecimento', validarAutorizacao, function(req,res){
	users.validateToken(req.token,function(response){
		if(response == true){
			notas.getNotas(req,res);
		}else{
			res.sendStatus(403);
		}
	});

	
});

app.get('/check-nota/:chave',function(req,res){
	notas.checkNota(req.params.chave, function(response){
		if(response.status == true){
			res.json({
				exist: true,
				msg: 'Ja existe uma nova cadastrada com essa chave',
				nota: response.nota
			});
		}else{
			res.json({
				exist:false,
				msg: 'Ainda nao existe nota cadastrada com essa chave'
			});
		}
	});
});

app.post('/nova-nota/estabelecimento/:id_estabelecimento', validarAutorizacao, function(req,res){
	var novaNota = req.body;
	users.validateToken(req.token,function(response){
		if(response == true){
			notas.cadastrarNota(req,res,novaNota);
		}else{
			res.sendStatus(403);
		}
	}); 
	
});

app.post('/update/nota/:id_nota', validarAutorizacao, function(req,res){
	var novaNota = req.body;
	users.validateToken(req.token,function(response){
		if(response == true){
			notas.updateNota(req,res,novaNota);
		}else{
			res.sendStatus(403);
		}
	}); 
	
});

app.listen(3000, function(){
	console.log("servidor rodando na porta 3000")
});


      