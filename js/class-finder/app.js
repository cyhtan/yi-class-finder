/*
    TODO: 

        # of results for each option

        modularize under js/class-finder
*/

var classFinder = angular.module('classFinder', ['ui.bootstrap']);

classFinder.controller('SearchCtrl', ['$scope', '$http', function (scope, http) {
    /*
    AJAX Not Working Logs Error: XMLHttpRequest cannot load https://yogainternational.com/json/classes. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
    http.get('https://yogainternational.com/json/classes').success(function(data) { scope.classes = data; });
    */
    scope.classes = classes;

    scope.filterResults;

    // Initial value prior to dynamic population of menuOptions.
    scope.dropdowns = [
                        {name:'Duration',   menuOptions:[]},
                        {name:'Level',      menuOptions:[]},
                        {name:'Instructor', menuOptions:[]},
                        {name:'Focus',      menuOptions:[]}
                      ];

    scope.activeFilters = {
                        Duration:  [],
                        Level:     [],
                        Instructor:[],
                        Focus:     []
                      };

    scope.populateDropdownMenuOptions = function (listOfClasses) {
        // console.log('beginning menu population with: ', listOfClasses);
        function mapDropdownToClasses(nameInDropdown, nameInClasses, classObj) {
            for (var i = 0; i < scope.dropdowns.length; i++) {
                if (scope.dropdowns[i].name === nameInDropdown) {
                    scope.dropdowns[i].menuOptions = scope.dropdowns[i].menuOptions.concat(classObj[nameInClasses]);
                }
            }
        }

        // Empty dropdown menus
        for (var i = 0; i < scope.dropdowns.length; i++) {
            scope.dropdowns[i].menuOptions = [];
        }

        // Get all possible values 
        for (var i = 0; i < listOfClasses.length; i++) {
            mapDropdownToClasses ('Duration',   'duration', listOfClasses[i]);
            mapDropdownToClasses ('Level',      'level',    listOfClasses[i]);
            mapDropdownToClasses ('Instructor', 'author',   listOfClasses[i]);
            mapDropdownToClasses ('Focus',      'focus',    listOfClasses[i]);
        }
        // Remove duplicates
        for (var j = 0; j < scope.dropdowns.length; j++) {
            scope.dropdowns[j].menuOptions = _.uniq(scope.dropdowns[j].menuOptions);
        }
    }

    // TODO: refactor this so that it fires on some reliable event, not just 100ms.
    scope.repopulateDropdowns = function () {
        setTimeout( function() {
            scope.populateDropdownMenuOptions(scope.filterResults);
        }, 100); 
    }

    scope.addFilter = function (filter, category) {
        // Don't add the filter if it already exists
        if ( scope.activeFilters[category].indexOf(filter) === -1 ) {
            scope.activeFilters[category].push(filter);
        }
        scope.repopulateDropdowns();
    };
    scope.removeFilter = function (index, category) {
        scope.activeFilters[category].splice(index,1);
        scope.repopulateDropdowns();
    };
    scope.resetFilters = function () {
        // Delete all active filters
        for (var prop in scope.activeFilters) {
            scope.activeFilters[prop] = [];
        }
        scope.repopulateDropdowns();
    }

    // Custom filter, checking only .title & .author properties.
    scope.filterSearch = function (obj) {
        var re = new RegExp(scope.searchText, 'i');
        return !scope.searchText || re.test(obj.title) || re.test(obj.author);
    };

    scope.filterDropdown = function (obj) {

        function hasValues (arrayToCheck, values) {
            if ( ! Array.isArray(arrayToCheck) || ! Array.isArray(values) ) {
                throw new Error('Invalid arguments to hasValues function. Both arguments must be arrays.');
            }

            for (var i = 0; i < values.length; i++) {                
                // If arrayToCheck is missing any of the values provided, return false
                if ( arrayToCheck.indexOf(values[i]) === -1 ) {
                    return false;
                }
            }
            // If arrayToCheck is has all items in values, return true (also works if values has no items)
            return true;
        }

        if  ( 
              hasValues(obj.duration, scope.activeFilters.Duration) &&
              hasValues(obj.level, scope.activeFilters.Level) &&
              hasValues([obj.author], scope.activeFilters.Instructor) && // note obj.author is not an array, and so must be cast into one
              hasValues(obj.focus, scope.activeFilters.Focus) 
            )
                { return true;

        } else {
                  return false;
        }
    }

    scope.init = function () {
        scope.populateDropdownMenuOptions(scope.classes);
    }
    scope.init();
}]);
