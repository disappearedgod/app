$(document).ready(function(){
    // var client = connect();
    // client.search({
    //     // index: indexinput,
    //     // type: 'apptype',
    //     // type: 'programtype',
    //     body: {
    //         "query" : {
    //             "match_all" : {}
    //         }, 

    //         "aggs" : {
    //             "types" : {
    //                 "cardinality": {
    //                     "field" : "website_firstcategory"
    //                 }
    //             }

    //         }
    //        // "sort":{
    //        //     "recommendvalue":{"order":"desc"}
    //        //  }
    //     }       
    // }).then(function (resp) {   

    //     console.log(resp)
    //     leftBar(resp);     
    // });

	var left_html = '<li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>安全软件<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">防火墙</a>\
                            </li>\
                            <li>\
                                <a href="appSearch.html">安全杀毒</a>\
                            </li>\
                            <li>\
                                <a>密码管理</a>\
                            </li>\
                            <li>\
                                <a>加密管理</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>编程开发<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>多媒体类<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>管理软件<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>行业软件<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>教育教学<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>其他软件<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>网络应用<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>系统软件<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>应用软件<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                             </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>游戏娱乐<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>主题素材<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>专题软件<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>\
                    <li>\
                        <a href="#"><i class="fa fa-edit fa-fw"></i>桌面应用<span class="fa arrow"></span></a>\
                        <ul class="nav nav-second-level">\
                            <li>\
                                <a href="documentSearch.html">test</a>\
                            </li>\
                        </ul>\
                    </li>';

    $("#side-menu").append(left_html);

    $(".li-toggle").click(function(){
        $(this).next().toggle();
        var thatArrow = $(this).find(".arrow");
        thatArrow.hasClass("arrow-rotate")?thatArrow.removeClass("arrow-rotate"):thatArrow.addClass("arrow-rotate");
    });

    $("#side-menu").find("."+classification).parent().css("background-color","lightgray");

    $("#side-menu").find(".li-toggle").each(function(){    
        if($(this).parent().find("."+classification).length == 0){
            $(this).trigger("click");
        }
    });
    // $("#side-menu").find("."+classification).parent().parent().prev().trigger("click");

});


function leftBar(data){
    console.log(data)
    $("#side-menu").append(left_html);

    $(".li-toggle").click(function(){
        $(this).next().toggle();
        var thatArrow = $(this).find(".arrow");
        thatArrow.hasClass("arrow-rotate")?thatArrow.removeClass("arrow-rotate"):thatArrow.addClass("arrow-rotate");
    });

    $("#side-menu").find("."+classification).parent().css("background-color","lightgray");

    $("#side-menu").find(".li-toggle").each(function(){    
        if($(this).parent().find("."+classification).length == 0){
            $(this).trigger("click");
        }
    });
}
