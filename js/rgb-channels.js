function combineChanelImages() {
	var redImage      = new CanvasImage('redChanelImage');
    var redImageData  = redImage.getImageData();
    var redPixels     = redImageData.data;
    
	var greenImage      = new CanvasImage('greenChanelImage');
    var greenImageData  = greenImage.getImageData();
    var greenPixels     = greenImageData.data;
    greenImage.removeCanvas();
    
	var blueImage      = new CanvasImage('blueChanelImage');
    var blueImageData  = blueImage.getImageData();
    var bluePixels     = blueImageData.data;
    blueImage.removeCanvas();
    
	var canvas = document.getElementById('canvasChanelsCombined');
	var context = canvas.getContext('2d');
	canvas.width = redImage.getWidth();
	canvas.height = redImage.getHeight();
	var combData = context.getImageData(0, 0, canvas.width, canvas.height);
	for(var i=0, offset;i<redPixels.length;i++) {
		offset = i * 4;
        combData.data[offset + 0] = redPixels[offset + 0];
        combData.data[offset + 1] = greenPixels[offset + 1];
        combData.data[offset + 2] = bluePixels[offset + 2];
        var a = parseInt((redPixels[offset + 3] + greenPixels[offset + 3] + bluePixels[offset + 3])/3);
        combData.data[offset + 3] = a;
	}
	context.putImageData(combData, 0, 0);
	redImage.removeCanvas();
    $('#rgbCombinedChannelImageDiv').show();
}


function generateRGBChanelImages() {
	var oImage      = new CanvasImage('originalImage');
    var oImageData  = oImage.getImageData();
    var oPixels     = oImageData.data;
    
	var redCanvas = document.getElementById('redChanelCanvas');
	var redContext = redCanvas.getContext('2d');
	redCanvas.width = oImage.getWidth();
	redCanvas.height = oImage.getHeight();
	var combData = redContext.getImageData(0, 0, redCanvas.width, redCanvas.height);
	for(var i=0, offset;i<oPixels.length;i++) {
		offset = i * 4;
        combData.data[offset + 0] = oPixels[offset + 0];
        combData.data[offset + 1] = oPixels[offset + 0];
        combData.data[offset + 2] = oPixels[offset + 0];
        combData.data[offset + 3] = oPixels[offset + 3];
	}
	redContext.putImageData(combData, 0, 0);
	
	
	var greenCanvas = document.getElementById('greenChanelCanvas');
	var greenContext = greenCanvas.getContext('2d');
	greenCanvas.width = oImage.getWidth();
	greenCanvas.height = oImage.getHeight();
	combData = greenContext.getImageData(0, 0, greenCanvas.width, greenCanvas.height);
	for(i=0;i<oPixels.length;i++) {
		offset = i * 4;
        combData.data[offset + 0] = oPixels[offset + 1];
        combData.data[offset + 1] = oPixels[offset + 1];
        combData.data[offset + 2] = oPixels[offset + 1];
        combData.data[offset + 3] = oPixels[offset + 3];
	}
	greenContext.putImageData(combData, 0, 0);
	
	var blueCanvas = document.getElementById('blueChanelCanvas');
	var blueContext = blueCanvas.getContext('2d');
	blueCanvas.width = oImage.getWidth();
	blueCanvas.height = oImage.getHeight();
	combData = blueContext.getImageData(0, 0, blueCanvas.width, greenCanvas.height);
	for(i=0;i<oPixels.length;i++) {
		offset = i * 4;
        combData.data[offset + 0] = oPixels[offset + 2];
        combData.data[offset + 1] = oPixels[offset + 2];
        combData.data[offset + 2] = oPixels[offset + 2];
        combData.data[offset + 3] = oPixels[offset + 3];
	}
	blueContext.putImageData(combData, 0, 0);
	oImage.removeCanvas();
    $('#rgbChanelImages').show();
}


function downloadCanvas(link, canvasId, filename) {
	link.href = document.getElementById(canvasId).toDataURL();
	link.download = filename;
}


if (window.FileReader) {
	addDragEventForImg('drop','originalImage');
	addDragEventForImg('drop1','redChanelImage');
	addDragEventForImg('drop1','redChanelImagePreview');
	addDragEventForImg('drop2','greenChanelImage');
	addDragEventForImg('drop2','greenChanelImagePreview');
	addDragEventForImg('drop3','blueChanelImage');
	addDragEventForImg('drop3','blueChanelImagePreview');
} else {
	alert("This browser doesn't support file reader. Please use HTML5 supported browser");
}
function addEventHandler(obj, evt, handler) {
	if (obj.addEventListener) {
		// W3C method
		obj.addEventListener(evt, handler, false);
	} else if (obj.attachEvent) {
		// IE method.
		obj.attachEvent('on' + evt, handler);
	} else {
		// Old school method.
		obj['on' + evt] = handler;
	}
}

function addDragEventForImg(dropId, imgId) {
	var drop;
	addEventHandler(
			window,
			'load',
			function() {
				drop = document.getElementById(dropId);
				
				function cancel(e) {
					if (e.preventDefault) {
						e.preventDefault();
					}
					return false;
				}

				// Tells the browser that we *can* drop on this target
				addEventHandler(drop, 'dragover', cancel);
				addEventHandler(drop, 'dragenter', cancel);

				addEventHandler(
						drop,
						'drop',
						function(e) {
							e = e || window.event; // get window.event if e argument missing (in IE)   
							if (e.preventDefault) {
								e.preventDefault();
							} // stops the browser from redirecting off to the image.

							var dt = e.dataTransfer;
							var files = dt.files;
							for (var i = 0; i < files.length; i++) {
								var file = files[i];
								var reader = new FileReader();

								//attach event handlers here...

								reader.readAsDataURL(file);
								addEventHandler(
										reader,
										'loadend',
										function(e, file) {
											var bin = this.result;
											var img = document.getElementById(imgId);
											img.file = file;
											img.src = bin;
										}.bindToEventHandler(file));
							}
							return false;
						});
				Function.prototype.bindToEventHandler = function bindToEventHandler() {
					var handler = this;
					var boundParameters = Array.prototype.slice.call(arguments);
					//create closure
					return function(e) {
						e = e || window.event; // get window.event if e argument missing (in IE)   
						boundParameters.unshift(e);
						handler.apply(this, boundParameters);
					};
				};
			});
}


var CanvasImage = function (imag) {
	var image = document.getElementById(imag);
    this.canvas  = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    this.width  = this.canvas.width  = image.width;
    this.height = this.canvas.height = image.height;

    this.context.drawImage(image, 0, 0, this.width, this.height);
};

CanvasImage.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

CanvasImage.prototype.update = function (imageData) {
    this.context.putImageData(imageData, 0, 0);
};

CanvasImage.prototype.getPixelCount = function () {
    return this.width * this.height;
};

CanvasImage.prototype.getWidth = function () {
    return this.width;
};

CanvasImage.prototype.getHeight = function () {
    return this.height;
};

CanvasImage.prototype.getImageData = function () {
    return this.context.getImageData(0, 0, this.width, this.height);
};

CanvasImage.prototype.removeCanvas = function () {
    this.canvas.parentNode.removeChild(this.canvas);
};
