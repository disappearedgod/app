//apptyperecommend
function apptyperecommend(types){
	var client = connect();
	client.search({
		index: indexinput,
        type: 'apptype',
        // type: 'programtype',
  		body: {
	   		"query" : {
        		"match_all" : {}
	     	}, 
		   	"filter":{
				"term":{
					"cat":types
				}
			},
		   "sort":{
			   "recommendvalue":{"order":"desc"}
		   	}
  		}		
	}).then(function (resp) {	
  		appRecommend(resp);		
	});
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
			"filter":{
			   "not":{
			       "term":{
						"path":""
				    }
			    }
			},
	   		"sort":{
		   		"recommendvalue":{"order":"desc"}
	   		}
  		}
	}).then(function (resp) {	
  		appRecommend(resp);	
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
	 		"aggs" : {
        		"types" : {
            		"terms" : {
                		"field" : "cat",
			   			 "size":100   //add at 2015-5-8
		            }
		        }
		    }
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
/*
* NId 为搜索精度 
* 根据 input 值搜索
* 根据 dsid 值判断程序搜索类型
*/
function searchkeyword(NId) {
	var startTime = new Date().getTime();
	var input = document.getElementById("keyword").value;  
	$("#Ngram").val(NId); 
	var client = connect();
 	input = input+" "+Nstrsplit(input,NId); //2015-5-12	
	client.cluster.health(function (err,resp) {
  		if (err) {
			console.error(err.message);
  		} else {
  			var appselect = $("#appselect").find(".selBold").data("dsid");
			if(appselect==1){
	 			client.search({
			        index: indexinput,
			        type: 'apptype',
			        // type: 'programtype',
  					body: {
    					query: {
	  						multi_match: {
	  							query:input,
	  							fields: [ "en","cn","ensplit","cnsplit","enanaly","cnanaly^0.1","cat^0.1","catsplit^0.1" ] 
      						}
    					},
						size:2000
  					}
				}).then(function (resp) {
					var endTime = new Date().getTime();
 					appResultDataToTable(resp, endTime-startTime);
				}, function (err) {
					alert("请检查您输入的命名空间正确无误后再重新开始！");
				    console.trace(err.message);
				});
			}else if(appselect==2){
	 	 		client.search({
			        index: indexinput,
			        type: 'apptype',
			        // type: 'programtype',
	  				body: {
	    				query: {
		  					multi_match: {
							  	query:input,
							  	fields: [ "en","cn","ensplit","cnsplit","enanaly","cnanaly^0.1","cat^0.1","catsplit^0.1" ] 
	     					 }
	    				},
						"filter":{
	   						"not":{
	       						"term":{
									"path":""
		      					}
	        				}
						},
						size:2000
	  				}
				}).then(function (resp) {
 					var endTime = new Date().getTime();
 					appResultDataToTable(resp, endTime-startTime);
				}, function (err) {
					alert("请检查您输入的命名空间正确无误后再重新开始！");
				    console.trace(err.message);
				});
		  	}else if(appselect==3){
		  		client.search({
			        index: indexinput,
			        type: 'apptype',
			        // type: 'programtype',
	  				body: {
	    				query: {
		  					multi_match: {
							  	query:input,
							  	fields: [ "en","cn","ensplit","cnsplit","enanaly","cnanaly^0.1","cat^0.1","catsplit^0.1" ] 
	     					 }
	    				},
						"filter":{
       						"term":{
								"path":""
	      					}
						},
						size:2000
	  				}
				}).then(function (resp) {
 					var endTime = new Date().getTime();
 					appResultDataToTable(resp, endTime-startTime);
				}, function (err) {
					alert("请检查您输入的命名空间正确无误后再重新开始！");
				    console.trace(err.message);
				});
		  	}
	  	}
	});
}

function addTag(id){
	// 建立索引
	$("#inputTag").css("display", "block");
	$("#inputTag").find(".tagcancel").one("click", function(){
		$("#inputTag").css("display", "none");
	});
	$("#inputTag").find(".tagsure").one("click", function(){
		var addTag = $("#tagvalue").val();
		console.log(addTag);
		if(addTag.length !== 0){
			var client = connect();
			client.cluster.health(function (err,resp) {
		  		if (err) {
					console.error(err.message);
		  		} else {
					client.update({
						type: 'programtype',
	  					index: wingearindex,
				        type: 'apptype',
				        //index: 'programindex',
				        // type: 'programtype',
					  id: id,
					  body: {
					    script: 'ctx._source.programtags += tag',
					    params: { tag: addTag }
					  }
					}, function (error, response) {
					  // ...
					  console.log(7878);
					});
				}
			});
		}
		$("#inputTag").css("display", "none");
	});
}
