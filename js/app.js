
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

    // Custom filter, checking only .title & .author properties.
    scope.searchFilter = function (obj) {
        var re = new RegExp(scope.searchText, 'i');
        return !scope.searchText || re.test(obj.title) || re.test(obj.author);
    };


}]);
