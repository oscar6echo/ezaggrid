
var JSONfunc = {};

JSONfunc.stringify = function (obj) {
	return JSON.stringify(obj, function (key, value) {
		return (typeof value === 'function') ? value.toString() : value;
	});
};

JSONfunc.parse = function (str) {
	return JSON.parse(str, function (key, value) {
		// console.log(key);
		// console.log(value);

		if (typeof value != 'string') return value;

		var valueCompact = value.replace(/\r?\n|\r/g, '').replace(/\s+/g, ' ');
		var r;
		// console.log(valueCompact);
		if (valueCompact.substring(0, 8) == 'function') {
			r = eval('(' + value + ')');
			return r;
		}
		else if (valueCompact.substring(0, 8) == 'helpers.') {
			r = eval(value);
			return r;
		}
		else {
			return value;
		}
	});
};

