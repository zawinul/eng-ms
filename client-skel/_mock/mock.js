function fotoRandom() {
	return "mock/foto/"+Math.floor(Math.random()*10)+".jpg"
}

function testoRandom(nmin, nmax) {
	var num_parole = nmin+Math.floor(Math.random(nmax-nmin+1));
	var l = testoRandom.t.length;
	var s = Math.floor(Math.random()*l);
	var k = [];
	for(var i=0; i<num_parole; i++) {
		k.push(testoRandom.t[s]);
		s = (s+1)%l;
	}
	var ret = k.join(' ');
	ret = ret.substring(0,1).toUpperCase()+ret.substring(1);
	return ret+' '+num_parole;
}

testoRandom.t ="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc.".split(" ");

function luogoRandom(territorio) {
	var r = Math.floor(Math.random()*territorio.regioni.length);
	var reg = territorio.regioni[r];
	var p = Math.floor(Math.random()*reg.province.length);
	var prov = reg.province[p];
	var c = Math.floor(Math.random()*prov.comuni.length);
	var com = prov.comuni[c];
	return { reg:reg, prov:prov, com:com, r:r, p:p, c:c};
}

