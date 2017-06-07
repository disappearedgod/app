$(document).ready(function(){

    appSearchFunc(function(err){
        if(err != null){
            //err
            return;
        }
        $('#datatables-searched').DataTable({
            // responsive: true
             // "order": [[ 0, "asc" ]]
            "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "对不起，查询不到任何相关数据",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_条记录",
            "sInfoEmtpy": "找不到相关数据",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
            "sProcessing": "正在加载中...",
            "sSearch": "过滤",
            "oPaginate": 
                {
                "sFirst": "第一页",
                "sPrevious":" 上一页 ",
                "sNext": " 下一页 ",
                "sLast": " 最后一页 "
                },
            }
         });
        // inputSearch();
    });
});

//apptyperecommend
function apptyperecommend(types){
    var client = connect();
    client.search({
        index: indexinput,
        type: 'apptype',
        // type: 'programtype',
        body: 
        // {

           {"query":{"bool":{"must":[{"match_all":{}}],"must_not":[],"should":[]}},"from":0,"size":5000,"sort":[],"facets":{}}
           //  "query" : {
           //      "match_all" : {}
           //  }, 
           //  // "filter":{
           //  //     "term":{
           //  //         "cat":types
           //  //     }
           //  // },
           // "sort":{
           //     "recommendvalue":{"order":"desc"}
           //  }
        // }       
    }).then(function (resp) {  
        appRecommend(resp);     
    });
}

function appSearchFunc(callback) {
    var handlebarsJsonArray = new Array();
    var JsonArr = new Array();
    var retString ="";
    var tmpStrArr = new Array();
    var client = connect();

    client.search({
        index: indexinput,
        type: 'apptype',
        website:"华军",
        // type: 'programtype',
        body: {

            "query":{"bool":{"must":[{"match_all":{}}]}},"size":100,"sort":[],"facets":{}
        }
    }).then(function (resp) { 
        console.log(resp);
        var hits = resp.hits.hits;
        //console.log(hits);
        jsonArr = new Array();
        for(var i in hits){
            var _source = hits[i]._source;
            // console.log(_source);
            var json ={
                website:_source.website,
                website_firstcategory:_source.website_firstcategory,
                website_secondcategory:_source.website_secondcategory,
                website_url_download:_source.website_url_download,
                appstore_firstcategory:_source.appstore_firstcategory,
                appstore_secondcategory:_source.appstore_secondcategory,
                appstore_url:_source.appstore_url,
                software_all:_source.software_all,
                software_name:_source.software_name,
                software_name_split:_source.software_name_split,
                software_version:_source.software_version,
                recommendvalue:_source.recommendvalue
            }
            //console.log(json)
            jsonArr.push(json)

        }
        console.log(jsonArr);

        handlebarsJsonArray["data"]=jsonArr;
        var source = $("#application-search-result").html();
        //console.log(source);
        var template = Handlebars.compile(source);
        //  console.log(template);
        var html = template(handlebarsJsonArray);
        //console.log(handlebarsJsonArray);
        //console.log(html);
        var div = $("#appContainer");
        div.html(html);
        client.search({
            index: indexinput,
            type: 'apptype',
            website:"华军",
            // type: 'programtype',
            body: {

                "query":{"bool":{"must":[{"match_all":{}}]}},"size":100,"sort":[],"facets":{}
            }
        }).then(function (resp) { 
            console.log(resp)
        })
        callback();
    })  
}

