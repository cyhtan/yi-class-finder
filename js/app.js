
var classFinder = angular.module('classFinder', []);

classFinder.controller('SearchCtrl', ['$scope', '$http', function(scope, http) {

    /*

    AJAX Not Working

    Logs Error:
    XMLHttpRequest cannot load https://yogainternational.com/json/classes. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
  
    http.get('https://yogainternational.com/json/classes').success(function(data) {
      scope.classes = data;
    });

    */

    scope.classes = classes;


}]);
