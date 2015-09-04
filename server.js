var express = require('express');
var fs = require("fs");
var lineReader = require("line-reader");
var config = require('./config.js');
var async = require("async");
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var sys = require('sys')
var exec = require('child_process').exec;

var app = express();

app = express(),
   path = require('path'),
   publicDir = path.join(__dirname, '/public/');

app.use(express.static(publicDir));

var port = process.env.PORT || 3000;

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// routes ==================================================
//require('./app/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// preform SVN updates

console.log('Listening on port ' + port);

 app.get('/api/getExeclFile/android', function (req, res) {
    getStringsAndroid(function(dictAnd){
      createExcelFile(res , dictAnd, "Android ");
     });
 });

 app.get('/api/getExeclFile/ios', function (req, res) {
    getStringsiOS(function(dictiOS){
      createExcelFile(res , dictiOS, "ios ");
     });
 });


app.get('/api/strings/ios', function (req, res) {

  async.parallel([SVNUdpateiOSFiles , SVNUdpateAndroidSFiles ],
  // optional callback
    function(err, results){
      if( err) {
        // One of the iterations produced an error.
        // All processing will now stop.
        console.log('A file failed to SVN update');
        console.log(err);
      } else {
        console.log('All files have been SVN updated successfully');
      }
      getStringsiOS(function(dictiOS) {     
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(dictiOS);
        res.end();
      });

  });
});

app.get('/api/strings/android', function (req, res) {

  getStringsAndroid(function(dictAnd){
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(dictAnd);
      res.end();
    });
});
app.use(function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
/*
=====================================================
*/

function getStringsiOS(returnCallback) {
  var dictiOS = {};
   async.waterfall([
    function(callback) {
      loadStringsFilesiOS(dictiOS, callback) ;
    } ,
    function(callback) {
      findMissingStrings(dictiOS) ;
      callback();
    }
  ], function(error, results) {
      returnCallback(dictiOS);
  });

}

/*
=====================================================
*/

function SVNUdpateiOSFiles(cb){
  var iosFiles = getFileNamesiOS();
//  console.log(iosFiles);
  async.each(iosFiles, function(fileName,callback){
    var localPath = publicDir + config.iOSLocalFilesLocalPath + fileName ;
    var cmd = "svn export --username " + config.SVNUser + " --password " + config.SVNPassword + " --non-interactive --force "  + "'" + config.iOSSVNRepoBaseUrl + fileName + "' '" + localPath  + "'" ;
  //  console.log(cmd) ;
    executeSVNUpdate(cmd, callback) ;
  }, function(err){
    // if any of the file processing produced an error, err would equal that error
    if( err) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to update');
      console.log(err);
    } else {
      console.log('All iOS files have been processed successfully');
      cb();
    }
  });
}


function SVNUdpateAndroidSFiles(cb){
  var androidFiles = getFileNamesAndroid();
  //console.log(androidFiles);

  async.each(androidFiles, function(fileNameElement,callback){
    var localPath = publicDir + config.androidLocalFilesLocalPath  + fileNameElement.file ;
    var cmd = "svn export --username " + config.SVNUser + " --password " + config.SVNPassword + " --non-interactive --force "  + "'" + config.androidSVNRepoBaseUrl + fileNameElement.file + "' '" + localPath  + "'" ;
  //  console.log(cmd) ;
    executeSVNUpdate(cmd, callback) ;
  }, function(err){
    // if any of the file processing produced an error, err would equal that error
    if( err) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to update');
      console.log(err);
    } else {
      console.log('All android files have been processed successfully');
      cb();
    }
  });

}

function executeSVNUpdate(cmd,cb){

  var child = exec(cmd , function (error, stdout, stderr) {
    console.log(stdout);
     if (error !== null) {
        cb(error);
      }
      else {
        cb();
      }
  });

}

