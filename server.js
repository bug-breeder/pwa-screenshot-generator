
const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const path = require('path');
const os = require('os');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

let browser;
let page;

app.post('/open-browser', async (req, res) => {
  const { device, url } = req.body;
  const userDataDir = path.join(
    os.homedir(),
    'AppData', 'Local', 'Google', 'Chrome', 'User Data'
  );

  try {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        `--user-data-dir=${userDataDir}`
      ]
    });

    page = await browser.newPage();

    if (device === 'pc') {
      await page.setViewport({ width: 1280, height: 800 });
    } else {
      const devices = puppeteer.KnownDevices;
      const deviceDescriptor = devices[device];
      await page.emulate(deviceDescriptor);
    }

    await page.goto(url, { waitUntil: 'networkidle2' });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

app.post('/take-screenshot', async (req, res) => {
  try {
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await page.screenshot({ path: screenshotPath });
    await browser.close();
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
