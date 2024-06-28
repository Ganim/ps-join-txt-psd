//================================================================
// PS Auto Join Text and PSD
//================================================================
/*
|  Write by: Guilherme Ganim <guilhermeganim@hotmail.com>
|  Find more at my Github: https://github.com/Ganim
|  Version> 1.0.0
|  Last Test: Photoshop 25.4.0
|
|  How it works:
|  - This script will open all PSD files in the chosen directory and the
|    match text file (ex: /example.psd and /example.txt). After that will add 
|    textLayers with each text file line.
|
|  How to install:
|  - Method [1]:
|     + move this file to yout photoshop script folder;
|  - Method [2]:
|     + create an action that open this file as a scrpt;
*/

//================================================================
// Manual Options
//================================================================

// Text Options
var fontName = "CCMeanwhile"; // [default = Arial]
var fontSize = 16 //pts [default = 16]
var fontColor = "000000" //hexadecimal format [default = 000000
var fontJustification = "CENTER"

// Text Box Options
var useTextBox = true //true or false [default = true]= 100 //pixels [default = 100]
var textBoxWidth = 100 //pixels [default = 100]
var textBoxHeight = 100 //pixels [default = 100]
var textBoxOrigin = 50 //pixels [default = 50]
var textBoxOffsetX = 100 //pixels [default = 100]
var textBoxOffsetY = 100 //pixels [default = 100]

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

        var documentRef = activeDocument;
        var pointerRef = null;
        var layerRef = null;
        var textRef = null;

        var textLine = textFile.readln();
        var origin = textBoxOrigin;

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
          textRef.position = new Array(origin + textBoxOffsetX, origin + textBoxOffsetY);
          textRef.contents = textLine;

          // Apply custom style settings
          preferences.rulerUnits = Units.POINTS;
          textRef.size = fontSize;
          textRef.leading = fontSize;
          textRef.useAutoLeading = false;

          textRef.font = fontName;
          textRef.color.rgb.hexValue = fontColor;
          textRef.autoKerning = AutoKernType.METRICS;

          switch(fontJustification) {
            case "CENTER":
              textRef.justification = Justification.CENTER;
              break;
            case "CENTERJUSTIFIED":
              textRef.justification = Justification.CENTERJUSTIFIED;
              break;
            case "FULLYJUSTIFIED":
              textRef.justification = Justification.FULLYJUSTIFIED;
              break;
            case "LEFT":
              textRef.justification = Justification.LEFT;
              break;
            case "LEFTJUSTIFIED":
              textRef.justification = Justification.LEFTJUSTIFIED;
              break;
            case "RIGHT":
              textRef.justification = Justification.RIGHT;
              break;
            case "RIGHTJUSTIFIED":
              textRef.justification = Justification.RIGHTJUSTIFIED;
              break;
            default:
              textRef.justification = Justification.CENTER;
          }

          // End custom style settings

          textLine = textFile.readln();
        }
        

        textFile.close();

        // Apply Save Options
        /* var saveOptions;
         var newFile = new File(newpsdName);
         saveOptions.alphaChannels = true;
         saveOptions.annotations = true;
         saveOptions.embedColorProfile = true;
         saveOptions.layers = true;
         saveOptions.spotColors = true;
         psd.saveAs(newFile, saveOptions);
         */

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

    // Apply Close Options

  }
}

else {
  alert('You must have a document open to run this script.');
};
/*function addText() {
  if (documents.length > 0) {
    var originalDialogMode = app.displayDialogs;
    app.displayDialogs = DialogModes.ERROR;
    var originalRulerUnits = preferences.rulerUnits;
    preferences.rulerUnits = Units.PIXELS;
    try {
      var testFile = new File('~/Desktop').openDlg('Select import file', '*.txt');
      if (testFile != null) {
        testFile.open('r');
        var textLine = testFile.readln();
        var documentRef = activeDocument;
        var layerRef = null;
        var textRef = null;
        var origin = 100;

        var layerGroup = app.activeDocument.layerSets.add();
        layerGroup.name = 'Type'
        setLayerLabelCol("blue");

        while (textLine != '') { //read in text one line at a time
          //layerRef = documentRef.artLayers.add();
          layerRef = layerGroup.artLayers.add();
          layerRef.kind = LayerKind.TEXT;
          textRef = layerRef.textItem;
          textRef.kind = TextType.PARAGRAPHTEXT
          textRef.width = new UnitValue(100, 'px');
          textRef.height = new UnitValue(150, 'px');
          textRef.contents = textLine;
          //optional text styling, can be customized to suit
          origin = origin + 100;
          textRef.position = new Array(pos, pos);
          preferences.rulerUnits = Units.POINTS;
          textRef.size = 16;
          textRef.useAutoLeading = false;
          textRef.leading = 16;

          //textRef.font = 'Calibri-Bold';
          textRef.font = 'CCMeanwhile';
          textRef.color.rgb.hexValue = "000000";
          textRef.justification = Justification.CENTER;
          textRef.autoKerning = AutoKernType.METRICS;


          //end optional text styling
          textLine = testFile.readln();
        }
        testFile.close();
      }
    }
    catch (e) {
      alert(e + e.line);
      preferences.rulerUnits = originalRulerUnits;
      app.displayDialogs = originalDialogMode;
      return;
    }
    preferences.rulerUnits = originalRulerUnits;
    app.displayDialogs = originalDialogMode;
  }
  else {
    alert('You must have a document open to run this script.');
    return;
  }
  return;
} */

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
  reference.putEnumerated(stringToType("layer"), s2t("ordinal"), s2t("targetEnum"));
  descriptorOne.putReference(chatToType("null"), reference);
  descriptorTwo.putEnumerated(s2t("color"), s2t("color"), s2t(colorName));
  descriptorOne.putObject(s2t("to"), s2t("layer"), descriptorTwo);
  executeAction(s2t("set"), descriptorOne, DialogModes.NO);
}



