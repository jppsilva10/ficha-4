"use strict";

(function()
{
	window.addEventListener("load", main);
}());


function main()
{
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var spArray;  //sprite array
	var som;

	canvas.addEventListener("initend", initEndHandler);
	init(ctx);  //carregar todos os componentes

	//funções locais para gestão de eventos
	function initEndHandler(ev)
	{
		//instalar listeners do rato	
		ctx.canvas.addEventListener("click", cch);
		
		spArray = ev.spArray;
		som = ev.som;

		function move(ev){
			switch(ev.keyCode){
				case 38:
					spArray[1].up=true;
					break;
				case 37:
					spArray[1].left=true;
					break;
				case 40:
					spArray[1].down=true;
					break;
				case 39:
					spArray[1].right=true;
					break;
			}
		}
		function stop(ev){
			switch(ev.keyCode){
				case 38:
					spArray[1].up=false;
					break;
				case 37:
					spArray[1].left=false;
					break;
				case 40:
					spArray[1].down=false;
					break;
				case 39:
					spArray[1].right=false;
					break;
			}
		}
		window.addEventListener("keydown", move);
		window.addEventListener("keyup", stop);

		function mouseDownHandler(ev){
			var sp = spArray[1];
			if(sp.draggable && sp.mouseOverPixelCheck(ev)){
				sp.mouseDown= true;
				sp.mouseOffsetX = ev.offsetX - sp.x;
				sp.mouseOffsetY = ev.offsetY - sp.y;
			}
		}

		function mouseMoveHandler(ev){
			var sp = spArray[1];
			if(sp.draggable && sp.mouseDown){
				sp.x = ev.offsetX - sp.mouseOffsetX;
				sp.y = ev.offsetY - sp.mouseOffsetY;
			}
		}

		function mouseUpHandler(ev){
			spArray[1]. mouseDown=false;
		}

		window.addEventListener("mousedown", mouseDownHandler);
		window.addEventListener("mousemove", mouseMoveHandler);
		window.addEventListener("mouseup", mouseUpHandler);

		//iniciar a animação
		startAnim(ctx, spArray, som);
	}

	var cch = function(ev)
	{
		canvasClickHandler(ev, ctx, spArray, som);	
	}


}


//init: carregamento de componentes
function init(ctx)
{
	var nLoad = 0;
	var totLoad = 3;
	var spArray = new Array(totLoad-1);

	//estilos de texto
	ctx.fillStyle = "#993333";
	ctx.font = "12px helvetica";	
	ctx.textBaseline = "bottom"; 
	ctx.textAlign = "center";  

	//carregar imagens e criar sprites
	var img1 = new Image(); 
	img1.addEventListener("load", imgLoadedHandler);
	img1.id="car";
	img1.src = "resources/car.png";  //dá ordem de carregamento da imagem

	var img2 = new Image(); 
	img2.addEventListener("load", imgLoadedHandler);
	img2.id="turbo";
	img2.src = "resources/turbo.png";  //dá ordem de carregamento da imagem

	var som = new Audio();
	som.addEventListener("canplaythrough", imgLoadedHandler);
	som.id="som";
	som.src = "resources/turbo.mp3";


	function imgLoadedHandler(ev)
	{
		var img = ev.target;

		var nw;
		var nh;
		if(img.id!="som"){
			nw = img.naturalWidth;
			nh = img.naturalHeight;
		}
		//var sp;

		switch(img.id){
			case "car":
				var sp = new SpriteImage(0, 0, Math.round(nw/4), Math.round(nh/4), 1, false, img);
				spArray[0] = sp;
				break;
			case "turbo":
				var sp = new SpriteImage(Math.round(ctx.canvas.width/2), 10, Math.round(nw), Math.round(nh), 1, false, img);
				spArray[1] = sp;
				break;
		}

		nLoad++;		

		if (nLoad == totLoad)
		{
			var ev2 = new Event("initend");
			ev2.spArray = spArray;
			ev2.som = som;
			ctx.canvas.dispatchEvent(ev2);
		}
	}	
}


