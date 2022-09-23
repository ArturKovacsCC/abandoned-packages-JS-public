const http = require('http');
const fs = require('fs');

const ip = "127.0.0.1";
const port = 9001;
const server = http.createServer((request, response) => {
	//request parameter contains the incoming (request) data from the client side to the server side as an object 
	console.log(request.method);
	console.log(request.url);

	const pkgs = readPackages();
	// console.log(JSON.stringify(pkgs));
	if (request.url === "/") {
		let htmlContents = fs.readFileSync("./index.html").toString();
		htmlContents = htmlContents.replace(
			"LATEST_NPM_RELEASE_DATE",
			pkgs[0].releases[0].date
		);
		response.write(htmlContents);
	} else if (request.url == "/api/package/") {
		console.log("responding to api/package")
		response.setHeader("Content-Type", "application/json");
		response.write(JSON.stringify(pkgs));
	}

	//Don't forget to close your response
	response.end();
});
server.listen(port, ip, () => {
	const addr = server.address();
	console.log(`http://${addr.address}:${addr.port}`);
});

function readPackages() {
	const jsonString = fs.readFileSync("./pkgs.json").toString();
	const pkgs = JSON.parse(jsonString);
	return pkgs.packages;
}
