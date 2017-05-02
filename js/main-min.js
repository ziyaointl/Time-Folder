"use strict";var Aria2=window.Aria2,data={host:"localhost",port:6800,secure:!1,secret:"",path:"/jsonrpc"},aria2=new Aria2(data),store=new Vuex.Store({state:{currentTab:"All"},mutations:{setCurrentTab:function t(e,i){e.currentTab=i}}});Vue.component("task",{template:"#task-template",props:["data","index"]}),Vue.component("tabs",{template:"#tabs-template",data:function t(){return{tabs:[]}},created:function t(){this.tabs=this.$children},methods:{selectTab:function t(e){this.tabs.forEach(function(t){t.isActive=t.name===e.name}),store.commit("setCurrentTab",e.name)}}}),Vue.component("tab",{template:"#tab-template",props:{name:{required:!0},selected:{default:!1}},data:function t(){return{isActive:!1}},mounted:function t(){this.isActive=this.selected}});var app=new Vue({el:"#app",data:{message:"",url:"",active:[],waiting:[],stopped:[]},computed:{all:function t(){return this.active.concat(this.waiting.concat(this.stopped))},currentTab:function t(){return store.state.currentTab}},mounted:function t(){var e=this;aria2.getVersion().then(function(t){e.printString(JSON.stringify(t))},function(t){e.printString(JSON.stringify(t))}),this.updateView()},methods:{openAddDialog:function t(){document.getElementById("addDialog").classList.add("is-active")},closeAddDialog:function t(){document.getElementById("addDialog").classList.remove("is-active")},addLink:function t(e){var i=this;aria2.addUri([e]).then(function(t){i.printString(JSON.stringify(t))},function(t){i.printString(JSON.stringify(t))}),i.url="",i.updateView()},printString:function t(e){this.message+="<br>"+e},updateView:function t(){var e=this;setTimeout(function(){aria2.tellWaiting(0,1e3).then(function(t){e.waiting=t},function(t){e.printString(JSON.stringify(t))}),aria2.tellActive([0,1e3]).then(function(t){e.active=t},function(t){e.printString(JSON.stringify(t))}),aria2.tellStopped(0,1e3).then(function(t){e.stopped=t},function(t){e.printString(JSON.stringify(t))})},100),e.clearSelected()},selectTask:function t(e){var i=e.currentTarget;i.classList.contains("is-selected")?i.classList.remove("is-selected"):i.classList.add("is-selected")},deleteTasks:function t(){for(var e=this,i=document.getElementsByClassName("task"),n=0;n<i.length;++n)if(i[n].classList.contains("is-selected")){var s=e.all[n].status;"active"===s||"waiting"===s||"paused"===s?e.deleteActiveTask(n):e.deleteCompletedTask(n)}e.updateView()},clearSelected:function t(){for(var e=document.getElementsByClassName("is-selected");0!=e.length;)e[0].classList.remove("is-selected")},deleteActiveTask:function t(e){var i=this;aria2.remove(i.all[e].gid).then(function(t){i.printString("Successfully deleted "+JSON.stringify(t))},function(t){i.printString(JSON.stringify(t))}),i.deleteCompletedTask(e)},deleteCompletedTask:function t(e){var i=this;aria2.removeDownloadResult(i.all[e].gid).then(function(t){i.printString("Successfully deleted "+JSON.stringify(t))},function(t){i.printString(JSON.stringify(t))})},pauseTasks:function t(){for(var e=this,i=document.getElementsByClassName("task"),n=0;n<i.length;++n)i[n].classList.contains("is-selected")&&aria2.pause(e.all[n].gid).then(function(t){e.printString("Successfully paused "+JSON.stringify(t))},function(t){e.printString(JSON.stringify(t))});e.updateView()},pauseAllTasks:function t(){var e=this;aria2.pauseAll().then(function(t){e.printString("Paused all "+JSON.stringify(t))},function(t){e.printString(JSON.stringify(t))}),e.updateView()},resumeTasks:function t(){for(var e=this,i=document.getElementsByClassName("task"),n=0;n<i.length;++n)i[n].classList.contains("is-selected")&&aria2.unpause(e.all[n].gid).then(function(t){e.printString("Successfully resumed "+JSON.stringify(t))},function(t){e.printString(JSON.stringify(t))});e.updateView()}}});