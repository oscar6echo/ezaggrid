
let gzip = {};

gzip.compress = function (jsonStr, level) {
	let binaryString = pako.deflate(jsonStr, {
		level: level,
		to: 'string'
	});
	return binaryString;
}

gzip.uncompress = function (binaryString, level) {
	let string = pako.inflate(binaryString, {
		level: level,
		to: 'string'
	});
	return string;
}

gzip.compressStrToBase64 = function (string, level){
	let binaryString = gzip.compress(string, level);
	let base64Str = btoa(binaryString);
	return base64Str;
}

gzip.uncompressBase64ToStr = function (base64Str, level){
	console.log('b2');
	console.log('base64Str');
	console.log(base64Str);

	let binaryString = atob(base64Str);

	console.log('binaryString');
	console.log(binaryString);

	let string = gzip.uncompress(binaryString, level);
	console.log('string');
	console.log(string);



	return string;
}