/* 

var font = app.fonts.itemByName(fontName);
if (font.isValid){
 and 

var font = app.fonts.item(fontName);
if (font.isValid){


https://community.adobe.com/t5/photoshop-ecosystem-discussions/dialog-box-with-input-text/m-p/10161326

https://community.adobe.com/t5/photoshop-ecosystem-discussions/list-with-all-files-in-the-folder/m-p/10549286

https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-open-folder-automatically/m-p/4478167
https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-ui-text-field-input/td-p/12899536
https://theiviaxx.github.io/photoshop-docs/ScriptUI/ScriptUI.html
https://extendscript.docsforadobe.dev/user-interface-tools/scriptui-programming-model.html

https://scriptui.joonas.me/
*/


//================================================================
// Interface
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

/*
Code for Import https://scriptui.joonas.me — (Triple click to select): 
{"activeId":37,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":"Dialog","windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Auto Join Text and PSD Script","preferredSize":[400,600],"margins":16,"orientation":"column","spacing":16,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"Group","parentId":12,"style":{"enabled":true,"varName":"textOptionsConfig","preferredSize":[350,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["fill","top"],"alignment":null}},"item-2":{"id":2,"type":"StaticText","parentId":11,"style":{"enabled":true,"varName":"fontNameLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Font Name:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-3":{"id":3,"type":"EditText","parentId":11,"style":{"enabled":true,"varName":"fontNameInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"Arial","justify":"left","preferredSize":[350,30],"alignment":null,"helpTip":null}},"item-4":{"id":4,"type":"Group","parentId":1,"style":{"enabled":true,"varName":"textOptionsSecondRow","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":50,"alignChildren":["left","center"],"alignment":null}},"item-5":{"id":5,"type":"Group","parentId":4,"style":{"enabled":true,"varName":"Size","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-6":{"id":6,"type":"Group","parentId":4,"style":{"enabled":true,"varName":"Color","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-7":{"id":7,"type":"StaticText","parentId":5,"style":{"enabled":true,"varName":"fontSizeLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Font Size (pt):","justify":"left","preferredSize":[150,0],"alignment":null,"helpTip":null}},"item-8":{"id":8,"type":"StaticText","parentId":6,"style":{"enabled":true,"varName":"fontColorLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Font Color (Hex):","justify":"left","preferredSize":[150,0],"alignment":null,"helpTip":null}},"item-9":{"id":9,"type":"EditText","parentId":5,"style":{"enabled":true,"varName":"fontSizeInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"16","justify":"left","preferredSize":[150,30],"alignment":null,"helpTip":"Only Numbers"}},"item-10":{"id":10,"type":"EditText","parentId":6,"style":{"enabled":true,"varName":"fontColorInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"000000","justify":"left","preferredSize":[150,30],"alignment":null,"helpTip":"Hexadecimal Value"}},"item-11":{"id":11,"type":"Group","parentId":1,"style":{"enabled":true,"varName":"textOptionsFirstRow","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-12":{"id":12,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"textOptionsPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Text Options","preferredSize":[0,0],"margins":20,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-13":{"id":13,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"textBoxOptionsPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Text Box Options","preferredSize":[0,0],"margins":20,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-14":{"id":14,"type":"Group","parentId":13,"style":{"enabled":true,"varName":"textBoxOptionsConfig","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-16":{"id":16,"type":"Group","parentId":14,"style":{"enabled":true,"varName":"textBoxOptionsSecondRow","preferredSize":[0,0],"margins":3,"orientation":"row","spacing":22,"alignChildren":["left","center"],"alignment":null}},"item-17":{"id":17,"type":"Group","parentId":14,"style":{"enabled":true,"varName":"textBoxOptionsFirstRow","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":25,"alignChildren":["left","center"],"alignment":null}},"item-18":{"id":18,"type":"Group","parentId":17,"style":{"enabled":true,"varName":"textBoxWidthGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-19":{"id":19,"type":"Group","parentId":17,"style":{"enabled":true,"varName":"textBoxHeightGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-20":{"id":20,"type":"Group","parentId":16,"style":{"enabled":true,"varName":"textBoxOriginGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-21":{"id":21,"type":"Group","parentId":16,"style":{"enabled":true,"varName":"textBoxOffsetXGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-22":{"id":22,"type":"Group","parentId":16,"style":{"enabled":true,"varName":"textBoxOffsetYGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-23":{"id":23,"type":"StaticText","parentId":18,"style":{"enabled":true,"varName":"textBoxWidthLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Width (px):","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-24":{"id":24,"type":"StaticText","parentId":19,"style":{"enabled":true,"varName":"textBoxHeightLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Height  (px):","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-25":{"id":25,"type":"StaticText","parentId":20,"style":{"enabled":true,"varName":"textBoxOriginLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Orgin  (px):","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-26":{"id":26,"type":"StaticText","parentId":21,"style":{"enabled":true,"varName":"textBoxOffsetXInput","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Offset-X (px):","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-27":{"id":27,"type":"StaticText","parentId":22,"style":{"enabled":true,"varName":"textBoxOffsetYLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Offset-Y (px):","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-28":{"id":28,"type":"EditText","parentId":18,"style":{"enabled":false,"varName":"textBoxWidthInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"100","justify":"left","preferredSize":[100,30],"alignment":null,"helpTip":null}},"item-29":{"id":29,"type":"EditText","parentId":19,"style":{"enabled":false,"varName":"textBoxHeightInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"100","justify":"left","preferredSize":[100,30],"alignment":null,"helpTip":null}},"item-30":{"id":30,"type":"EditText","parentId":20,"style":{"enabled":false,"varName":"textBoxOriginInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"50","justify":"left","preferredSize":[100,30],"alignment":null,"helpTip":null}},"item-31":{"id":31,"type":"EditText","parentId":21,"style":{"enabled":false,"varName":"textBoxOffsetXInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"100","justify":"left","preferredSize":[100,30],"alignment":null,"helpTip":null}},"item-32":{"id":32,"type":"EditText","parentId":22,"style":{"enabled":false,"varName":"textBoxOffsetYInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"100","justify":"left","preferredSize":[100,30],"alignment":null,"helpTip":null}},"item-33":{"id":33,"type":"Group","parentId":17,"style":{"enabled":true,"varName":"useTextBoxGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["center","center"],"alignment":null}},"item-34":{"id":34,"type":"StaticText","parentId":33,"style":{"enabled":true,"varName":"useTextBoxLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Text Box:","justify":"left","preferredSize":[100,30],"alignment":"center","helpTip":null}},"item-35":{"id":35,"type":"Checkbox","parentId":33,"style":{"enabled":true,"varName":"useTextBoxCheck","text":"Use Text Box","preferredSize":[0,30],"alignment":"left","helpTip":null,"checked":false}},"item-36":{"id":36,"type":"Button","parentId":0,"style":{"enabled":true,"varName":"needHelpButton","text":"Need Help? Visit the GitHub Project","justify":"center","preferredSize":[0,30],"alignment":"center","helpTip":null}},"item-37":{"id":37,"type":"Button","parentId":0,"style":{"enabled":true,"varName":"processDataButton","text":"Confirm and Execute","justify":"center","preferredSize":[0,30],"alignment":null,"helpTip":null}},"item-38":{"id":38,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"layerGroupPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Layer Group Options","preferredSize":[0,0],"margins":20,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-40":{"id":40,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"fileOptionsPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Files Path","preferredSize":[0,0],"margins":20,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-41":{"id":41,"type":"Button","parentId":52,"style":{"enabled":true,"varName":"selectFolderButton","text":"Search Folder","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-42":{"id":42,"type":"EditText","parentId":52,"style":{"enabled":true,"varName":"selectFolderLabel","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"Folder Path....","justify":"left","preferredSize":[230,30],"alignment":null,"helpTip":null}},"item-43":{"id":43,"type":"Group","parentId":51,"style":{"enabled":true,"varName":"fileOptionsFirstRow","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-44":{"id":44,"type":"Group","parentId":38,"style":{"enabled":true,"varName":"layerGroupOptionsConfig","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-45":{"id":45,"type":"Group","parentId":51,"style":{"enabled":true,"varName":"fileOptionsSecondRow","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":25,"alignChildren":["left","center"],"alignment":null}},"item-48":{"id":48,"type":"Group","parentId":45,"style":{"enabled":true,"varName":"folderOutputGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-49":{"id":49,"type":"Group","parentId":45,"style":{"enabled":true,"varName":"newFileSufixGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-50":{"id":50,"type":"Group","parentId":45,"style":{"enabled":true,"varName":"autoSaveGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-51":{"id":51,"type":"Group","parentId":40,"style":{"enabled":true,"varName":"fileOptionsConfig","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["fill","center"],"alignment":null}},"item-52":{"id":52,"type":"Group","parentId":43,"style":{"enabled":true,"varName":"filePathGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-53":{"id":53,"type":"Group","parentId":44,"style":{"enabled":true,"varName":"layerGroupOptionsFirstRow","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":25,"alignChildren":["left","center"],"alignment":null}},"item-54":{"id":54,"type":"StaticText","parentId":50,"style":{"enabled":true,"varName":"autoSaveLavel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Auto Save:","justify":"left","preferredSize":[100,0],"alignment":null,"helpTip":null}},"item-55":{"id":55,"type":"StaticText","parentId":48,"style":{"enabled":true,"varName":"folderOutputLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Folder Output:","justify":"left","preferredSize":[100,0],"alignment":null,"helpTip":null}},"item-56":{"id":56,"type":"StaticText","parentId":49,"style":{"enabled":true,"varName":"newFileSuffixLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"New File Suffix:","justify":"left","preferredSize":[100,0],"alignment":null,"helpTip":null}},"item-57":{"id":57,"type":"EditText","parentId":48,"style":{"enabled":false,"varName":"folderOutputInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"/","justify":"left","preferredSize":[100,30],"alignment":null,"helpTip":null}},"item-59":{"id":59,"type":"Checkbox","parentId":50,"style":{"enabled":true,"varName":"saveCurrentFileCheck","text":"Current File","preferredSize":[0,0],"alignment":"left","helpTip":null,"checked":true}},"item-60":{"id":60,"type":"Checkbox","parentId":50,"style":{"enabled":true,"varName":"saveAsNewFileCheck","text":"As New File","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":false}},"item-61":{"id":61,"type":"EditText","parentId":49,"style":{"enabled":false,"varName":"newFileSuffixInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"_edit","justify":"left","preferredSize":[100,30],"alignment":null,"helpTip":null}},"item-62":{"id":62,"type":"Group","parentId":53,"style":{"enabled":true,"varName":"layerGroupNameGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-63":{"id":63,"type":"Group","parentId":53,"style":{"enabled":true,"varName":"uselayerGroupGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-64":{"id":64,"type":"Group","parentId":53,"style":{"enabled":true,"varName":"layerGroupColorGroup","preferredSize":[0,0],"margins":0,"orientation":"column","spacing":0,"alignChildren":["left","center"],"alignment":null}},"item-65":{"id":65,"type":"StaticText","parentId":63,"style":{"enabled":true,"varName":"uselayerGroupLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":" Layer Group:","justify":"left","preferredSize":[0,30],"alignment":null,"helpTip":null}},"item-66":{"id":66,"type":"Checkbox","parentId":63,"style":{"enabled":true,"varName":"uselayerGroupCheck","text":" Use  Layer G.","preferredSize":[100,30],"alignment":"left","helpTip":null}},"item-67":{"id":67,"type":"StaticText","parentId":62,"style":{"enabled":true,"varName":"layerGroupNameLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Group Name:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-68":{"id":68,"type":"EditText","parentId":62,"style":{"enabled":true,"varName":"layerGroupNameInput","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"Texts","justify":"left","preferredSize":[100,30],"alignment":null,"helpTip":null}},"item-69":{"id":69,"type":"StaticText","parentId":64,"style":{"enabled":true,"varName":"layerGroupColorLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Color:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-70":{"id":70,"type":"DropDownList","parentId":64,"style":{"enabled":true,"varName":"layerGroupColorDrop","text":"DropDownList","listItems":"None, Red, Orange, YellowColor, Grain, Blue, Violet, Gray, Magenta*, SeaFoam*, Indigo*, Fuchsia*","preferredSize":[100,30],"alignment":null,"selection":0,"helpTip":"* - Only at 2024 version"}}},"order":[0,36,40,51,43,52,42,41,45,50,54,59,60,48,55,57,49,56,61,12,1,11,2,3,4,5,7,9,6,8,10,13,14,17,33,34,35,18,23,28,19,24,29,16,20,25,30,21,26,31,22,27,32,38,44,53,63,65,66,62,67,68,64,69,70,37],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"none"}}
*/

