
var classFinder = angular.module('classFinder', ['ui.bootstrap']);

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

    // TODO: Generate dynamically from JSON
    scope.filterByLevel = ['Advanced','All Levels','Beginner','Intermediate','Restorative'];
    scope.filterByDuration = ['15 min','30 min','45 min','60 min','75 min','90 min'];
    scope.filterByInstructor = ['Shari Friedrichsen','Luke Ketterhagen'];
    scope.filterByFocus = ['Prenatal','Strength','Gentle'];

    // Custom filter, checking only .title & .author properties.
    scope.searchFilter = function (obj) {
        var re = new RegExp(scope.searchText, 'i');
        return !scope.searchText || re.test(obj.title) || re.test(obj.author);
    };


}]);
