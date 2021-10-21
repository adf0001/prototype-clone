
// prototype-merge @ npm
// Like Object.assign(), but all simple objects will be deep-copied into derived objects.

var is_simple_object = require("is-simple-object");

//prototype-clone
module.exports = function (source1 /*, source2 ... */) {
	var map = new Map();		//map the original to the derived

	var copySingle = function (target, source) {
		var i, ti, si, si_simple, ni;
		for (i in source) {
			ti = target[i];
			si = source[i];

			if ((si_simple = is_simple_object(si)) && is_simple_object(ti)) {
				//deep copy
				if (map.has(ti)) {
					target[i] = ni = map.get(ti);
					if (map.has(si) && map.get(si) === ni) {		//already copied
						//console.log("skip copied, "+ i);
						continue;
					}
				}
				else {
					target[i] = ni = Object.create(ti);		//create new
					map.set(ti, ni);		//map the original
					map.set(ni, ni);		//map the derived itself
				}
				copySingle(ni, si);
			}
			else {
				//direct copy
				if (!si_simple) { if (ti !== si) target[i] = si; }
				else if (map.has(si)) { target[i] = map.get(si); }
				else {
					target[i] = ni = Object.create(si);		//create new
					map.set(si, ni);		//map the original
					map.set(ni, ni);		//map the derived itself
				}
			}
		}
	}

	var dest = Object.create(source1);
	for (var i = 0; i < arguments.length; i++) {	//i=0 to derive all simple objects
		copySingle(dest, arguments[i]);
	}
	return dest;
}
