"use strict";
/*global console, FormData*/
function progressHandlingFunction(e) {
	if (e.lengthComputable) {
		document.getElementsByTagName('progress')[0].style.display = "block";
		document.getElementsByTagName('progress')[0].setAttribute("value", e.loaded);
		document.getElementsByTagName('progress')[0].setAttribute("max", e.total);
	}
}
function errorHandler(status, error) {
	console.error(status + " " + error);
	document.getElementsByTagName("progress")[0].style.display = "none";
}
function completeHandler(response) {
	document.getElementById("info").style.display = "block";
	document.getElementById("info").innerHTML = response;
	document.getElementsByClassName("fileupload")[0].classList.remove("drop");
	document.getElementsByTagName('progress')[0].style.display = "none";
}
function ajax(url, data) {
	var xhr = new XMLHttpRequest();
	
	if (xhr.upload) { // Check if upload property exists
		xhr.upload.addEventListener('progress', progressHandlingFunction, false);
		// For handling the progress of the upload
	}

	xhr.onreadystatechange = function (response) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				completeHandler(xhr.responseText);
			} else {
				errorHandler(xhr.status, xhr.error);
			}

		}

	};

	xhr.contentType = false;
	xhr.processData = false;
	xhr.cache = false;
	xhr.open("POST", url, true);
	xhr.send(data);

	return xhr;
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

	ajax('php/upload.php', formData);
}

document.getElementById("file").onchange = function () {upload(document.getElementById("file")); };
var lastenter = null;

function dragover(event) {
	lastenter = event.target;
	event.preventDefault();
	event.target.classList.add("drop");
}

document.getElementsByClassName("fileupload")[0].ondragenter = dragover;
document.getElementsByClassName("fileupload")[0].ondragover = dragover;
document.getElementsByClassName("fileupload")[0].ondragleave = function (event) {
	event.preventDefault();
	if (lastenter === event.target) {
		event.target.classList.remove("drop");
	}
};
document.getElementsByClassName("fileupload")[0].ondrop = function (event) {
	event.preventDefault();
	event.target.classList.add("drop");
	upload(event.dataTransfer);
};