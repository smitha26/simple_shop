// console.log('app has loaded')
//create an angular  module for app
var module = angular.module (
    'MyApp', //Tell angular the name of my nodule
    //Tell angular what module depends on
    ['ui.router']
    //Configure /setup the module
).config(
    //Dependency injection
    //pull in the individual service
    //my configuration will need
    [
        '$urlRouterProvider', '$stateProvider',
         function($urlRouterProvider, $stateProvider){
             //First set the router so that any undefined path
             //will always route back to the '/' path
             $urlRouterProvider.otherwise('/');
             //setup the "states" for our router
             //Think of states as mini pages on our simple page app.
             $stateProvider
                .state ('home', {
                 url: '/',
                //  template: 'This is my home';
                 templateUrl:'/templates/home.html'
             })
                .state ('about', {
                 url: '/about',
                 templateUrl: '/templates/about.html'
             })
             .state ('sandbox', {
              url: '/sandbox',
              templateUrl: '/templates/sandbox.html',
              controller: 'SandboxCtrl'

          });

         }
    ]
);

// create a controller for the sandbox
// Associate the controller with the "myApp"
// created at the top of this file
module.controller (
    //Give the controller a name
    'SandboxCtrl',
    //Dependancy inject the services the controller will need to use
    [
        '$scope', '$http',
        //Create the callback method that will act as our
        //actual controller.
        function($scope, $http) {
            //Create a variable that will be usable by
            //the html template associated with this controller
            $scope.name = 'bob';
            $scope.nameList = ['sarah', 'joe', 'dan'];

            $scope.test = function (){
                console.log('-this is my test running....');
            }
            //Create a method that will pull user data from the stateProvider
            $scope.getUsers = function () {
                //Make req to express server for json data
                $http.get('/template', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: ''
                }).success (function () {
                    console.log ('-Got back response.');

                });
            }
        }
    ]
);
