// global, for html page
assert = require("assert");
prototype_clone = require("../prototype-clone.js");

prototype_stringify = require("prototype-stringify");   //tool for debug

module.exports = {

	"prototype_clone()": function (done) {
		var a = { b: 1, c: { d: 2 }, e: { f: 3 } };
		var a_s0 = JSON.stringify(a);

		//clone 1 object
		var aa = prototype_clone(a);

		assert(aa.b === 1 && aa.c.d === 2 && aa.e.f === 3);		//value from prototype

		assert(JSON.stringify(aa) === '{"c":{},"e":{}}');	//clone as void
		assert(prototype_stringify(aa) === '{"b":1,"c":{"d":2},"e":{"f":3}}');

		aa.c.dd = 22;
		aa.e.f = 33;
		aa.e.ff = 333;
		aa.gg = 44;

		assert(JSON.stringify(aa) === '{"c":{"dd":22},"e":{"f":33,"ff":333},"gg":44}');
		assert(prototype_stringify(aa) === '{"b":1,"c":{"d":2,"dd":22},"e":{"f":33,"ff":333},"gg":44}');

		//clone from 2 objects
		var aaa = prototype_clone(a, { c: { dd: 22 }, e: { f: 33, ff: 333 }, gg: 44 });
		assert(JSON.stringify(aaa) === '{"c":{"dd":22},"e":{"f":33,"ff":333},"gg":44}');
		assert(prototype_stringify(aaa) === '{"b":1,"c":{"d":2,"dd":22},"e":{"f":33,"ff":333},"gg":44}');

		//source is unchanged
		assert(a_s0 === JSON.stringify(a));

		//change source prototype
		a.h = 5;

		assert(aa.h === 5 && aaa.h === 5);		//value from prototype

		//unchanged owned property
		assert(JSON.stringify(aa) === '{"c":{"dd":22},"e":{"f":33,"ff":333},"gg":44}');
		//changed from prototype
		assert(prototype_stringify(aa) === '{"b":1,"c":{"d":2,"dd":22},"e":{"f":33,"ff":333},"gg":44,"h":5}');
		//unchanged owned property
		assert(JSON.stringify(aaa) === '{"c":{"dd":22},"e":{"f":33,"ff":333},"gg":44}');
		//changed from prototype
		assert(prototype_stringify(aaa) === '{"b":1,"c":{"d":2,"dd":22},"e":{"f":33,"ff":333},"gg":44,"h":5}');

		done(false);
	},

	"duplicated": function (done) {
		var a = { b: 1, c: { d: 2 }, e: { f: 3 } };
		a.g = a.e;

		//clone 1 object
		var aa = prototype_clone(a);

		assert(JSON.stringify(aa) === '{"c":{},"e":{},"g":{}}');

		//change target value in duplicated
		aa.e.ff = 33;

		//clone same object only 1 time
		assert(JSON.stringify(aa) === '{"c":{},"e":{"ff":33},"g":{"ff":33}}');

		done(false);
	},


};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('mocha-test', function () { for (var i in module.exports) { it(i, module.exports[i]); } });
