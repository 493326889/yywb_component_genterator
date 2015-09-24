define(function(require, exports, module) {

	//动态构建
	var compEditor = require("/edit/js/imgTextDate.js");


	const CONFIG_PATH = "../config.json";
	const COMP_ID = "compTestId";

	var defaultLoadMap = {
		css: ["/test/css/reset.css"],
		js: ["/test/lib/jquery-1.8.3.min.js", "/test/lib/template-native.js"]

	};
	var utiljs = "/test/lib/editUtil.js";
	var load = {
		init: function() {

			this.getConfig(this.insertComp.bind(this));

		},
		getConfig: function(cb) {

			this.aj(CONFIG_PATH, function(response) {
				this.config = response;

				cb && cb();

			}.bind(this));



		},


		getFrame: function() {

			if (!this.frame) {
				this.frame = $("#editFrame")[0].contentWindow.window;

			}


			return this.frame;


		},
		insertComp: function() {

			var frameWindow = this.getFrame();

			var loadCss = defaultLoadMap.css.concat(this.config.dependent_css).concat(this.config.src.css),

				loadJs = this.formatJs(defaultLoadMap.js, "lib").concat(this.formatJs(this.config.dependent_js)).concat(this.formatJs(this.config.src.js, "lib"));

			this.loadCss(loadCss, function() {

				this.loadHtmlAndTpl(function() {

					this.loadBaseJs(function() {

						this.getFrame().ls(loadJs);
						this.startEdit();
					}.bind(this));

				}.bind(this));

			}.bind(this));


		},
		startEdit: function() {

			this.aj(this.config.edit.html, function(response) {
				$("#editBar").html(response);

				compEditor.edit(COMP_ID, this.compTarget);

			}.bind(this), "html");


		},
		loadHtmlAndTpl: function(callback) {

			async.series([function(cb) {

				this.aj(this.config.src.html, function(response) {
					var tg = $(response)[0];
					tg.setAttribute("id", COMP_ID);
					this.compTarget = tg;
					this.getFrame().document.body.appendChild(tg);

					cb();
				}.bind(this), "html")

			}.bind(this), function(cb) {

				this.aj(this.config.src.template[0], function(response) {

					var tg = $(response)[0];

					this.getFrame().document.body.appendChild(tg);

					cb();
				}.bind(this), "html")



			}.bind(this)], function() {

				callback && callback();

			}.bind(this));


		},
		formatJs: function(jsSet, type) {
			var temp = [];

			for (var i = 0, js; js = jsSet[i]; i++) {
				temp.push({
					src: js,
					type: type
				});

			}


			return temp;
		},
		loadCss: function(cssSet, callback) {
			var $editHead = $(this.getFrame().document.head);

			async.map(cssSet, function(css, cb) {
				if (!$editHead.find("[href='" + css + "']").length) {
					var temp = this.getLinkTag(css);

					temp.onload = function() {
						cb();
					}
					$editHead.append(temp);

				} else {
					cb();
				}

			}.bind(this), function() {
				callback && callback();
			});

		},
		getLinkTag: function(url) {
			var cssTag = document.createElement("link");
			cssTag.setAttribute("rel", "stylesheet");
			cssTag.setAttribute("href", url);
			return cssTag;
		},



		loadBaseJs: function(cb) {
			var scriptTag = document.createElement("script");

			scriptTag.src = utiljs;

			scriptTag.onload = function() {

				cb && cb();

			};

			this.getFrame().document.body.appendChild(scriptTag);



		},

		aj: function(url, cb, dataType, data) {

			$.ajax({
				url: url,
				data: data || {},
				dataType: dataType || "json",
				success: function(response) {
					cb && cb(response);
				}

			})


		}



	}


	return load;

});