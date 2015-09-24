(function($) {


    var <%=componentName.toUpperCase()%> = function() {

        //若服务端端渲染发布上线
        this.isProduct = $("body").attr("isProduct") === 'true';
        /**
         * 组件初始化
         * @return {[type]} [description]
         */
        this.init = function() {
                _this = this;
                var comArr = $(".comp_<%=componentName%>[component_parse!='true']");

                for (var i = 0, j = comArr.length; i < j; i++) {

                    this.fecthConfig($(comArr[i]), function(styObj, dataUrl) {
                        _this.initStyle($(comArr[i]), styObj);
                        _this.renderData($(comArr[i]), dataUrl);
                    });
                }
                this.bindEvent();
            },
            /**
             * 获取组件配置信息
             * @return {[type]} [description]
             */
            this.fecthConfig = function($com, fn) {

                this.comStyleData = JSON.parse($com.attr("component_style"));
                this.dataUrl = JSON.parse($com.attr("component_dataUrl"));
                fn && fn(this.comStyleData, this.dataUrl);

            },
            /**
             * 生成样式
             * @return {[type]} [description]
             */
            this.initStyle = function($com, styObj) {

                var comId = $com.attr("id");
                //标题颜色
               //addRule

            },
            /**
             * 渲染数据
             * @return {[type]} [description]
             */
            this.renderData = function($com, dataUrl) {

                for (var i = 0, j = dataUrl.length; i < j; i++) {

                    (function(i) {

                        if (!_this.isProduct || !dataUrl[i].isBeRender) {

                            $.ajax({
                                url: dataUrl[i].url,
                                type: 'get',
                                dataType: 'json',
                                xhrFields: {
                                    withCredentials: true
                                },
                                // data: data,
                                success: function(data, textStatus, xhr) {


                                    data.data["config_dataUrl"] = dataUrl[i];
                                    //模板渲染
                                    var html = template(dataUrl[i].id, data.data);
                                    $com.find('.' + dataUrl[i].target).html(html);
                                    i++;

                                },
                                error: function(xhr, textStatus, errorThrown) {
                                    //请求失败
                                    i++;
                                }
                            });
                        }

                    })(i);
                }
            },
            /**
             * 绑定事件
             * @return {[type]} [description]
             */
            this.bindEvent = function() {
                var _this = this;
                //bind event  component class comp_<%=componentName%>

            },
            /**
             * 组件销毁
             * @return {[type]} [description]
             */
            this.destory = function() {

               

            }
    };

    window.<%=componentName%> = new <%=componentName.toUpperCase()%>();
    window.<%=componentName%>.init();

})(jQuery);