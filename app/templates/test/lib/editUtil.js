(function (window) {
    var styleCatch = {};

    initStyleCatch();
    /**
     * 当页面重新加载的时候，初始化styleCatch
     *
     */
    function initStyleCatch() {
        var cssText = getStyleTag().innerText || getStyleTag().innerHTML,
            cssText = cssText.replace(/\/\*(.*)\*\//mg, ""),
            cssText = cssText.replace(/(^\s*)|(\s*$)/g, "");


        if (cssText) {
            var ct = cssText.replace(/}/g, "}\n"),

                ruleSet = ct.split("\n");

            for (var i = 0, rule; rule = ruleSet[i]; i++) {
                var ruleMatch = rule.match(/(.*)?{(.*)?;}/);
                var selector, value;
                if (ruleMatch) {
                    selector = ruleMatch[1];
                    value = ruleMatch[2];
                    if (selector && value) {
                        var ruleValue = formatRuleValue(value);

                        !styleCatch[selector] && (styleCatch[selector] = {});


                        for (var r in ruleValue) {
                            styleCatch[selector][r] = ruleValue[r];
                        }
                    }
                }
            }
        }

    }


    /**
     * 初始化的时候格式化页面
     * @param ruleValue
     */
    function formatRuleValue(ruleValue) {
        var sr = ruleValue.split(";");
        var temp = {};

        for (var i = 0, item; item = sr[i]; i++) {
            var st = item.match(/(.+?):(.+)/);
            temp[st[1]] = st[2];
        }

        return temp;
    }

    /**
     * 放置在生成的页面之中,用于按顺序加载javascript
     * @param index
     * @param scripts
     * @private
     */
    function _loadScript(index, scripts, onhead, onheadTag, clsAndId) {
        if (!scripts[index]) return;

        var script = scripts[index];
        index++;
        if (!document.querySelector("[src='" + script.src + "']") || script.type == "component") {
            var scriptTarget = document.createElement("script");
            scriptTarget.src = script.src;

            if (clsAndId) {
                clsAndId.clazz && scriptTarget.classList.add(clsAndId.clazz);

                clsAndId.id && scriptTarget.setAttribute("id", clsAndId.id);

            }

            scriptTarget.onload = function () {
                _loadScript(index, scripts);
            }

            if (!onhead) {
                document.body.appendChild(scriptTarget);
            } else {
                if (onheadTag) {
                    document.head.appendChild(scriptTarget);
                } else {
                    document.body.insertBefore(scriptTarget, document.body.children[0]);
                }
            }


        } else {
            _loadScript(index, scripts);
        }
    }


    /**
     * 为组件提供添加样式的方法
     *
     */
    function _addRule(selector, ruleObj, ruleValue) {


        !styleCatch[selector] && (styleCatch[selector] = {});

        if (arguments.length === 3) {//单条规则

            styleCatch[selector][ruleObj] = ruleValue;

        } else if (arguments.length === 2 && typeof ruleObj === "object") {//多条规则

            for (var key in ruleObj) {
                var value = ruleObj[key];
                styleCatch[selector][key] = value;

            }
        } else {
            return;
        }


        _generalRule();

    }

    /**
     * 函数节流
     * @private
     */
    function _generalRule() {

        window.setTimeoutHandler && clearTimeout(window.setTimeoutHandler);
        window.setTimeoutHandler = setTimeout(function () {
            var cssText = formatRule(styleCatch);

            if( getStyleTag().innerText){
                getStyleTag().innerText = cssText;
            }else{
                getStyleTag().innerHTML = cssText;
            }

            window.setTimeoutHandler = void 0;
        }, 40);
    }

    /**
     * 添加css标签
     */
    function formatRule(cssRuleSet) {

        var cssText = "";

        for (var selector in cssRuleSet) {
            var temp = selector + "{";

            var t = cssRuleSet[selector];
            for (var rule in t) {
                var param = t[rule];
                param && (temp += rule + ":" + param + ";");

            }
            temp += "}"

            cssText += temp;
        }


        return cssText;


    }

    function getStyleTag() {
        var st = document.getElementById('component_style');

        if (!st) {
            st = document.createElement("style");
            st.id = "component_style";
            document.head.appendChild(st);
        }


        return st;

    }


    function getStyleCatch() {
        return styleCatch;
    }


    /**
     * 组件添加样式方法（备用）
     *
     */
    function insertRule(selectorText, cssText, position) {
        var sheet = getCreateStyleSheet();
        if (sheet.insertRule) {
            sheet.insertRule(selectorText + "{" + cssText + "}", position);
        } else if (sheet.addRule) {
            sheet.addRule(selectorText, cssText, poistion);
        }
    }

    /**
     * 获取添加在head的样式对象
     *
     */
    function getCreateStyleSheet() {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        return style.sheet;
    }

    /**
     * 读取样式表样式对象
     */
    function getstyle(sname) {
        for (var i = 0; i < document.styleSheets.length; i++) {
            var rules;
            if (document.styleSheets[i].cssRules) {
                rules = document.styleSheets[i].cssRules;
            } else {
                rules = document.styleSheets[i].rules;
            }
            for (var j = 0; j < rules.length; j++) {
                if (rules[j].selectorText == sname) {
                    return rules[j].style;
                }
            }
        }
    }


    window.ls = function (scripts, onhead, onheadTag, clsAndId) {
        _loadScript(0, scripts, onhead, onheadTag, clsAndId);
    }
    window.addRule = _addRule;

    window.formatRule = formatRule;

    window.getStyleCatch = getStyleCatch;

    window.initStyleCatch = initStyleCatch;
})(window);

