//================================================================
// PS Auto Join Text and PSD
//================================================================
/*
|  Write by: Guilherme Ganim <guilhermeganim@hotmail.com>
|  Find more at my Github: https://github.com/Ganim
|  Version: 1.1.0
|  Last Test: Photoshop 25.4.0
|
|  How it works:
|  - This script will open all PSD files in the chosen directory and the
|    match text file (ex: /example.psd and /example.txt). After that will add 
|    textLayers with each text file line.
|
|  How to install:
|  - Method [1]:
|     + Save this file in your photoshop script folder;
      + [example] C:\Program Files\Adobe\Adobe Photoshop 2024\Presets\Scripts
      + Go to File > Scripts at Ribbon Menu and run this script
|  - Method [2]:
|     + Create an action that open this file as a script;
*/

//================================================================
// Manual Options
//================================================================

// Text Options
var primaryFontName = "CCWildWordsInt-Roman"; // [default = CCkWiIdWordsInt-Roman]
var primaryFontSize = 16 //pts [default = 16]
var primaryFontLeading = 18 //pts [default = 18]
var primaryFontColor = "000000" //hexadecimal format [default = 000000
var primaryFontJustification = "CENTER"

var secondaryFontIdentifier = "*"; // [default = *]
var secondaryFontName = "CCZoinks-Regular"; // [default = CCZoinks-Regular]
var secondaryFontSize = 24 //pts [default = 16]
var secondaryFontLeading = 24 //pts [default = 16]
var secondaryFontColor = "000000" //hexadecimal format [default = 000000
var secondaryFontJustification = "CENTER"

// Text Box Options
var useTextBox = true //true or false [default = true]= 100 //pixels [default = 100]
var textBoxWidth = 120 //pixels [default = 100]
var textBoxHeight = 150 //pixels [default = 100]
var textBoxOriginX = 0 //pixels [default = 50]
var textBoxOriginY = 0 //pixels [default = 50]
var textBoxOffsetX = 50 //pixels [default = 100]
var textBoxOffsetY = 50 //pixels [default = 100]

// Layer Group Options
var uselayerGroup = true //true or false [default = true]
var layerGroupName = 'Type'
var layerGroupColor = "blue"
/*
|  Color name options:
|  - until PS.23:
|     + "none", "red", "orange", "yellowColor", "grain", "blue", "violet", "gray"
|  - PS.24+ (PS.23 + new colors):
|     + "magenta", "seafoam", "indigo", "fuchsia"
*/

// File Options
var saveCurrentFile = false //true or false [default = true]
var saveAsNewFile = false //true or false [default = true]
var folderOutput = '/' // don't leave blank [default = '/output/']
var newFileSuffix = ""; // keep blank to use same name [default = '_edit']

//================================================================
// Don't change the code below
//================================================================

// Validations
if(folderOutput.length === 0){
  folderOutput = "/"
}

// Code
// #target photoshop