// DIALOG
// ======
var Dialog = new Window("dialog");
Dialog.text = "Auto Join Text and PSD Script";
Dialog.preferredSize.width = 400;
Dialog.preferredSize.height = 600;
Dialog.orientation = "column";
Dialog.alignChildren = ["center", "top"];
Dialog.spacing = 16;
Dialog.margins = 16;

var needHelpButton = Dialog.add("button", undefined, undefined, { name: "needHelpButton" });
needHelpButton.text = "Need Help? Visit the GitHub Project";
needHelpButton.preferredSize.height = 30;
needHelpButton.alignment = ["center", "top"];

// FILEOPTIONSPANEL
// ================
var fileOptionsPanel = Dialog.add("panel", undefined, undefined, { name: "fileOptionsPanel" });
fileOptionsPanel.text = "Files Path";
fileOptionsPanel.orientation = "column";
fileOptionsPanel.alignChildren = ["left", "top"];
fileOptionsPanel.spacing = 10;
fileOptionsPanel.margins = 20;

// FILEOPTIONSCONFIG
// =================
var fileOptionsConfig = fileOptionsPanel.add("group", undefined, { name: "fileOptionsConfig" });
fileOptionsConfig.orientation = "column";
fileOptionsConfig.alignChildren = ["fill", "center"];
fileOptionsConfig.spacing = 10;
fileOptionsConfig.margins = 0;

