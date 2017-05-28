"use strict";var Aria2=void 0===window.Aria2?require("aria2"):window.Aria2,data={host:"localhost",port:6800,secure:!1,secret:"",path:"/jsonrpc"},aria2=new Aria2(data);aria2.onopen=function(){console.log("aria2 open")},aria2.open();var store=new Vuex.Store({state:{currentTab:"All"},mutations:{setCurrentTab:function t(e,n){e.currentTab=n}}});Vue.component("task",{template:"#task-template",props:["data"],computed:{percentFinished:function t(){var e=(this.data.completedLength/this.data.totalLength*100).toFixed(2);return e=parseFloat(e),e!=e?0:e},finishedSize:function t(){return this.convertToFileSize(this.data.completedLength)},totalSize:function t(){return this.convertToFileSize(this.data.totalLength)},downloadSpeed:function t(){return this.convertToFileSize(this.data.downloadSpeed)+"/s"},status:function t(){return this.data.status[0].toUpperCase()+this.data.status.substr(1)},timeRemaining:function t(){var e=this.data.totalLength-this.data.completedLength,n=e/this.data.downloadSpeed;return n!=n||n===1/0?1/0:this.convertToTime(math.round(n))}},methods:{convertToFileSize:function t(e){return e<1024?e+"B":e<1048576?parseFloat((e/1024).toFixed(2))+"KB":e<1073741824?parseFloat((e/1048576).toFixed(2))+"MB":e<1099511627776?parseFloat((e/1073741824).toFixed(2))+"GB":parseFloat((e/1099511627776).toFixed(2))+"TB"},convertToTime:function t(e){return e<60?e+"s":e<3600?math.round(e/60)+"min":e<216e3?math.round(e/3600)+"h":math.round(e/86400)+"d"},selectTask:function t(e){var n=e.currentTarget;n.classList.contains("is-selected")?n.classList.remove("is-selected"):n.classList.add("is-selected")},showInfo:function t(e){var n=e.currentTarget.parentElement.parentElement.nextElementSibling;n.classList.contains("is-shown")?n.classList.remove("is-shown"):n.classList.add("is-shown")}}}),Vue.component("simple-tabs",{template:"#simple-tabs-template",methods:{selectTab:function t(e){this.$children.forEach(function(t){t.name!==e.name?t.isActive=!1:t.isActive=!0})}}}),Vue.component("simple-tab",{template:"#simple-tab-template",props:{name:{required:!0},selected:{default:!1}},data:function t(){return{isActive:!1}},mounted:function t(){this.isActive=this.selected}}),Vue.component("tabs",{template:"#tabs-template",data:function t(){return{tabs:[]}},created:function t(){this.tabs=this.$children},methods:{selectTab:function t(e){this.tabs.forEach(function(t){t.isActive=t.name===e.name}),store.commit("setCurrentTab",e.name)}}}),Vue.component("tab",{template:"#tab-template",props:{name:{required:!0},selected:{default:!1},icon:{required:!0}},data:function t(){return{isActive:!1}},mounted:function t(){this.isActive=this.selected}});var app=new Vue({el:"#app",data:{message:"",url:"",active:[],waiting:[],paused:[],stopped:[],complete:[],error:[]},computed:{all:function t(){return this.active.concat(this.waiting.concat(this.paused.concat(this.complete.concat(this.error))))},currentTab:function t(){return store.state.currentTab}},mounted:function t(){var e=this;aria2.getVersion().then(function(t){e.printString(JSON.stringify(t))},function(t){e.printString(JSON.stringify(t))}),setInterval(function(){e.updateView()},500)},methods:{openAddDialog:function t(){document.getElementById("addDialog").classList.add("is-active")},closeAddDialog:function t(){document.getElementById("addDialog").classList.remove("is-active")},addLink:function t(e){var n=this;aria2.addUri([e]).then(function(t){n.printString(JSON.stringify(t))},function(t){n.printString(JSON.stringify(t))}),n.url="",n.updateView(),n.clearSelected()},printString:function t(e){console.log(e)},updateView:function t(){var e=this;setTimeout(function(){aria2.tellWaiting(0,1e3).then(function(t){e.appendFileName(t);for(var n=[],i=[],a=0;a<t.length;++a)"paused"===t[a].status?n.push(t[a]):i.push(t[a]);e.waiting=i,e.paused=n},function(t){e.printString(JSON.stringify(t))}),aria2.tellActive([0,1e3]).then(function(t){e.active=t,e.appendFileName(e.active)},function(t){e.printString(JSON.stringify(t))}),aria2.tellStopped(0,1e3).then(function(t){e.appendFileName(t);for(var n=[],i=[],a=0;a<t.length;++a)"complete"===t[a].status?n.push(t[a]):i.push(t[a]);e.complete=n,e.error=i},function(t){e.printString(JSON.stringify(t))})},100)},deleteTasks:function t(){for(var e=this,n=document.getElementsByClassName("task"),i=0;i<n.length;++i)if(n[i].classList.contains("is-selected")){var a=e.all[i].status;"active"===a||"waiting"===a||"paused"===a?e.deleteActiveTask(i):e.deleteCompletedTask(i)}e.updateView(),e.clearSelected()},clearSelected:function t(){for(var e=document.getElementsByClassName("is-selected");0!=e.length;)e[0].classList.remove("is-selected")},deleteActiveTask:function t(e){var n=this;aria2.remove(n.all[e].gid).then(function(t){n.printString("Successfully deleted "+JSON.stringify(t))},function(t){n.printString(JSON.stringify(t))}),n.deleteCompletedTask(e)},deleteCompletedTask:function t(e){var n=this;aria2.removeDownloadResult(n.all[e].gid).then(function(t){n.printString("Successfully deleted "+JSON.stringify(t))},function(t){n.printString(JSON.stringify(t))})},pauseTasks:function t(){for(var e=this,n=document.getElementsByClassName("task"),i=0;i<n.length;++i)n[i].classList.contains("is-selected")&&aria2.pause(e.all[i].gid).then(function(t){e.printString("Successfully paused "+JSON.stringify(t))},function(t){e.printString(JSON.stringify(t))});e.updateView(),e.clearSelected()},pauseAllTasks:function t(){var e=this;aria2.pauseAll().then(function(t){e.printString("Paused all "+JSON.stringify(t))},function(t){e.printString(JSON.stringify(t))}),e.clearSelected(),setTimeout(function(){e.updateView()},1e3)},resumeTasks:function t(){for(var e=this,n=document.getElementsByClassName("task"),i=0;i<n.length;++i)n[i].classList.contains("is-selected")&&aria2.unpause(e.all[i].gid).then(function(t){e.printString("Successfully resumed "+JSON.stringify(t))},function(t){e.printString(JSON.stringify(t))});e.updateView(),e.clearSelected()},resumeAllTasks:function t(){var e=this;aria2.unpauseAll().then(function(t){e.printString("Resumed all "+JSON.stringify(t))},function(t){e.printString(JSON.stringify(t))}),e.updateView(),e.clearSelected()},appendFileName:function t(e){for(var n=0;n<e.length;++n)""===e[n].files[0].path?e[n].taskName=e[n].files[0].uris[0].uri:e[n].taskName=this.getFileNameFromPath(e[n].files[0].path)},getFileNameFromPath:function t(e){return e.replace(/^.*[\\\/]/,"")},fileChange:function t(e){for(var n=this,i=e.target.files,a=function t(e){var a=new FileReader;a.onload=function(){var t=window.btoa(a.result);console.log(t),aria2.addTorrent(t).then(function(t){n.printString("Added Torrent "+JSON.stringify(t))},function(t){n.printString(JSON.stringify(t))}),n.updateView()},a.readAsBinaryString(i[e])},s=0;s<i.length;++s)a(s)}}});