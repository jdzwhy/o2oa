MWF.xApplication.Forum = MWF.xApplication.Forum || {};
MWF.xApplication.ForumSearch = MWF.xApplication.ForumSearch || {};
MWF.require("MWF.widget.Identity", null,false);
MWF.xDesktop.requireApp("Forum", "Actions.RestActions", null, false);
MWF.xDesktop.requireApp("Forum", "lp."+MWF.language, null, false);
MWF.xDesktop.requireApp("Template", "Explorer", null, false);
MWF.xDesktop.requireApp("Forum", "Access", null, false);
MWF.xDesktop.requireApp("Forum", "TopNode", null, false);
MWF.xApplication.ForumSearch.options = {
	multitask: true,
	executable: true
}
MWF.xApplication.ForumSearch.Main = new Class({
	Extends: MWF.xApplication.Common.Main,
	Implements: [Options, Events],

	options: {
		"style": "default",
		"name": "ForumSearch",
		"icon": "icon.png",
		"width": "1210",
		"height": "700",
		"isResize": false,
		"isMax": true,
		"title": MWF.xApplication.ForumSearch.LP.title,
		"searchContent" : ""
	},
	onQueryLoad: function(){
		this.lp = MWF.xApplication.Forum.LP;
	},
	loadApplication: function(callback){
		this.userName = layout.desktop.session.user.name;
		this.restActions = new MWF.xApplication.Forum.Actions.RestActions();

		this.path = "/x_component_ForumSearch/$Main/"+this.options.style+"/";
		this.createNode();
		this.loadApplicationContent();
	},
	reloadAllParents : function( sectionId ){
		this.restActions.getSection( sectionId, function( json ){
			var aid = "Forum";
			if (this.desktop.apps[aid]){
				this.desktop.apps[aid].reload();
			}

			aid = "ForumCategory"+json.data.forumId;
			if (this.desktop.apps[aid]){
				this.desktop.apps[aid].reload();
			}

			aid = "ForumSection"+sectionId;
			if (this.desktop.apps[aid]){
				this.desktop.apps[aid].reload();
			}
		}.bind(this) )
	},
	loadController: function(callback){
		this.access = new MWF.xApplication.Forum.Access( this.restActions, this.lp );
		if(callback)callback();
	},
	createNode: function(){
		this.content.setStyle("overflow", "hidden");
		this.node = new Element("div", {
			"styles": this.css.node
		}).inject(this.content);
	},
	loadApplicationContent: function(){
		if( !this.options.searchContent && this.status && this.status.searchContent ){
			this.options.searchContent = this.status.searchContent;
		}
		this.loadController(function(){
			this.access.login( function () {
				this.loadApplicationLayout();
			}.bind(this))
		}.bind(this))
	},
	loadApplicationLayout : function(){
		this.contentContainerNode = new Element("div.contentContainerNode", {
			"styles": this.css.contentContainerNode
		}).inject(this.node);

		this.createTopNode();
		this.createMiddleNode();
	},
	createTopNode: function(){
		var forumColor = this.lp.defaultForumColor;

		var topNode = this.topNode = new Element("div.topNode", {
			"styles": this.css.topNode
		}).inject(this.contentContainerNode);
		topNode.setStyle("border-bottom","1px solid "+forumColor);

		var topTitleLeftNode = new Element("div.topTitleLeftNode", {
			"styles": this.css.topTitleLeftNode
		}).inject(topNode);
		topTitleLeftNode.setStyle( "background-color" , forumColor )

		var topTitleMiddleNode = new Element("div.topTitleMiddleNode", {
			"styles": this.css.topTitleMiddleNode
		}).inject(topNode);
		topTitleMiddleNode.setStyle( "background-color" , forumColor )

		var topTitleRightNode = new Element("div.topTitleRightNode", {
			"styles": this.css.topTitleRightNode
		}).inject(topNode);
		topTitleRightNode.setStyle( "background-color" , forumColor )

		var topItemTitleNode = new Element("div.topItemTitleNode", {
			"styles": this.css.topItemTitleNode,
			"text": this.lp.title
		}).inject(topTitleMiddleNode);
		topItemTitleNode.addEvent("click", function(){
			var appId = "Forum";
			if (this.desktop.apps[appId]){
				this.desktop.apps[appId].setCurrent();
			}else {
				this.desktop.openApplication(null, "Forum", { "appId": appId });
			}

			if( !this.inBrowser ){
				this.close();
			}
			//this.close();
		}.bind(this))

		var topItemSepNode = new Element("div.topItemSepNode", {
			"styles": this.css.topItemSepNode
		}).inject(topTitleMiddleNode);


		var topItemTitleNode = new Element("div.topItemTitleNode", {
			"styles": this.css.topItemTitleNode,
			"text": this.lp.search
		}).inject(topTitleMiddleNode);

		this.searchDiv = new Element("div.searchDiv",{
			"styles" : this.css.searchDiv
		}).inject(this.topNode)
		this.searchInput = new Element("input.searchInput",{
			"styles" : this.css.searchInput,
			"value" : this.options.searchContent,
			"title" : this.lp.searchTitle
		}).inject(this.searchDiv)
		var _self = this;
		this.searchInput.addEvents({
			"focus": function(){
				if (this.value==_self.lp.searchKey) this.set("value", "");
			},
			"blur": function(){if (!this.value) this.set("value", _self.lp.searchKey);},
			"keydown": function(e){
				if (e.code==13){
					this.search();
					e.preventDefault();
				}
			}.bind(this)
		});

		this.searchAction = new Element("div.searchAction",{
			"styles" : this.css.searchAction
		}).inject(this.searchDiv);
		this.searchAction.addEvents({
			"click": function(){ this.search(); }.bind(this),
			"mouseover": function(e){
				this.searchAction.setStyles( this.css.searchAction_over2 );
				e.stopPropagation();
			}.bind(this),
			"mouseout": function(){ this.searchAction.setStyles( this.css.searchAction ) }.bind(this)
		});
		this.searchDiv.addEvents( {
			"mouseover" : function(){
				this.searchInput.setStyles( this.css.searchInput_over )
				this.searchAction.setStyles( this.css.searchAction_over )
			}.bind(this),
			"mouseout" : function(){
				this.searchInput.setStyles( this.css.searchInput )
				this.searchAction.setStyles( this.css.searchAction )
			}.bind(this)
		} )
	},
	search : function(){
		var val = this.searchInput.get("value");
		if( val == "" || val == this.lp.searchKey ){
			this.notice( this.lp.noSearchContentNotice, "error" );
			return;
		}
		this.options.searchContent = val;
		this.explorer.reloadView();
	},
	createMiddleNode: function(){
		this.middleNode = new Element("div.middleNode", {
			"styles": this.css.middleNode
		}).inject(this.contentContainerNode);

		this._createMiddleNode();

		this.addEvent("resize", function () {
			this.setContentSize();
		}.bind(this));
		this.setContentSize();

		//MWF.require("MWF.widget.ScrollBar", function () {
		//	new MWF.widget.ScrollBar(this.contentContainerNode, {
		//		"indent": false,
		//		"style": "xApp_TaskList",
		//		"where": "before",
		//		"distance": 30,
		//		"friction": 4,
		//		"axis": {"x": false, "y": true},
		//		"onScroll": function (y) {
		//		}
		//	});
		//}.bind(this));
	},
	_createMiddleNode : function(){
		this.contentDiv = new Element("div.contentDiv",{"styles":this.css.contentDiv}).inject(this.middleNode);
		if( this.contentDiv )this.contentDiv.empty();
		if( this.explorer ){
			this.explorer.destroy();
			delete this.explorer;
		}
		this.explorer = new MWF.xApplication.ForumSearch.Explorer(this.contentDiv, this, this,{
			style:this.options.style,
			viewPageNum : ( this.status && this.status.viewPageNum ) ? this.status.viewPageNum : 1
		});
		this.explorer.load();
	},
	setContentSize: function () {
		//var topSize = this.topNode ? this.topNode.getSize() : {"x": 0, "y": 0};
		var topSize = {"x": 0, "y": 0};
		var nodeSize = this.node.getSize();
		var pt = this.contentContainerNode.getStyle("padding-top").toFloat();
		var pb = this.contentContainerNode.getStyle("padding-bottom").toFloat();

		var height = nodeSize.y - topSize.y - pt - pb;
		this.contentContainerNode.setStyle("height", "" + height + "px");
	},
	recordStatus: function(){
		return {
			searchContent : this.options.searchContent,
			viewPageNum : this.explorer.view.getCurrentPageNum()
		};
	},
	getDateDiff: function (publishTime) {
		var dateTimeStamp = Date.parse(publishTime.replace(/-/gi, "/"));
		var minute = 1000 * 60;
		var hour = minute * 60;
		var day = hour * 24;
		var halfamonth = day * 15;
		var month = day * 30;
		var year = month * 12;
		var now = new Date().getTime();
		var diffValue = now - dateTimeStamp;
		if (diffValue < 0) {
			//若日期不符则弹出窗口告之
			//alert("结束日期不能小于开始日期！");
		}
		var yesterday = new Date().decrement('day', 1);
		var beforYesterday = new Date().decrement('day', 2);
		var yearC = diffValue / year;
		var monthC = diffValue / month;
		var weekC = diffValue / (7 * day);
		var dayC = diffValue / day;
		var hourC = diffValue / hour;
		var minC = diffValue / minute;
		if (yesterday.getFullYear() == dateTimeStamp.getFullYear() && yesterday.getMonth() == dateTimeStamp.getMonth() && yesterday.getDate() == dateTimeStamp.getDate()) {
			result = "昨天 " + dateTimeStamp.getHours() + ":" + dateTimeStamp.getMinutes();
		} else if (beforYesterday.getFullYear() == dateTimeStamp.getFullYear() && beforYesterday.getMonth() == dateTimeStamp.getMonth() && beforYesterday.getDate() == dateTimeStamp.getDate()) {
			result = "前天 " + dateTimeStamp.getHours() + ":" + dateTimeStamp.getMinutes();
		} else if (yearC > 1) {
			result = dateTimeStamp.getFullYear() + "年" + (dateTimeStamp.getMonth() + 1) + "月" + dateTimeStamp.getDate() + "日";
		} else if (monthC >= 1) {
			//result= parseInt(monthC) + "个月前";
			// s.getFullYear()+"年";
			result = (dateTimeStamp.getMonth() + 1) + "月" + dateTimeStamp.getDate() + "日";
		} else if (weekC >= 1) {
			result = parseInt(weekC) + "周前";
		} else if (dayC >= 1) {
			result = parseInt(dayC) + "天前";
		} else if (hourC >= 1) {
			result = parseInt(hourC) + "小时前";
		} else if (minC >= 1) {
			result = parseInt(minC) + "分钟前";
		} else
			result = "刚刚发表";
		return result;
	},
	openPerson : function( userName ){
		if( !userName || userName == "" ){
		}else{
			var appId = "ForumPerson"+userName;
			if (this.desktop.apps[userName]){
				this.desktop.apps[userName].setCurrent();
			}else {
				this.desktop.openApplication(null, "ForumPerson", {
					"personName" : userName,
					"appId": appId
				});
			}
		}
	},
	createPersonNode : function( container, personName ){
		var persons = personName.split(",");
		persons.each( function(userName, i){
			var span = new Element("span", {
				"text" : userName,
				"styles" : this.css.person
			}).inject(container);
			span.addEvents( {
				mouseover : function(){ this.node.setStyles( this.obj.css.person_over )}.bind( {node:span, obj:this} ),
				mouseout : function(){ this.node.setStyles( this.obj.css.person )}.bind( {node:span, obj:this} ),
				click : function(){ this.obj.openPerson( this.userName ) }.bind( {userName:userName, obj:this} )
			})
			if( i != persons.length - 1 ){
				new Element("span", {
					"text" : ",",
				}).inject(container);
			}
		}.bind(this))
	}
});


