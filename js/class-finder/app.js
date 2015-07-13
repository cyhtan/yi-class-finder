/*
    TODO: 
        exclusive filters
        dynamically generate filters (+ USE LOCAL STORAGE TO CACHE?cache to local storage w/ a time stamp, and if < 1 day elapsed, recreate )

        # of results for each option
        
        elastic dropdowns

        modularize under js/class-finder


*/


var classFinder = angular.module('classFinder', ['ui.bootstrap']);

classFinder.controller('SearchCtrl', ['$scope', '$http', function(scope, http) {
    /*
    AJAX Not Working Logs Error: XMLHttpRequest cannot load https://yogainternational.com/json/classes. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
    http.get('https://yogainternational.com/json/classes').success(function(data) { scope.classes = data; });
    */
    scope.classes = classes;

    scope.dropdowns = [
                        {name:'Duration',        menuOptions:['15-min','30-min','45-min','60-min','75-min','90-min']},
                        {name:'Level',           menuOptions:['Advanced','All-Levels','Beginners','Intermediate','Restorative']},
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


    scope.durationFilter = function (obj) {
        if ( !scope.activeFilters.Duration.length ) { return true; }
        for (var i = 0; i < scope.activeFilters.Duration.length; i++) {
            if ( obj.duration[0] === scope.activeFilters.Duration[i] ) { return true; }    
        }
        return false;
    };

    scope.levelFilter = function (obj) {
        if ( !scope.activeFilters.Level.length ) { return true; }
        for (var i = 0; i < scope.activeFilters.Level.length; i++) {
            if ( obj.level[0] === scope.activeFilters.Level[i].toLowerCase() ) { return true; }    
        }
        return false;
    };

    scope.instructorFilter = function (obj) {
        if ( !scope.activeFilters.Instructor.length ) { return true; }
        for (var i = 0; i < scope.activeFilters.Instructor.length; i++) {
            if ( obj.author === scope.activeFilters.Instructor[i] ) { return true; }    
        }
        return false;
    };

    scope.focusFilter = function (obj) {
        if ( !scope.activeFilters.Focus.length ) { return true; }
        for (var i = 0; i < scope.activeFilters.Focus.length; i++) {
            for (var j = 0; j < obj.focus.length; j++){
                if ( obj.focus[j] === scope.activeFilters.Focus[i].toLowerCase() ) { return true; }    
            }
        }
        return false;
    };

}]);

/*
classFinder.filter('searchFilter', function() {
    return function (obj) {
        var re = new RegExp($scope.searchText, 'i');
        return !$scope.searchText || re.test(obj.title) || re.test(obj.author);
    };
});
*/


