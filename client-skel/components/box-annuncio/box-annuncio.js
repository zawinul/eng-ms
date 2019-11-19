(function(){

var delay = 100;

var ready = $.Deferred();	
var templateDiv;

function init() {

	var d = $("<div/>");
	// engapp.load("components/box-annuncio/box-annuncio.css");
	var dependencies = [
		"components/box-annuncio/box-annuncio.css",
		[d, "components/box-annuncio/box-annuncio.html"]
	];

	engapp.load(dependencies).then(function() {
		templateDiv = d.children();
		ready.resolve();
	});
}

engapp.getBoxAnnuncio = function(id, callback) {
	var div;
	ready.then(function(){
		div = templateDiv.clone();
		$('.importo .bottone, .metriquadri .bottone', div).click(onSortClick);
		$('.prima-riga,.foto,.desc,.tab',div).css('visibility', 'hidden')
		div.waitStart();
		setTimeout(function(){
			engapp.ajax.getAnnuncio(id, onAnnuncio);
		}, delay);
		
		if (callback)
			callback(div);
	});

	function onAnnuncio(annuncio) {
		
		$('.link-dettaglio, .lente', div).click(function(){
			engapp.pushPage('dettaglio-annuncio', {id:id});
		});

		if (!annuncio.immobile) {
			console.log("annuncio.immobile=null\n"+JSON.stringify(annuncio,null,2));
			div.hide();
			return;
		}
		$('.desc .inner', div).text(annuncio.immobile.descrizione).attr('title','id='+id);

		var imgset = [annuncio.imgAnteprima];
		if (annuncio.imgElenco)
			for(var i=0;i<annuncio.imgElenco.length; i++)
				imgset.push(annuncio.imgElenco[i]);
		var curPic = 0;

		function setPic(delta) {
			curPic = (curPic+delta+imgset.length)%imgset.length;
			var name = (annuncio.tipoAnnuncio=="LOCAZIONE")?"Affitto Immobile ":"Vendita Immobile ";
			name += annuncio.comune+' '+annuncio.codice+' '+(curPic+1);
			//var url = 'download?type=image&id='+imgset[curPic];
			var url = 'gallery/' + escape(name) + '?id=' + imgset[curPic];

			//console.log('setPic '+curPic+' of '+ imgset.length+'. id='+imgset[curPic]);
			var webimg = $('.foto img', div);
			webimg.parent().waitStart();

			// faccio il preload dell'immagine per poter sapere quando posso spegnere il wait
 			engapp.load(url).then(function(img){
				console.log(img.width+' '+img.height);
				webimg.parent().waitStop();
				webimg.attr({
					src: url,
					alt: name,
					title: name,
				});
				centra(webimg, img);
			});
		}

		function centra(webimg, img) {
			//debugger;
			webimg.hide();
			var w = img.width, h = img.height;
			var box = webimg.parent();
			var bw = box.width(), bh = box.height();
			var wratio = bw/w;
			var hratio = bh/h;
			var f = (wratio>hratio) ? wratio : hratio;
			var cw = w*f, ch=h*f;
			var ml = (bw-cw)/2;
			var mt = (bh-ch)/2;
			//console.log({w:w,h:h,cw:cw,ch:ch,wr:wratio,hr:hratio,f:f,bw:bw,bh:bh, ml:ml, mt:mt});
			webimg.css({
				width: cw,
				height:ch,
				marginLeft: ml,
				marginTop: mt
			});	
			setTimeout(function(){ webimg.show(); },1);
		}

		setPic(0);
		$('.bottone.sinistro', div).click(function(){
			setPic(-1);
		});
		$('.bottone.destro', div).click(function(){
			setPic(1);
		});

		$('.comune', div).text(annuncio.comune);
		$('.provincia', div).text('('+annuncio.provincia+')');

		$('.riferimento .codice', div).text(annuncio.codice).attr('title', annuncio.id);

		//scadenza
		if (annuncio.scadenzaGara && annuncio.scadenzaGara!='null') {
			var datagara = engapp.util.stringToMoment(annuncio.scadenzaGara);
			var oggi = (moment().hour()<12)
				? moment().startOf('day')
				: moment().startOf('day').add(1, 'days');
			var box = $('.box-annuncio-in-scadenza', div);
			var isOn = !datagara.isBefore(oggi);

			box.toggleClass("acceso", isOn).text('scade il '+datagara.format('D/MM/YY'));
		}
		//$('.riferimento', div).text('Rif: ' + annuncio.chiavi.progressivo);
		
		setImporto($('.importo .testo', div), annuncio.prezzoBase);
		setMetriQuadri($('.metriquadri .testo', div), annuncio.mq);
			
		$('.prima-riga,.foto,.desc,.tab',div).css({visibility:'visible'});
		div.waitStop();
	}

	function onSortClick() {
		var d = $(this);
		var isAsc = d.is('.bottone-asc');
		var isImporto = d.is('.bottone-importo');

		console.log({isAsc:isAsc, isImporto:isImporto});
		d.trigger('ordina', [isAsc, isImporto]);
	}
}

function nToS(n) {
	if (n<1000)
		return ""+n;
	var left = nToS(Math.floor(n/1000));
	var right = (""+(1000+n%1000)).substring(1);
	return left+'.'+right;
}

function setImporto(container, x) {
	container.html((x) ? "&euro; "+nToS(x) : "");

}


function setMetriQuadri(container, x) {
	container.html((x) ? "m&sup2; "+nToS(x) : "");
}

engapp.onStart(init);


})()


 