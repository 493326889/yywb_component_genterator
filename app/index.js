'use strict';

var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var path = require('path');

module.exports = generators.Base.extend({

	constructor: function () {
		
		generators.Base.apply(this, arguments);

	},

	initializing: function(){

		this._fileCopy =function(templateFile, desFile, tplDataObj){

			this.fs.copyTpl(
				this.templatePath(templateFile),
				desFile,
				tplDataObj
			);

		}.bind(this);

		// var nameRep =new RegExp('[^name=][a-zA-Z0-9]*', "i"),
		// 	dirRep = new RegExp('[^dir=].*', "i");

		if(this.args.length >0){

			for(var i=0; i<this.args.length; i++){

				if(this.args[i].indexOf("config=")!=-1){

					this.configObj = JSON.parse(decodeURIComponent(this.args[i].split("config=")[1]));
					this.componentName = this.configObj.name_en;
					this.dirRoot = this.configObj.dir;
					
					//构建component_dataUrl
					this.componentDataUrl =[];
					if(this.configObj.dependent_data.length>0){
						for(var j=0,k=this.configObj.dependent_data.length; j<k; j++){

							var tempObj = {
								"id":"comp_"+this.componentName+"Tpl",
								"startIndex": 0,
								"dsid": this.configObj.dependent_data[j],
								"url": "http://wb.yy.com/dataStructure/testData?dsid="+this.configObj.dependent_data[j],
								"target": "comp_"+this.componentName+"_ct",
								"isBeRender":false
							}
							this.componentDataUrl.push(tempObj);
						}

					}
					break;
				}
			}

		}

	},

	writing: {

		thumb: function(){

			this.fs.copy(
				this.templatePath('thumb.png'),
				path.join(this.dirRoot.toString(),'thumb.png')
			);

			this.configObj["thumb"]= path.join(this.dirRoot.toString(),'thumb.png');
		},
		src: function(){

			this.srcFileArr = [
				{
					temp:"src"+path.sep+"componentSrc.html",
					des: this.dirRoot.toString()+'/src/'+this.componentName.toString()+'.html',
					type: "html",
					data:{
						componentName: this.componentName,
						dataUrlConfig: JSON.stringify(this.componentDataUrl)
					}
				},{
					temp:"src"+path.sep+"js"+path.sep+"componentSrc.js",
					des: this.dirRoot.toString()+'/src/'+'js/'+this.componentName.toString()+'.js',
					type: "js",
					data:{
						componentName:this.componentName
					}
				},{
					temp:"src"+path.sep+"css"+path.sep+"componentSrc.css",
					des: this.dirRoot.toString()+'/src/'+'css/'+this.componentName.toString()+'.css',
					type: "css",
					data:{
						componentName:this.componentName
					}
				},{
					temp:"src"+path.sep+"template"+path.sep+"componentTpl.html",
					des: this.dirRoot.toString()+'/src/'+'template/'+this.componentName.toString()+'.html',
					type: "template",
					data:{
						componentName:this.componentName
					}
				}
			];
			var configSrcObj={
               	css: [],
                js: [],
                html: [],
                template: []
            };
            this.configObj["src"] = configSrcObj;
			for(var i=0, j=this.srcFileArr.length;i<j; i++){

				this._fileCopy(this.srcFileArr[i].temp, this.srcFileArr[i].des,this.srcFileArr[i].data);
			
				this.configObj["src"][this.srcFileArr[i].type].push(this.srcFileArr[i].des.toString().split(this.dirRoot.toString())[1]);

			}

			mkdirp(path.join(this.dirRoot.toString(),'src','images'));
		},

		edit: function(){

			this.editFileArr = [
				{
					temp: "edit"+path.sep+"componentEdit.html",
					des: this.dirRoot.toString()+'/edit/'+this.componentName.toString()+".html",
					type: "html",
					data:{
						componentName:this.componentName
					}
				},{
					temp: "edit"+path.sep+"js"+path.sep+"componentEdit.js",
					des: this.dirRoot.toString()+'/edit/'+'js/'+this.componentName.toString()+".js",
					type:"js",
					data:{
						componentName:this.componentName
					}
				}
			];
			var configEditObj={
                js: [],
                html: []
            };
            this.configObj["edit"] = configEditObj;
			for(var i=0, j=this.editFileArr.length;i<j; i++){

				this._fileCopy(this.editFileArr[i].temp, this.editFileArr[i].des,this.editFileArr[i].data);
				this.configObj["edit"][this.editFileArr[i].type].push(this.editFileArr[i].des.toString().split(this.dirRoot.toString())[1]);


			}

		},


		config: function(){
			this.configObj["finish"]=false;
			this.fs.writeJSON(path.join(this.dirRoot.toString(),'config.json'),this.configObj);

		},
		test: function(){

			this.fs.copy( path.join(this.templatePath(),'test','css'),path.join(this.dirRoot.toString(),'test','css') );
			this.fs.copyTpl( 
				path.join(this.templatePath(),'test','lib'),
				path.join(this.dirRoot.toString(),'test','lib'),
				{componentName:this.componentName} 
			);
			this.fs.copy( path.join(this.templatePath(),'test','test.html'),path.join(this.dirRoot.toString(),'test','test.html') );
		
		}

	}

});
