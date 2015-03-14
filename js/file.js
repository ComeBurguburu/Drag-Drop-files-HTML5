"use strict";
/*global $, console,alert,confirm,prompt, FormData*/

function progressHandlingFunction(e) {
	if (e.lengthComputable) {
		$('progress').show().prop({value: e.loaded, max: e.total});
	}
}
function errorHandler(e) {
	console.error("error");
	$('progress').hide();
}
function completeHandler(response) {
	$("#info").html(response).show("slow");
	$(".fileupload").removeClass("drop");
	$('progress').hide();
}

function upload(fileSelect) {

	var files, formData, i, file;
		
	// Get the selected files from the input.
	files = fileSelect.files;

	// Create a new FormData object.
	formData = new FormData();
		
	// Loop through each of the selected files.
	for (i = 0; i < files.length; i = i + 1) {
		file = files[i];
		// Add the file to the request.
		formData.append('files[]', file, file.name);
	}
	
    $.ajax({
        url: 'php/upload.php',  //Server script to process data
        type: 'POST',
        xhr: function () {  // Custom XMLHttpRequest
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) { // Check if upload property exists
                myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
				// For handling the progress of the upload
            }
            return myXhr;
        },
        //Ajax events
        //beforeSend: beforeSendHandler,
        success: completeHandler,
        error: errorHandler,
        // Form data
        data: formData,
        //Options to tell jQuery not to process data or worry about content-type.
        cache: false,
        contentType: false,
        processData: false
    });

	
}

$("#file").change(function () {upload($("#file").get(0)); });
var lastenter = null;

$(".fileupload").on("dragenter dragover", function (event) {
	lastenter = event.target;
	event.preventDefault();
	$(this).addClass("drop");
});
$(".fileupload").on("dragleave", function (event) {
	event.preventDefault();
	if (lastenter === event.target) {
		$(this).removeClass("drop");
	}
});
$(".fileupload").on("drop", function (event) {
	event.preventDefault();
	$(this).addClass("drop");
	upload(event.originalEvent.dataTransfer);
});