define("cssanimation",[cssrule],function(o){function t(t){this.name=t,this.from=new o("from"),this.to=new o("to")}return t.prototype.name="",t.prototype.from=null,t.prototype.to=null,t.prototype.toString=function(){var o="@keyframes "+this.name+" {\n@from\n@to\n}",t=this.from.toString(),n=this.to.toString();t=t.replace(".from","from"),n=n.replace(".to","to"),o=o.replace("@from",t),o=o.replace("@to",n);var e="@-webkit-keyframes "+this.name+" {\n@from\n@to\n}";return e=e.replace("@from",t),e=e.replace("@to",n),o+"\n"+e},t}),requirejs(["cssanimation"],function(o){console.log(o)}),define("main",function(){});
