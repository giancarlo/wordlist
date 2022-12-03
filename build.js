const {
	buildCxl,
	build,
	tsBundle,
	pkg,
	file,
	minify,
	concat,
} = require("../cxl/dist/build");
const { writeFile } = require("fs/promises");

const json = require("./dataset.json");
const result = [],
	map = {};
let count = 0;
const regex = /^[a-zñáíéúó]+$/;

for (const key in json) {
	if (regex.test(key) && json[key] > 10000) {
		result[json[key]] = key;
		map[key] = json[key];
		count++;
	}
}

console.log(`${count} words found`);

writeFile("es-common.json", JSON.stringify(map), "utf8");
writeFile("es-common.txt", result.filter((n) => n).join("\n"), "utf8");

//buildCxl();