//iniciar animação
function startAnim(ctx, spArray, som)
{
	draw(ctx, spArray);
	spArray[1].draggable = true;
	animLoop(ctx, spArray, som, 0);	
}


//desenhar sprites
function draw(ctx, spArray)
{
	var dim = spArray.length;

	for (let i = 0; i < dim; i++)
	{
		spArray[i].draw(ctx);
	}
}


//apagar sprites
function clear(ctx, spArray)
{
	var dim = spArray.length;

	for (let i = 0; i < dim; i++)
	{
		spArray[i].clear(ctx);
	}
}


//-------------------------------------------------------------
//--- controlo da animação: coração da aplicação!!!
//-------------------------------------------------------------
var auxDebug = 0;  //eliminar
function animLoop(ctx, spArray, som, startTime, time)
{	
	var al = function(time)
	{
		if(startTime==0){
			startTime = time;
		}
		animLoop(ctx, spArray, som, startTime, time);
	}
	var reqID = window.requestAnimationFrame(al);
	render(ctx, spArray, reqID, time - startTime, som);
}

//resedenho, actualizações, ...
function render(ctx, spArray, reqID, dt, som)
{
	var cw = ctx.canvas.width;
	var ch = ctx.canvas.height;

	//apagar canvas
	ctx.clearRect(0, 0, cw, ch);

	//animar sprites
	var sp = spArray[0];
	if(sp.intersectsPixelCheck(spArray[1])){
		sp.speed=10;
		som.play();
		spArray[1].x = Math.round(ctx.canvas.width/2);
		spArray[1].y = Math.round(ctx.canvas.height/2);
		spArray[1].draggable = false;
	}
	if (sp.x + sp.width < cw)
	{
		if (sp.x + sp.width + sp.speed > cw)
			sp.x = cw - sp.width;
		else
			sp.x = sp.x + sp.speed;		
	}
	else
	{
		window.cancelAnimationFrame(reqID);
		var dim = spArray.length;

		for (let i = 0; i < dim; i++)
		{
			spArray[i].clickable = true;
		}

		spArray[1].draggable= false;
		//make clickable
	}

	sp = spArray[1];
	if(sp.right){
		if (sp.x + sp.width < cw)
		{
			if (sp.x + sp.width + sp.speed > cw)
				sp.x = cw - sp.width;
			else
				sp.x = sp.x + sp.speed;		
		}
	}
	if(sp.left){
		if (sp.x > 0)
		{
			if (sp.x - sp.speed < 0)
				sp.x = 0;
			else
				sp.x = sp.x - sp.speed;		
		}
	}
	if(sp.up){
		if (sp.y > 0)
		{
			if (sp.y - sp.speed < 0)
				sp.y = 0;
			else
				sp.y = sp.y - sp.speed;		
		}
	}
	if(sp.down){
		if (sp.y + sp.height < ch)
		{
			if (sp.y + sp.height + sp.speed > ch)
				sp.y = ch - sp.height;
			else
				sp.y = sp.y + sp.speed;		
		}
	}


	//redesenhar sprites e texto
	var txt = "Time: " + Math.round(dt) + " msec";
	ctx.fillText(txt, cw/2, ch);

	draw(ctx, spArray);
}


//-------------------------------------------------------------
//--- interacção com o rato
//-------------------------------------------------------------
function canvasClickHandler(ev, ctx, spArray, som)
{
	if (spArray[0].clickedPixelCheck(ev) || spArray[1].clickedPixelCheck(ev))
	{
		var dim = spArray.length;

		for (let i = 0; i < dim; i++)
		{
			spArray[i].reset(ev, ctx);
		}	
		spArray[1].draggable = true;
		animLoop(ctx, spArray, som, 0);
	}
}