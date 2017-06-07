// 根据程序路径打开程序
function openApp(path){
	var explorer = clientCheck();
    if(explorer){
    	alert("浏览器");
    }else{
    	if(path.length == 0){
    		alert("当前程序没有安装！");
    	}else{
    		var exec = require('child_process').exec;
			exec('"'+path+'"',function(err, stdout, stderr){
    		    if(err !== null){
    		        alert(err);
    		    }      
		    });
    	} 
	}
}

//拷贝程序路径
function copypath(m,n){
    var client = connect();
    client.update({
        index: wingearindex,
        type: 'apptype',
        id: n,
        body: {
            script: 'ctx._source.recommendvalue+=1'
        }
        // index: indexinput,
        // type: 'programtype',
        // id: n,
        // body: {
        //     script: 'ctx._source.recommendvalue+=1'
        // }
    }, function (error, response) {
        console.log(response);
    });

    if (window.clipboardData){
        window.clipboardData.setData( "Text" , m);
    }else {
        unsafeWindow.netscape.security.PrivilegeManager.enablePrivilege( "UniversalXPConnect");
        const clipboardHelper = Components.classes[ "@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
        clipboardHelper.copyString(m);
     }
}

function updatecounter(m,n){
    var client =connect();
    client.update({
        index: wingearindex,
        type: 'apptype',
        id: n,
        body: {
            script: 'ctx._source.recommendvalue+=1'
        }
        // index: indexinput,
        // type: 'programtype',
        // id: n,
        // body: {
        //     script: 'ctx._source.recommendvalue+=1'
        // }
    }, function (error, response) {});
}

// 程序搜索结果页面化
function appResultDataToTable(data, searchtime){
    var div = document.getElementById("container-area"); 
    var out_div = document.getElementById("container"); 
    var types = $("#classify").find("span[class='selBold']").data("types");
    var source   = $("#app-search-result").html();
    var template = Handlebars.compile(source);
    var handleHelper = Handlebars.registerHelper("compare",function(v1,v2,options){
        if(v1>v2){
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    });
    var handleHelper = Handlebars.registerHelper('comparepath', function(left, operator, right, options) {
        if (arguments.length < 3) {
           throw new Error('Handlerbars Helper "compare" needs 2 parameters');
        }
        var operators = {
           '==':     function(l, r) {return l == r; },
           '===':    function(l, r) {return l === r; },
           '!=':     function(l, r) {return l != r; },
           '!==':    function(l, r) {return l !== r; },
           '<':      function(l, r) {return l < r; },
           '>':      function(l, r) {return l > r; },
           '<=':     function(l, r) {return l <= r; },
           '>=':     function(l, r) {return l >= r; },
           'typeof': function(l, r) {return typeof l == r; }
        };

        if (!operators[operator]) {
           throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
        }

        var result = operators[operator](left, right);

        if (result) {
           return options.fn(this);
        } else {
           return options.inverse(this);
        }
    });
    var hits = data.hits;  
    var lenp = hits.hits.length;
    if(lenp > 0){
        var typeJ = 0;
        var temp,
            type;
        for(var item in LISTDATA){
            LISTDATA[item].length = 0;
        }
        for(var i = 0; i < lenp; i++){  
            temp = hits.hits[i]._source;
            type = temp.cat;
            LISTDATA[type].push(hits.hits[i]); //全局保存数据便于按类别搜索直接读取，不再搜索
        }
        if(typeof(types) == "undefined"){
            typeJ = lenp;
            var renderData = {
                national: langNational,
                time: (searchtime/1000).toFixed(3), 
                content: hits.hits,
                length: typeJ
            };
            var html = template(renderData);
        }else{
            typeJ = LISTDATA[types].length;
            var renderData = {
                national: langNational,
                time: (searchtime/1000).toFixed(3), 
                content: LISTDATA[types],
                length: typeJ
            };
            var html = template(renderData);
        }
        if(typeJ == 0){
            result = "<span class=''>没有找到符合条件的程序，请检查搜索条件后重新搜索!</span>";
        }else{
            // var pageNumHtml = pageNumberCut(typeJ, perPageNum);
            // result = html+"<tr class='pageNumber'><td colspan=5 style='text-align:center;'>"+pageNumHtml+"</td></tr></table> "; 
            result = html; 
        }
        div.innerHTML = result; 
        out_div.style.display = "block";
        // pageOnClick(typeJ, perPageNum, "container");
    }else{
        div.innerHTML = "<span class=''>没有找到符合条件的程序，请检查搜索条件后重新搜索!</span>";
        out_div.style.display = "block";
    }

    $('#datatables-search').DataTable({
        // responsive: true
        "order": [[ 0, "asc" ]]
    });
}

// 按所选类型从已经保存LISTDATA数据中提出并展示
function  appTypesearch(types){
    var startTime = new Date().getTime();
    if(types == undefined){
        var Nid = $("#Ngram").val();
        searchkeyword(Nid);
        recommend();
        return;
    }
    apptyperecommend(types);
    var source   = $("#app-search-result").html();
    var template = Handlebars.compile(source);
    var handleHelper = Handlebars.registerHelper("compare",function(v1,v2,options){
            if(v1>v2){
                return options.fn(this);
            }else{
                return options.inverse(this);
            }
    });
    var handleHelper = Handlebars.registerHelper('comparepath', function(left, operator, right, options) {
        if (arguments.length < 3) {
           throw new Error('Handlerbars Helper "compare" needs 2 parameters');
        }
        var operators = {
           '==':     function(l, r) {return l == r; },
           '===':    function(l, r) {return l === r; },
           '!=':     function(l, r) {return l != r; },
           '!==':    function(l, r) {return l !== r; },
           '<':      function(l, r) {return l < r; },
           '>':      function(l, r) {return l > r; },
           '<=':     function(l, r) {return l <= r; },
           '>=':     function(l, r) {return l >= r; },
           'typeof': function(l, r) {return typeof l == r; }
        };

        if (!operators[operator]) {
           throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
        }

        var result = operators[operator](left, right);
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    var hits = LISTDATA[types];  
    var lenp = hits.length;
    var div = document.getElementById("container-area");
    var out_div = document.getElementById("container");
    if(hits.length > 0){
        var searchtime = new Date().getTime() - startTime;
        var renderData = {
            national: langNational,
            time: (searchtime/1000).toFixed(3), 
            content: hits,
            length: lenp
        };
        result = template(renderData);
        // var pageNumHtml = pageNumberCut(lenp, perPageNum);  
        // result += "<tr class='pageNumber'><td colspan=5 style='text-align:center;'>"+pageNumHtml+"</td></tr></table> "; 
    }else{
        result = "<span class=''>没有找到符合条件的程序，请检查搜索条件后重新搜索!</span>";
    }
    div.innerHTML = result;
    out_div.style.display = "block";   
    // pageOnClick(lenp, perPageNum, "container"); 

    $('#datatables-search').DataTable({
        // responsive: true
        "order": [[ 0, "asc" ]]
    });
}

// 推荐内容展示
function appRecommend(data, searchtime){
    var source   = $("#app-recommend").html();
    var template = Handlebars.compile(source);
    var handleHelper = Handlebars.registerHelper("addOne",function(index){return index+1;});
    var hits = data.hits.hits; 
    var div = document.getElementById("recommend-area"); 
    var result = '';
    var lenp = hits.length;
    if(lenp > 0){
        var renderData = {
            national: langNational,
            time: (searchtime/1000).toFixed(3), 
            content: hits,
            length: lenp
        };
        div.innerHTML = template(renderData);
        // var html = template(hits);
        // var pageNumHtml = pageNumberCut(lenp, recomPageINum);
        // html = html+"<tr class='pageNumber'><td colspan=5 style='text-align:center;display:none;'>"+pageNumHtml+"</td></tr></table> "; 
        // div.innerHTML = html; 
        // pageOnClick(lenp, recomPageINum, "recommend");
    }else{
        div.innerHTML = " ";
    }

    $('#datatables-recommend').DataTable({
        // responsive: true
        "order": [[ 0, "asc" ]]
    });
}