if (app.documents.length > 0) {

  for (var i = 0; i < app.documents.length; i++) {
    var psd = app.documents[i];

    app.activeDocument = psd;

    // Actual file info
    var psdPath = psd.path + "/";
    var psdName = psd.name.match(/([^\.]+)/)[1];

    // Txt file info
    var txtPath = psdPath + psdName + ".txt"

    // New file info (Optional)
    var newPsdPath = psd.path + folderOutput;
    var newPsdName = newPsdPath + psdName + newFileSuffix + ".psd";

    // Set new Dialog settings
    var originalDialogMode = app.displayDialogs;
    app.displayDialogs = DialogModes.ERROR;

    // Set new Units settings
    var originalRulerUnits = preferences.rulerUnits;
    preferences.rulerUnits = Units.PIXELS;

    try {
      // Open Txt File and process the content
      var textFile = new File(txtPath);

      if (textFile != null) {
        textFile.open('r');
        var textLine = textFile.readln();

        var documentRef = activeDocument;
        var pointerRef = null;
        var layerRef = null;
        var textRef = null;

        // Set Position
        var positionX = textBoxOriginX
        var positionY = textBoxOriginY

        // Apply Layer Group Settings
        if(uselayerGroup === true){
          var layerGroup = app.activeDocument.layerSets.add();
          layerGroup.name = layerGroupName
          setLayerLabelCol(layerGroupColor);
          
          pointerRef = layerGroup
        } 
        else {
          pointerRef = documentRef
        }

        //read in text one line at a time
        while (textLine != '') { 
          layerRef = pointerRef.artLayers.add();
          layerRef.kind = LayerKind.TEXT;
          textRef = layerRef.textItem;

        // Apply Text Box Settings
          if(useTextBox === true ){
            textRef.kind = TextType.PARAGRAPHTEXT
            textRef.width = new UnitValue(textBoxWidth, 'px');
            textRef.height = new UnitValue(textBoxHeight, 'px');
          }
          textRef.position = new Array(positionX, positionY);

          positionX = positionX + textBoxOffsetX
          positionY = positionY + textBoxOffsetY

          textRef.contents = textLine;

          // Apply custom style settings
          preferences.rulerUnits = Units.POINTS;
          textRef.useAutoLeading = true;
          textRef.autoKerning = AutoKernType.METRICS;

          var fontSize = primaryFontSize;
          var fontLeading = primaryFontLeading;
          var fontName = primaryFontName;
          var fontColor = primaryFontColor;
          var fontJustification = primaryFontJustification;

          if(isSecondaryText(textLine, secondaryFontIdentifier)){
            var fontSize = secondaryFontSize;
            var fontLeading = secondaryFontLeading;
            var fontName = secondaryFontName;
            var fontColor = secondaryFontColor;
            var fontJustification = secondaryFontJustification;
            applyLayerStyleOne()

          }
          
          textRef.size = fontSize;
          textRef.leading = fontLeading;
          textRef.font = fontName;
          textRef.color.rgb.hexValue = fontColor;
          textRef.justification = applyFontJustification(fontJustification);

          // End custom style settings

          textLine = textFile.readln();
        }
        

        textFile.close();

        // Future updates: Save Options Here

      }
      else {
        alert(docPath.toString().match(/([^\.]+)/)[1] + documentRef.name.match(/([^\.]+)/)[1] + ".txt not found.");
      }
    }
    catch (e) {
      alert(e + e.line);
      // Restore default Dialog settings
      app.displayDialogs = originalDialogMode;
      // Restore default Units settings
      preferences.rulerUnits = originalRulerUnits;
    }

    // Restore default Dialog settings
    app.displayDialogs = originalDialogMode;

    // Restore default Units settings
    preferences.rulerUnits = originalRulerUnits;

    // Future updates: Close Options Here

  }
}

else {
  alert('You must have at least one document open to run this script.');
};

//================================================================
// Helper functions
//================================================================

/*
|  Function setLayerLabelCol(colorName)
|  - Sets the layer label color
|  - Color name options:
|  - until PS.23:
|     + "none","red","orange","yellowColor","grain","blue","violet","gray"
|  - PS.24+ (PS.23 + new colors):
|     + "magenta", "seafoam", "indigo", "fuchsia"
*/

function setLayerLabelCol(colorName) {
  var chatToTypeID = function (s) {
    return app.charIDToTypeID(s);
  };
  var stringToTypeID = function (s) {
    return app.stringIDToTypeID(s);
  };
  var descriptorOne = new ActionDescriptor();
  var descriptorTwo = new ActionDescriptor();
  var reference = new ActionReference();
  reference.putEnumerated(stringToTypeID("layer"), stringToTypeID("ordinal"), stringToTypeID("targetEnum"));
  descriptorOne.putReference(chatToTypeID("null"), reference);
  descriptorTwo.putEnumerated(stringToTypeID("color"), stringToTypeID("color"), stringToTypeID(colorName));
  descriptorOne.putObject(stringToTypeID("to"), stringToTypeID("layer"), descriptorTwo);
  executeAction(stringToTypeID("set"), descriptorOne, DialogModes.NO);
}

