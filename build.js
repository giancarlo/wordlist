const {
	buildCxl,
	build,
	tsBundle,
	pkg,
	file,
	minify,
	concat,
} = require("../cxl/dist/build");
const { readFileSync } = require("fs");
const { writeFile } = require("fs/promises");

// Dataset from https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists#Spanish

//const json = require("./dataset.json");
const data = readFileSync("es-corpus-10000.txt", "utf8");
const result = [];
const regex = /^\s+\d+\.\s+([a-zñáíéúó]+)/gm;

let m;
while ((m = regex.exec(data))) {
	result.push(m[1]);
}
console.log(result.length);
writeFile("es-common.txt", result.join("\n"));

/*
console.log(`${count} words fo
writeFile("es-common.json", JSON.stringify(result), "utf8");
writeFile(
	"es-common.txt",
	Object.entries(result)
		.sort((a, b) => (a[1] > b[1] ? -1 : 1))
		.map((r) => r[0])
		.join("\n"),
	"utf8"
);*/

//buildCxl();
