const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://micassail.com/');
  await page.waitForTimeout(5000); // wait for animations
  await page.screenshot({ path: 'original_site.png', fullPage: true });
  await browser.close();
})();