function getFileNamesiOS(){
  var iosFiles = [];
  var locale = config.locale ;
  locale.forEach(function(element, index, array) {
    iosFiles.push(config.iOSLocalFilesPathPrefix + element + config.iOSLocalFilesPathSuffix ) ;
  });
  return iosFiles;
 }

function loadStringsFilesiOS (dictiOS, endCallback) {

  var iosFiles = getFileNamesiOS() ;

  var index = 0 ;
  async.eachSeries(iosFiles, function(element, callback) {
      lineReader.eachLine(publicDir + "iosSVN" + element ,function(line, last) {
        if (line.charAt(0) == "\""){
          var stringTitleAposStartIndex = line.indexOf("\"", 0) + 1 ;
          var stringTitleAposEndIndex = line.indexOf("\"", stringTitleAposStartIndex+1) ;

          var stringValueAposStartIndex = line.indexOf("\"", stringTitleAposEndIndex+1) + 1   ;
          var stringValueAposEndIndex = line.indexOf("\"", stringValueAposStartIndex+1) ;

          var title = line.substring(stringTitleAposStartIndex , stringTitleAposEndIndex );
          var value = line.substring(stringValueAposStartIndex , stringValueAposEndIndex);

          // If we already encountered this title we create the initial entry
          if (dictiOS[title] == null ) {
            dictiOS[title] = ["","","","","",""] ;
          }
          var index  = iosFiles.indexOf(element) ;
          dictiOS[title][index] = value ;
      }
    }, '\n', 'ucs-2').then(function () {
        index ++ ;
        //console.log("I'm done!!" + index);
        if (index == iosFiles.length  )  {
          endCallback() ;
        }
      });
     callback() ;
  }, function(err) {
    //endCallback() ;
  });
}

/*
=====================================================
*/

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

function findMissingStrings(dict) {
  Object.keys(dict).forEach(function (prop) {

    for (i= 0 ; i < dict[prop].length ; i++) {
      if (dict[prop][i].isEmpty()){
        dict[prop].push({'isEmpty' :true}) ;
        break;
       }
    }
  });
}

/*
=====================================================
*/


function createExcelFile(response, dictionary, osName){

  var iconv = require('iconv-lite');
  var filename =  osName + 'missing strings report.csv' ;

  var content = "String ID\u0009English\u0009German\u0009Spanish\u0009Italian\u0009French\u0009Japanese\n" ;
  content = content.concat("\u0009");

  Object.keys(dictionary).forEach(function(element) {

    if (dictionary[element][config.locale.length]) {
      content = content.concat(element);
      content = content.concat("\u0009");
      for (i= 0 ; i < dictionary[element].length -1 ; i++) {
        content = content.concat(dictionary[element][i]) ;
        content = content.concat("\u0009");
      }
      content = content.concat("\n");
    }
  });

  content = iconv.encode(content, 'utf16');
  response.setHeader('Pragma', 'public');
  response.setHeader('Expires', '0');
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  response.setHeader('Content-Type', 'text/csv; charset=GBK');
  response.setHeader('Content-Disposition', 'attachment;filename="'+ filename +'"');
  response.setHeader('Content-Length', content.length);
  response.end(content);

}

/*
=====================================================
*/

