var express = require('express');
var bodyparser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var sharp = require('sharp');
var path = require('path');

var upload = multer({
	dest: './images'
})

var app = express();

app.use("/",express.static('public'))

app.use(bodyparser.urlencoded({
	extended: true
}))


app.post('/upload', upload.single("avatar"), async (req, res) => {
	var ts = Date.now();
	var options = {
		root: path.join(__dirname + `/images`)
	};

	await fs.rename(req.file.path, `./images/org-${ts}.jpg`, (err) => {
		if (err) throw err;
		console.log("Done");
	})

	if (req.query.type == "png") {
		await sharp(__dirname + `/images/org-${ts}.jpg`)
			.png({
				quality: 50
			}).toFile(__dirname +
				`/images/converted-${ts}.png`);
		var fileName = `converted-${ts}.png`;
	} else if (req.query.type == "webp") {
		await sharp(__dirname + `/images/org-${ts}.jpg`)
			.webp({
				quality: 50
			}).toFile(__dirname +
				`/images/converted-${ts}.webp`);
		var fileName = `converted-${ts}.webp`;
	} else {
		await sharp(__dirname + `/images/org-${ts}.jpg`)
			.jpeg({
				quality: 80
			}).toFile(__dirname +
				`/images/converted-${ts}.jpg`);
		var fileName = `converted-${ts}.jpg`;
	}

	res.sendFile(fileName, options, async function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('Sent:', fileName);
		}
	});
});

app.listen(3000, () => {
	console.log("Server Running!")
})