Element.prototype.siblings = function () {
	var siblingElement = [];
	var sibs = document.getElementsByClassName("hexo-douban-tab")
	for (var i = 0; i < sibs.length; i++) {
		siblingElement.push(sibs[i]);
	}
	return siblingElement;
};

$(function () {
	var pageNo = 1;
	var pageSize = 10;
	var total = 0;
	var totalPages = 0;
	var type = "collect"
	var serverPath = "https://api.jsonpop.cn/douban";

	getCount();

	var tabs = $(".hexo-douban-tab");
	for (var i = 0; i < tabs.length; i++) {
		$(tabs[i]).on('click',function(){
			tabClick(this)
		});
	}
	tabs[2].click();

	$(".hexo-douban-firstpage").click(function(){
		pageNo = 1;
		getData();
	});
	$(".hexo-douban-previouspage").click(function(){
		if(pageNo-1>0){
			pageNo = pageNo - 1;
			getData();
		}
	});
	$(".hexo-douban-nextpage").click(function(){
		if(pageNo+1<=totalPages){
			pageNo = pageNo + 1;
			getData();
		}
	});
	$(".hexo-douban-lastpage").click(function(){
		pageNo = totalPages;
		getData();
	});

	function tabClick(that) {
		var sibs = that.siblings();
		for (var j = 0; j < sibs.length; j++) {
			sibs[j].classList.remove('hexo-douban-active');
		}
		//修改标签样式
		that.classList.add('hexo-douban-active');
		type = that.id.replace('hexo-douban-tab-', '')
		pageNo = 1;
		getData();
	}

	function getCount(){
		$.ajax({
			url: serverPath+"/movies/count",
			type: "POST",
			dataType: "JSON",
			contentType:"application/json;charset=utf-8",
			success: function(data) {
				$("#hexo-douban-tab-do").text("在看("+data.doCount+")");
				$("#hexo-douban-tab-wish").text("想看("+data.wishCount+")");
				$("#hexo-douban-tab-collect").text("已看("+data.collectCount+")");
			},
			error: function(err){
				console.log(err);
			}
		})
	}

	function getData(){
		$.ajax({
			url: serverPath+"/movies/"+type,
			type: "POST",
			dataType: "JSON",
			contentType:"application/json;charset=utf-8",
			data: '{"pageNo":'+pageNo+',"pageSize":'+pageSize+'}',
			success: function(data) {
				var html = "";
				var content = data.content;
				for(var i = 0;i<content.length;i++){
					html +='<div class="hexo-douban-item">'
					var pic = content[i].pic
					// html +='<div class="hexo-douban-picture" style="background-image: url('+pic+');">'
					// html +='</div>'

					html +='<div class="hexo-douban-picture">'
					html +='<img src="'+pic+'"data-src="'+pic+'" referrerpolicy="no-referrer">'
					html +='</img>'

					html +='<div class="hexo-douban-tips">'
					html +=content[i].ratingNum
					html +='</div>'
					
					html +='</div>'

					html +='<div class="hexo-douban-info">'
					html +='<div class="hexo-douban-title">'
					html +='<a target="_blank" href="'+content[i].href+'">'
					html += content[i].title
					html +='</a>'
					html +='</div>'
					html +='<div class="hexo-douban-meta">'
					html +='<div class="intro">'
					html += content[i].intro
					html +='</div>'
					html +='</div>'



					html +='<div class="hexo-douban-eval">'

					html +='<div>'
					html +='<span class="'+content[i].rating+'">'
					html +='</span>'
					html +='<span class="date">'
					html += content[i].date
					html +='</span>'
					html +='</div>'

					if(content[i].comment!=''){
						html +='<div class="hexo-douban-comment">'
						html += content[i].comment
						html +='</div>'
					}

					html +='</div>'


					html +='</div>'

					// 在线观看下载
					/*html+='<div class = "hexo-douban-player-info">'
					html+='<div class="hexo-douban-player">'
					html+='<div>#在线播放#</div>'
					html+='<a href="/">H1080P</a>'
					html+='</div>'

					html+='<div class="hexo-douban-player-download">'
					html+='<div>#资源下载#</div>'
					html+='<a href="magnet:?xt=urn:btih:D9843BC408B1D70E3A491537C26512B5E840502E">[梨泰院Class][第01集][韩语中字][720p]</a>'
					html+='</div>'*/

					html+='</div>'
					html +='</div>'
				}
				$("#hexo-douban-item").html(html);

				pageNo = data.pageNo;
				pageSize = data.pageSize;
				total = data.total;
				totalPages = data.totalPages;

				$(".hexo-douban-pagenum").text(pageNo + " / " + totalPages);
			},
			error: function(err){
				console.log(err);
			}
		})
	}

	$.ajaxSetup({
		layerIndex:-1, //保存当前请求对应的提示框index,用于后面关闭使用
		//在请求显示提示框
		beforeSend: function(jqXHR, settings) {
			this.layerIndex = layer.load(1);
		},
		//请求完毕后（不管成功还是失败），关闭提示框
		complete: function () {
			layer.close(this.layerIndex);
		},
		//请求失败时，弹出错误信息
		error: function (jqXHR, status, e) {
			layer.alert('数据请求失败，请后再试!');
		}
	});
});