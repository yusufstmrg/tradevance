const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

    console.log('Navigating to https://tradevance-os.web.app ...');
    await page.goto('https://tradevance-os.web.app', { waitUntil: 'networkidle' });

    console.log('Done.');
    await browser.close();
})();
