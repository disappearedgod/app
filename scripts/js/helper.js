function Nstrsplit(str,n){
	var newstring;
	var arr="";
	if(n == 1){
		return arr;
	}else if(n == 2){
		for(var i=0;i<=str.length-2;i++){
			newstring=str.substr(i,2);
			arr=arr+newstring+" ";
		}
		return arr;
	}else if(n == 3){
		for( var j=1;j<=n;j++){
			for(var i=0;i<=str.length-j;i++){
				newstring=str.substr(i,j);
				arr=arr+newstring+" ";
			}
		}
		return arr;
	}
}

function connect(){
	var client = new elasticsearch.Client({
 		host: '127.0.0.1:9200', 
  		log: 'trace'
	});
	return client;
}

function boldChange(that){
	var that = that;
	if(that.hasClass("selBold")){
		return;
	}else{
		that.parent().find(".selBold").removeClass("selBold");
		that.addClass("selBold");
	}
}

function clientCheck(){
	// if(typeof(window.__nwWindowId) == "undefined"){
	// 	return true;
	// }else {
	// 	return false;
	// }

	return false;
}

// 翻页相关函数
function pageNumberCut(tolNum, partNum){
	var pblock = tolNum%partNum?parseInt(tolNum/partNum)+1:parseInt(tolNum/partNum);
	var pHtml = '<div data-pid=1 data-pbn='+pblock+'><input class="prePage button button-rounded button-tiny" type="button" value="'+langNational.prev+'"></input>';
	pHtml += '<p style="display:inline;border:none;margin:8px;" class="preDot">...</p>';
	for (var i = 1; i <= pblock; i++) {
		if(i <= dotPageNum){
			pHtml += '<span>'+i+'</span>';
		}else if(i > dotPageNum){
			pHtml += '<span style="display:none;">'+i+'</span>';
		}
	}
	if(i > dotPageNum){
		pHtml += '<p style="display:inline;border:none;margin:8px;" class="nextDot">...</p>';
	}
	if(pblock > 1){
		pHtml += '<input class="nextPage button button-rounded button-tiny" type="button" value="'+langNational.next+'"></input></div>';
	}
	return pHtml;
}

function pageDotNumChange(m, n, that){
	var numSpan = that.parent().find("p");
	var pageFirstDot = numSpan.first();
	var pageLastDot = numSpan.last();
	for (var i = 1; i <= n; i++) {
		if(i == m){
			that.parent().find("span:eq("+(i-1)+")").css("background-color", "#66ffff");
		}else{
			that.parent().find("span:eq("+(i-1)+")").css("background-color", "white");
		}
	}
	if(m%parseInt(dotPageNum/2) == 1){
		for (var i = 0; i < n; i++) {
			var isWithTwo =  i >= m-parseInt(dotPageNum/2)-1 && i <= m+parseInt(dotPageNum/2)-1?true:false;
  			if ( isWithTwo ) {
    			that.parent().find("span:eq("+(i)+")").show();
  			} else {
    			that.parent().find("span:eq("+(i)+")").hide();
    		}
		}
	}
	if(that.parent().find("span:visible").first().text() == 1){
		pageFirstDot.hide();
	}else {
		pageFirstDot.show();
	}
	if(that.parent().find("span:visible").last().text() == n){
		pageLastDot.hide();
	}else {
		pageLastDot.show();
	}
}