MWF.xApplication.ForumSearch.Explorer = new Class({
	Extends: MWF.widget.Common,
	Implements: [Options, Events],
	options: {
		"style": "default",
		"viewPageNum" : 1
	},
	initialize: function (container, app, parent, options) {
		this.setOptions( options );
		this.container = container;
		this.parent = parent;
		this.app = app;
		this.css = this.parent.css;
		this.lp = this.app.lp;
	},
	load: function () {
		this.container.empty();

		this.loadToolbar();

		this.viewContainer = Element("div",{
			"styles" : this.css.viewContainer
		}).inject(this.container);

		this.loadToolbar();

		this.loadView();
	},
	destroy : function(){
		if(this.resizeWindowFun)this.app.removeEvent("resize",this.resizeWindowFun)
		this.view.destroy();
	},
	loadToolbar: function(){
		var toolbar = new Element("div",{
			styles : this.css.toolbar
		}).inject(this.container)
		if( this.toolbarTop ){
			this.toolbarBottom = toolbar;
		}else{
			this.toolbarTop = toolbar;
		}

		var fileterNode = new Element("div",{
			styles : this.css.fileterNode
		}).inject(toolbar);

		var pagingBar = new Element("div",{
			styles : this.css.fileterNode
		}).inject(toolbar);
		if( this.pagingBarTop ){
			this.pagingBarBottom = pagingBar;
		}else{
			this.pagingBarTop = pagingBar;
		}
	},
	reloadView : function(){
		//this.view.filterData = { searchContent : this.app.options.searchContent };
		//this.view.reload();
		this.view.destroy();
		this.loadView();
	},
	loadView : function(){

		//this.resizeWindow();
		//this.resizeWindowFun = this.resizeWindow.bind(this)
		//this.app.addEvent("resize", this.resizeWindowFun );

		this.view = new MWF.xApplication.ForumSearch.View( this.viewContainer, this.app, this, {
			templateUrl : this.parent.path+"listItem.json",
			pagingEnable : true,
			pagingPar : {
				currentPage : this.options.viewPageNum,
				countPerPage : 30,
				onPostLoad : function( pagingBar ){
					if(pagingBar.nextPageNode){
						pagingBar.nextPageNode.inject( this.toolbarBottom, "before" );
					}
				}.bind(this),
				onPageReturn : function( pagingBar ){
					var appId = "Forum";
					if (this.app.desktop.apps[appId]){
						this.app.desktop.apps[appId].setCurrent();
					}else {
						this.app.desktop.openApplication(null, "Forum", { "appId": appId });
					}
					this.app.close();
				}.bind(this)
			}
		} )
		this.view.filterData = { searchContent : this.app.options.searchContent };
		this.view.pagingContainerTop = this.pagingBarTop;
		this.view.pagingContainerBottom = this.pagingBarBottom;
		this.view.load();
	},
	resizeWindow: function(){
		var size = this.app.content.getSize();
		this.viewContainer.setStyles({"height":(size.y-121)+"px"});
	},
	createSubject: function(){
		var _self = this;
		var appId = "ForumDocument";
		if (_self.app.desktop.apps[appId]){
			_self.app.desktop.apps[appId].setCurrent();
		}else {
			this.app.desktop.openApplication(null, "ForumDocument", {
				"sectionId": this.app.sectionData.id,
				"appId": appId,
				"isNew" : true,
				"isEdited" : true,
				"onPostPublish" : function(){
					this.view.reload();
				}.bind(this)
			});
		}
	},
	openPerson : function( userName ){
		var appId = "ForumPerson"+userName;
		if (this.desktop.apps[userName]){
			this.desktop.apps[userName].setCurrent();
		}else {
			this.desktop.openApplication(null, "ForumPerson", {
				"personName" : userName,
				"appId": appId
			});
		}
	},
	createPersonNode : function( container, personName ){
		var persons = personName.split(",");
		persons.each( function(userName, i){
			var span = new Element("span", {
				"text" : userName,
				"styles" : this.css.person
			}).inject(container);
			span.addEvents( {
				mouseover : function(){ this.node.setStyles( this.obj.css.person_over )}.bind( {node:span, obj:this} ),
				mouseout : function(){ this.node.setStyles( this.obj.css.person )}.bind( {node:span, obj:this} ),
				click : function(){ this.obj.openPerson( this.userName ) }.bind( {userName:userName, obj:this} )
			})
			if( i != persons.length - 1 ){
				new Element("span", {
					"text" : ",",
				}).inject(container);
			}
		}.bind(this))
	}
})

