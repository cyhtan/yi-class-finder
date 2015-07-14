/*
    TODO: 

        # of results for each option
        
        elastic dropdowns

        modularize under js/class-finder
*/


var classFinder = angular.module('classFinder', ['ui.bootstrap']);

classFinder.controller('SearchCtrl', ['$scope', '$http', function (scope, http) {
    /*
    AJAX Not Working Logs Error: XMLHttpRequest cannot load https://yogainternational.com/json/classes. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
    http.get('https://yogainternational.com/json/classes').success(function(data) { scope.classes = data; });
    */
    scope.classes = classes;

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

    // TODO: move into an init function
    scope.populateDropdownMenuOptions = function () {
        function mapDropdownToClasses(nameInDropdown, nameInClasses, classObj) {
            for (var i = 0; i < scope.dropdowns.length; i++) {
                if (scope.dropdowns[i].name === nameInDropdown) {
                    scope.dropdowns[i].menuOptions = scope.dropdowns[i].menuOptions.concat(classObj[nameInClasses]);
                }
            }
        }
        // Get all values 
        for (var i = 0; i < scope.classes.length; i++) {
            mapDropdownToClasses ('Duration',   'duration', scope.classes[i]);
            mapDropdownToClasses ('Level',      'level',    scope.classes[i]);
            mapDropdownToClasses ('Instructor', 'author',   scope.classes[i]);
            mapDropdownToClasses ('Focus',      'focus',    scope.classes[i]);
        }

        // Remove duplicates
        for (var j = 0; j < scope.dropdowns.length; j++) {
            scope.dropdowns[j].menuOptions = _.uniq(scope.dropdowns[j].menuOptions)
        }
        

        console.log(scope.dropdowns);
    }
    scope.populateDropdownMenuOptions();




    scope.addFilter = function (filter, category) {
        // Don't add the filter if it already exists
        if ( scope.activeFilters[category].indexOf(filter) === -1 ) {
            scope.activeFilters[category].push(filter);
        }
    };
    scope.removeFilter = function (index, category) {
        scope.activeFilters[category].splice(index,1);
    };
    scope.resetFilters = function () {
        // Delete all active filters
        for (var prop in scope.activeFilters) {
            scope.activeFilters[prop] = [];
        }
    }

    // Custom filter, checking only .title & .author properties.
    scope.searchFilter = function (obj) {
        var re = new RegExp(scope.searchText, 'i');
        return !scope.searchText || re.test(obj.title) || re.test(obj.author);
    };

    scope.dropdownFilter = function (obj) {

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
              hasValues([obj.author], scope.activeFilters.Instructor) &&
              hasValues(obj.focus, scope.activeFilters.Focus) 
            )
                { return true;

        } else {
                  return false;
        }
    }
}]);
