define(function(require,exports,module){
	var componentUtil = require("componentUtil");
	var frameWindow = componentUtil.getFrameWindow();
	
	module.exports = {
		edit:function(id,el){
			this.el = el;
			this.elId = id;
			
			this.comStyleObj = $.parseJSON($(this.el).attr("component_style"));
			this.comDataObj = $.parseJSON($(this.el).attr("component_dataUrl"));

			// 组件样式
			this.styleEditor = new JSONEditor(document.getElementById('info_style_obj'),{
				disable_properties:true,
				schema: {
					type: "object",
					title: "组件样式",
					properties: {
						
						//write style json edit form object here
						
					}
				}
			});

			//组件数据
			this.dataEditor = new JSONEditor(document.getElementById('info_data_obj'), {
				disable_properties:true,
				schema: {
					type: "array",
					title: "数据接口",
					items:{
						title:"数据组件",
						type:"object",
						properties:{
							id:{
								title:"模板id",
								type:"string"
							},
							url:{
								title:"数据接口地址",
								type:"string"
							},
							target:{
								title:"模板目标",
								type:"string"
							},
							startIndex:{
								title:"数据开始序号",
								type:"integer"
							},
							isBeRender:{
								title:"后端渲染",
								type:"boolean",
								format:"checkbox",
								options:{
									hidden: true
								}
							},
							dsid: {
								title:"数据结构id",
								type:"string",
								format:"checkbox",
								options:{
									hidden: true
								}
							}
						}
					}
				}
			});

			this.renderDataInterfaceList();

			this.styleEditor.setValue(this.comStyleObj);
			this.dataEditor.setValue(this.comDataObj);

			componentUtil.setColorPickerRoot(this.styleEditor);
            this.bindEvent();
		},
		/**
		 * 生成对应数据接口数据接口绑定项
		 * @return {[type]} [description]
		 */
		renderDataInterfaceList: function(){
			var _this= this;
			for(var i=0,j=this.comDataObj.length; i<j; i++){

				(function(i){

					$.ajax({
						url: 'http://wb.yy.com/DataComponent/readByStructure',
						type: 'get',
						dataType: 'json',
						xhrFields: {
	                    	withCredentials: true
	               	 	},
						data: {dsid: _this.comDataObj[i].dsid},
					})
					.done(function(data) {

						var dataInterfaceData = data.data;
						var temp = '<div class="input_group">'+
				            '<label>'+dataInterfaceData.ds_name+'</label><select class="diSelect">';	
						for(var key in dataInterfaceData.component){
							temp+= '<option value="'+dataInterfaceData.component[key].api+'">'+dataInterfaceData.component[key].name+'</option>';
						}	
						$("#info_dataInterface").append(temp+'</select></div>');
						i++;

					})
					.fail(function() {
						i++;
						console.log(<%=componentName%>+'readByStructureError');
					});

				})(i);

			}
		},


		bindEvent:function(){
			//修改样式
			var _this = this;
			$("#style_comfirmBtn").on("click",function(){
				//获取样式表单数据
				var objtext = _this.styleEditor.getValue();
				$(this.el).attr("component_style",JSON.stringify(objtext));
				frameWindow.<%=componentName%>.init();
			}.bind(this));

			//修改数据
			$("#data_comfirmBtn").on("click",function(){
				//将格式化后的component_data 去掉换行
				var objtext = _this.dataEditor.getValue();
				$(this.el).attr("component_data",JSON.stringify(objtext));
				
				frameWindow.<%=componentName%>.init();
			}.bind(this));

			//保存绑定接口数据
			$("#di_comfirmBtn").on("click",function(){

				var objtext = _this.dataEditor.getValue();
				var apiArr = $(".diSelect option:selected");

				for(var i=0, j=apiArr.length; i<j; i++){
					objtext[i].url= $(apiArr[i]).val();
				}
				$(this.el).attr("component_dataUrl",JSON.stringify(objtext));
				this.dataEditor.setValue(objtext);
				frameWindow.<%=componentName%>.init();

			}.bind(this));
		}
	}	
			
});