MWF.xApplication.ForumSearch.View = new Class({
	Extends: MWF.xApplication.Template.Explorer.ComplexView,
	_createDocument: function(data, index){
		return new MWF.xApplication.ForumSearch.Document(this.viewNode, data, this.explorer, this, null,  index);
	},
	_getCurrentPageData: function(callback, count, pageNum){
		this.clearBody();
		if(!count)count=30;
		if(!pageNum)pageNum = 1;
		var filter = this.filterData || {};
		this.actions.listSubjectSearchPage( pageNum, count, filter, function(json){
			if( !json.data )json.data = [];
			if( !json.count )json.count=0;
			if( callback )callback(json);
		}.bind(this))
	},
	_removeDocument: function(documentData, all){
		this.actions.deleteSubject(documentData.id, function(json){
			this.reload();
			this.app.reloadAllParents( documentData.sectionId );
			this.app.notice(this.app.lp.deleteDocumentOK, "success");
		}.bind(this));
	},
	_create: function(){

	},
	_openDocument: function( documentData,index ){
		var appId = "ForumDocument"+documentData.id;
		if (this.app.desktop.apps[appId]){
			this.app.desktop.apps[appId].setCurrent();
		}else {
			this.app.desktop.openApplication(null, "ForumDocument", {
				"sectionId" : documentData.sectionId,
				"id" : documentData.id,
				"appId": appId,
				"isEdited" : false,
				"isNew" : false,
				"index" : index
			});
		}
	},
	_queryCreateViewNode: function(){
	},
	_postCreateViewNode: function( viewNode ){
	},
	_queryCreateViewHead:function(){
	},
	_postCreateViewHead: function( headNode ){
	}

})

MWF.xApplication.ForumSearch.Document = new Class({
	Extends: MWF.xApplication.Template.Explorer.ComplexDocument,
	_queryCreateDocumentNode:function( itemData ){
	},
	_postCreateDocumentNode: function( itemNode, itemData ){
	},
	open: function (e) {
		this.view._openDocument(this.data, this.index);
	},
	edit : function(){
		var appId = "ForumDocument"+this.data.id;
		if (this.app.desktop.apps[appId]){
			this.app.desktop.apps[appId].setCurrent();
		}else {
			this.app.desktop.openApplication(null, "ForumDocument", {
				"sectionId" : this.data.sectionId,
				"id" : this.data.id,
				"appId": appId,
				"isEdited" : true,
				"isNew" : false,
				"index" : this.index
			});
		}
	},
	openSection : function( ev ){
		var data = this.data;
		var appId = "ForumSection"+ data.sectionId;
		if (this.app.desktop.apps[appId]){
			this.app.desktop.apps[appId].setCurrent();
		}else {
			this.app.desktop.openApplication(ev, "ForumSection", {
				"sectionId": data.sectionId,
				"appId": appId
			});
		}
		ev.stopPropagation();
	},
	isAdmin: function(){
		return this.app.access.isAdmin();
	}
})