// FILEOPTIONSFIRSTROW
// ===================
var fileOptionsFirstRow = fileOptionsConfig.add("group", undefined, { name: "fileOptionsFirstRow" });
fileOptionsFirstRow.orientation = "row";
fileOptionsFirstRow.alignChildren = ["left", "center"];
fileOptionsFirstRow.spacing = 10;
fileOptionsFirstRow.margins = 0;

// FILEPATHGROUP
// =============
var filePathGroup = fileOptionsFirstRow.add("group", undefined, { name: "filePathGroup" });
filePathGroup.orientation = "row";
filePathGroup.alignChildren = ["left", "center"];
filePathGroup.spacing = 10;
filePathGroup.margins = 0;

var selectFolderLabel = filePathGroup.add('edittext {properties: {name: "selectFolderLabel"}}');
selectFolderLabel.text = "Folder Path....";
selectFolderLabel.preferredSize.width = 230;
selectFolderLabel.preferredSize.height = 30;

var selectFolderButton = filePathGroup.add("button", undefined, undefined, { name: "selectFolderButton" });
selectFolderButton.text = "Search Folder";

// FILEOPTIONSSECONDROW
// ====================
var fileOptionsSecondRow = fileOptionsConfig.add("group", undefined, { name: "fileOptionsSecondRow" });
fileOptionsSecondRow.orientation = "row";
fileOptionsSecondRow.alignChildren = ["left", "center"];
fileOptionsSecondRow.spacing = 25;
fileOptionsSecondRow.margins = 0;

