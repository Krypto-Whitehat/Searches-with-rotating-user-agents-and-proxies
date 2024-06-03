const { Module, Browser } = require('somiibo');
const fs = require('fs');

class GoogleSearch extends Module {
  constructor() {
    super();
    this.name = 'google-search';
    this.userAgents = JSON.parse(fs.readFileSync('./google-search/user_agents.json', 'utf8'));
  }

  async run() {
    const proxy = this.settings.get('proxy');
    const threads = this.settings.get('threads');
    const rotationTime = this.settings.get('rotationTime');
    
    for (let i = 0; i < threads; i++) {
      this.performSearch(proxy, rotationTime);
    }
  }

  async performSearch(proxy, rotationTime) {
    const browser = new Browser({
      headless: true,
      proxy: proxy,
      userAgent: this.getRandomUserAgent()
    });

    try {
      await browser.goto('https://www.google.de');
      await browser.type('input[name="q"]', 'Werbeagentur Köln');
      await browser.click('input[name="btnK"]');
      await browser.waitForNavigation();
      await this.scrollPage(browser);
      await browser.clickLinkByText('Websites zu Orten');
      await this.scrollPage(browser);
      await browser.clickLinkByText('Bewertungen zu ICE Werbeagentur Köln - Trustpilot');
      this.log('Search completed successfully.');
    } catch (error) {
      this.log('An error occurred:', error);
    } finally {
      await browser.close();
      if (rotationTime > 0) {
        setTimeout(() => this.performSearch(proxy, rotationTime), rotationTime);
      }
    }
  }

  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async scrollPage(browser) {
    await browser.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await browser.wait(2000);
    await browser.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }
}

module.exports = GoogleSearch;
