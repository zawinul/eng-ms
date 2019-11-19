function getUrlParameter(name) {
	var s = decodeURIComponent(window.location.search.substring(1));
	var	variables = s.split('&');
	for (var i = 0; i < variables.length; i++) {
		var v = variables[i].split('=');
		if (name != v[0])
			continue;
		return v[1] === undefined ? true : v[1];
	}

	// else return is undefined
};