// AUTOSAVEGROUP
// =============
var autoSaveGroup = fileOptionsSecondRow.add("group", undefined, { name: "autoSaveGroup" });
autoSaveGroup.orientation = "column";
autoSaveGroup.alignChildren = ["left", "center"];
autoSaveGroup.spacing = 0;
autoSaveGroup.margins = 0;

var autoSaveLavel = autoSaveGroup.add("statictext", undefined, undefined, { name: "autoSaveLavel" });
autoSaveLavel.text = "Auto Save:";
autoSaveLavel.preferredSize.width = 100;

var saveCurrentFileCheck = autoSaveGroup.add("checkbox", undefined, undefined, { name: "saveCurrentFileCheck" });
saveCurrentFileCheck.text = "Current File";
saveCurrentFileCheck.value = true;
saveCurrentFileCheck.alignment = ["left", "center"];

var saveAsNewFileCheck = autoSaveGroup.add("checkbox", undefined, undefined, { name: "saveAsNewFileCheck" });
saveAsNewFileCheck.text = "As New File";

// FOLDEROUTPUTGROUP
// =================
var folderOutputGroup = fileOptionsSecondRow.add("group", undefined, { name: "folderOutputGroup" });
folderOutputGroup.orientation = "column";
folderOutputGroup.alignChildren = ["left", "center"];
folderOutputGroup.spacing = 0;
folderOutputGroup.margins = 0;

var folderOutputLabel = folderOutputGroup.add("statictext", undefined, undefined, { name: "folderOutputLabel" });
folderOutputLabel.text = "Folder Output:";
folderOutputLabel.preferredSize.width = 100;

var folderOutputInput = folderOutputGroup.add('edittext {properties: {name: "folderOutputInput"}}');
folderOutputInput.enabled = false;
folderOutputInput.text = "/";
folderOutputInput.preferredSize.width = 100;
folderOutputInput.preferredSize.height = 30;

// NEWFILESUFIXGROUP
// =================
var newFileSufixGroup = fileOptionsSecondRow.add("group", undefined, { name: "newFileSufixGroup" });
newFileSufixGroup.orientation = "column";
newFileSufixGroup.alignChildren = ["left", "center"];
newFileSufixGroup.spacing = 0;
newFileSufixGroup.margins = 0;

var newFileSuffixLabel = newFileSufixGroup.add("statictext", undefined, undefined, { name: "newFileSuffixLabel" });
newFileSuffixLabel.text = "New File Suffix:";
newFileSuffixLabel.preferredSize.width = 100;

var newFileSuffixInput = newFileSufixGroup.add('edittext {properties: {name: "newFileSuffixInput"}}');
newFileSuffixInput.enabled = false;
newFileSuffixInput.text = "_edit";
newFileSuffixInput.preferredSize.width = 100;
newFileSuffixInput.preferredSize.height = 30;

// TEXTOPTIONSPANEL
// ================
var textOptionsPanel = Dialog.add("panel", undefined, undefined, { name: "textOptionsPanel" });
textOptionsPanel.text = "Text Options";
textOptionsPanel.orientation = "column";
textOptionsPanel.alignChildren = ["left", "top"];
textOptionsPanel.spacing = 10;
textOptionsPanel.margins = 20;

