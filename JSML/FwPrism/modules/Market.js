INFO = { name:'Market', version:'1.0.3', type:'panel' };

try {

	(function() {
		
		var WebResult, SelectedId, astExist;
		var SortBy = "time";
		var SearchResult = ['No result'];
		var SearchResultDetail = ['No result'];
		var FwCurrentScriptDir = fw.currentScriptDir;
		var DownloadFolder = FwCurrentScriptDir + "/download";
		var PrismSetting = new Object();
		var PrismSettingFilePath = FwCurrentScriptDir + "/core/prism.json";
		
		var CatalogList = ["All",
							"Panel",
							"Command",
							"Icon",
							"UIKit",
							"Texture",
							"Pattern",
							"Template",
							"Style",
							"Swatch",
							"AutoShape",
							"RichSymbol",
							"Others"];

		sp = "\n";

		/* FWHXR 联网模组 */
		try { dojo.require.call; } catch (exception)
			{ fw.runScript(FwCurrentScriptDir + "/lib/lib.js"); }
			dojo.require("fwlib.io");
		
		
		/* FwLib 增强模组 */
		if (typeof require != "function" || !require.version) {
			fw.runScript(FwCurrentScriptDir + "/lib/fwrequire.js");
		}
		
		require(["fwlib/layers",
			 "fwlib/prefs",
			 "fwlib/DomStorage",
			 "fwlib/files",
			 "fwlib/underscore"], function(
			 layers,
			 prefs,
			 DomStorage,
			 files,
			 _) {


	//------------------------------------------------------------------------------ 函数.start

			function init(inEvent){
				//inEvent.result.push(["ResultList", "dataProvider", CatalogList]);
			}
			
			/* 下载资源 */
			function Download(){
				var TargetPath, TargetFolder, DestinationPath, DestinationFolder;
				var NewFileName = "";
				var ResFileType = WebResult[SelectedId].catalog;
				var ResFileURL = WebResult[SelectedId].url;
				var ResFileName = ResFileURL.split('/');
					ResFileName = ResFileName[ResFileName.length-1];
				var ResFileExt = ResFileName.split('.')[0];
					ResFileExt = ResFileName.replace(ResFileExt,'');
				var AssetsFolder = FwCurrentScriptDir + '/assets';
					
				if(fw.platform == "win"){
					
					/* 下载命令脚本路径 */
					if(ResFileType=="command" || ResFileType=="texture" || ResFileType=="pattern" || ResFileType=="template" || ResFileType=="style" || ResFileType=="autoshape" || ResFileType=="richsymbol"){
					
						if(!Files.exists(DownloadFolder +"/"+ ResFileType)){ Files.createDirectory(DownloadFolder +"/"+ ResFileType) }
						TargetPath = DownloadFolder +"/"+ ResFileType +"/"+ ResFileName;
						
						switch(ResFileType){
							case "command":
								DestinationPath = files.path(fw.userJsCommandsDir, ResFileName);
								break;
							
							case "texture":
								DestinationPath = files.path(fw.appTexturesDir, ResFileName);
								break;
								
							case "pattern":
								DestinationPath = files.path(fw.appPatternsDir, ResFileName);
								break;
								
							case "template":
								DestinationPath = files.path(fw.appTemplatesDir, ResFileName);
								break;
								
							case "style":
								DestinationPath = files.path(fw.appStylesDir, ResFileName);
								break;
								
							case "autoshape":
								DestinationPath = files.path(fw.appSmartShapesDir, ResFileName);
								break;
								
							case "richsymbol":
								DestinationPath = files.path((fw.userSymbolLibrariesDir).replace("Libraries","Common Library/Custom Symbols"), ResFileName);
								break;
								
							default:
								break;
						}
						
					}
					
					
					/* 下载图标路径 */
					if(ResFileType=="icon" || ResFileType=="uikit" || ResFileType=="swatch" || ResFileType=="others"){
						TargetPath = fw.browseForFileURL("save","Save resource as...");
						if(!TargetPath){ return }
						
						var customExt = Files.getExtension(TargetPath);
						if(customExt != ResFileExt){
							if(customExt!=''){
								TargetPath = TargetPath.replace(customExt, '');
							}
							TargetPath += ResFileExt;
						}
						
						ResFileName = Files.getFilename(TargetPath);
					}
					
					
					/* 下载面板脚本路径 */
					if(ResFileType=="panel"){
						var PrismSetting = files.readJSON(PrismSettingFilePath);
						
						//TargetPath = files.path(FwCurrentScriptDir+"/modules/", ResFileName);
						TargetPath = files.path(DownloadFolder+"/panel", ResFileName);
						DestinationPath = files.path(FwCurrentScriptDir+"/modules", ResFileName);
						if(Files.exists(DestinationPath)){
							var overwrite = fw.yesNoDialog("Found same module file, overwrite?");
							if(!overwrite){ return }
						}
						
						if(!SearchList(ResFileName.replace(/.js/gi,""), PrismSetting)){
							PrismSetting.modList.push(ResFileName.replace(/.js/gi,""));
							files.writeJSON(PrismSettingFilePath, PrismSetting);
						}
					}
					
				//------------------------------------------------------------------------------------------------------------------
					
					if(ResFileName.indexOf(".")!=-1){
						/* 创建文件下载列表 */
						var listFilePath = FwCurrentScriptDir + "/filelist.txt";
						var listFileText = ResFileURL +sp;
						
						/* 额外下载的文件 */
						var AssetsFilesList, AssetsFilesNameList;
							AssetsFilesList = WebResult[SelectedId].assets.split(',');
							AssetsFilesNameList = [];
							for(i=0; i<AssetsFilesList.length; i++){
								AssetsFilesNameList.push(AssetsFilesList[i].split('/')[AssetsFilesList[i].split('/').length-1]);
							}
						
						/* 需要下载的所有文件 */
						var DownloadFilesList, DownloadFilesNameList;
							DownloadFilesList = listFileText.split('\n');
							DownloadFilesNameList = [];
							for(i=0; i<DownloadFilesList.length; i++){
								temp = DownloadFilesList[i].split('/');
								DownloadFilesNameList.push(temp[temp.length-1]);
							}
						
						listFileText += AssetsFilesList.join('\n');
						files.write(listFilePath, listFileText);
						
						
						
						/* 创建 UAC.JSF 与 BAT批处理 脚本 */
						var jsfFilePath = FwCurrentScriptDir + "/uac.jsf";
						var jsfFileText = '/*FwPrism_MoveCommandFileToDestination*/' +sp;
						
						var batFilePath = FwCurrentScriptDir + "/download.bat";
						
						var batFileText = "";
							batFileText += '@ECHO OFF&MODE CON COLS=20 LINES=2' +sp;
							batFileText += 'TITLE FwPrism' +sp;
							batFileText += 'ECHO Downloading...' +sp;
							batFileText += 'cd /d %~dp0' +sp;
							//batFileText += 'START/MIN/WAIT "" wget.exe  --no-check-certificate -i filelist.txt -O '+ files.convertURLToOSPath(TargetPath, false) +' -o wget.log' +sp;
							
							if(WebResult[SelectedId].assets==""){
								batFileText += 'START/MIN/WAIT "" wget.exe  --no-check-certificate -i filelist.txt -O '+ files.convertURLToOSPath(TargetPath, false) +sp;
							}else{
								for(i=0; i<DownloadFilesNameList.length; i++){
									/* 由于是指定目录的下载，无法覆盖文件，所以要先删除已存在的文件 */
									Files.deleteFileIfExisting(files.path(Files.getDirectory(TargetPath), DownloadFilesNameList[i]));
								}
								batFileText += 'START/MIN/WAIT "" wget.exe  --no-check-certificate -i filelist.txt -P '+ files.convertURLToOSPath(Files.getDirectory(TargetPath), false) +sp;
							}
							
							
							if(ResFileType == "panel"){
								/* 创建UAC.JSF脚本，复制下载好的文件到指定目录 */
								Files.deleteFileIfExisting(DestinationPath);
								jsfFileText += 'var install=Files.copy("'+ TargetPath +'","'+ DestinationPath +'");' +sp;
								
								
								/* 也下载附加文件 */
								if(WebResult[SelectedId].assets!=""){
									for(i=0; i<AssetsFilesList.length; i++){
										Files.deleteFileIfExisting(files.path(AssetsFolder, AssetsFilesNameList[i]));
										
										jsfFileText += 'Files.copy("'+ files.path(DownloadFolder+'/panel',AssetsFilesNameList[i]) +'","'+ files.path(AssetsFolder,AssetsFilesNameList[i]) +'");' +sp;
									}
								}
								
								
								/* 检测面板安装是否成功 */
								jsfFileText += 'var install=Files.exists("'+ TargetPath +'");' +sp;
								jsfFileText += 'if(install){alert("[ '+ ResFileName +' ]\\n\\nInstallation is completed.")}else{alert("[ '+ ResFileName +' ]\\n\\nInstallation is failed.")}' +sp;
								
							}
							
							
							if(ResFileType == "command" || ResFileType == "texture" || ResFileType == "pattern" || ResFileType == "template" || ResFileType == "style" || ResFileType == "autoshape" || ResFileType == "richsymbol"){
								
								DestinationFolder = Files.getDirectory(DestinationPath);
								TargetFolder = Files.getDirectory(TargetPath);
								
								if(WebResult[SelectedId].assets!=""){
									for(i=0; i<AssetsFilesList.length; i++){
										Files.deleteFileIfExisting(files.path(DestinationFolder, AssetsFilesNameList[i]));
										
										jsfFileText += 'Files.copy("'+ files.path(TargetFolder,AssetsFilesNameList[i]) +'","'+ files.path(DestinationFolder,AssetsFilesNameList[i]) +'");' +sp;
									}
								}
								
								/* 创建UAC.JSF脚本，并最终回调Fireworks.exe来转移文件，否则会有权限问题 */
								//jsfFileText += 'Files.deleteFileIfExisting("'+ DestinationPath +'");' +sp;
								Files.deleteFileIfExisting(DestinationPath);
								jsfFileText += 'var install=Files.copy("'+ TargetPath +'","'+ DestinationPath +'");' +sp;
								jsfFileText += 'if(install){alert("[ '+ ResFileName +' ]\\n\\nInstallation is completed.")}else{alert("[ '+ ResFileName +' ]\\n\\nInstallation is failed.")}' +sp;
								
								if(ResFileType == "texture" || ResFileType == "pattern" || ResFileType == "style"){
									jsfFileText += 'alert("You must restart Fireworks to take effect.");' +sp;
								}
								if(ResFileType == "richsymbol"){
									jsfFileText += 'fw.reloadCommonLibrary();' +sp;
								}
							}
							
							
							if(ResFileType=="icon" || ResFileType=="uikit"){
								/* 下载并打开文件 */
								jsfFileText += 'var install=Files.exists("'+ TargetPath +'");' +sp;
								jsfFileText += 'if(install){alert("[ '+ ResFileName +' ]\\n\\nDownload is completed,\\nnow the file will be opened.");fw.openDocument("'+ TargetPath +'",false);}else{alert("[ '+ ResFileName +' ]\\n\\nDownload is failed.")}' +sp;
							}
							
							
							if(ResFileType=="swatch" || ResFileType=="others"){
								/* 仅下载文件 */
								jsfFileText += 'var install=Files.exists("'+ TargetPath +'");' +sp;
								jsfFileText += 'if(install){alert("[ '+ ResFileName +' ]\\n\\nDownload is completed.")}else{alert("[ '+ ResFileName +' ]\\n\\nDownload is failed.")}' +sp;
							}
							
							
							files.write(jsfFilePath, jsfFileText);
							
							batFileText += files.convertURLToOSPath(fw.appDir+'/Fireworks.exe', false)+' '+files.convertURLToOSPath(FwCurrentScriptDir+'/uac.jsf',false) +sp;
							//batFileText += sp+ 'DEL /f /q %0>NUL' +sp;
							files.write(batFilePath, batFileText);

						fw.launchApp(batFilePath, []);
					}else{
						alert("Invalid resource!\n\nPlease contact me to solve the problem,\nmailto: wavef@minicg.com");
					}
					
				}else{ /*code for MacOSX here*/ }
			}
			
			/* 格式化查询信息 */
			function FormatInfo(inEvent){
				var idx;
				SearchResult = [];
				SearchResultDetail = [];
				
				for(var i=0; i<WebResult.length; i++){
					idx = "00" + (i+1);
					if(i>=9){ idx = "0" + (i+1) }
					if(i>=99){ idx = i+1 }
					SearchResult.push( '['+idx+']    ' + WebResult[i].title + ' (v' + WebResult[i].ver + ', by ' + WebResult[i].author + ')' + sp + ' ');
					SearchResultDetail.push( WebResult[i].title +'  v ' + WebResult[i].ver +sp+sp+ 'by ' + WebResult[i].author +sp+sp+ WebResult[i].descript );
				}
				
				if(WebResult==""){
					SearchResult = ['No result'];
					SearchResultDetail = ['No result'];
				}
			}
			
			function strToJson(str){ 
				var json = (new Function("return " + str))(); 
				return json; 
			} 
			
			/* 面板名称检索 */
			function SearchList(name, setting){
				var match = false;
				
				for(var i=0; i<setting.modList.length;i++){
					if(setting.modList[i]==name){ match = true; break }
				}
				return match;
			}
			
			/* 联网查询 */
			function Query(inEvent){
				var webURL = "http://minicg.com/fwprism";
				var response = fwlib.io.request(
					webURL,
					{
						data: {
							seed: Math.floor(new Date().getTime()*Math.random()),
							catalog: CatalogList[inEvent.currentValues.CatalogBox.selectedIndex].toLowerCase(),
							keyword: inEvent.currentValues.SearchField,
							sort: SortBy
						}
					}
				);
				
				if (!response) {
					alert("The request was canceled.");
				} else if (response.status != 200) {
					alert("The request failed: " + response.responseText);
				} else {
					WebResult = eval(response.responseText);
				}
			}
			
			
			/* 界面控制 */
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
			
			function CreateResultHeader(inLabel){
				return { HBox: {
					percentWidth: 100,
					height: 22,
					style: {
						paddingLeft: 4,
						paddingRight: 20,
						backgroundAlpha: .2,
						//backgroundColor: "0xA4A4A4",
					},
					children: [
						{ Label: {
							text: inLabel,
							style: {
								paddingLeft: 4,
								paddingTop: 2,
								fontWeight: "bold",
								color: 0x555555,
								fontSize: 11,
							},
						} },
					],
				} };
			}
			
			
			/* 检测中文字符 */
			function CheckChinese(str){
				for(var i=0; i<str.length; i++){
					if(str.charCodeAt(i) > 255){ return true }
					else{ return false }
				}
			}

	//------------------------------------------------------------------------------ 函数.end


			fwlib.panel.register({
				events: {
					onFwStartMovie: function(event){ init(event); },
				},
				css: {
					".btnNormal": { fontWeight: "normal" },
					".Col": { paddingLeft:0 },
					".Row": { paddingLeft:4, paddingButtom:0 },
					".SearchBar": { fontSize: 14 },
					".RbOn": { color: 0x30A951, paddingTop:2, paddingLeft:0, paddingRight:0, fontSize:11 },
					".RbOff": { color: 0x666666, paddingTop:2, paddingLeft:0, paddingRight:0, fontSize:11 }
				},
				children:[
					CreateHeader(INFO.name, 0x4A4D54),
					Col([
						//------------------------------------------------------------- 缩放
						Row([
							{ TextInput: {
								name: "SearchField",
								percentWidth: 60,
								height: 31,
								styleName: "SearchBar"
							} },
							{ ComboBox: {
								name: "CatalogBox",
								percentWidth:15,
								height:30,
								selectedIndex: 0,
								dataProvider: CatalogList,
								events: {
									change: function(event){
										
									}
								}
							} },
							
							//{ VRule: { height:30 } },
							{ Label: { text:"|", width: 6, style: { color: 0x888888, paddingTop: 5, fontWeight: "normal" } } },
							
							{ Button: {
								name: "SearchBtn",
								label: "Search",
								percentWidth: 20,
								height: 30,
								emphasized: true,
								events: {
									click: function(event){
										Query(event);
										FormatInfo(event);
										event.result.push(["ResultList", "dataProvider", SearchResult]);
									}
								}
							} }
						]),
						RowSpace(),
						
						//------------------------------------------------------------- 信息
						{ HBox: {
							percentWidth: 100,
							height: 22,
							style: {
								backgroundAlpha: .2,
								backgroundColor: "0xA4A4A4",
								paddingRight: 8,
							},
							children: [
								CreateResultHeader("Result"),
								{ Label: { text:"|", width: 6, style: { color: 0x888888, paddingTop: 2, fontWeight: "normal" } } },
								
								{ Label: {
									text: "Sort by:",
									style: {
										paddingTop: 2,
										paddingLeft:0,
										paddingRight:0,
										fontSize: 11,
										color: 0x666666
									},
								} },
								
								{ Button: {
									name: "SortByTime",
									label: "Newest",
									buttonMode: true,
									styleName: "RbOn",
									alpha: 0,
									events: {
										click: function(event){
											SortBy = "time";
											event.result.push(["SortByTime", "styleName", "RbOn"], ["SortByName", "styleName", "RbOff"]);
											
											if(SearchResult != 'No result'){
												Query(event);
												FormatInfo(event);
												event.result.push(["ResultList", "dataProvider", SearchResult]);
											}
										}
									}
								} },
								
								{ Button: {
									name: "SortByName",
									buttonMode: true,
									label: "A - Z",
									styleName: "RbOff",
									alpha: 0,
									events: {
										click: function(event){
											SortBy = "name";
											event.result.push(["SortByTime", "styleName", "RbOff"], ["SortByName", "styleName", "RbOn"]);
											
											if(SearchResult != 'No result'){
												Query(event);
												FormatInfo(event);
												event.result.push(["ResultList", "dataProvider", SearchResult]);
											}
										}
									}
								} },
							],
						} },
						
						
						{ List: {
							name: "ResultList",
							rowCount: 6,
							percentWidth: 100,
							percentHeight: 100,
							selectedIndex: 0,
							doubleClickEnabled: true,
							dataProvider: SearchResult,
							events: {
								doubleClick: function(event){
									var confirm;
									SelectedId = event.currentValues.ResultList.selectedIndex;
									if(SelectedId==-1){ return }
									
									if(SearchResult[0]!='No result'){
										if(WebResult[SelectedId].catalog=='panel'){
											confirm = fw.yesNoDialog(SearchResultDetail[SelectedId] +sp+sp+ ">> Download this item? <<");
											if(confirm){ Download(); }
										}else{
											confirm = fw.yesNoDialog(SearchResultDetail[SelectedId] +sp+sp+ ">> Install this item? <<");
											if(confirm){ Download(); }
										}
									}
								}
							},
							style: {
								fontSize: 12,
								fontWeight: 'bold',
								paddingLeft: 6,
								paddingRight: 6,
							}
						} },
						
					]),
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
							source: FwCurrentScriptDir + "/images/back.png",
							events:{
								click: function(event){
									fw.launchApp(fw.appDir+((fw.platform=="win")?"/Fireworks.exe":"/Adobe Fireworks CS6.app"), [fw.currentScriptDir+"/core/restore.jsf"]);
								}
							}
						} }
					],
				} };
			}

		});

	})();

} catch (exception) {
	alert([exception, exception.lineNumber, exception.fileName].join("\n"));
}