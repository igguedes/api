var app = angular.module("Exemplo", []);

app.controller("ExemploCtrl", function($scope,$http){




	//Os dados na url : https://cryptic-tundra-32566.herokuapp.com/teste serao requisitados

	
	//esse array sera populado com os dados que vem do servidor
	$scope.notas = [];

	$scope.carregarNotas = function(){
		$http.get("http://localhost:3000/users").success(function(retornoDosDadosEmJson){
			//em caso de sucesso as seguintes instrucoes serao executadas
			var dados = retornoDosDadosEmJson;

			$scope.notas = dados;
		});
	}


	//chamando a funcao para pegar os dados no servidor

	$scope.carregarNotas();

})
.config(function($httpProvider){


$httpProvider.interceptors.push(function($q) {
        return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = 'TOKEN ' + Main.getToken();
                    return config;
                },

                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                       	console.log("faca seu login");
                    }
                    return $q.reject(response);
                }
            };
        });


});