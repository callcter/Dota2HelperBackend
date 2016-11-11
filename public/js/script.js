var uptoken = null;
$(document).ready(function(){

	$.get('/uptoken',function(res){
		uptoken = res.uptoken;
		var bgUl = Qiniu.uploader({
			runtimes: 'html5,flash,html4',
			browse_button: 'pickfile',
			get_new_uptoken: false,
			// unique_names: true,
			uptoken: uptoken,
			domain: 'http://oalqimdk5.bkt.clouddn.com/',
			max_file_size: '100mb',
			flash_swf_url: './Moxie.swf',
			multi_selection: false,
			filters: {
				mime_types: [
					{title:'图片文件',extensions:'jpg,jpeg,gif,png,bmp'}
				]
			},
			max_retries: 3,
			dragdrop: true,
			drop_element: 'editor-container',
			chunk_size: '4mb',
			auto_start: true,
			init: {
				'FilesAdded': function(up,files){
					plupload.each(files,function(file){
						printLog('on FilesAdded');
					});
				},
				'BeforeUpload': function(up,file){
					printLog('on BeforeUpload');
				},
				'UploadProgress': function(up,file){
					editor.showUploadProgress(file.percent);
				},
				'FileUploaded': function(up,file,info){
					printLog(info);
					var domain = up.getOption('domain');
					var res = $.parseJSON(info);
					var sourceLink = domain + res.key;
					printLog(sourceLink);
					$('#pickfile').css('background-image','url('+sourceLink+')');
				},
				'Error': function(up,err,errTip){
					printLog('on Error');
				},
				'UploadComplete': function(){
					printLog('on UploadComplete');
					editor.hideUploadProgress();
				}
			}
		});
	});

	var editor = new wangEditor('editor-trigger');
	editor.config.customUpload = true;
	editor.config.customUploadInit = uploadInit;
	editor.config.menus = ['bold','underline','italic','img'];
	editor.create();

	$(document).on('click','.submit',function(){
		var title = $('.title').val();
		var backUrl = $('.pickfile').css('background-image').split('"')[1];
		var content = editor.$txt.html();
		var source = $('.source').val();
		var date = new Date();
		var article = {
			title: title,
			backUrl: backUrl,
			content: $.trim(content),
			source: source,
			date: timeFormat(date,'date')
		}
		$.ajax({
			url: '/release',
			type: 'post',
			data: JSON.stringify(article),
			dataType: 'json',
			contentType: 'application/json',
			success: function(res){
				console.log(res.result);
			},
			error: function(err){
				console.log(err);
			}
		});
	});
});

function printLog(title){
	window.console && console.log(title);
}
function uploadInit(){
	var editor = this;
	var btnId = editor.customUploadBtnId;
	var containerId = editor.customUploadContainerId;
	var uploader = Qiniu.uploader({
		runtimes: 'html5,flash,html4',
		browse_button: btnId,
		get_new_uptoken: false,
		unique_names: true,
		uptoken: uptoken,
		domain: 'http://oalqimdk5.bkt.clouddn.com/',
		container: containerId,
		max_file_size: '100mb',
		flash_swf_url: './Moxie.swf',
		multi_selection: false,
		filters: {
			mime_types: [
				{title:'图片文件',extensions:'jpg,jpeg,gif,png,bmp'}
			]
		},
		max_retries: 3,
		dragdrop: true,
		drop_element: 'editor-container',
		chunk_size: '4mb',
		auto_start: true,
		init: {
			'FilesAdded': function(up,files){
				plupload.each(files,function(file){
					printLog('on FilesAdded');
				});
			},
			'BeforeUpload': function(up,file){
				printLog('on BeforeUpload');
			},
			'UploadProgress': function(up,file){
				editor.showUploadProgress(file.percent);
			},
			'FileUploaded': function(up,file,info){
				printLog(info);
				var domain = up.getOption('domain');
				var res = $.parseJSON(info);
				var sourceLink = domain + res.key;
				printLog(sourceLink);
				editor.command(null,'insertHtml','<img src="'+sourceLink+'" style="max-width:100%"/>');
			},
			'Error': function(up,err,errTip){
				printLog('on Error');
			},
			'UploadComplete': function(){
				printLog('on UploadComplete');
				editor.hideUploadProgress();
			}
		}
	});
}

function timeFormat(date,type){
	switch(type){
		case 'date':
			Y = date.getFullYear() + '-';
		  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		  D = date.getDate();
			return Y+M+D;
			break;
		case 'datetime':
			Y = date.getFullYear() + '-';
		  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		  D = date.getDate();
		  h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
		  m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
		  s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
			return Y+M+D+' '+h+m+s;
			break;
		case 'time':
			h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
		  m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
		  s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
			return h+m+s;
			break;
	}
}
