"use strict";var Aria2=window.Aria2,data={host:"localhost",port:6800,secure:!1,secret:"",path:"/jsonrpc"},aria2=new Aria2(data),app=new Vue({el:"#app",data:{message:"Hello",acitveDownloads:[],pausedDownloads:[]},mounted:function a(){var e=this;aria2.getVersion().then(function(a){e.message=a},function(a){e.message=a})},methods:{openAddDialog:function a(){}}});