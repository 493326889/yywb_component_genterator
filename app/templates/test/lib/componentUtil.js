define(function (require, exports, module) {
    require("componentConfig");

    var common = require("./common");

    module.exports = {
        compResize: function () {

            modView.handlerWinResize();

        },
        generalId: function () {
            return common.generalDomId();
        },
        setCss: function (el, attr) {
            el.css(attr);

            //TODO
            console.log("hhhh");
        },
        getFrameWindow: function () {
            return window.frames["editFrame"].contentWindow;
        },

        //获取组件样式并填充编辑表单
        getComStyle: function (el) {
            var csObj = $.parseJSON($(el).attr("component_style"));
            //数据自动填充表单
            for (var key in csObj) {
                $('.' + key).val(csObj[key])
            }
        },
        //获取表单信息并返回为 json字符串
        setComStyle: function () {
            //组件样式对象
            var csObj = new Object();
            var csInputArr = $(".cs_input");
            for (var i = 0; i < csInputArr.length; i++) {
                if ($(csInputArr[i]).val()) {
                    var name = $(csInputArr[i]).attr("name");
                    csObj[name] = $(csInputArr[i]).val();
                }
            }
            return JSON.stringify(csObj);
        },
        /**
         * 设置表单编辑样式
         */
        setJsonEdTheme: function () {
            var setTheme = function (theme) {
                theme = theme || '';
                var mapping = {
                    html: '',
                    bootstrap2: '//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css',
                    bootstrap3: '//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css',
                    foundation3: '//cdnjs.cloudflare.com/ajax/libs/foundation/3.2.5/stylesheets/foundation.css',
                    foundation4: '//cdn.jsdelivr.net/foundation/4.3.2/css/foundation.min.css',
                    foundation5: '//cdn.jsdelivr.net/foundation/5.0.2/css/foundation.min.css',
                    jqueryui: '//code.jquery.com/ui/1.10.3/themes/south-street/jquery-ui.css'
                };
                JSONEditor.defaults.options.theme = theme;
                document.getElementById('theme_stylesheet').href = mapping[theme];
            };

            // Set the icontheme
            // Set the theme by loading the right stylesheets
            var setIconlib = function (iconlib) {
                iconlib = iconlib || '';
                var mapping = {
                    foundation2: '//cdnjs.cloudflare.com/ajax/libs/foundicons/2.0/stylesheets/general_foundicons.css',
                    foundation3: '//cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/foundation-icons.css',
                    fontawesome3: '//cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/css/font-awesome.css',
                    fontawesome4: '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css'
                };
                JSONEditor.defaults.options.iconlib = iconlib;
                document.getElementById('icon_stylesheet').href = mapping[iconlib] || '';
            };

            setTheme('bootstrap2');
            /*	setIconlib('bootstrap3');*/
        },
        /**
         * 设置颜色选择器控制目标
         */
        setColorPickerRoot: function (editor) {
            $('.colorPicker').ColorPicker({
                onSubmit: function (hsb, hex, rgb, el) {
                    //							$(el).val("#" + hex);
                    $(el).ColorPickerHide();
                    //							alert($(el).attr("name"));
                    //							this.styleEditor.getEditor($(el).attr("name"));
                    //							.getEditor("root")
                    //							console.log(_this.styleEditor.getEditor($(el).attr("name")));
                    $(el).attr("name").split("[")[1].split("]")[0]
                    var target = editor.getEditor($(el).attr("name").replace(new RegExp(/(\[)/g),'.').replace(new RegExp(/(\])/g),''));
                    target.setValue("#" + hex);
                },
                onBeforeShow: function () {
                    $(this).ColorPickerSetColor(this.value);
                }
            })
                .bind('keyup', function () {
                    $(this).ColorPickerSetColor(this.value);
                });
        },
        //rgb转16进制颜色
        RGBToHex: function (rgb) {
            var regexp = /[0-9]{0,3}\d/g;
            var re = rgb.match(regexp);//利用正则表达式去掉多余的部分，将rgb中的数字提取
            var hexColor = "#";
            var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
            for (var i = 0; i < 3; i++) {
                var r = null, c = re[i], l = c;
                var hexAr = [];
                while (c > 16) {
                    r = c % 16;
                    c = (c / 16) >> 0;
                    hexAr.push(hex[r]);
                }
                hexAr.push(hex[c]);
                if (l < 16 && l != "") {
                    hexAr.push(0)
                }
                hexColor += hexAr.reverse().join('');
            }
            return hexColor;
        },
        /**
         * 解析url
         */
        parseUrl: function (url) {
            return common.parseUri(url);
        },
        /**
         * 初始化
         */

        /**
         * 初始化表单(已无用)
         */
        initStyleForm: function (obj) {

            var temp = "",
                html = "",
                c_style = obj.attr("component_style"),
                c_data = obj.attr("component_data");

            if (c_style) {
                $.each(JSON.parse(c_style), function (key, value) {
                    temp += '<div class="input_group">' +
                    '<label>' + nameConfig[key] + '</label>' +
                    '<input type="text" name="' + key + '" class="cw' + key + ' cs_input" value="' + value + '" />' +
                    '</div>';
                });
            }


            html += '<div class="tab_container">' +
            '<input id="tab_checkbox1" class="tab_checkbox" type="checkbox">' +
            '<div class="tab_header">' +
            '<label class="tab_label" for="tab_checkbox1">' +
            '<span> 组件样式 </span>' +
            '<a href="#" class="tab_save" id="style_comfirmBtn">保存</a>' +
            '</label>' +
            '</div>' +
            '<div class="tabContainer buty-scrollbar">' +
            '<!-- 表单内容 -->' +
            temp +
            '<!-- end 表单内容 -->' +
            '</div>' +
            '</div>' +
            '<div class="tab_container buty-scrollbar">' +
            '<input id="tab_checkbox2" class="tab_checkbox" type="checkbox">' +
            '<div class="tab_header">' +
            '<label class="tab_label" for="tab_checkbox2">' +
            '<span> 组件数据 </span>' +
            '<a href="#" class="tab_save" id="data_comfirmBtn">保存</a>' +
            '</label>' +
            '</div>' +
            '<div class="tabContainer">' +
            '<!-- 表单内容 -->' +
            '<div class="input_group">' +
            '<p>直接编辑文本框内数据即可修改组件数据</p>' +
            '<textarea rows="10" cols="40" class="info_data_obj" placeholder="" ></textarea>' +
            '</div>' +
            '<!-- end 表单内容 -->' +
            '</div>' +
            '</div>';
            if ($(".edit_bar .tab_container .cmsCode").length <= 1) {
                $(".edit_bar .container").prepend(html);
            }
            if (c_data) {
                $(".info_data_obj").val(JSON.stringify(JSON.parse(c_data), null, "  "));
            }
        }
    }


});