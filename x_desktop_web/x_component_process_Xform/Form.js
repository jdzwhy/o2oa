MWF.require("MWF.widget.Common", null, false);
MWF.require("MWF.xAction.org.express.RestActions", null,false);
MWF.xDesktop.requireApp("Organization", "Selector.package", null, false);
MWF.require("MWF.widget.Identity", null,false);
MWF.xApplication.process = MWF.xApplication.process || {};
MWF.xApplication.process.Xform = MWF.xApplication.process.Xform || {};
MWF.xDesktop.requireApp("process.Xform", "Package", null, false);
MWF.xApplication.process.Xform.Form = MWF.APPForm =  new Class({
	Implements: [Options, Events],
	Extends: MWF.widget.Common,
	options: {
		"style": "default",
        "readonly": false,
		"cssPath": "",
        "macro": "FormContext",
        "parameters": null,
        "moduleEvents": ["queryLoad",
            "beforeLoad",
            "postLoad",
            "afterLoad",
            "beforeSave",
            "afterSave",
            "beforeClose",
            "beforeProcess",
            "afterProcess",
            "beforeReset",
            "afterReset",
            "beforeRetract",
            "afterRetract",
            "beforeReroute",
            "afterReroute",
            "beforeDelete"]
	},
	initialize: function(node, data, options){
		this.setOptions(options);

		this.container = $(node);
        this.container.setStyle("-webkit-user-select", "text");
		this.data = data;
		this.json = data.json;
		this.html = data.html;
		
		this.path = "/x_component_process_Xform/$Form/";
		this.cssPath = this.options.cssPath || "/x_component_process_Xform/$Form/"+this.options.style+"/css.wcss";
		this._loadCss();
		
		this.modules = [];
        this.all = {};
        this.forms = {};

        if (!this.personActions) this.personActions = new MWF.xAction.org.express.RestActions();
	},
	load: function(){
        debugger;
        if (this.app){
            if (this.app.formNode) this.app.formNode.setStyles(this.json.styles);
        }
        if (!this.businessData.control.allowSave) this.setOptions({"readonly": true});
		if (this.fireEvent("queryLoad")){
            this.fireEvent("beforeLoad");

            MWF.xDesktop.requireApp("process.Xform", "lp."+MWF.language, null, false);
	//		this.container.setStyles(this.css.container);
			this._loadBusinessData();

            if (!MWF.Macro[this.options.macro || "FormContext"]){
                MWF.require("MWF.xScript.Macro", function(){
                    this.Macro = new MWF.Macro[this.options.macro || "FormContext"](this);

                    this._loadHtml();
                    this._loadForm();
                    this._loadModules(this.node);

                    this.fireEvent("postLoad");
                    this.fireEvent("afterLoad");
                }.bind(this));
            }else{
                this.Macro = new MWF.Macro[this.options.macro || "FormContext"](this);

                this._loadHtml();
                this._loadForm();
                this._loadModules(this.node);

                this.fireEvent("postLoad");
                this.fireEvent("afterLoad");
            }
		}
	},
	_loadBusinessData: function(){
        if (!this.businessData){
            this.businessData = {
                "data": {
                    "select": "222",
                    "radio": "bbb",
                    "checkbox": ["check1", "check3"],
                    "orderData": [
                        {
                            "orderName": {"namefield": "电脑"},
                            "orderCount": {"countField": "3"},
                            "priceCount": {"priceField": "9000"}
                        },
                        {
                            "orderName": {"namefield": "路由器"},
                            "orderCount": {"countField": "2"},
                            "priceCount": {"priceField": "1000"}
                        },
                        {
                            "orderName": {"namefield": "网线"},
                            "orderCount": {"countField": "10"},
                            "priceCount": {"priceField": "200"}
                        }
                    ]

                }
            };
        }
	},
	
	_loadHtml: function(){
		this.container.set("html", this.html);
		this.node = this.container.getFirst();
        this.node.setStyle("overflow", "hidden");
        this.node.addEvent("selectstart", function(e){
            var select = "text";
            if (e.target.getStyle("-webkit-user-select")){
                select = e.target.getStyle("-webkit-user-select").toString().toLowerCase();
            }

            if (select!=="text" && select!=="auto") e.preventDefault();
        });
	},
	
	_loadForm: function(){
		this._loadStyles();
		this._loadCssLinks();
		this._loadScriptSrc();
		this._loadJsheader();
		this._loadEvents();
	},
	_loadStyles: function(){
		this.node.setStyles(this.json.styles);
	},
	_loadCssLinks: function(){
		var urls = this.json.cssLinks;
		urls.each(function(url){
			new Element("link", {
				"rel": "stylesheet",
				"type": "text/css",
				"href": url
			}).inject($(document.head));
		});
	},
	_loadScriptSrc: function(){
		var urls = this.json.scriptSrc;
		urls.each(function(url){
			new Element("script", {
				"src": url
			}).inject($(document.head));
		});
	},
	_loadJsheader: function(){
		var code = this.json.jsheader.code;
		if (code) Browser.exec(code);
	},
	_loadEvents: function(){
		Object.each(this.json.events, function(e, key){
			if (e.code){
                if (this.options.moduleEvents.indexOf(key)!==-1){
                    this.addEvent(key, function(event){
                        return this.Macro.fire(e.code, this, event);
                    }.bind(this));
                }else{
                    if (key==="load"){
                        this.addEvent("postLoad", function(){
                            return this.Macro.fire(e.code, this);
                        }.bind(this));
                    }else if (key==="submit"){
                        this.addEvent("beforeProcess", function(){
                            return this.Macro.fire(e.code, this);
                        }.bind(this));
                    }else{
                        this.node.addEvent(key, function(event){
                            return this.Macro.fire(e.code, this, event);
                        }.bind(this));
                    }
                }
			}
		}.bind(this));
	},
	
	
	_getDomjson: function(dom){
		var mwfType = dom.get("MWFtype");
		switch (mwfType) {
			case "form": 
				return this.json;
			case "":
				return null;
			default:
				var id = dom.get("id");
				if (!id) id = dom.get("MWFId");
				if (id){
					return this.json.moduleList[id];
				}else{
					return null;
				}
		}
	},
	_getModuleNodes: function(dom){
		var moduleNodes = [];
		var subDom = dom.getFirst();
		while (subDom){
			if (subDom.get("MWFtype")){
                var type = subDom.get("MWFtype");
				if (type.indexOf("$")===-1){
                    moduleNodes.push(subDom);
                }
				if (subDom.get("MWFtype") !== "datagrid" && subDom.get("MWFtype") !== "subSource"){
					moduleNodes = moduleNodes.concat(this._getModuleNodes(subDom));
				}
			}else{
				moduleNodes = moduleNodes.concat(this._getModuleNodes(subDom));
			}
			subDom = subDom.getNext();
		}
		return moduleNodes;
	},

	_loadModules: function(dom){
        //var subDom = this.node.getFirst();
        //while (subDom){
        //    if (subDom.get("MWFtype")){
        //        var json = this._getDomjson(subDom);
        //        var module = this._loadModule(json, subDom);
        //        this.modules.push(module);
        //    }
        //    subDom = subDom.getNext();
        //}

		var moduleNodes = this._getModuleNodes(dom);
        //alert(moduleNodes.length);

		moduleNodes.each(function(node){
			var json = this._getDomjson(node);
			var module = this._loadModule(json, node);
			this.modules.push(module);
		}.bind(this));
	},
	_loadModule: function(json, node, beforeLoad){
		var module = new MWF["APP"+json.type](node, json, this);
        if (beforeLoad) beforeLoad.apply(module);
        if (!this.all[json.id]) this.all[json.id] = module;
        if (module.field){
            if (!this.forms[json.id]) this.forms[json.id] = module;
        }
        module.readonly = this.options.readonly;
		module.load();
		return module;
	},
    getData: function(){
        var data= Object.clone(this.businessData.data);
        Object.each(this.forms, function(module, id){
            if (module.json.section==="yes"){
                data[id] = this.getSectionData(module, data[id]);
            }else{
                data[id] = module.getData();
            }
        }.bind(this));

        this.businessData.data = data;
        this.Macro.environment.setData(this.businessData.data);
        return data;
    },
    getSectionData: function(module, obj){
        var v = module.getData();
        switch (module.json.sectionBy){
            case "person":
                return this.getSectionDataByPerson(v, obj);
                break;
            case "department":
                return this.getSectionDataByDepartment(v, obj);
                break;
            case "activity":
                return this.getSectionDataByPActivity(v, obj);
                break;
            case "script":
                return this.getSectionDataByScript(module.json.sectionByScript.code, v, obj);
                break;
            default:
                return v;
        }
    },
    getSectionDataByPerson: function(v, obj) {
        var key = layout.desktop.session.user.id;
        if (!obj || (typeOf(obj)!=="object")) obj={};
        obj[key] = v;
        return obj;
    },
    getSectionDataByDepartment: function(v, obj) {
        var key = (this.businessData.task) ? this.businessData.task.department : "";
        if (!obj || (typeOf(obj)!=="object")) obj={};
        if (key) obj[key] = v;
        return obj;
    },
    getSectionDataByPActivity: function(v, obj) {
        var key = (this.businessData.work) ? this.businessData.work.activity : "";
        if (!obj || (typeOf(obj)!=="object")) obj={};
        if (key) obj[key] = v;
        return obj;
    },
    getSectionDataByScript: function(code, v, obj) {
        var key = this.form.Macro.exec(code, this);
        if (!obj || (typeOf(obj)!=="object")) obj={};
        if (key) obj[key] = v;
        return obj;
    },

    saveWork: function(callback){
        if (this.businessData.control["allowSave"]){
            this.fireEvent("beforeSave");
            this.workAction.saveData(function(json){
                this.notice(MWF.xApplication.process.Xform.LP.dataSaved, "success");
                if (callback) callback();
                this.fireEvent("afterSave");
            }.bind(this), null, this.businessData.work.id, this.getData());
        }else{
            MWF.xDesktop.notice("error", {x: "right", y:"top"}, "Permission Denied");
            //if (failure) failure(null, "Permission Denied", "");
        }
    },
    closeWork: function(){
        this.fireEvent("beforeClose");
        if (this.app){
            this.app.close();
        //    this.fireEvent("afterClose");
        }
    },
    addMessage: function(data){
        var content = "";
        if (data.length){
            data.each(function(work){
                var users = [];
                work.taskList.each(function(task){
                    users.push(task.person+"("+task.department+")");
                }.bind(this));

                content += "<div><b>"+MWF.xApplication.process.Xform.LP.nextActivity+"<font style=\"color: #ea621f\">"+work.fromActivityName+"</font>, "+MWF.xApplication.process.Xform.LP.nextUser+"<font style=\"color: #ea621f\">"+users.join(", ")+"</font></b></div>"
            }.bind(this));
        }else{
            content += MWF.xApplication.process.Xform.LP.workCompleted;
        }

        //data.workList.each(function(list){
        //    content += "<div><b>"+MWF.xApplication.process.Xform.LP.nextActivity+"<font style=\"color: #ea621f\">"+list.activityName+"</font>, "+MWF.xApplication.process.Xform.LP.nextUser+"<font style=\"color: #ea621f\">"+list.personList.join(", ")+"</font></b></div>"
        //}.bind(this));

        var msg = {
            "subject": MWF.xApplication.process.Xform.LP.taskProcessed,
            "content": "<div>"+MWF.xApplication.process.Xform.LP.taskProcessedMessage+"“"+this.businessData.work.title+"”</div>"+content
        };
        layout.desktop.message.addTooltip(msg);
        return layout.desktop.message.addMessage(msg);
    },
    formValidation: function(routeName, opinion){
        if (this.options.readonly) return true;
        this.Macro.environment.form.currentRouteName = routeName;
        this.Macro.environment.form.opinion = opinion;

        var flag = true;
        //flag = this.validation();
        Object.each(this.forms, function(field, key){
            field.validationMode();
            if (!field.validation(routeName, opinion)) flag = false;
        }.bind(this));
        return flag;
    },
    validation: function(routeName, opinion, processor){
        this.Macro.environment.form.currentRouteName = routeName;
        this.Macro.environment.form.opinion = opinion;
        var routeFlag = this.validationRoute(processor);
        var opinionFlag = this.validationOpinion(processor);
        return routeFlag && opinionFlag;
    },
    validationRoute: function(processor){
        if (!this.json.validationRoute) return true;
        if (!this.json.validationRoute.code) return true;
        var flag = this.Macro.exec(this.json.validationRoute.code, this);
        if (!flag) flag = MWF.xApplication.process.Xform.LP.notValidation;
        if (flag.toString()!="true"){
            this.notValidationRouteMode(flag, processor);
            return false;
        }
        return true;
    },
    validationOpinion: function(processor){
        if (!this.json.validationOpinion) return true;
        if (!this.json.validationOpinion.code) return true;
        var flag = this.Macro.exec(this.json.validationOpinion.code, this);
        if (!flag) flag = MWF.xApplication.process.Xform.LP.notValidation;
        if (flag.toString()!="true"){
            this.notValidationOpinionMode(flag, processor);
            return false;
        }
        return true;
    },
    notValidationRouteMode: function(flag, processor){
        processor.routeSelectorArea.setStyle("background-color", "#ffe9e9");
        new mBox.Notice({
            type: "error",
            position: {"x": "center", "y": "top"},
            move: false,
            target: processor.routeSelectorArea,
            delayClose: 6000,
            content: flag
        });
    },
    notValidationOpinionMode: function(flag, processor){
        processor.inputTextarea.setStyle("background-color", "#ffe9e9");
        new mBox.Notice({
            type: "error",
            position: {"x": "center", "y": "top"},
            move: false,
            target: processor.inputTextarea,
            delayClose: 6000,
            content: flag
        });
    },


    //fireRtEvent: function(type, args, delay){
    //    type = removeOn(type);
    //    var events = this.$events[type];
    //    if (!events) return this;
    //    if (!events.length) return this;
    //    var event = events[events.length-1];
    //    args = Array.from(args);
    //    if (delay) fn.delay(delay, this, args);
    //    else return fn.apply(this, args);
    //    return this;
    //},
    submitWork: function(routeName, opinion, callback, processor){
        if (!this.businessData.control["allowProcessing"]){
            MWF.xDesktop.notice("error", {x: "right", y:"top"}, "Permission Denied");
            this.app.content.unmask();
            processor.node.unmask();
            return false;
        }
        if (!this.formValidation(routeName, opinion)){
            this.app.content.unmask();
            //this.app.notice("", "error", target, where, offset);
            if (callback) callback();
            return false;
        }
        if (!this.validation(routeName, opinion, processor)){
            //this.app.content.unmask();
            processor.node.unmask();
            return false;
        }
        if (!opinion) opinion = routeName;
        this.fireEvent("beforeProcess");

        MWF.require("MWF.widget.Mask", function(){
            this.mask = new MWF.widget.Mask({"style": "desktop", "zIndex": 50000});
            this.mask.loadNode(this.app.content);

            this.fireEvent("beforeSave");
            this.workAction.saveData(function(json){
                this.businessData.task.routeName = routeName;
                this.businessData.task.opinion = opinion;

                this.fireEvent("afterSave");

                this.workAction.processTask(function(json){
                    //if (processor) processor.destroy();
                    //if (processNode) processNode.destroy();
                    if (callback) callback();
                    this.fireEvent("afterProcess");
                    //    this.notice(MWF.xApplication.process.Xform.LP.taskProcessed, "success");
                    this.addMessage(json.data);

                    if (this.app.taskObject) this.app.taskObject.destroy();

                    this.app.close();
                    //window.setTimeout(function(){this.app.close();}.bind(this), 2000);
                }.bind(this), null, this.businessData.task.id, this.businessData.task);
            }.bind(this), null, this.businessData.work.id, this.getData());

        }.bind(this));
    },
    processWork: function(){
        if (this.app.inBrowser){
            this.app.content.setStyle("height", document.body.getSize().y);
        }
        this.app.content.mask({
            "destroyOnHide": true,
            "style": this.app.css.maskNode
        });

        if (!this.formValidation("", "")){
            this.app.content.unmask();
        //    if (callback) callback();
            return false;
        }

        var processNode = this.createProcessNode();

        this.setProcessNode(processNode);

        this.showProcessNode(processNode);
    },
    createProcessNode: function(){
        var processNode = new Element("div", {"styles": this.app.css.processNode_from}).inject(this.app.content);
        processNode.position({
            relativeTo: this.app.content,
            position: "topcenter",
            edge: "topcenter"
        });
        return processNode;
    },

    setProcessNode: function(processNode){
        var _self = this;
        MWF.xDesktop.requireApp("process.Work", "Processor", function(){
            new MWF.xApplication.process.Work.Processor(processNode, this.businessData.task, {
                "onCancel": function(){
                    processNode.destroy();
                    _self.app.content.unmask();
                    delete this;
                },
                "onSubmit": function(routeName, opinion){
                    _self.submitWork(routeName, opinion, function(){
                        this.destroy();
                        processNode.destroy();
                        delete this;
                    }.bind(this), this);
                }
            })
        }.bind(this));
    },
    showProcessNode: function(processNode){
        var size = this.app.content.getSize();
        var nodeSize = processNode.getSize();

        var top = size.y/2-nodeSize.y/2-20;
        var left = size.x/2-nodeSize.x/2;
        if (top<0) top = 0;

        this.app.css.processNode.top = ""+top+"px";
        this.app.css.processNode.left = ""+left+"px";

        var morph = new Fx.Morph(processNode, {
            "duration": 300,
            "transition": Fx.Transitions.Expo.easeOut
        });
        morph.start(this.app.css.processNode);
    },


    confirm: function(type, e, title, text, width, height, ok, cancel, callback){
        MWF.require("MWF.xDesktop.Dialog", function(){
            var size = this.container.getSize();

            var x = parseFloat((Browser.name==="firefox") ? e.event.clientX : e.event.x);
            var y = parseFloat((Browser.name==="firefox") ? e.event.clientY : e.event.y);

            if (x+parseFloat(width)>size.x){
                x = x-parseFloat(width);
            }
            if (x<0) x = 20;
            var dlg = new MWF.xDesktop.Dialog({
                "title": title,
                "style": "o2",
                "top": y,
                "left": x-20,
                "fromTop":e.event.y,
                "fromLeft": (Browser.name==="firefox") ? e.event.clientX-20 : e.event.x-20,
                "width": width,
                "height": height,
                "text": text,
                "container": this.content,
                "buttonList": [
                    {
                        "text": MWF.LP.process.button.ok,
                        "action": ok
                    },
                    {
                        "text": MWF.LP.process.button.cancel,
                        "action": cancel
                    }
                ]
            });

            switch (type.toLowerCase()){
                case "success":
                    dlg.content.setStyle("background-image", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAB1hJREFUeNqsWGtsVEUUPnMf+y6rLcW2tDxUKARaikqgiWh8BlH8IwYkaozhh4nhB1FMTKkxQtQYQzRGE2JEfMRHYhQSVChgFYIGqLSUtoKUQmlp2b53u233de94zuzcZbfdbhdwkpPZmbl3zjffnHPuOcue/WgxZNnc3OT3cQ4rGIMlwNg8BjATGEwDDgHOeZdpQis3eKMR5Sd62kaO/PHp5QDub2ba9OtNTYnf2lQIcOO5igpr8eeT3kL9XneuCi6vAvYcFWxOBqrO6BlvZIx7w8PGwlG/uWZkwADNzo4//e7CfQMdYz/88t6F8/i+icB4Jl0sEzPIxEbsXiwotVd6C3TwTFezZRGCfQb4r0bhSnPo78io8dWP1ed24nRkPFNTMoMnnYNsbGYK2zR/pYsRGxJc1mDcuQqKHbwF2t3/Hh29a+3bC8oHOkM7UPk5UpGOpQQzFsINHyxahDaxdeYix/r8223AFLjpxpGL3rYIXDw5um+gc+ydwx9fqsPpKC0lP6eWr54hfjT+2gPP7Fg0R1HgreIyx/rpc2zxjfjNCzXXrSo4PMr8sWFecEuRo6mjMdBPdpQMJuWa6GoKF9jX55bo13UlE5jg8szobshyotG+RtT1OJrBAA43o/hRYhOYKVuVvxFtZPusCie7GUbQvcnmIBbh4noEoqR15zQV/N1GeXFZzvD5Y4P1ydclwJD7om1sn3uPs0S3x1++ESHlJgJB74FiXgkD4XZQLGr4NQtBh2DDvWa+3aOd7D4b7CGDFjcjr2dt3mxbpQNjB53sRsTA7YiN0IgBRWYlrJz2suhpTPO0bj1LegpKHWWFpZ6nUL0ngYOAUkBz34JAYjytEO1GJN5Pth4LmRAajkGxuQJWFb0CLpdL9DSmeVpPfp/0uXP1B2+b5y5A/cJbVLSVh9252uu5M/WM1BMYSLKBdFczS6mEx0peBbfbDU6nE1RVhdnOZdDj78AruyyvLP6+ZmMQDQMCYc3tp/xnKSAq9K2xuxmYBp8oeIJY2ITwSAxm8uWip7E43bj1ErYCHpsVB0KsOBwO0dOY5mdrlXhdSe+ikN6cPNtSeTsqgV2iOxRchFRBh4uGOSpCY8QTP5C/SfQ0pnkjmrq+es6WBBBN0wQrNpsNvF4vFBYWwgvL3ofFeY/EmZQ6SK/do5YiECeFGYW+vprGUu0AaY/iHYeDceqfmLtFKKGexjRP15K8ngxEUa6FbfpNwH5qfQua+w8lGCUhvbpDLZE2g8xgGkAhP4WRCJ3YhFk6KrozrignJ0f0NKb50LCRsp4OCJNu/X3LG3Cm92Dcm5LYJ71oO9MtMJrIRyguGzwRPelu5zoqYc28a4rodLqui2eexPk9/3DRTwXku6ZqaOo7KOw2bdqgMLf8EigaJUaxCHgT+yCY8hmPwrrFb4oNLbEUkGITj7iuoloozwTk28ZqONMzOZA4U3w07mLANMrQ0CO85GpWO+M7iKsMNlRsk2zxxP2TYo/HIwBZ43RAvmmohkZfzaRAqIlgGDH7rEChUaqIXrFQUVPfauiqEcifvWubUJAMiLwkLeUSyNenEMjVzECokTdGQman/FiaGuWs6DlrdNvENxs6DwCuw3PLtqcAygTkq5Nb4XT31EAEGIragVgrBTz6PmmUPBNdppH+hfrOGhEbnl8+OSALyJfHtwpGswFiXdNgV6jFAqPm3+7yOb36A5pdKaY906UF3f4LcNXfDhUlDyUUjwey+6+qOPAs0w8KH0NXI00nvu/aFQoaPnxtWKFyAhHui4Yw/0B20goyU3+5BnYfq0oASPYymqd1em7SPcYJ6fP7wn8OdYcp0RoRzFBiHPCFexRdqdR0VsRkzjpBiKGhC+BDhpbOfijBzOdHq+BU+4H4ic3sJIYRPtAbbWk+1Pv54JXQRdxmiExI+CTVNVROjI2YPGPeggrrLh2AXUeqBCvU09jk15f7kJ6+S6P7244PUT0VkDYTz/QoGf+ntr9h/srcIs2mLFVY5oyua7AVfIF2qGvbn5rFZSHESn9HaG/Nhxc/wxmylUErDxbMyBomQnVNcDC2Lyq9a1LB051o3T/hWzOV0L6D3eHalsN936K+PgkkYiWkyVWR+dsnl85RXRP0R3+OxbioEP4vof2GfOHac0f6v7h4cqhZghlNLldS6iZCiA/6qK7RnapLtSvlwCm43ES1QFdjco6s722q6d2NFcFp1NMjbSWWsdbGypIshj7POatfu+MlT55tnd2lljHOso1l18yIYYIeNFrIWGt3tv8o2SAZJu8h80iutRPMWE0aNFEXobqGygk0ar+iM5eqswIrqE0w3ASAeD8WjDX1d4ztIfet3+v7XRprL/0nQIxYtba8kan/hUDUikx8PJTFl96fdx/lrJQqUoZGiRHlI5QG0NeXPnr0raEQf7a2r04GtICU4FT/QmTDPJOGTqAcMnl2yrFNJkZWMIhJ7yAZk5E1JMfm+EI/naLraQRKlQBUKUoSGFNWh4YEZowv7jO1/wQYAIxJoZGb/Cz/AAAAAElFTkSuQmCC)");
                    break;
                case "error":
                    dlg.content.setStyle("background-image", "url(data:image/png;base64,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)");
                    break;
                case "info":
                    dlg.content.setStyle("background-image", "url(data:image/png;base64,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)");
                    break;
                case "warn":
                    dlg.content.setStyle("background-image", "url(data:image/png;base64,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)");
                    break;
                default:
            }
            dlg.show();
        }.bind(this));
    },
    notice: function(content, type, target, where){
        if (!where) where = {"x": "right", "y": "top"};
        if (!target) target = this.node;
        if (!type) type = "ok";
        var noticeTarget = target || layout.layout.contentNode;
        new mBox.Notice({
            type: type,
            position: where,
            move: false,
            target: noticeTarget,
            delayClose: (type==="error") ? 5000 : 1000,
            offset: {
                x: 10,
                y: where.y.toString().toLowerCase()==="bottom" ? 10 : 10
            },
            content: content
        });
    },

    resetWork: function(){
        if (!this.businessData.control["allowReset"]){
            MWF.xDesktop.notice("error", {x: "right", y:"top"}, "Permission Denied");
            return false;
        }
        MWF.require("MWF.xDesktop.Dialog", function(){
            var width = 680;
            var height = 300;
            var p = MWF.getCenterPosition(this.app.content, width, height);

            var _self = this;
            var dlg = new MWF.xDesktop.Dialog({
                "title": this.app.lp.reset,
                "style": "work",
                "top": p.y-100,
                "left": p.x,
                "fromTop": p.y-100,
                "fromLeft": p.x,
                "width": width,
                "height": height,
                "url": this.app.path+"reset.html",
                "container": this.app.content,
                "isClose": true,
                "onPostShow": function(){
                    $("resetWork_okButton").addEvent("click", function(){
                        _self.doResetWork(this);
                    }.bind(this));
                    $("resetWork_cancelButton").addEvent("click", function(){
                        this.close();
                    }.bind(this));

                    $("resetWork_selPeopleButton").addEvent("click", function(){
                        _self.selectPeople(this);
                    }.bind(this));
                }
            });
            dlg.show();
        }.bind(this));
    },
    selectPeople: function(dlg){
        var range = this.businessData.activity.resetRange || "department";
        var count = this.businessData.activity.resetCount || 0;

        switch (range){
            case "department":
                this.personActions.getDepartmentByIdentity(function(json){
                    this.selectPeopleDepartment(dlg, json.data, count);
                }.bind(this), null, this.businessData.task.identity);
                break;
            case "company":
                this.personActions.getCompanyByIdentity(function(json){
                    this.selectPeopleCompany(dlg, json.data, count)
                }.bind(this), null, this.businessData.task.identity);
                break;
            default:
                this.selectPeopleAll(dlg, count);
        }
    },
    selectPeopleDepartment: function(dlg, department, count){
        var names = dlg.identityList || [];
        var areaNode = $("resetWork_selPeopleArea");
        var options = {
            "names": names,
            "type": "identity",
            "count": count,
            "departments": (department) ? [department.name]: [],
            "title": this.app.lp.reset,
            "onComplete": function (items) {
                areaNode.empty();
                var identityList = [];
                items.each(function(item){
                    var explorer = {
                        "actions": this.personActions,
                        "app": {"lp": this.app.lp}
                    };
                    new MWF.widget.Identity(item.data, areaNode, explorer, false, null, {"style": "reset"});
                    identityList.push(item.data.name);
                }.bind(this));
                dlg.identityList = identityList;
            }.bind(this)
        };

        var selector = new MWF.OrgSelector(this.app.content, options);
    },
    selectPeopleCompany: function(dlg, company, count){
        var names = dlg.identityList || [];
        var areaNode = $("resetWork_selPeopleArea");
        var options = {
            "names": names,
            "type": "identity",
            "count": count,
            "companys": [company.name],
            "title": this.app.lp.reset,
            "onComplete": function (items) {
                areaNode.empty();
                var identityList = [];
                items.each(function(item){
                    var explorer = {
                        "actions": this.personActions,
                        "app": {"lp": this.app.lp}
                    };
                    new MWF.widget.Identity(item.data, areaNode, explorer, false, null, {"style": "reset"});
                    identityList.push(item.data.name);
                }.bind(this));
                dlg.identityList = identityList;
            }.bind(this)
        };

        var selector = new MWF.Selector(this.app.content, options);
    },
    selectPeopleAll: function(dlg, count){
        var names = dlg.identityList || [];
        var areaNode = $("resetWork_selPeopleArea");
        var options = {
            "names": names,
            "type": "identity",
            "count": count,
            "title": this.app.lp.reset,
            "onComplete": function (items) {
                areaNode.empty();
                var identityList = [];
                items.each(function(item){
                    var explorer = {
                        "actions": this.personActions,
                        "app": {"lp": this.app.lp}
                    };

                    new MWF.widget.Identity(item.data, areaNode, explorer, false, null, {"style": "reset"});
                    identityList.push(item.data.name);
                }.bind(this));
                dlg.identityList = identityList;
            }.bind(this)
        };

        var selector = new MWF.Selector(this.app.content, options);
    },


    doResetWork: function(dlg){
        var names = dlg.identityList || [];
        if (!names.length){
            this.app.notice(MWF.xApplication.process.Xform.LP.inputResetPeople, "error", dlg.node);
            return false;
        }
        var opinion = $("resetWork_opinion").get("value");
        if (!opinion){
            opinion = MWF.xApplication.process.Xform.LP.resetTo+": "+names.join(", ");
        }

        MWF.require("MWF.widget.Mask", function(){
            this.mask = new MWF.widget.Mask({"style": "desktop", "zIndex": 50000});
            this.mask.loadNode(this.app.content);

            this.fireEvent("beforeReset");

            this.resetWorkToPeson(names, opinion, function(){
                this.workAction.getJobByWork(function(workJson){
                    this.fireEvent("afterReset");
                    this.addResetMessage(workJson.data);
                    this.app.notice(MWF.xApplication.process.Xform.LP.resetOk+": "+names.join(", "), "success");
                    this.app.close();
                }.bind(this), null, this.businessData.work.id);
                dlg.close();
                if (this.mask) {this.mask.hide(); this.mask = null;}
            }.bind(this), function(xhr, text, error){
                var errorText = error+":"+text;
                if (xhr) errorText = xhr.responseText;
                this.app.notice("request json error: "+errorText, "error", dlg.node);
                if (this.mask) {this.mask.hide(); this.mask = null;}
            }.bind(this));
        }.bind(this));

        //var data = {
        //    "opinion": opinion,
        //    "routeName": MWF.xApplication.process.Xform.LP.reset,
        //    "identityList": names
        //}
        //
        //this.workAction.resetWork(function(json){
        //
        //}.bind(this), null, this.businessData.task.id, data);
    },
    resetWorkToPeson: function(identityList, opinion, success, failure){
        var data = {
            "opinion": opinion,
            "routeName": MWF.xApplication.process.Xform.LP.reset,
            "identityList": identityList
        };

        this.workAction.saveData(
            function(json){
                this.workAction.resetWork(
                    function(json){
                        if (success) success();
                    }.bind(this),
                    function(xhr, text, error){
                        if (failure) failure(xhr, text, error);
                    },
                    this.businessData.task.id, data
                );
            }.bind(this),
            function(xhr, text, error){
                if (failure) failure(xhr, text, error);
            },
            this.businessData.work.id, this.getData()
        );


    },

    addResetMessage: function(data){
        var users = [];
        data.taskList.each(function(task){
            users.push(task.person+"("+task.department+")");
        }.bind(this));
        var content = "<div><b>"+MWF.xApplication.process.Xform.LP.currentActivity+"<font style=\"color: #ea621f\">"+data.work.activityName+"</font>, "+MWF.xApplication.process.Xform.LP.nextUser+"<font style=\"color: #ea621f\">"+users.join(", ")+"</font></b></div>"

        var msg = {
            "subject": MWF.xApplication.process.Xform.LP.workReset,
            "content": "<div>"+MWF.xApplication.process.Xform.LP.resetWorkInfor+"“"+this.businessData.work.title+"”</div>"+content
        };
        layout.desktop.message.addTooltip(msg);
        return layout.desktop.message.addMessage(msg);
    },

    retractWork: function(e, ev){
        var _self = this;
        var p = MWF.getCenterPosition(this.app.content, 300, 150);
        var event = {
            "event":{
                "x": p.x,
                "y": p.y-200,
                "clientX": p.x,
                "clientY": p.y-200
            }
        };
        this.app.confirm("infor", event, MWF.xApplication.process.Xform.LP.retractTitle, MWF.xApplication.process.Xform.LP.retractText, 300, 120, function(){
            _self.app.content.mask({
                "style": {
                    "background-color": "#999",
                    "opacity": 0.6
                }
            });

            MWF.require("MWF.widget.Mask", function(){
                _self.mask = new MWF.widget.Mask({"style": "desktop", "zIndex": 50000});
                _self.mask.loadNode(_self.app.content);

                _self.fireEvent("beforeRetract");

                _self.doRetractWork(function(){
                    _self.workAction.getJobByWork(function(workJson){
                        _self.fireEvent("afterRetract");
                        _self.app.notice(MWF.xApplication.process.Xform.LP.workRetract, "success");
                        _self.app.content.unmask();
                        _self.app.reload(workJson.data);
                    }, null, _self.businessData.work.id);
                    this.close();
                    if (_self.mask) {_self.mask.hide(); _self.mask = null;}
                }.bind(this));
            }.bind(this), function(xhr, text, error){
                var errorText = error+":"+text;
                if (xhr) errorText = xhr.responseText;
                _self.app.notice("request json error: "+errorText, "error", dlg.node);
                if (_self.mask) {_self.mask.hide(); _self.mask = null;}
            });

            //this.close();
        }, function(){
            this.close();
        });
    },
    doRetractWork: function(success, failure){
        if (this.businessData.control["allowRetract"]){
            this.workAction.retractWork(function(json){
                if (success) success();
            }.bind(this), function(xhr, text, error){
                if (failure) failure(xhr, text, error);
            }, this.businessData.work.id);
        }else{
            if (failure) failure(null, "Permission Denied", "");
        }
    },
    addRetractMessage: function(data){
        var users = [];
        data.taskList.each(function(task){
            users.push(task.person+"("+task.department+")");
        }.bind(this));
        var content = "<div><b>"+MWF.xApplication.process.Xform.LP.currentActivity+"<font style=\"color: #ea621f\">"+data.work.activityName+"</font>, "+MWF.xApplication.process.Xform.LP.nextUser+"<font style=\"color: #ea621f\">"+users.join(", ")+"</font></b></div>"

        var msg = {
            "subject": MWF.xApplication.process.Xform.LP.workRetract,
            "content": "<div>"+MWF.xApplication.process.Xform.LP.retractWorkInfor+"“"+this.businessData.work.title+"”</div>"+content
        };
        layout.desktop.message.addTooltip(msg);
        return layout.desktop.message.addMessage(msg);
    },

    rerouteWork: function(e, ev){
        if (!this.businessData.control["allowReroute"]){
            MWF.xDesktop.notice("error", {x: "right", y:"top"}, "Permission Denied");
            return false;
        }
        MWF.require("MWF.xDesktop.Dialog", function(){
            var width = 480;
            var height = 160;
            var p = MWF.getCenterPosition(this.app.content, width, height);

            var _self = this;
            var dlg = new MWF.xDesktop.Dialog({
                "title": this.app.lp.reroute,
                "style": "work",
                "top": p.y-100,
                "left": p.x,
                "fromTop": p.y-100,
                "fromLeft": p.x,
                "width": width,
                "height": height,
                "url": this.app.path+"reroute.html",
                "container": this.app.content,
                "isClose": true,
                "onPostShow": function(){
                    $("rerouteWork_okButton").addEvent("click", function(){
                        _self.doRerouteWork(this);
                    }.bind(this));
                    $("rerouteWork_cancelButton").addEvent("click", function(){
                        this.close();
                    }.bind(this));

                    var select = $("rerouteWork_selectActivity");
                    _self.workAction.getRerouteTo(_self.businessData.work.process, function(json){
                        json.data.agentList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#agent",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.cancelList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#cancel",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.choiceList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#choice",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.conditionList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#condition",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.delayList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#delay",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.embedList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#embed",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.endList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#end",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.invokeList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#invoke",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.manualList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#manual",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.mergeList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#merge",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.messageList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#message",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.parallelList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#parallel",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.serviceList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#service",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));

                        json.data.splitList.each(function(activity){
                            new Element("option", {
                                "value": activity.id+"#split",
                                "text": activity.name
                            }).inject(select);
                        }.bind(_self));
                    }.bind(_self));
                }
            });
            dlg.show();
        }.bind(this));
    },
    doRerouteWork: function(dlg){
        var opinion = $("rerouteWork_opinion").get("value");
        var select = $("rerouteWork_selectActivity");
        var activity = select.options[select.selectedIndex].get("value");
        var activityName = select.options[select.selectedIndex].get("text");
        var tmp = activity.split("#");
        activity = tmp[0];
        var type = tmp[1];

        MWF.require("MWF.widget.Mask", function(){
            this.mask = new MWF.widget.Mask({"style": "desktop", "zIndex": 50000});
            this.mask.loadNode(this.app.content);

            this.fireEvent("beforeReroute");

            this.rerouteWorkToActivity(activity, type, opinion, function(){
                this.workAction.getJobByWork(function(workJson){
                    this.fireEvent("afterReroute");
                    this.addRerouteMessage(workJson.data);
                    this.app.notice(MWF.xApplication.process.Xform.LP.rerouteOk+": "+activityName, "success");
                    this.app.close();
                }.bind(this), null, this.businessData.work.id);
                dlg.close();
                if (this.mask) {this.mask.hide(); this.mask = null;}
            }.bind(this), function(xhr, text, error){
                var errorText = error+":"+text;
                if (xhr) errorText = xhr.responseText;
                this.app.notice("request json error: "+errorText, "error", dlg.node);
                if (this.mask) {this.mask.hide(); this.mask = null;}
            }.bind(this));
        }.bind(this));
    },
    rerouteWorkToActivity: function(activity, type, opinion, success, failure){
        if (this.businessData.task){
            this.workAction.saveData(function(json){
                this.workAction.rerouteWork(function(json){
                    if (success) success();
                }.bind(this), function(xhr, text, error){
                    if (failure) failure(xhr, text, error);
                }, this.businessData.work.id, activity, type);
            }.bind(this), function(xhr, text, error){
                if (failure) failure(xhr, text, error);
            }, this.businessData.work.id, this.getData());
        }else{
            this.workAction.rerouteWork(function(json){
                if (success) success();
            }.bind(this), function(xhr, text, error){
                if (failure) failure(xhr, text, error);
            }, this.businessData.work.id, activity, type);
        }
    },
    addRerouteMessage: function(data){
        var users = [];
        data.taskList.each(function(task){
            users.push(task.person+"("+task.department+")");
        }.bind(this));
        var content = "<div><b>"+MWF.xApplication.process.Xform.LP.currentActivity+"<font style=\"color: #ea621f\">"+data.work.activityName+"</font>, "+MWF.xApplication.process.Xform.LP.nextUser+"<font style=\"color: #ea621f\">"+users.join(", ")+"</font></b></div>"

        var msg = {
            "subject": MWF.xApplication.process.Xform.LP.workReroute,
            "content": "<div>"+MWF.xApplication.process.Xform.LP.rerouteWorkInfor+"“"+this.businessData.work.title+"”</div>"+content
        };
        layout.desktop.message.addTooltip(msg);
        return layout.desktop.message.addMessage(msg);
    },

    deleteWork: function(){
        var _self = this;
        var p = MWF.getCenterPosition(this.app.content, 380, 150);
        var event = {
            "event":{
                "x": p.x,
                "y": p.y-200,
                "clientX": p.x,
                "clientY": p.y-200
            }
        };
        this.app.confirm("infor", event, MWF.xApplication.process.Xform.LP.deleteWorkTitle, MWF.xApplication.process.Xform.LP.deleteWorkText, 380, 120, function(){
            //_self.app.content.mask({
            //    "style": {
            //        "background-color": "#999",
            //        "opacity": 0.6
            //    }
            //});


            MWF.require("MWF.widget.Mask", function(){
                _self.mask = new MWF.widget.Mask({"style": "desktop", "zIndex": 50000});
                _self.mask.loadNode(_self.app.content);

                _self.fireEvent("beforeDelete");

                _self.doDeleteWork(function(){
                    _self.app.notice(MWF.xApplication.process.Xform.LP.workDelete+": “"+_self.businessData.work.title+"”", "success");
                    _self.app.close();
                    this.close();
                    if (_self.mask) {_self.mask.hide(); _self.mask = null;}
                }.bind(this),function(xhr, text, error){
                    var errorText = error+":"+text;
                    if (xhr) errorText = xhr.responseText;
                    _self.app.notice("request json error: "+errorText, "error", dlg.node);
                    if (_self.mask) {_self.mask.hide(); _self.mask = null;}
                }.bind(this));
            }.bind(this));



            //_self.workAction.deleteWork(function(json){
            //    _self.app.notice(MWF.xApplication.process.Xform.LP.workDelete+": “"+_self.businessData.work.title+"”", "success");
            //    _self.app.close();
            //    this.close();
            //}.bind(this), null, _self.businessData.work.id);
            //this.close();
        }, function(){
            this.close();
        });
    },
    doDeleteWork: function(success, failure){
        if (this.businessData.control["allowDelete"]){
            this.workAction.deleteWork(function(json){
                if (success) success();
            }.bind(this), function(xhr, text, error){
                if (failure) failure(xhr, text, error);
            }, this.businessData.work.id);
        }else{
            if (failure) failure(null, "Permission Denied", "");
        }
    },

    //printWork: function(){
    //    var form = this.json.id;
    //    if (this.json.printForm){
    //        form = this.json.printForm;
    //    }
    //    window.open("/x_desktop/printWork.html?workid="+this.businessData.work.id+"&app="+this.businessData.work.application+"&form="+form);
    //},
    printWork: function(app, form){
        var application = app || (this.businessData.work) ? this.businessData.work.application : this.businessData.workCompleted.application;
        var form = form;
        if (!form){
            form = this.json.id;
            if (this.json.printForm) form = this.json.printForm;
        }
        if (this.businessData.workCompleted){
            var application = app || this.businessData.workCompleted.application;
            window.open("/x_desktop/printWork.html?workCompletedId="+this.businessData.workCompleted.id+"&app="+application+"&form="+form);
        }else{
            var application = app || this.businessData.work.application;
            window.open("/x_desktop/printWork.html?workid="+this.businessData.work.id+"&app="+application+"&form="+form);
        }

    },
    openWindow: function(form, app){
        //var application = app || (this.businessData.work) ? this.businessData.work.application : this.businessData.workCompleted.application;
        var form = form;
        if (!form){
            form = this.json.id;
            //if (this.json.printForm) form = this.json.printForm;
        }
        if (this.businessData.workCompleted){
            var application = app || this.businessData.workCompleted.application;
            window.open("/x_desktop/printWork.html?workCompletedId="+this.businessData.workCompleted.id+"&app="+application+"&form="+form);
        }else{
            var application = app || this.businessData.work.application;
            window.open("/x_desktop/printWork.html?workid="+this.businessData.work.id+"&app="+application+"&form="+form);
        }
        //window.open("/x_desktop/printWork.html?workid="+this.businessData.work.id+"&app="+this.businessData.work.application+"&form="+form);
    },

    uploadedAttachment: function(site, id){
        this.workAction.getAttachment(id, this.businessData.work.id, function(json){
            var att = this.all[site];
            if (att){
                if (json.data) att.attachmentController.addAttachment(json.data);
                att.attachmentController.checkActions();
                att.fireEvent("upload", [json.data]);
            }
        }.bind(this));
    },
    replacedAttachment: function(site, id){
        this.workAction.getAttachment(id, this.businessData.work.id, function(json){

            var att = this.all[site];
            if (att){
                var attachmentController = att.attachmentController;
                var attachment = null;
                for (var i=0; i<attachmentController.attachments.length; i++){
                    if (attachmentController.attachments[i].data.id===id){
                        attachment = attachmentController.attachments[i];
                        break;
                    }
                }
                attachment.data = json.data;
                attachment.reload();
                attachmentController.checkActions();
            }
        }.bind(this))
    }
	
});