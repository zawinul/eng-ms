
function listaAnnunci(container) {

	var verbose = false;
	var	completed = $.Deferred(),
		elementCreated = $.Deferred(),
		elementLoaded = $.Deferred();

	var dataset = [], visibleElements=0, lastElement=null;
	var disposed = false;
	var filter;
	var keys;
	var cursort = container.data('cursort') || 'none';;

	lastElement = null;
	visibleElements = 0;
	$(window).bind('scroll', onScroll);
	$('.annuncio', container).remove();
	
	container.addClass('la-sortable la-sort-none');
	container.on('ordina', onSortRequest);

	function setFilter(_filter) {
		filter = _filter;
		vendite.ajax.getChiaviDiRicerca().then(function(chiavi) {
			keys = []; // copia locale delle chiavi, per sort
			for(var i=0; i<chiavi.length; i++)
				keys.push(chiavi[i]);
			cursort = container.data('cursort') || 'none'; 
			doSort();
		});
	}

	function onScroll() {
		if (verbose) 
			console.log('scroll catturato da lista annunci');
		docheck();
	}
 
	function onSortRequest(evt, isAsc, isImporto) {
		console.log("onsort "+isAsc+" "+isImporto);
		var nextsort;
		if (isImporto) {
			if (cursort=='importo-asc')
				nextsort = 'importo-desc';
			else if (cursort=='importo-desc')
				nextsort = 'none';
			else 
				nextsort = 'importo-asc';
		}
		else { // is metri quadri
			if (cursort=='mq-asc')
				nextsort = 'mq-desc';
			else if (cursort=='mq-desc')
				nextsort = 'none';
			else 
				nextsort = 'mq-asc';
		}

		console.log('cursort = '+cursort+' nextsort='+nextsort);
		cursort = nextsort;
		console.log('now cursort = '+cursort);
		doSort();
	}

	function doSort() {
		container.data('cursort', cursort);
		container.removeClass('la-sort-none la-sort-importo-asc la-sort-importo-desc la-sort-mq-asc la-sort-mq-desc ');
		container.addClass('la-sort-'+cursort);


		$('.art-box-container', container).remove();
		dataset = [];
		keys.sort(comparaChiavi);
		for(var i=0; i<keys.length; i++) {
			if (filter(keys[i]))
				dataset.push(keys[i].id);
		}
		visibleElements=0;
		lastElement=null;
		
		docheck();
		container.waitStop();
	}

	function comparaChiavi(a,b) {
		if (!cursort || cursort=='none')
			return a.originalSort-b.originalSort;
		else if (cursort=='importo-asc')
			return (a.prezzo || 0)-(b.prezzo ||0);
		else if (cursort=='importo-desc')
			return (b.prezzo || 0)-(a.prezzo ||0);
		else if (cursort=='mq-asc')
			return (a.mq || 0)-(b.mq ||0);
		else if (cursort=='mq-desc')
			return (b.mq || 0)-(a.mq ||0);
		else
			return 0;
	}

	function docheck() {
		setTimeout(checkLastElementVisibility,200);
	}

	function checkLastElementVisibility() {
		if (disposed)
			return;
		if (verbose) console.log('checkLastElementVisibility');
		if (!dataset || visibleElements>=dataset.length) {
			completed.resolve();
			return;
		}
		var ok = true;
		if (lastElement) {
			var offs = lastElement.offset().top;
			var scrolly = $(document).scrollTop().valueOf();
			if (verbose) console.log('offs='+offs+' scrolly='+scrolly);
			if (offs>scrolly+$(window).height())
				ok = false;
		} 
		else {
			if (verbose) console.log('lastElement not present');
		}
		if (verbose) console.log('checkLastElementVisibility -> '+ok);
		
		if (ok) 
			addElement();
		
	} 

	function addElement() {
		var box = $('<div/>').addClass('art-box-container').appendTo(container);
		elementCreated.notify(box);
		var id = dataset[visibleElements];
		visibleElements++;
		vendite.getBoxAnnuncio(id, function(obj){
			if (disposed)
				return;
			lastElement = obj;
			//obj.addClass('annuncio risultato-ricerca');
			box.append(obj);
			elementLoaded.notify(box);
			docheck();
		});		
	}

	function dispose() {
		$(window).unbind('scroll', onScroll);

		elementCreated.reject();
		elementLoaded.reject();
		completed.reject();
		$('.art-box-container', container).remove();
		disposed = true;
	}

	container.addClass('lista-annunci');
	container.waitStart();
	return {
		completed: completed,
		elementCreated: elementCreated,
		elementLoaded: elementLoaded,
		//setData: setData,
		setFilter: setFilter,
		dispose:dispose
	}
}

