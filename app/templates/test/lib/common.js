/**
 * Created with WebStorm.
 * User: zqbright
 * Date: 2015/2/6 0006
 * Time: 14:33
 * To change this template use File | Settings | File Templates.
 */

define(function (require) {

    var eFun = function(){};

    var c = {
        on: eFun,
        trigger: eFun,
        once: eFun,
        off: eFun,
        domIndex: 0,
        getComHtmlId: function ($target) {
            var id = $target.attr("id");
            if (!id) {
                id = c.generalDomId();
                $target.attr("id", id);
            }

            return id;
        },
        getSearchItem: function (key) {
            return searchItem[key]

        },

        setDomIndex: function (index) {
            (!index || isNaN(index) ) && (index = 0);

            c.domIndex = index;

        },

        getPageUuId: function () {
            if (!c.pageUuId) {
                c.generalPageUuId();
            }

            return c.pageUuId;

        },
        generalPageUuId: function () {

            c.pageUuId = c.uuid(12, 16);

            return c.pageUuId;

        },
        generalDomId: function () {
            return "psdDom_" + c.getPageUuId() + "_" + (c.domIndex++);

        },
        /**
         * 生成uuid 用于添加dom节点的元素
         * @param len 长度
         * @param radix
         * @returns {string}
         */
        uuid: function (len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        },
        parseUri: function (str) {
            var options = c._getParseUriConfig();
            var matches = options.parser[options.strictMode ? "strict" : "loose"].exec(str);
            var uri = {};
            var i = 14;
            while (i--) {
                uri[options.key[i]] = matches[i] || "";
            }
            uri[options.query.name] = {};
            uri[options.key[12]].replace(options.query.parser, function ($0, $1, $2) {
                if ($1)
                    uri[options.query.name][$1] = $2;
            });

            return uri;
        },
        _getParseUriConfig: function () {
            return {
                strictMode: false,
                key: ["source", "protocol", "authority", "userInfo", "user", "password",
                    "host", "port", "relative", "path", "directory", "file", "query",
                    "anchor"],
                query: {
                    name: "queryKey",
                    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                },
                parser: {
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                }
            }

        },

        getLinkTag: function (url) {

            return $("<link rel='stylesheet' href='" + url + "'>");


        }

    }


    return c;


});