// recommend
function recommend(){
    var client = connect();
    client.search({
        index: indexinput,
        type: 'apptype',
        // type: 'programtype',
        body: {
            "query" : {
                "match_all" : {}
            }, 
            // "filter":{
            //    "not":{
            //        "term":{
            //             "path":""
            //         }
            //     }
            // },
            "sort":{
                "recommendvalue":{"order":"desc"}
            }
        }
    }).then(function (resp) {   
        appRecommend(resp); 
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

//显示程序类型
function  typedisplay(){
    var client = connect();
    client.search({
        index: indexinput,
        type: 'apptype',
        // type: 'programtype',
        body: {
            "query" : {
                "match_all" : {}
            },
            // "aggs" : {
            //     "types" : {
            //         "terms" : {
            //             "field" : "cat",
            //              "size":100   //add at 2015-5-8
            //         }
            //     }
            // }
        }
    }).then(function (resp) {   
        var hits = resp.hits;  
        var aggre=resp.aggregations;
        var div = document.getElementById("classify"); 
        var types=aggre.types;
        var arr = new Array();
        var arr = types.buckets;
        var len = arr.length;
        if(len>0){
            var result = "<div><strong>"+langNational.programtype+"</strong></div><div style='padding-left:4px;'><span class='selBold'>"+langNational.all+"</span>"; 
            for(var i = 0; i < len; i++){  
                var temp=arr[i].key;
                var count=arr[i].doc_count;
                result += "<span data-types="+temp+" style='margin-left:8px;'>"+temp+"("+count+")</span>";
                LISTDATA[temp] = []; 
            }
            result += "</div>";  
            div.innerHTML = result; 
            div.style.display = "inline";   
        }else{
            div.innerHTML = "<div><strong>"+langNational.programtype+"</strong></div>"; 
            div.style.display = "inline";
        }
    }, function (err) {
        alert("请您检查您的网络设置并刷新页面！");
        console.trace(err.message);
    });
}

(function($){
    $.fn.textSearch = function(str,options){
        var defaults = {
            divFlag: true,
            divStr: " ",
            markClass: "",
            markColor: "blue",
            nullReport: true,
            callback: function(){
                return false;
            }
        };
        var sets = $.extend({}, defaults, options || {}), clStr;
        if(sets.markClass){
            clStr = "class='"+sets.markClass+"'";
        }else{
            clStr = "style='color:"+sets.markColor+";'";
        }

        //对前一次高亮处理的文字还原
        $("span[rel='mark']").removeAttr("class").removeAttr("style").removeAttr("rel");

        //字符串正则表达式关键字转化
        $.regTrim = function(s){
            var imp = /[\^\.\\\|\(\)\*\+\-\$\[\]\?]/g;
            var imp_c = {};
            imp_c["^"] = "\\^";
            imp_c["."] = "\\.";
            imp_c["\\"] = "\\\\";
            imp_c["|"] = "\\|";
            imp_c["("] = "\\(";
            imp_c[")"] = "\\)";
            imp_c["*"] = "\\*";
            imp_c["+"] = "\\+";
            imp_c["-"] = "\\-";
            imp_c["$"] = "\$";
            imp_c["["] = "\\[";
            imp_c["]"] = "\\]";
            imp_c["?"] = "\\?";
            s = s.replace(imp,function(o){
                return imp_c[o];
            });
            return s;
        };
        $(this).each(function(){
            var t = $(this);
            str = $.trim(str);
            if(str === ""){
                // alert("关键字为空");
                return false;
            }else{
                //将关键字push到数组之中
                var arr = [];
                if(sets.divFlag){
                    arr = str.split(sets.divStr);
                }else{
                    arr.push(str);
                }
            }
            var v_html = t.html();
            //删除注释
            v_html = v_html.replace(/<!--(?:.*)\-->/g,"");

            //将HTML代码支离为HTML片段和文字片段，其中文字片段用于正则替换处理，而HTML片段置之不理
            var tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
            var a = v_html.match(tags), test = 0;
            $.each(a, function(i, c){
                if(!/<(?:.|\s)*?>/.test(c)){//非标签
                    //开始执行替换
                    $.each(arr,function(index, con){
                        if(con === ""){return;}
                        var reg = new RegExp($.regTrim(con), "g");
                        if(reg.test(c)){
                            //正则替换
                            c = c.replace(reg,"♂"+con+"♀");
                            test = 1;
                        }
                    });
                    c = c.replace(/♂/g,"<span rel='mark' "+clStr+">").replace(/♀/g,"</span>");
                    a[i] = c;
                }
            });
            //将支离数组重新组成字符串
            var new_html = a.join("");
            $(this).html(new_html);
            if(test === 0 && sets.nullReport){
                alert("没有搜索结果");
                return false;
            }

            //执行回调函数
            sets.callback();
        });
    };
})(jQuery);