function pageOnClick(tolNum, partNum, id){
	$("#"+id).find("p").first().hide();
	$(".pageNumber").find("span").first().css("background-color", "#66ffff");
	for (var i = 2; i < parseInt(partNum)+2; i++) {
		$("#"+id).find("tr:eq("+i+")").show();
	};
	$(".pageNumber").find(".prePage").unbind("click").click(function(event){
		var that = $(this);
		var pblockNum = that.parent().data("pbn");
		var pageId = that.parent().data("pid");
		var pageSelId = pageId - 1;
		if(pageSelId >= 1){
			that.parent().data("pid", pageSelId);
			var trList = that.parentsUntil("table").last().find("tr:gt(1)").length;
			for (var i = 1; i < trList; i++) {
				isWithTwo =  i > (pageSelId-1)*partNum && i<= pageSelId*partNum?true:false;
	  			if ( isWithTwo ) {
	    			that.parentsUntil("table").last().find("tr:eq("+(i+1)+")").show();
	  			} else {
	    			that.parentsUntil("table").last().find("tr:eq("+(i+1)+")").hide();
	    		}
			}
			if(pageSelId == 1){
				that.hide();
				that.parent().find(".nextPage").show();
				that.parent().find(".preDot").hide();
			}else if(pageSelId > 1){
				that.parent().find(".nextPage").show();
			}
			pageDotNumChange(pageSelId, pblockNum, that);
		}
	});	

	$(".pageNumber").find(".nextPage").unbind("click").click(function(event){
		var that = $(this);
		var pageId = that.parent().data("pid");
		var pageSelId = pageId + 1;
		var pblockNum = that.parent().data("pbn");
		if(pageSelId <= pblockNum){
			that.parent().data("pid", pageSelId);
			var trList = that.parentsUntil("table").last().find("tr:gt(1)").length;
			for (var i = 1; i < trList; i++) {
				isWithTwo =  i > (pageSelId-1)*partNum && i<= pageSelId*partNum?true:false;
	  			if ( isWithTwo ) {
	    			that.parentsUntil("table").last().find("tr:eq("+(i+1)+")").show();
	  			} else {
	    			that.parentsUntil("table").last().find("tr:eq("+(i+1)+")").hide();
	    		}
			}
			if(pageSelId == pblockNum){
				that.hide();
				that.parent().find(".nextDot").hide();
			}
			that.parent().find(".prePage").show();
			pageDotNumChange(pageSelId, pblockNum, that);
		}
	});

	$('.pageNumber').find("span").on("click", function(){
		var that = $(this);
		var pageId = that.parent().data("pid");
		var pblockNum = that.parent().data("pbn");
		var pageSelId = parseInt(that.text());

		if(pageSelId != pageId && pageSelId > 0){
			that.parent().data("pid", pageSelId);
			var trList = that.parentsUntil("table").last().find("tr:gt(1)").length;
			for (var i = 1; i < trList; i++) {
				isWithTwo =  i > (pageSelId-1)*partNum && i<= pageSelId*partNum?true:false;
	  			if ( isWithTwo ) {
	    			that.parentsUntil("table").last().find("tr:eq("+(i+1)+")").show();
	  			} else {
	    			that.parentsUntil("table").last().find("tr:eq("+(i+1)+")").hide();
	    		}
			}
			if(pageSelId == 1){
				console.log($(".preDot"));
				that.parent().find(".prePage").hide();
				that.parent().find(".preDot").hide();
				that.parent().find(".nextPage").show();
			}else if(pageSelId == pblockNum){
				that.parent().find(".prePage").show();
				that.parent().find(".nextPage").hide();
				that.parent().find(".nextDot").hide();
			}else{
				that.parent().find(".prePage").show();
				that.parent().find(".nextPage").show();
			}
			pageDotNumChange(pageSelId, pblockNum, that);	
		}
	});
}

