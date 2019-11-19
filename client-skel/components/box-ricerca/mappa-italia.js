vendite.getMappaItalia = function(container, onChange) {
	function initMap() {
		$('.mappa-italia-img', container).maphilight({
			fill: true,
			fillColor: 'ffffff',
			fillOpacity: 0.4,
			stroke: true,
			strokeColor: '000000',
			strokeOpacity: .3,
			strokeWidth: 1,
			fade: true,
			alwaysOn: false,
			neverOn: false,
			groupBy: false,
			wrapClass: true,
			shadow: false,
			shadowX: 0,
			shadowY: 0,
			shadowRadius: 6,
			shadowColor: '000000',
			shadowOpacity: 0.8,
			shadowPosition: 'outside',
			shadowFrom: false
		});
		$('area', container).click(function(){
			// regselect.val($(this).data('id'));
			// regselect.trigger('change');
			if (onChange)
				onChange($(this).data('id'));
		});
	}

	var l = [
		"img/mappa-italia-transp.png",
		"libs/jquery.maphilight.js",
		[container, "components/box-ricerca/mappa-italia.html"]
	];
	container.waitStart();
	vendite.load(l).then(function(){
		initMap();
		container.waitStop();
	});

}