// TEXTOPTIONSCONFIG
// =================
var textOptionsConfig = textOptionsPanel.add("group", undefined, { name: "textOptionsConfig" });
textOptionsConfig.preferredSize.width = 350;
textOptionsConfig.orientation = "column";
textOptionsConfig.alignChildren = ["fill", "top"];
textOptionsConfig.spacing = 10;
textOptionsConfig.margins = 0;

// TEXTOPTIONSFIRSTROW
// ===================
var textOptionsFirstRow = textOptionsConfig.add("group", undefined, { name: "textOptionsFirstRow" });
textOptionsFirstRow.orientation = "column";
textOptionsFirstRow.alignChildren = ["left", "center"];
textOptionsFirstRow.spacing = 0;
textOptionsFirstRow.margins = 0;

var fontNameLabel = textOptionsFirstRow.add("statictext", undefined, undefined, { name: "fontNameLabel" });
fontNameLabel.text = "Font Name:";

var fontNameInput = textOptionsFirstRow.add('edittext {properties: {name: "fontNameInput"}}');
fontNameInput.text = "Arial";
fontNameInput.preferredSize.width = 350;
fontNameInput.preferredSize.height = 30;

// TEXTOPTIONSSECONDROW
// ====================
var textOptionsSecondRow = textOptionsConfig.add("group", undefined, { name: "textOptionsSecondRow" });
textOptionsSecondRow.orientation = "row";
textOptionsSecondRow.alignChildren = ["left", "center"];
textOptionsSecondRow.spacing = 50;
textOptionsSecondRow.margins = 0;

// SIZE
// ====
var Size = textOptionsSecondRow.add("group", undefined, { name: "Size" });
Size.orientation = "column";
Size.alignChildren = ["left", "center"];
Size.spacing = 0;
Size.margins = 0;

var fontSizeLabel = Size.add("statictext", undefined, undefined, { name: "fontSizeLabel" });
fontSizeLabel.text = "Font Size (pt):";
fontSizeLabel.preferredSize.width = 150;

var fontSizeInput = Size.add('edittext {properties: {name: "fontSizeInput"}}');
fontSizeInput.helpTip = "Only Numbers";
fontSizeInput.text = "16";
fontSizeInput.preferredSize.width = 150;
fontSizeInput.preferredSize.height = 30;

// COLOR
// =====
var Color = textOptionsSecondRow.add("group", undefined, { name: "Color" });
Color.orientation = "column";
Color.alignChildren = ["left", "center"];
Color.spacing = 0;
Color.margins = 0;

var fontColorLabel = Color.add("statictext", undefined, undefined, { name: "fontColorLabel" });
fontColorLabel.text = "Font Color (Hex):";
fontColorLabel.preferredSize.width = 150;

var fontColorInput = Color.add('edittext {properties: {name: "fontColorInput"}}');
fontColorInput.helpTip = "Hexadecimal Value";
fontColorInput.text = "000000";
fontColorInput.preferredSize.width = 150;
fontColorInput.preferredSize.height = 30;

// TEXTBOXOPTIONSPANEL
// ===================
var textBoxOptionsPanel = Dialog.add("panel", undefined, undefined, { name: "textBoxOptionsPanel" });
textBoxOptionsPanel.text = "Text Box Options";
textBoxOptionsPanel.orientation = "column";
textBoxOptionsPanel.alignChildren = ["left", "top"];
textBoxOptionsPanel.spacing = 10;
textBoxOptionsPanel.margins = 20;

// TEXTBOXOPTIONSCONFIG
// ====================
var textBoxOptionsConfig = textBoxOptionsPanel.add("group", undefined, { name: "textBoxOptionsConfig" });
textBoxOptionsConfig.orientation = "column";
textBoxOptionsConfig.alignChildren = ["left", "center"];
textBoxOptionsConfig.spacing = 10;
textBoxOptionsConfig.margins = 0;

// TEXTBOXOPTIONSFIRSTROW
// ======================
var textBoxOptionsFirstRow = textBoxOptionsConfig.add("group", undefined, { name: "textBoxOptionsFirstRow" });
textBoxOptionsFirstRow.orientation = "row";
textBoxOptionsFirstRow.alignChildren = ["left", "center"];
textBoxOptionsFirstRow.spacing = 25;
textBoxOptionsFirstRow.margins = 0;

// USETEXTBOXGROUP
// ===============
var useTextBoxGroup = textBoxOptionsFirstRow.add("group", undefined, { name: "useTextBoxGroup" });
useTextBoxGroup.orientation = "column";
useTextBoxGroup.alignChildren = ["center", "center"];
useTextBoxGroup.spacing = 0;
useTextBoxGroup.margins = 0;

var useTextBoxLabel = useTextBoxGroup.add("statictext", undefined, undefined, { name: "useTextBoxLabel" });
useTextBoxLabel.text = "Text Box:";
useTextBoxLabel.preferredSize.width = 100;
useTextBoxLabel.preferredSize.height = 30;
useTextBoxLabel.alignment = ["center", "center"];

