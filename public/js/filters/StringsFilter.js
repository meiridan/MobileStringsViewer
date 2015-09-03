angular.module('StringsFilter', []).filter('filterString', function($log) {
  return function(input, strSearch) {
    var tmp = {};
    if (strSearch.length < 5){
      return input ;
    }

    var inKeys = Object.keys(input) ; // String Id
    for(i = 0 ; i<inKeys.length; i++){
      strId = inKeys[i];
      localesArray = input[strId] ;

      for(j = 0 ; j<localesArray.length; j++){
        if (localesArray.length == 7 && j == 6)
          break;
        if (localesArray[j].toLowerCase().indexOf(strSearch.toLowerCase()) != -1){
          tmp[strId] = localesArray ;
          break;
        }
      }
    }

    return tmp ;

   };
});
