const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

let browser;

app.get(express.json());

app.get('/', async function (req, res) {
	res.send(`hello world`);
});

app.get('/link', async function (req, res, next) {
  	const link = await getLink(req.query.njiir)
  	if (!link)
  		res.status(404).send('Something went wrong');

  	res.send(link)
})

app.listen(process.env.PORT || 8080, async () => {
	browser = await puppeteer.launch({headless: false, args: ['--no-sandbox']});
});

const getLink = async njirr => {
	let link;

	try {
		const page = await browser.newPage();

		await page.goto(njirr, {timeout: 300000});

		await page.waitForSelector('div.result > a')
			.then(async () => {
				do {
					link = await page.$eval('div.result > a', el => el.href);
					await new Promise(resolve => setTimeout(resolve, 1500));
				} while (link == 'javascript:;');
				
			})
			.catch(err => console.log(err));

		await page.close();

		return link;
	} catch (e) {
		if (e instanceof puppeteer.errors.TimeoutError) {
			return false;
		}
	}
}

// (async () => {
// 	const link = await getLink("https://www.tetew.info/njir/?r=aHR0cHM6Ly93d3cubmppaXIuY29tL3Avc3RvcGluZy1nZW9tZXRyaWVzLmh0bWw/dXJsPUl5TmZaMk5mSlRGQldDVXhSQ1UxUTNFbE1VVlpaa1JhWTBWYWFVUmhKVFZGV1dadlNWOGxOVUlsTVVNbE4wSmFaaVUxUkNVeE9TVXhOVXhCSlRFM1JrMVlSeVV3TjBWSFN5VXdOazFFVDBkSFR5VXdOazBsTlVWQldrd2xNRGNsTURjbE1USWxOVUpZSlRWREpUVkRKVFF3SXlNJTNE")
// 	console.log(link)
// })();