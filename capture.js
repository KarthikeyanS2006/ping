const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const sites = [
  { name: 'srikeyan-main', url: 'https://srikeyan.gt.tc/' },
  { name: 'srikeyan-mail', url: 'https://srikeyanmail.gt.tc/' },
  { name: 'srikeyan-drive', url: 'https://srikeyandrive.gt.tc/' },
  { name: 'srikeyan-docs', url: 'https://srikeyanword.gt.tc/' }
];

(async () => {
  const outputDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  for (const site of sites) {
    const page = await context.newPage();
    console.log(`Navigating to ${site.url}...`);
    try {
      await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60000 });
      // Extra 3-second buffer to allow any JS redirects or host security checks to clear
      await page.waitForTimeout(3000); 
      
      const filePath = path.join(outputDir, `${site.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`Saved ${filePath}`);
    } catch (error) {
      console.error(`Failed to capture ${site.url}:`, error.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
})();