var useTextBoxCheck = useTextBoxGroup.add("checkbox", undefined, undefined, { name: "useTextBoxCheck" });
useTextBoxCheck.text = "Use Text Box";
useTextBoxCheck.preferredSize.height = 30;
useTextBoxCheck.alignment = ["left", "center"];

// TEXTBOXWIDTHGROUP
// =================
var textBoxWidthGroup = textBoxOptionsFirstRow.add("group", undefined, { name: "textBoxWidthGroup" });
textBoxWidthGroup.orientation = "column";
textBoxWidthGroup.alignChildren = ["left", "center"];
textBoxWidthGroup.spacing = 0;
textBoxWidthGroup.margins = 0;

var textBoxWidthLabel = textBoxWidthGroup.add("statictext", undefined, undefined, { name: "textBoxWidthLabel" });
textBoxWidthLabel.text = "Width (px):";

var textBoxWidthInput = textBoxWidthGroup.add('edittext {properties: {name: "textBoxWidthInput"}}');
textBoxWidthInput.enabled = false;
textBoxWidthInput.text = "100";
textBoxWidthInput.preferredSize.width = 100;
textBoxWidthInput.preferredSize.height = 30;

// TEXTBOXHEIGHTGROUP
// ==================
var textBoxHeightGroup = textBoxOptionsFirstRow.add("group", undefined, { name: "textBoxHeightGroup" });
textBoxHeightGroup.orientation = "column";
textBoxHeightGroup.alignChildren = ["left", "center"];
textBoxHeightGroup.spacing = 0;
textBoxHeightGroup.margins = 0;

var textBoxHeightLabel = textBoxHeightGroup.add("statictext", undefined, undefined, { name: "textBoxHeightLabel" });
textBoxHeightLabel.text = "Height  (px):";

var textBoxHeightInput = textBoxHeightGroup.add('edittext {properties: {name: "textBoxHeightInput"}}');
textBoxHeightInput.enabled = false;
textBoxHeightInput.text = "100";
textBoxHeightInput.preferredSize.width = 100;
textBoxHeightInput.preferredSize.height = 30;

// TEXTBOXOPTIONSSECONDROW
// =======================
var textBoxOptionsSecondRow = textBoxOptionsConfig.add("group", undefined, { name: "textBoxOptionsSecondRow" });
textBoxOptionsSecondRow.orientation = "row";
textBoxOptionsSecondRow.alignChildren = ["left", "center"];
textBoxOptionsSecondRow.spacing = 22;
textBoxOptionsSecondRow.margins = 3;

// TEXTBOXORIGINGROUP
// ==================
var textBoxOriginGroup = textBoxOptionsSecondRow.add("group", undefined, { name: "textBoxOriginGroup" });
textBoxOriginGroup.orientation = "column";
textBoxOriginGroup.alignChildren = ["left", "center"];
textBoxOriginGroup.spacing = 0;
textBoxOriginGroup.margins = 0;

var textBoxOriginLabel = textBoxOriginGroup.add("statictext", undefined, undefined, { name: "textBoxOriginLabel" });
textBoxOriginLabel.text = "Orgin  (px):";

var textBoxOriginInput = textBoxOriginGroup.add('edittext {properties: {name: "textBoxOriginInput"}}');
textBoxOriginInput.enabled = false;
textBoxOriginInput.text = "50";
textBoxOriginInput.preferredSize.width = 100;
textBoxOriginInput.preferredSize.height = 30;

// TEXTBOXOFFSETXGROUP
// ===================
var textBoxOffsetXGroup = textBoxOptionsSecondRow.add("group", undefined, { name: "textBoxOffsetXGroup" });
textBoxOffsetXGroup.orientation = "column";
textBoxOffsetXGroup.alignChildren = ["left", "center"];
textBoxOffsetXGroup.spacing = 0;
textBoxOffsetXGroup.margins = 0;

var textBoxOffsetXInput = textBoxOffsetXGroup.add("statictext", undefined, undefined, { name: "textBoxOffsetXInput" });
textBoxOffsetXInput.text = "Offset-X (px):";

var textBoxOffsetXInput1 = textBoxOffsetXGroup.add('edittext {properties: {name: "textBoxOffsetXInput1"}}');
textBoxOffsetXInput1.enabled = false;
textBoxOffsetXInput1.text = "100";
textBoxOffsetXInput1.preferredSize.width = 100;
textBoxOffsetXInput1.preferredSize.height = 30;

// TEXTBOXOFFSETYGROUP
// ===================
var textBoxOffsetYGroup = textBoxOptionsSecondRow.add("group", undefined, { name: "textBoxOffsetYGroup" });
textBoxOffsetYGroup.orientation = "column";
textBoxOffsetYGroup.alignChildren = ["left", "center"];
textBoxOffsetYGroup.spacing = 0;
textBoxOffsetYGroup.margins = 0;

var textBoxOffsetYLabel = textBoxOffsetYGroup.add("statictext", undefined, undefined, { name: "textBoxOffsetYLabel" });
textBoxOffsetYLabel.text = "Offset-Y (px):";

