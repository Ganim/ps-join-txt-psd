# Photoshop auto join TXT and PSD files

This is an Photoshop script that automates the process of joining text files (.txt) with Photoshop files (.psd) in a batch manner. Each TXT line will generate an Text Box in Photoshop file with same name.

## Installation and Usage

You can install this script following this steps:

#### Method-1:
- Step 1: 
   Save the script file in your photoshop script folder.
   [Example] C:\Program Files\Adobe\Adobe Photoshop 2024\Presets\Scripts

- Step 2:
   Go to File > Scripts at Ribbon Menu and run this script


#### Method-2:

- Step 1: 
   Create an action that run the script by File > Scripts > Browse...;


To usage this script you need to have at least one PSD file openned in Photoshop and a TXT file with same name in the same PSD folder. 

## Important Notes

This script works opening a ".txt" file with same name and folder that your PSD file.

To run this script you need to have at least one PSD file opened in Photoshop. 

You can open and process more than one file at same time. It only depends about your hardware power.

## Custom Settings
You can open the ps-join-txt-psd-v-X-X-X.jsx file and edit some settings. Here are the list with what you can change:
```javascript	
// Text Options
var fontName = "Arial"; // [default = Arial]
var fontSize = 16 //pts [default = 16]
var fontColor = "000000" //hexadecimal format [default = 000000
var fontJustification = "CENTER"

// Text Box Options
var useTextBox = true //true or false [default = true]= 100 //pixels [default = 100]
var textBoxWidth = 100 //pixels [default = 100]
var textBoxHeight = 100 //pixels [default = 100]
var textBoxOriginX = 0 //pixels [default = 0]
var textBoxOriginY = 0 //pixels [default = 0]
var textBoxOffsetX = 50 //pixels [default = 50]
var textBoxOffsetY = 50 //pixels [default = 50]

// Layer Group Options
var uselayerGroup = true //true or false [default = true]
var layerGroupName = 'Text'
var layerGroupColor = "blue"
```


## Changelog

> 1.0.1 **[Current]**
````
Add: 
- Now Origin setting is avaliable in X and Y axis;

Fix:
- setLayerLabelCol() variables is now with correct names;
- Text Box Offset don't double jump the second element anymore;
````

> 1.0.0
````
Add: 
- File Control;
- Font settings;
- Text Box settings;
- Layer Group setting;
- Layer Group color;
````

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.