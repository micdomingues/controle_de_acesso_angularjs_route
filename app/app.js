angular.module('myApp', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'partials/home.html',
                controller: 'homeController'
            })
            .when('/livros', {
                templateUrl: 'partials/livros.html',
                controller: 'livroController'
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'loginController'
            })
            .when('/usuarios', {
                templateUrl: 'partials/usuarios.html',
                controller: 'usuariosController'
            })
            .when('/acessoNegado', {
                templateUrl: 'partials/acessoNegado.html',
                controller: 'acessoNegadoController'
            })
            .otherwise({ redirectTo: '/home'});

})
.controller('pageController', function ($scope, usuariosService) {

    $scope.logout = function(){
        usuariosService.logout();
    }

})
.controller('homeController', function ($scope) {

})

.controller('livroController', function ($scope, livrosService) {
    $scope.livros = livrosService.getLivros();
    
})
.controller('loginController', function ($scope, usuariosService) {

    $scope.logar = function(user){
        usuariosService.validaLogin(user);
    }
})

.controller('usuariosController', function ($scope, usuariosService) {
    $scope.usuarios = usuariosService.getUsers();
    
})
.controller('acessoNegadoController', function ($scope) {
    
})

.service('usuariosService', function ($rootScope, $location) {

    /*Nesta função, vamos fazer o papel de validação que seria feito no backend */
    this.validaLogin = function(user){
        //Vamos criar usuários fictícios que possam ser usados pela página e pra validar o login
        var usuarios = [{username:'Robson', password:'123', admin:true},
            {username:'Juliano', password:'123', admin:false},
            {username:'Bruno', password:'123', admin:false}
        ]

        //Aqui, faremos um for para validar o login
        angular.forEach(usuarios, function(value, index){
            if(value.username == user.username &&
                value.password == user.password){
                delete value.password;
                $rootScope.usuarioLogado = value;
                $location.path('/home')
            }
        })
    }

    this.logout = function(){
        $rootScope.usuarioLogado = null;
        $location.path('/home')
    }
    this.getUsers = function(){
      return [{nome:'Robson', admin:true},
          {nome:'Juliano', admin:false},
          {nome:'Bruno', admin:false}]
    }

})
.service('livrosService', function () {
    //busca livros
    this.getLivros = function(){
        return [{nome:'Como Eu Era Antes de Você', autor:'Jojo Moyes'},
            {nome:'A sereia', autor:'Kiera Cass'},
            {nome:'Belo Sacrifício - Irmãos Maddox', autor:'Jamie McGuire'}
        ];
    }
})
.run(function ($rootScope, $location) {
    //Rotas que necessitam do login
    var rotasBloqueadasUsuariosNaoLogados = ['/usuarios', '/livros'];
    var rotasBloqueadasUsuariosComuns = ['/usuarios'];

    $rootScope.$on('$locationChangeStart', function () { //iremos chamar essa função sempre que o endereço for alterado
        /*  podemos inserir a logica que quisermos para dar ou não permissão ao usuário.
         Neste caso, vamos usar uma lógica simples. Iremos analisar se o link que o usuário está tentando acessar (location.path())
         está no Array (rotasBloqueadasUsuariosNaoLogados) caso o usuário não esteja logado. Se o usuário estiver logado, iremos
         validar se ele possui permissão para acessar os links no Array de strings 'rotasBloqueadasUsuariosComuns'
         */
        if($rootScope.usuarioLogado == null && rotasBloqueadasUsuariosNaoLogados.indexOf($location.path()) != -1){
            $location.path('/acessoNegado');
        }else
        if($rootScope.usuarioLogado != null &&
            rotasBloqueadasUsuariosComuns.indexOf($location.path()) != -1 &&
            $rootScope.usuarioLogado.admin == false){
            $location.path('/acessoNegado')
        }
    });
});