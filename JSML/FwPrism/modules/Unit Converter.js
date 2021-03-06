INFO = { name:'Unit Converter', version:'1.1', type:'panel' };


(function() {

	//================================================================ 初始化设定
	var i = 0;
	var offset = 0;
	
	var ratios = {};
	var calc = {};
	
	var units = [	["pixel", 1],
					["cm", 0.026],
					["mm", 0.265],
					["inch", 0.01],
					["point", 0.75],
					["pica", 0.063],
					["ldpi", 1.333],
					["mdpi", 1],
					["hdpi", 0.667],
					["xhdpi", 0.5],
					["xxhdpi", 0.333],
					["tvdpi", 0.751]	];
	
	
	for (var i in units) {
		if(typeof units[i][0]=="string"){
			ratios[units[i][0]] = 1/units[i][1];
			calc[units[i][0]] = 0;
		}
	}
	
	//================================================================== 功能函数
	
	function UpdateValue(inEvent, _val, _name){
		Calculate(_val, _name, ratios);
		
		for (var i in units) {
			if(typeof units[i][0]=="string"){
				inEvent.result.push([ units[i][0].toUpperCase(), "value", calc[ units[i][0] ] ]);
			}
		}
	}
	
	function Calculate(num, unit, rate){
		var value = num * rate[unit];
		for (var i in calc) {
			calc[i] = FormatValue(value/rate[i]);
		}
	}
	
	function FormatValue(v){
		var cal = v.toFixed(3);
		cal = Math.abs(cal);
		
		return cal;
	}
	
	//================================================================== 界面函数
	
	
	function CreateCounter(inLabel, inName, inTips){
		return Row([
			{ Label: {
				width: 46,
				height: 26,
				text: inLabel + ":",
				styleName: "resultLabel"
			} },
			{ NumericStepper: {
				name: inName,
				percentWidth: 100,
				height: 26,
				value: 0,
				stepSize: .001,
				maximum: 999999,
				minimum: 0,
				events: {
					change: function(event){
						//if(event.currentValues[inName]>calc[inName]){ offset = 1-.001 }
						//if(event.currentValues[inName]<calc[inName]){ offset = 1+.001 }
						
						UpdateValue(event, event.currentValues[inName], inLabel);
					},
					keyUp: function(event){
						UpdateValue(event, event.currentValues[inName], inLabel);
					},
				}
			} },
		]);
	}
	
	
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
			
			CreateHeader(INFO.name, 0xEFB64B),
			
			Col([
				
				CreateCaption("Calculation"),
				//RowSpace(),
				Row([
					//------------------------------------------------------------- 左侧
					Col([
						CreateCounter(units[0][0], units[0][0].toUpperCase(), "notips"),
						CreateCounter(units[1][0], units[1][0].toUpperCase(), "notips"),
						CreateCounter(units[2][0], units[2][0].toUpperCase(), "notips"),
						CreateCounter(units[3][0], units[3][0].toUpperCase(), "notips"),
						CreateCounter(units[4][0], units[4][0].toUpperCase(), "notips"),
						CreateCounter(units[5][0], units[5][0].toUpperCase(), "notips"),
					], 50),
					
					//------------------------------------------------------------- 右侧
						
					Col([
						CreateCounter(units[6][0], units[6][0].toUpperCase(), "notips"),
						CreateCounter(units[7][0], units[7][0].toUpperCase(), "notips"),
						CreateCounter(units[8][0], units[8][0].toUpperCase(), "notips"),
						CreateCounter(units[9][0], units[9][0].toUpperCase(), "notips"),
						CreateCounter(units[10][0], units[10][0].toUpperCase(), "notips"),
						CreateCounter(units[11][0], units[11][0].toUpperCase(), "notips"),
					], 50),
				
				]),
			]),
		]
	});

})();