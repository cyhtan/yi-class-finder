/*
    TODO: 
        dynamically generate filters (+ USE LOCAL STORAGE TO CACHE?cache to local storage w/ a time stamp, and if < 1 day elapsed, recreate )

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
                        {name:'Duration',        menuOptions:['15-min','30-min','45-min','60-min','75-min','90-min']},
                        {name:'Level',           menuOptions:['advanced','all-levels','beginners','intermediate','restorative']},
                        {name:'Instructor',      menuOptions:['Shari Friedrichsen','Luke Ketterhagen']},
                        {name:'Focus',           menuOptions:["deeper-dimensions", "prana-vayus", "calming", "gentle", "breath-and-pranayama", "core", "hip-opening", "twists", "vinyasa", "forward-bends", "strength", "back-support", "healing", "yoga-therapy-yoga-classes", "stress-relief", "energize", "backbends", "inversions", "arm-balances", "prenatal", "bandhas", "pm", "peak-pose", "for-men", "meditation-preparation", "for-women", "5-elements", "chakras-yoga-classes", "alignment", "ayurveda", "am"]}
                      ];
                      
                      

    scope.activeFilters = {
                            Duration:  [],
                            Level:     [],
                            Instructor:[],
                            Focus:     []
                          };

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
