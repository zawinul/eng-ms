(function(){
	
function addWait() {
	var container = $(this);
	var d1 = $('<div/>').addClass("wait-outer2").appendTo(container);
	var d2 = $('<div/>').addClass("wait-inner2").appendTo(container).hide().fadeTo(1000,.5);
	var w=0, h=0;
	var t = setInterval(checkSize, 50);

	function checkSize() {
		var _w = container.width();
		var _h = container.height();
		if (w!=_w || h!=_h) {
			w = _w;
			h = _h;
			d1.width(w).height(h);
			d2.width(w).height(h*.5).css({top:h*.25})
		}		
	}

	container.data('waitStop', function() {
		clearInterval(t);
		container.removeClass('wait-container');
		d1.remove();
		d2.remove();
	});
}

jQuery.fn.extend({
	waitStart: function() {
		// if (this.length!=1)
		// 	debugger;
		this.addClass('wait-container');
		this.each(addWait);
		return this;
	},

	waitStop: function() {
		var container = this;
		container.each(function() {
			var element = $(this);
			if (element.data('waitStop'))
				element.data('waitStop')(); 
		})
		return this;
	}
});

})();