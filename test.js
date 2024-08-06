const puppeteer = require('puppeteer');
const os = require('os');
const path = require('path');
const { KnownDevices } = puppeteer;

async function captureScreenshot(url, width, height, outputPath, mode) {
    const userDataDir = path.join(
        os.homedir(),
        'AppData', 'Local', 'Google', 'Chrome', 'User Data'
    );

    const browser = await puppeteer.launch({
        headless: false, // Run in headless mode or not
        args: [
            `--user-data-dir=${userDataDir}`
        ]
    });

    const page = await browser.newPage();

    if (mode === 'mobile') {
        const iPhone = KnownDevices['iPhone 11'];
        await page.emulate(iPhone);
    } else {
        await page.setViewport({ width: width, height: height });
    }

    // Navigate to the specified URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Take a screenshot of the viewport
    await page.screenshot({ path: outputPath });

    await browser.close();
    console.log(`Screenshot saved to ${outputPath}`);
}

// Command-line arguments for URL, width, height, output path, and mode (pc/mobile)
const args = process.argv.slice(2);
if (args.length < 5) {
    console.error('Usage: node screenshot.js <url> <width> <height> <outputPath> <mode (pc/mobile)>');
    process.exit(1);
}

const [url, width, height, outputPath, mode] = args;

captureScreenshot(url, parseInt(width), parseInt(height), outputPath, mode);

