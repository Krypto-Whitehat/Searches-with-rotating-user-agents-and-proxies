let somiibo;
let settings;

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
  // Add more user agents to make it 1000
];

async function main(mod) {
  somiibo = mod;

  // Initialize the module and get user settings
  await somiibo.initialize(() => {
    settings = somiibo.getSetting();
  });

  // Loop for multiple threads
  for (let i = 0; i < settings.threads; i++) {
    performSearch();
  }
}

async function performSearch() {
  let browser;
  try {
    browser = await somiibo.openBrowser({
      headless: true,
      proxy: settings.proxy,
      userAgent: getRandomUserAgent()
    });

    await browser.goto('https://www.google.de');
    await browser.type('input[name="q"]', settings.searchQuery);
    await browser.click('input[name="btnK"]');
    await browser.waitForNavigation();

    // Scroll down and up
    await scrollPage(browser);
    await browser.select('a h3', { index: '$random' })
      .then(() => browser.scroll('$selected', { offsetY: 150 }))
      .then(() => browser.click());

    // Find and click specific links
    await browser.evaluate(() => {
      let links = document.querySelectorAll('a');
      for (let link of links) {
        if (link.innerText.includes('Websites zu Orten')) {
          link.click();
          break;
        }
      }
    });

    await scrollPage(browser);

    await browser.evaluate(() => {
      let links = document.querySelectorAll('a');
      for (let link of links) {
        if (link.innerText.includes('Bewertungen zu ICE Werbeagentur Köln - Trustpilot')) {
          link.click();
          break;
        }
      }
    });

    somiibo.log('Search completed successfully.');
  } catch (error) {
    somiibo.log('An error occurred:', error);
  } finally {
    if (browser) {
      await browser.stop();
    }
  }
}

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function scrollPage(browser) {
  await browser.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await browser.wait(2000);
  await browser.evaluate(() => {
    window.scrollTo(0, 0);
  });
}

module.exports = main;
