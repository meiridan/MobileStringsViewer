var config = {2};

config.locale =  ["en", "de", "es", "it", "fr", "ja"];
config.localeId ={EN : 0, DE : 1, ES: 2, IT :3, FR :4, JA: 5}; // miko

config.variants = ["cwttogo","worldmate","jtb_managed", "jtb_unmanaged", "sato"] ;
config.variantsId = {CTG : 0 , WM: 1, JTB_MANAGED: 2 ,  JTB_UNMANAGED:3 , SATO: 4} ;

config.iOSFilesPath = {};
config.androidFilesPath = {};


config.SVNUser = 'idan.meir'
config.SVNPassword = 'K7V!fc9b'

// ios
config.iOSSVNRepoBaseUrl = "http://svn.mobimate.local/repo/projects/WorldMateLive/iOS/trunk" ;
config.iOSLocalFilesPathPrefix = "/WorldMate Live/resources/";
config.iOSLocalFilesPathSuffix = ".lproj/Localizable.strings";
config.iOSLocalFilesLocalPath = "iosSVN" ;


// Android
config.androidSVNRepoBaseUrl = "http://svn.mobimate.local/repo/projects/WorldMateLive/Android/worldmate_unified/trunk"
config.androidLocalFilesLocalPath = "androidSvn" ;

config.androidFilesPath.commonStringsFilesArray =
  [ "/level_1/all_common/res/values/common_strings.xml" ,
    "/level_1/all_common/res/values/main_strings.xml"] ;

config.androidFilesPath.level2StringsFilesArray =
  [ "/level_2/$target_common/res/values/strings.xml" , //worldmate. cwttogo , no locales
    "/level_2/$target_common/res/values/target_strings.xml" ] ; //worldmate. cwttogo, no locales

config.androidFilesPath.level3StringsFileEn = "/level_3/jtb_common/res/values/strings.xml"  ; //jtb, only ja and en

config.androidFilesPath.level3StringsFileJTB =
  [ "/level_3/jtb_common/res/values-ja/common_strings.xml" , // JTB
    "/level_3/jtb_common/res/values-ja/target_strings.xml" ,// JTB
    "/level_3/jtb_common/res/values-ja/main_strings.xml" ,// JTB
    "/level_3/jtb_common/res/values-ja/strings.xml" , // JTB
    "/level_3/jtb_common/res/values-ja/worldmate_common_strings.xml" ] ; //JTB

config.androidFilesPath.TargetsWorldMateStringsFilesArray =
      [ "/targets/worldmate/res/values/common_strings.xml" , // WorldMate, only EN
        "/targets/worldmate/res/values/strings.xml" ] // WorldMate, only EN

config.androidFilesPath.TargetsSatoStringsFilesArray =
      [ "/targets/sato/res/values/target_strings.xml" , // WorldMate & CTG, only EN
        "/targets/sato/res/values/strings.xml" ] // WorldMate & CTG, only EN

config.androidFilesPath.TargetsJTBStringsFilesArray =
    [ "/targets/$target/res/values/strings.xml" , // BOTH JTB targets, only EN, JA
      "/targets/$target/res/values-ja/strings.xml" ] // BOTH JTB targets, only EN, JA

config.androidFilesPath.TargetsStringsFilesArray =
  [ "/targets/$target/res/values-/common_strings.xml" , // all targets, all locales per variant
    "/targets/$target/res/values-$localeId/target_strings.xml" ,// all targets, all locales per variant
    "/targets/$target/res/values-$localeId/strings.xml" ] ;// all targets, all locales per variant

config.androidFilesPath.TargetsCTG_ENStringsFilesArray =
  [ "/targets/cwttogo/res/values/target_strings.xml" , //  CTG, only EN
    "/targets/cwttogo/res/values/strings.xml" ] //  CTG, only EN

config.androidFilesPath.TargetsCTG_SringsFilesArray =
  [ "/targets/cwttogo/res/values-$localeId/target_strings.xml" , //  CTG, FIGS
    "/targets/cwttogo/res/values-$localeId/common_strings.xml"  , //  CTG, FIGS
    "/targets/cwttogo/res/values-$localeId/main_strings.xml" , //  CTG, FIGS
    "/targets/cwttogo/res/values-$localeId/strings.xml"] ;  //  CTG, FIGS

module.exports = config;
