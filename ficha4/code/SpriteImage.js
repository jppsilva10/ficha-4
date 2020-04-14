"use strict";

class SpriteImage
{
	constructor(x, y, w, h, speed, clickable, img)
	{
		//posição e movimento
		this.xIni = x;
		this.yIni = y;
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.speedIni = speed;
		this.speed = speed;

		//imagem
		this.img = img;
		this.imageData = this.getImageData(img);		
		
		//rato
		this.clickableIni = clickable;
		this.clickable = clickable;

		this.up= false;
		this.down= false;
		this.left= false;
		this.right= false;
		this.mouseDown= false;
		this.draggable= false;
		this.mouseOffsetX = 0;
		this.mouseOffsetY = 0;			
	}


	draw(ctx)
	{
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}


	clear(ctx)
	{
		ctx.clearRect(this.x, this.y, this.width, this.height);
	}	


	reset(ev, ctx)
	{
		this.clear(ctx);
		this.x = this.xIni;
		this.y = this.yIni;
		this.speed = this.speedIni;
		this.clickable = this.clickableIni;
	}


	mouseOverBoundingBox(ev) //ev.target é a canvas
	{
		var mx = ev.offsetX;  //mx, my = mouseX, mouseY na canvas
		var my = ev.offsetY;

		if (mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height)
			return true;
		else
			return false;
	}


	clickedBoundingBox(ev) //ev.target é a canvas
	{
		if (!this.clickable)
			return false;
		else
			return this.mouseOverBoundingBox(ev);
	}

	getImageData(img){
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, this.width, this.height);
		return ctx.getImageData(0, 0, this.width, this.height);
	}

	static intersectsBoundingBox(sp1, sp2){
		if(sp1.x > sp2.x+ sp2.width || sp2.x > sp1.x+ sp1.width)
			return false;
		if(sp1.y > sp2.y+ sp2.height || sp2.y > sp1.y+ sp1.height)
			return false;
		return true;
	}

	intersectsPixelCheck(sp2){
		if(SpriteImage.intersectsBoundingBox(this, sp2)){
			var xMin = Math.max(this.x, sp2.x);
			var xMax = Math.min(this.x + this.width, sp2.x + sp2.width);
			var yMin = Math.max(this.y, sp2.y);
			var yMax = Math.min(this.y + this.height, sp2.y + sp2.height);

			for(let x = xMin; x <= xMax; x++){
				for(let y = yMin; y <= yMax; y++){
					// sprite 1
					var xLocal = Math.round(x - this.x);
					var yLocal = Math.round(y - this.y);
					var pixelIndex1 = yLocal * this.width + xLocal;
					pixelIndex1 = pixelIndex1 * 4 + 3;
					// sprite 2
					xLocal = Math.round(x - sp2.x);
					yLocal = Math.round(y - sp2.y);
					var pixelIndex2 = yLocal * sp2.width + xLocal;
					pixelIndex2 = pixelIndex2 * 4 + 3;

					if(this.imageData.data[pixelIndex1] && sp2.imageData.data[pixelIndex2]){
						return true;
					}
				}
			}
			return false;
		}
		else{
			return false;
		}
	}
	clickedPixelCheck(ev){
		if(this.clickedBoundingBox(ev)){
			var xLocal = Math.round(ev.offsetX - this.x);
			var yLocal = Math.round(ev.offsetY - this.y);

			var pixelIndex = yLocal * this.width + xLocal;
			pixelIndex = pixelIndex * 4 + 3;
			if(this.imageData.data[pixelIndex]){
				return true;
			}
			return false;
		}
		else{
			return false;
		}
	}
	mouseOverPixelCheck(ev){
		if(this.mouseOverBoundingBox(ev)){
			var xLocal = Math.round(ev.offsetX - this.x);
			var yLocal = Math.round(ev.offsetY - this.y);

			var pixelIndex = yLocal * this.width + xLocal;
			pixelIndex = pixelIndex * 4 + 3;
			if(this.imageData.data[pixelIndex]){
				return true;
			}
			return false;
		}
		else{
			return false;
		}
	}
}