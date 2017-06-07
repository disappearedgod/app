$(document).ready(function(){

	//$(".titicon").find("a").last().attr("href",location.hostname+':8002');

	// 输入框enter事件
	var txt = $(":text");
    $(this).keyup(function(e){if(e.keyCode == 13){txt.focus();}});
    txt.keyup(function(e){if(e.keyCode == 13)searchkeyword(1);});

    // 输入框长度、位置
    windowResize();
  	window.onresize = function(){
    	windowResize();
    };

	typedisplay();
	recommend();

	// 标签筛选事件
	$("#docselect,#appselect,#searchAct").delegate("span", "click", function(){
		var that = $(this);
		boldChange(that);
		var Nid = that.data("nid")?that.data("nid"):$("#Ngram").val();
		$("#Ngram").val(Nid);  //更改搜索级别
		searchkeyword(Nid);
	});

	// 针对类别做列表处理
	$("#classify").delegate("span", "click", function(){
		var that = $(this);
		boldChange(that);
		var types = that.data("types");
		if (indexinput == "programindex"){
			appTypesearch(types);
		}else if(indexinput == "documentindex"){
			docTypesearch(types);
		}
	});
	
	// js读取xml文件，页面国际化
	var lang = getCookie('lang') !== null?getCookie('lang'):'cn';
	langNationalFun(lang);

	// 设置框设置参数
	$(".editicon").click(function(){
	    $("#useredit").toggle();
	});
	
	$("#cancel").click(function(){
	    $("#useredit").css("display", "none");
	});

	$("#editsure").click(function(){
	    var lang = $("#langedit").find("option:selected").val();
	    var searchnum = $("#searchnum").val();
	    var recomnum = $("#recommendnum").val();
	    // var dir = $("#indexdir").val();
	    setCookie ("lang", lang);
	    if(!isNaN(searchnum) && searchnum >0){
	    	setCookie ("searchnum", searchnum);
	    }else{
	    	setCookie ("searchnum", 10);
	    }
	    if(!isNaN(recomnum) && recomnum > 0){
	    	setCookie ("recomnum", recomnum);
	    }else{
	    	setCookie ("recomnum", 10);
	    }
	    // if(!isNaN(dir)){
	    // 	docSearchIndex(dir);
	    // }
	    location.reload();
	});
});