function getStringsAndroid(returnCallback) {
    var dictAndroid = {};

    var androidFiles = getFileNamesAndroid() ;
    androidFiles.forEach(function (element , index, array) {

      var parseString = require('xml2js').parseString;
      var xml = fs.readFileSync(publicDir + config.androidLocalFilesLocalPath  + element.file, 'utf8');

      parseString(xml, function (err, result) {

        // string
        result.resources.string.forEach(function(stringElement, index, array) {

          var title = stringElement.$.name ;
          var value = stringElement._;

          if (dictAndroid[title] == null ) {
            dictAndroid[title] = ["","","","","",""] ;
          }
          dictAndroid[title][element.localeIndex] = value || ""  ;
        });

        try {

          // plurals
          result.resources.plurals.forEach(function(plurals, index, array) {

              // plurals key
            var title = plurals.$.name ;
            plurals.item.forEach(function(plural, index, array) {
              var quantityTitle = plural.$.quantity ;
              var quantityValue = plural._;
              if (dictAndroid[title + " (" + quantityTitle + ")"] == null ) {
                dictAndroid[title + " (" + quantityTitle + ")"] = ["","","","","",""] ;
              }
              dictAndroid[title + " (" + quantityTitle + ")"][element.localeIndex] = quantityValue || "";
            });
         });}catch (ex) {}

       try {
         result.resources['string-array'].forEach(function(stringArray, index) {
           //string-array key
            var title = stringArray.$.name ;
            if (dictAndroid[title + " (string-array)"] == null ) {
              dictAndroid[title + " (string-array)"] = ["","","","","",""] ;
            }
            stringArray.item.forEach(function(stringArrayItem, index, array) {
              dictAndroid[title + " (string-array)"][element.localeIndex] = stringArrayItem || "" ;
          });
        });}catch (ex) {}
      });
    });

    findMissingStrings(dictAndroid);
    returnCallback(dictAndroid);

}


function getFileNamesAndroid() {
    filesArrayAndroid =[] ;

    //  level 1 - EFIGS
    config.androidFilesPath.commonStringsFilesArray.forEach(function(element, index, array) {
        filesArrayAndroid.push({file: element , localeIndex :  config.localeId.EN} ) ;
        // Only common_strings add FIGS
        if (index == 0)  {
          temp = element.replace("values" , 'values-de') ;
          filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.DE}) ;
          temp = element.replace("values" , 'values-es') ;
          filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.ES}) ;
          temp = element.replace("values" , 'values-it') ;
          filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.IT}) ;
          temp = element.replace("values" , 'values-fr') ;
          filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.FR}) ;
        }
    });

    // level 2 - only En
    config.androidFilesPath.level2StringsFilesArray.forEach(function(element, index, array) {
        //only worldmate and cwttogog,
      temp = element.replace("$target" , config.variants[config.variantsId.WM]) ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.EN}) ;

      temp = element.replace("$target" , config.variants[config.variantsId.CTG]) ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.EN}) ;
    });

    // level 3 - JTB

    // Only EN
    temp = config.androidFilesPath.level3StringsFileEn ;
    filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.EN}) ;

    // Only JA
    config.androidFilesPath.level3StringsFileJTB.forEach(function(element, index, array) {
      temp = element;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.JA}) ;
    });

    // Targets

    //WorldMate
    // WorldMate- Only En
    config.androidFilesPath.TargetsWorldMateStringsFilesArray.forEach(function(element, index, array) {

      temp = element ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.EN}) ;
    });

    // Sato- Only En
    config.androidFilesPath.TargetsSatoStringsFilesArray.forEach(function(element, index, array) {

      temp = element ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.EN}) ;
    });

    // JTB- Only En , JA
    config.androidFilesPath.TargetsJTBStringsFilesArray.forEach(function(element, index, array) {

      temp = element.replace("$target" , config.variants[config.variantsId.JTB_MANAGED]) ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.EN}) ;

      temp = element.replace("$target" , config.variants[config.variantsId.JTB_UNMANAGED]) ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.JA}) ;
    });

    //CTG EN
    config.androidFilesPath.TargetsCTG_ENStringsFilesArray.forEach(function(element, index, array) {

      temp = element ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.EN}) ;
    });

    // CTG FIGS
    config.androidFilesPath.TargetsCTG_SringsFilesArray.forEach(function(element, index, array) {

      temp = element.replace("$localeId" , 'de') ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.DE}) ;
      temp = element.replace("$localeId" , 'es') ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.ES}) ;
      temp = element.replace("$localeId" , 'it') ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.IT}) ;
      temp = element.replace("$localeId" , 'fr') ;
      filesArrayAndroid.push( {file: temp , localeIndex: config.localeId.FR}) ;
    });
   return filesArrayAndroid ;
  }
