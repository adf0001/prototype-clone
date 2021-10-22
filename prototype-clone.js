
// prototype-merge @ npm
// Like Object.assign(), but all simple objects will be deep-copied into derived objects.

var is_simple_object = require("is-simple-object");

var createRef = function (o, refMap) {
	if (refMap.has(o)) return refMap.get(o);

	var ref = Object.create(o);
	refMap.set(o, ref);		//map the original
	refMap.set(ref, ref);		//map the ref itself

	return ref;
}

var copySingle = function (target, source, refMap) {
	if (!refMap) refMap = new Map();		//map the original to the derived
	if (!target) target = createRef(source, refMap);

	var i, ti, si, si_simple, ni;
	for (i in source) {
		ti = target[i];
		si = source[i];

		if ((si_simple = is_simple_object(si)) && is_simple_object(ti)) {
			//deep copy
			if (Object.prototype.hasOwnProperty.call(target, i)) {
				if (!refMap.has(si) || refMap.get(si) !== ti) copySingle(ti, si, refMap);
				//else console.log("skip already copied, " + i);	//skip already copied
			}
			else {
				target[i] = refMap.has(si) ?
					refMap.get(si) :		//copy already copied
					copySingle(null, si, refMap);
			}
		}
		else {
			//direct copy
			if (si_simple) target[i] = createRef(si, refMap);
			else if (ti !== si) target[i] = si;
			//else { }	//skip same
		}
	}
	return target;
}

var assign = function (target, source1 /*, source2 ... */) {
	var refMap = new Map();		//map the original to the derived

	if (target) refMap.set(target, target);	//target may be referred in sources

	for (var i = 1; i < arguments.length; i++) {
		target = copySingle(target, arguments[i], refMap);
	}
	return target;
}

var clone = function (source1 /*, source2 ... */) {
	return assign.apply(null, [null].concat(Array.prototype.slice.call(arguments)));
}

//module
module.exports = exports = clone;

exports.createRef = createRef;
exports.copySingle = copySingle;
exports.assign = assign;
exports.clone = clone;
