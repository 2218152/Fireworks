INFO = { version:'1.0', type:'panel' };


(function() {

	//================================================================ 初始化设定
	var i=0;
	
	var ratios = {};
	ratios.pixel = 1;
	ratios.ldpi = 1.333;
	ratios.mdpi = 1;
	ratios.hdpi = 0.667;
	ratios.xhdpi = 0.5;
	ratios.xxhdpi = 0.333;
	ratios.tvdpi = 0.751;
	ratios.cm = 0.026;
	ratios.mm = 0.265;
	ratios.inch = 0.01;
	ratios.point = 0.75;
	ratios.pica = 0.063;
	
	
	//================================================================== 功能函数
	
	function UpdateValue(inEvent){
		var val = inEvent.currentValues.oriNum;
		
		inEvent.result.push(["PIXEL", "text", FormatValue(val*ratios.pixel)],
							["LDPI", "text", FormatValue(val*ratios.ldpi)],
							["MDPI", "text", FormatValue(val*ratios.mdpi)],
							["HDPI", "text", FormatValue(val*ratios.hdpi)],
							["XHDPI", "text", FormatValue(val*ratios.xhdpi)],
							["XXHDPI", "text", FormatValue(val*ratios.xxhdpi)],
							["TVDPI", "text", FormatValue(val*ratios.tvdpi)],
							["CM", "text", FormatValue(val*ratios.cm)],
							["MM", "text", FormatValue(val*ratios.mm)],
							["INCH", "text", FormatValue(val*ratios.inch)],
							["POINT", "text", FormatValue(val*ratios.point)],
							["PICA", "text", FormatValue(val*ratios.pica)]);
	}
	
	function FormatValue(v){
		var cal = v.toFixed(3);
		cal = Math.abs(cal);
		
		return cal;
	}
	
	//================================================================== 界面函数
	
	
	
	function CreateHeader(inLabel, bgColor){
		if(bgColor==0xFFFFFF){ bgColor=0xCCCCCC }
		return { HBox: {
			percentWidth: 100,
			height: 30,
			style: {
				paddingLeft: 4,
				backgroundAlpha: 1,
				backgroundColor: String(bgColor),
			},
			children: [
				{ Label: {
					percentWidth: 100,
					text: inLabel,
					style: {
						paddingLeft: 4,
						paddingTop: 6,
						fontWeight: "bold",
						color: 0xFFFFFF,
						fontSize: 12,
					},
				} },
				{ Image: {
					width: 30,
					height: 30,
					buttonMode: true,
					source: fw.currentScriptDir + "/images/back.png",
					events:{
						click: function(event){
							fw.launchApp(fw.appDir+((fw.platform=="win")?"/Fireworks.exe":"/Adobe Fireworks CS6.app"), [fw.currentScriptDir+"/core/restore.jsf"]);
						}
					}
				} }
			],
		} };
	}

	function CreateCaption(inLabel){
		return { HBox: {
			percentWidth: 100,
			height: 22,
			style: {
				paddingLeft: 4,
				backgroundAlpha: .2,
				backgroundColor: "0xA4A4A4",
			},
			children: [
				{ Label: {
					percentWidth: 100,
					text: inLabel,
					style: {
						paddingLeft: 4,
						paddingTop: 2,
						fontWeight: "bold",
						color: 0x555555,
						fontSize: 11,
					},
				} }
			],
		} };
	}

	function RowSpace(){
		return { Spacer: { height:2 } };
	}

	function Col(inChildren,pw){
		if(!pw){ pw=100 };
		return { VBox: {
			percentWidth: pw,
			styleName: "Col",
			children: inChildren
		} };
	}

	function Row(inChildren,pw){
		if(!pw){ pw=100 };
		return { HBox: {
			percentWidth: pw,
			styleName: "Row",
			children: inChildren
		} };
	}
	
	//========================================================================== 用户界面
	
	fwlib.panel.register({
		css: {
			".Col": { paddingLeft:0 },
			".Row": { paddingLeft:4, paddingButtom:0 },
			".btnNormal": { color:0x666666, fontWeight: "normal" },
			".btnActive": { color:0x0085D5, fontWeight: "normal" },
			
			".infoTitle": { color:0x636363, paddingTop:8 },
			".infoValue": { color:0x0085D5, paddingTop:8, fontWeight:"bold", fontSize:11 },
			
			".resultLabel": { color:0x636363, fontWeight: "normal", paddingTop:3, paddingLeft:0 }
		},
		children:[
			
			CreateHeader("Unit Converter", 0xEFB64B),
			
			Col([
				//--------------------------------------------------------- 缩放
				//CreateCaption("操作"),
				RowSpace(),
				
				Row([
					{ NumericStepper: {
						name: "oriNum",
						percentWidth: 60,
						height: 26,
						value: 0,
						stepSize: 1,
						maximum: 999999,
						minimum: 0,
						events: {
							change: function(event){ UpdateValue(event) },
							keyUp: function(event){ UpdateValue(event) }
						},
						style: { fontSize:12 }
					} },
					
					{ ComboBox: {
						name: "oriUnit",
						enabled: false,
						percentWidth: 40,
						height:26,
						selectedIndex: 0,
						dataProvider: ["pixel"],
					} },
					
				]),
				RowSpace(),
				
				
				
				//------------------------------------------------------------- 操作
				CreateCaption("Result"),
				
				Row([
					//------------------------------------------------------------- 左侧
					Col([
					
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "Pixel:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "PIXEL",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
					
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "LDPI:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "LDPI",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "MDPI:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "MDPI",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "HDPI:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "HDPI",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "XHDPI:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "XHDPI",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "XXHDPI:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "XXHDPI",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
					], 50),
					
					//------------------------------------------------------------- 右侧
					Col([
					
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "TVDPI:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "TVDPI",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "cm:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "CM",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "mm:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "MM",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "Inch:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "INCH",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "Point:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "POINT",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
						Row([
							{ Label: {
								width: 50,
								height: 26,
								text: "Pica:",
								styleName: "resultLabel"
							} },
							{ TextInput: {
								name: "PICA",
								percentWidth: 100,
								height: 26,
								editable: false,
								text: "0"
							} },
						]),
						
					], 50),
				
				]),
			]),
		]
	});

})();