var textBoxOffsetYInput = textBoxOffsetYGroup.add('edittext {properties: {name: "textBoxOffsetYInput"}}');
textBoxOffsetYInput.enabled = false;
textBoxOffsetYInput.text = "100";
textBoxOffsetYInput.preferredSize.width = 100;
textBoxOffsetYInput.preferredSize.height = 30;

// LAYERGROUPPANEL
// ===============
var layerGroupPanel = Dialog.add("panel", undefined, undefined, { name: "layerGroupPanel" });
layerGroupPanel.text = "Layer Group Options";
layerGroupPanel.orientation = "column";
layerGroupPanel.alignChildren = ["left", "top"];
layerGroupPanel.spacing = 10;
layerGroupPanel.margins = 20;

// LAYERGROUPOPTIONSCONFIG
// =======================
var layerGroupOptionsConfig = layerGroupPanel.add("group", undefined, { name: "layerGroupOptionsConfig" });
layerGroupOptionsConfig.orientation = "column";
layerGroupOptionsConfig.alignChildren = ["left", "center"];
layerGroupOptionsConfig.spacing = 10;
layerGroupOptionsConfig.margins = 0;

// LAYERGROUPOPTIONSFIRSTROW
// =========================
var layerGroupOptionsFirstRow = layerGroupOptionsConfig.add("group", undefined, { name: "layerGroupOptionsFirstRow" });
layerGroupOptionsFirstRow.orientation = "row";
layerGroupOptionsFirstRow.alignChildren = ["left", "center"];
layerGroupOptionsFirstRow.spacing = 25;
layerGroupOptionsFirstRow.margins = 0;

// USELAYERGROUPGROUP
// ==================
var uselayerGroupGroup = layerGroupOptionsFirstRow.add("group", undefined, { name: "uselayerGroupGroup" });
uselayerGroupGroup.orientation = "column";
uselayerGroupGroup.alignChildren = ["left", "center"];
uselayerGroupGroup.spacing = 0;
uselayerGroupGroup.margins = 0;

var uselayerGroupLabel = uselayerGroupGroup.add("statictext", undefined, undefined, { name: "uselayerGroupLabel" });
uselayerGroupLabel.text = " Layer Group:";
uselayerGroupLabel.preferredSize.height = 30;

var uselayerGroupCheck = uselayerGroupGroup.add("checkbox", undefined, undefined, { name: "uselayerGroupCheck" });
uselayerGroupCheck.text = " Use  Layer G.";
uselayerGroupCheck.preferredSize.width = 100;
uselayerGroupCheck.preferredSize.height = 30;
uselayerGroupCheck.alignment = ["left", "center"];

// LAYERGROUPNAMEGROUP
// ===================
var layerGroupNameGroup = layerGroupOptionsFirstRow.add("group", undefined, { name: "layerGroupNameGroup" });
layerGroupNameGroup.orientation = "column";
layerGroupNameGroup.alignChildren = ["left", "center"];
layerGroupNameGroup.spacing = 0;
layerGroupNameGroup.margins = 0;

var layerGroupNameLabel = layerGroupNameGroup.add("statictext", undefined, undefined, { name: "layerGroupNameLabel" });
layerGroupNameLabel.text = "Group Name:";

var layerGroupNameInput = layerGroupNameGroup.add('edittext {properties: {name: "layerGroupNameInput"}}');
layerGroupNameInput.text = "Texts";
layerGroupNameInput.preferredSize.width = 100;
layerGroupNameInput.preferredSize.height = 30;

// LAYERGROUPCOLORGROUP
// ====================
var layerGroupColorGroup = layerGroupOptionsFirstRow.add("group", undefined, { name: "layerGroupColorGroup" });
layerGroupColorGroup.orientation = "column";
layerGroupColorGroup.alignChildren = ["left", "center"];
layerGroupColorGroup.spacing = 0;
layerGroupColorGroup.margins = 0;

var layerGroupColorLabel = layerGroupColorGroup.add("statictext", undefined, undefined, { name: "layerGroupColorLabel" });
layerGroupColorLabel.text = "Color:";

var layerGroupColorDrop_array = ["None", "Red", "Orange", "YellowColor", "Grain", "Blue", "Violet", "Gray", "Magenta*", "SeaFoam*", "Indigo*", "Fuchsia*"];
var layerGroupColorDrop = layerGroupColorGroup.add("dropdownlist", undefined, undefined, { name: "layerGroupColorDrop", items: layerGroupColorDrop_array });
layerGroupColorDrop.helpTip = "* - Only at 2024 version";
layerGroupColorDrop.selection = 0;
layerGroupColorDrop.preferredSize.width = 100;
layerGroupColorDrop.preferredSize.height = 30;

// DIALOG
// ======
var processDataButton = Dialog.add("button", undefined, undefined, { name: "processDataButton" });
processDataButton.text = "Confirm and Execute";
processDataButton.preferredSize.height = 30;

Dialog.show();

