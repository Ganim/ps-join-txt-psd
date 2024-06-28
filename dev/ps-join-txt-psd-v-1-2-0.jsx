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

// 1.1 - Add Secondary Font Style || ADD ROADMAP
// 1.2 - Add save and close files config || ADD README WHY USE THIS
// 1.3 - Add Infinity font style support // Substitute variables settings for an object and make more functions to apply them || ADD README HOW TO USE AND HOW TO INSTALL
// 1.4 - Add dialog with processbar information
// 1.5 - Add search folder dialog to process files without open 
// 2.0 - Add Interface
// https://github.com/frontendbeast/list-fonts
// https://ps-scripts.sourceforge.net/xtools.html
//================================================================
// Manual Options
//================================================================

// Text Options
var primaryFontName = "Arial Regular"; // [default = Arial]
var primaryFontSize = 16 //pts [default = 16]
var primaryFontColor = "000000" //hexadecimal format [default = 000000
var primaryFontJustification = "LEFT"

var secondaryFontIdentifier = "*"; // [default = Arial]
var secondaryFontName = "CCZoinks-Regular"; // [default = Arial]
var secondaryFontSize = 12 //pts [default = 16]
var secondaryFontColor = "000000" //hexadecimal format [default = 000000
var secondaryFontJustification = "CENTER"

// Text Box Options
var useTextBox = true //true or false [default = true]= 100 //pixels [default = 100]
var textBoxWidth = 100 //pixels [default = 100]
var textBoxHeight = 100 //pixels [default = 100]
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
          textRef.useAutoLeading = false;
          textRef.autoKerning = AutoKernType.METRICS;

          var fontSize = primaryFontSize;
          var fontName = primaryFontName;
          var fontColor = primaryFontColor;
          var fontJustification = primaryFontJustification;

          if(isSecondaryText(textLine, secondaryFontIdentifier)){
            var fontSize = secondaryFontSize;
            var fontName = secondaryFontName;
            var fontColor = secondaryFontColor;
            var fontJustification = secondaryFontJustification;
          }
          
          textRef.size = fontSize;
          textRef.leading = fontSize;
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
  var chatToType = function (s) {
    return app.charIDToTypeID(s);
  };
  var stringToType = function (s) {
    return app.stringIDToTypeID(s);
  };
  var descriptorOne = new ActionDescriptor();
  var descriptorTwo = new ActionDescriptor();
  var reference = new ActionReference();
  reference.putEnumerated(stringToType("layer"), stringToType("ordinal"), stringToType("targetEnum"));
  descriptorOne.putReference(chatToType("null"), reference);
  descriptorTwo.putEnumerated(stringToType("color"), stringToType("color"), stringToType(colorName));
  descriptorOne.putObject(stringToType("to"), stringToType("layer"), descriptorTwo);
  executeAction(stringToType("set"), descriptorOne, DialogModes.NO);
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