// 页面国际化代码
function langNationalFun(lang){
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET","../scripts/lang/"+lang+".xml",false);
	xmlhttp.send();
	var xmlDoc = xmlhttp.responseXML;
	langNational['search'] 				= xmlDoc.getElementsByTagName("search")[0].childNodes[0].nodeValue;
	langNational['searchband'] 			= xmlDoc.getElementsByTagName("searchband")[0].childNodes[0].nodeValue;
	langNational['all'] 				= xmlDoc.getElementsByTagName("all")[0].childNodes[0].nodeValue;
	langNational['filename'] 			= xmlDoc.getElementsByTagName("filename")[0].childNodes[0].nodeValue;
	langNational['filetype'] 			= xmlDoc.getElementsByTagName("filetype")[0].childNodes[0].nodeValue;
	langNational['installed'] 			= xmlDoc.getElementsByTagName("installed")[0].childNodes[0].nodeValue;
	langNational['uninstalled'] 		= xmlDoc.getElementsByTagName("uninstalled")[0].childNodes[0].nodeValue;
	langNational['filecontent'] 		= xmlDoc.getElementsByTagName("filecontent")[0].childNodes[0].nodeValue;
	langNational['searchlevel'] 		= xmlDoc.getElementsByTagName("searchlevel")[0].childNodes[0].nodeValue;
	langNational['primary'] 			= xmlDoc.getElementsByTagName("primary")[0].childNodes[0].nodeValue;
	langNational['medium'] 				= xmlDoc.getElementsByTagName("medium")[0].childNodes[0].nodeValue;
	langNational['senior'] 				= xmlDoc.getElementsByTagName("senior")[0].childNodes[0].nodeValue;
	langNational['searchdocument'] 		= xmlDoc.getElementsByTagName("searchdocument")[0].childNodes[0].nodeValue;
	langNational['searchprogram'] 		= xmlDoc.getElementsByTagName("searchprogram")[0].childNodes[0].nodeValue;
	langNational['recommenddocument'] 	= xmlDoc.getElementsByTagName("recommenddocument")[0].childNodes[0].nodeValue;
	langNational['recommendprogram'] 	= xmlDoc.getElementsByTagName("recommendprogram")[0].childNodes[0].nodeValue;
	langNational['programname'] 		= xmlDoc.getElementsByTagName("programname")[0].childNodes[0].nodeValue;
	langNational['programdescribe'] 	= xmlDoc.getElementsByTagName("programdescribe")[0].childNodes[0].nodeValue;
	langNational['programtype'] 		= xmlDoc.getElementsByTagName("programtype")[0].childNodes[0].nodeValue;
	langNational['ordernum'] 			= xmlDoc.getElementsByTagName("ordernum")[0].childNodes[0].nodeValue;
	langNational['lastatime'] 			= xmlDoc.getElementsByTagName("lastatime")[0].childNodes[0].nodeValue;
	langNational['hit'] 				= xmlDoc.getElementsByTagName("hit")[0].childNodes[0].nodeValue;
	langNational['item'] 				= xmlDoc.getElementsByTagName("item")[0].childNodes[0].nodeValue;
	langNational['timeconsum'] 			= xmlDoc.getElementsByTagName("timeconsum")[0].childNodes[0].nodeValue;
	langNational['prev'] 				= xmlDoc.getElementsByTagName("prev")[0].childNodes[0].nodeValue;
	langNational['next'] 				= xmlDoc.getElementsByTagName("next")[0].childNodes[0].nodeValue;
	langNational['language'] 			= xmlDoc.getElementsByTagName("language")[0].childNodes[0].nodeValue;
	langNational['searchnum'] 			= xmlDoc.getElementsByTagName("searchnum")[0].childNodes[0].nodeValue;
	langNational['recomnum'] 			= xmlDoc.getElementsByTagName("recomnum")[0].childNodes[0].nodeValue;
	langNational['usersure'] 			= xmlDoc.getElementsByTagName("usersure")[0].childNodes[0].nodeValue;
	langNational['usercancel'] 			= xmlDoc.getElementsByTagName("usercancel")[0].childNodes[0].nodeValue;
	langNational['tag'] = xmlDoc.getElementsByTagName("tag")[0].childNodes[0].nodeValue;

	htmlLangChange(langNational);
}

function htmlLangChange(langNational){
	$('.keyWordBox div span').text(langNational['search']);

	$('#docselect div strong').text(langNational['searchband']);
	$('#docselect span').first().text(langNational['all']);
	$('#docselect span').eq(1).text(langNational['filename']);
	$('#docselect span').last().text(langNational['filecontent']);
	
	$('#appselect div strong').text(langNational['searchband']);
	$('#appselect span').first().text(langNational['all']);
	$('#appselect span').eq(1).text(langNational['installed']);
	$('#appselect span').last().text(langNational['uninstalled']);

	$('#searchAct div strong').text(langNational['searchlevel']);
	$('#searchAct span').first().text(langNational['primary']);
	$('#searchAct span').eq(1).text(langNational['medium']);
	$('#searchAct span').last().text(langNational['senior']);

	$('#useredit').find('.language').text(langNational['language']);
	$('#useredit').find('.searched-area').text(langNational['searchnum']);
	$('#useredit').find('.recommended-area').text(langNational['recomnum']);
	$('#useredit').find('#editsure').text(langNational['usersure']);
	$('#useredit').find('#cancel').text(langNational['usercancel']);
}

// javascript针对cookie进行操作
// setCookie ("xiaoqi", "3");
// alert(getCookie('xiaoqi'));	
// delCookie('xiaoqi');
function setCookie(name, value){
	var Days = 30; //此 cookie 将被保存 30 天
    var exp  = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) 
    	return unescape(arr[2]); 
    return null;
}

function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) 
    	document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function windowResize(){
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	// console.log(windowWidth);
  	$('.classify').css("margin-left", parseInt(windowWidth/5.5)+"px");
  	$('.keyWordBox').css("margin-left", "330px");
  	$('.keyWordBox input').css("width", parseInt(windowWidth/2-160)+"px");
  	
	//  var eyeheight = $(".sidebar-nav").height();
	// (windowHeight > eyeheight)?$('.iframe-size').css("height", parseInt(windowHeight-300)+"px"):$('.iframe-size').css("height", parseInt(eyeheight-250)+"px");
}
