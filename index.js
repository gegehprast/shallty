const puppeteer = require('puppeteer');
const fs = require("fs");
// const express = require('express');
// const app = express();

// app.use(express.json());

// app.post('/', async function (req, res) {
// 	res.send(`hello world`);
// });

// app.post('/link', async function (req, res, next) {
// 	console.log(req.body)
//   	const link = await getLink(req.body.njiir)
// 	console.log(link);
//   	res.json(link)
// })

// app.listen(process.env.PORT || 8080);


const getLink = async njirr => {
	let seconds = 0;
	const browser = await puppeteer.launch();
	console.log("puppeteer launched");

	const counter = setInterval(function(){ seconds++; }, 1000);

	const page = await browser.newPage();
	console.log("going to njiir https://www.tetew.info/njir/?r="+njirr);
	await page.goto("https://www.tetew.info/njir/?r="+njirr, {timeout: 0});
	await page.waitForNavigation({
	  timeout: 0,
	  waitUntil: 'networkidle0'
	});
	console.log("page retrieved");
	
	const content = await page.content();
	fs.writeFile("njiir.txt", content, (err) => {
	  	if (err) console.log(err);
	  	clearInterval(counter);
	  	console.log(`Successfully Written to File - ${seconds} seconds`);
	});

	const resultDiv = await page.$eval('div.result', nodes => {
		nodes.map( element => {
			return element.querySelector('a').getAttribute('href')
		})
	})

	await browser.close();

	return resultDiv;
}

(async () => {
	const link = await getLink("aHR0cHM6Ly93d3cubmppaXIuY29tL3Avc3RvcGluZy1nZW9tZXRyaWVzLmh0bWw/dXJsPUl5TmZaMk5mSlRGQldDVXhSQ1UxUTNFbE1VVlpaa1JhWTBWYWFVUmhKVFZGV1dadlNWOGxOVUlsTVVNbE4wSmFaaVUxUkNVeE9TVXhOVXhCSlRFM1JrMVlSeVV3TjBWSFN5VXdOazFFVDBkSFR5VXdOazBsTlVWQldrd2xNRGNsTURjbE1USWxOVUpZSlRWREpUVkRKVFF3SXlNJTNE")
	console.log(link)
})();