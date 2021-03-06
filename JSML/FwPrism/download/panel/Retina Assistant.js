INFO = { version:'1.0', type:'panel' };

fwlib.panel.register({
	css: {
		".btnNormal": { fontWeight: "normal" },
		".Col": { paddingLeft:0 },
		".Row": { paddingLeft:4, paddingButtom:0 },
	},
	children:[
		CreateHeader("Retina Assistant", 0x0090EA),
		Col([
			//------------------------------------------------------------- 缩放
			CreateCaption("缩放"),
			Row([
				{ Button: {
					label: "原始",
					percentWidth: 15,
					height: 30,
					styleName: "btnNormal",
				} },
				{ Button: {
					label: "1.5倍",
					percentWidth: 15,
					height: 30,
					styleName: "btnNormal",
				} },
				{ Button: {
					label: "2倍",
					percentWidth: 15,
					height: 30,
					styleName: "btnNormal",
				} },
				{ Button: {
					label: "3倍",
					percentWidth: 15,
					height: 30,
					styleName: "btnNormal",
				} },
				
				{ VRule: { width:10, height:30 } },
				
				{ Button: {
					label: "自定义倍数",
					percentWidth: 15,
					height: 30,
					styleName: "btnNormal",
				} },
				{ NumericStepper: {
					percentWidth: 25,
					height: 26,
					value: 2.5,
					stepSize: .1,
					maximum: 10,
					minimum: .1,
				} },
			]),
			RowSpace(),
			
			//------------------------------------------------------------- 信息
			CreateCaption("信息"),
			Row([
				
			]),
		]),
		
		//{ Button: {
		//	label: "Button",
		//	percentWidth: 40,
		//	height: 38,
		//	emphasized: true,
		//	events:{
		//		click: function(event){
		//			alert("you click me!");
		//		}
		//	}
		//} },
	]
});

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
	return { Spacer: { height:1 } };
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