/*
|  Function isSecondaryText(text, identifier)
|  - Verify if the text is a secondary text to apply the specified style
*/

function isSecondaryText(text, identifier) {
  return text.charAt(0) === identifier;
}

/*
|  applyFontJustification(settings)
|  - Use the settings to apply the specified justification style
|  - Its usefull when we have more than one font style
*/

function applyFontJustification(settings) {
  switch(settings) {
    case "CENTER":
      return Justification.CENTER;
      
    case "CENTERJUSTIFIED":
      return Justification.CENTERJUSTIFIED;
      
    case "FULLYJUSTIFIED":
      return Justification.FULLYJUSTIFIED;
      
    case "LEFT":
      return Justification.LEFT;
      
    case "LEFTJUSTIFIED":
      return Justification.LEFTJUSTIFIED;
      
    case "RIGHT":
      return Justification.RIGHT;
      
    case "RIGHTJUSTIFIED":
      return Justification.RIGHTJUSTIFIED;
      
    default:
      return Justification.CENTER;
  }
}

//================================================================
// Text effects
//================================================================

/*
|  Function applyLayerStyleOne(enabled, withDialog)
|  - Sets the layer label color
|  - Color name options:
|  - until PS.23:
|     + "none","red","orange","yellowColor","grain","blue","violet","gray"
|  - PS.24+ (PS.23 + new colors):
|     + "magenta", "seafoam", "indigo", "fuchsia"
*/

function applyLayerStyleOne(enabled, withDialog) {
  var chatToTypeID = function (s) {
    return app.charIDToTypeID(s);
  };
  var stringToTypeID = function (s) {
    return app.stringIDToTypeID(s);
  };
  if (enabled != undefined && !enabled)
    return;
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc1 = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putProperty(chatToTypeID('Prpr'), chatToTypeID('Lefx'));
  ref1.putEnumerated(chatToTypeID('Lyr '), chatToTypeID('Ordn'), chatToTypeID('Trgt'));
  desc1.putReference(chatToTypeID('null'), ref1);
  var desc2 = new ActionDescriptor();
  desc2.putUnitDouble(chatToTypeID('Scl '), chatToTypeID('#Prc'), 100);
  var desc3 = new ActionDescriptor();
  desc3.putBoolean(chatToTypeID('enab'), true);
  desc3.putBoolean(stringToTypeID("present"), true);
  desc3.putBoolean(stringToTypeID("showInDialog"), true);
  desc3.putEnumerated(chatToTypeID('Styl'), chatToTypeID('FStl'), chatToTypeID('OutF'));
  desc3.putEnumerated(chatToTypeID('PntT'), chatToTypeID('FrFl'), chatToTypeID('SClr'));
  desc3.putEnumerated(chatToTypeID('Md  '), chatToTypeID('BlnM'), chatToTypeID('Nrml'));
  desc3.putUnitDouble(chatToTypeID('Opct'), chatToTypeID('#Prc'), 100);
  desc3.putUnitDouble(chatToTypeID('Sz  '), chatToTypeID('#Pxl'), 4);
  var desc4 = new ActionDescriptor();
  desc4.putDouble(chatToTypeID('Rd  '), 255);
  desc4.putDouble(chatToTypeID('Grn '), 255);
  desc4.putDouble(chatToTypeID('Bl  '), 255);
  desc3.putObject(chatToTypeID('Clr '), stringToTypeID("RGBColor"), desc4);
  desc3.putBoolean(stringToTypeID("overprint"), false);
  desc2.putObject(chatToTypeID('FrFX'), chatToTypeID('FrFX'), desc3);
  desc1.putObject(chatToTypeID('T   '), chatToTypeID('Lefx'), desc2);
  executeAction(stringToTypeID('set'), desc1, dialogMode);
}