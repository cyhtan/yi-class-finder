var classFinder = angular.module('classFinder', ['ui.bootstrap']);

classFinder.controller('SearchCtrl', ['$scope', '$http', function (scope, http) {
    /*
    AJAX Not Working Logs Error: XMLHttpRequest cannot load https://yogainternational.com/json/classes. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
    http.get('https://yogainternational.com/json/classes').success(function(data) { scope.classes = data; });
    */
    scope.classes = classes;

    // This property is defined in the HTML (Angular necessity), and will carry the current filtration results
    // scope.filterResults;

    // Initial value prior to dynamic population of menuOptions.
    scope.dropdowns = [
                        {name:'Duration',   menuOptions:{}},
                        {name:'Level',      menuOptions:{}},
                        {name:'Instructor', menuOptions:{}},
                        {name:'Focus',      menuOptions:{}}
                      ];

    scope.activeFilters = {
                        Duration:  [],
                        Level:     [],
                        Instructor:[],
                        Focus:     []
                      };

    scope.populateDropdownMenuOptions = function (listOfClasses) {

        function mapDropdownToClasses(nameInDropdown, nameInClasses, classObj) {
            for (var i = 0; i < scope.dropdowns.length; i++) {
                if (scope.dropdowns[i].name === nameInDropdown) {
                    // Iterate through classObj[nameInClasses] and create a property for each on menuOptions, initialize it to 0 if undefined, then increment
                    for (var j = 0; j < classObj[nameInClasses].length; j++) {
                        if (nameInDropdown === 'Instructor') {
                            scope.dropdowns[i].menuOptions[ classObj[nameInClasses] ] = ( scope.dropdowns[i].menuOptions[ classObj[nameInClasses] ] || 0 ) + 1;
                            break;
                        } else {
                            scope.dropdowns[i].menuOptions[ classObj[nameInClasses][j] ] = ( scope.dropdowns[i].menuOptions[ classObj[nameInClasses][j] ] || 0 ) + 1;
                        }
                    }
                }
            }
        }

        // Empty dropdown menus
        for (var i = 0; i < scope.dropdowns.length; i++) {
            scope.dropdowns[i].menuOptions = {};
        }

        // Iterate over all classes, and get all possible values
        for (i = 0; i < listOfClasses.length; i++) {
            mapDropdownToClasses('Duration',   'duration', listOfClasses[i]);
            mapDropdownToClasses('Level',      'level',    listOfClasses[i]);
            mapDropdownToClasses('Instructor', 'author',   listOfClasses[i]);
            mapDropdownToClasses('Focus',      'focus',    listOfClasses[i]);
        }
    };


    // TODO: refactor this so that it fires on some reliable event, not just 100ms.
    scope.repopulateDropdowns = function () {
        setTimeout( function() {
            scope.populateDropdownMenuOptions(scope.filterResults);
        }, 100); 
    };

    scope.addFilter = function (filter, category) {
        // Don't add the filter if it already exists
        if ( scope.activeFilters[category].indexOf(filter) === -1 ) {
            scope.activeFilters[category].push(filter);
        }
        scope.repopulateDropdowns();  // TODO: have this fire on a $watch event of activeFilters ?
    };
    scope.removeFilter = function (index, category) {
        scope.activeFilters[category].splice(index, 1);
        scope.repopulateDropdowns();
    };
    scope.resetFilters = function () {
        // Delete all active filters
        for (var prop in scope.activeFilters) {
            scope.activeFilters[prop] = [];
        }
        // Delete text from search field
        scope.searchText = '';
        scope.repopulateDropdowns();
    };

    scope.$watch('searchText', function(newValue, oldValue) {
        scope.repopulateDropdowns();
    });

    // Custom filter, checking only .title & .author properties.
    scope.filterSearch = function (obj) {
        var re = new RegExp(scope.searchText, 'i');
        return !scope.searchText || re.test(obj.title) || re.test(obj.author);
    };

    // Helper function
    scope.hasValues = function (arrayToCheck, values) {
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
    };

    scope.filterDropdown = function (obj) {
        if  ( 
              scope.hasValues(obj.duration, scope.activeFilters.Duration) &&
              scope.hasValues(obj.level, scope.activeFilters.Level) &&
              scope.hasValues([obj.author], scope.activeFilters.Instructor) && // note obj.author is not an array, and so must be cast into one
              scope.hasValues(obj.focus, scope.activeFilters.Focus) 
            )
                { return true;

        } else {
                  return false;
        }
    };

    scope.init = function () {
        scope.populateDropdownMenuOptions(scope.classes);
    };
    scope.init();
}]);
