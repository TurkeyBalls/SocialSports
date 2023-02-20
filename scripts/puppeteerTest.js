const puppeteer = require('puppeteer');
async function main() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://playtomic.io/surge-padel/18fda907-f989-4d40-b124-b8bf98ecbbd2?q=PADEL~2023-02-11~~~');
	await page.setBypassCSP(true)
	// await page.screenshot({'path': 'oxylabs_js.png'})
	const document = await page.evaluate(() => document.body);
	console.log(">>", document)
	await browser.close();
}
main();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://playtomic.io/surge-padel/18fda907-f989-4d40-b124-b8bf98ecbbd2?q=PADEL~2023-02-11~~~');

  const data = await page.evaluate(() => {
    console.log( document.querySelector('body'))
  });

  console.log(data);

  await browser.close();
})();