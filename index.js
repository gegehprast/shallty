const puppeteer = require('puppeteer');
const fs = require("fs");
const express = require('express');
const app = express();

app.get(express.json());

app.get('/', async function (req, res) {
	res.send(`hello world`);
});

app.get('/link', async function (req, res, next) {
	// console.log(req.query.njiir)
  	const link = await getLink(req.query.njiir)
	// console.log(link);
  	res.send(link)
})

app.listen(process.env.PORT || 8080);


const getLink = async njirr => {
	// let seconds = 0;
	const browser = await puppeteer.launch({args: ['--no-sandbox']});
	// console.log("puppeteer launched");

	// const counter = setInterval(function(){ seconds++; }, 1000);

	const page = await browser.newPage();
	// console.log("going to "+njirr);
	await page.goto(njirr, {timeout: 0});
	await page.waitForNavigation({
	  timeout: 0,
	  waitUntil: 'networkidle0'
	});
	// console.log("page retrieved");
	
	// const content = await page.content();
	// fs.writeFile("njiir.txt", content, (err) => {
	  	// if (err) console.log(err);
	  	// clearInterval(counter);
	  	// console.log(`Successfully Written to File - ${seconds} seconds`);
	// });

	const resultDiv = await page.$('div.result');
	const link = await resultDiv.$eval('a', el => el.getAttribute('href'));

	await browser.close();

	return link;
}

// (async () => {
// 	const link = await getLink("https://www.tetew.info/njir/?r=aHR0cHM6Ly93d3cubmppaXIuY29tL3Avc3RvcGluZy1nZW9tZXRyaWVzLmh0bWw/dXJsPUl5TmZaMk5mSlRGQldDVXhSQ1UxUTNFbE1VVlpaa1JhWTBWYWFVUmhKVFZGV1dadlNWOGxOVUlsTVVNbE4wSmFaaVUxUkNVeE9TVXhOVXhCSlRFM1JrMVlSeVV3TjBWSFN5VXdOazFFVDBkSFR5VXdOazBsTlVWQldrd2xNRGNsTURjbE1USWxOVUpZSlRWREpUVkRKVFF3SXlNJTNE")
// 	console.log(link)
// })();