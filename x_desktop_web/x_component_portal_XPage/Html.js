MWF.xDesktop.requireApp("process.Xform", "$Module", null, false);
MWF.xApplication.process.Xform.Html = MWF.APPHtml =  new Class({
	Extends: MWF.APP$Module,

	load: function(){
		this.node.appendHTML(this.json.text, "after");
		this.node.destory();
	}
});