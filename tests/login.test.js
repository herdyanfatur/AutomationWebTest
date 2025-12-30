import { Builder, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { expect } from 'chai';
import 'chromedriver';

import { LoginPages } from '../pages/loginPages.js';
import { InventoryPage } from '../pages/inventoryPage.js';
import { config } from '../config/config.js';

import fs from 'fs';

describe('Login & Sort Product Tests', function () {
  this.timeout(30000);

  let driver;
  let loginPages;
  let inventoryPage;

  // ======================
  // HOOK: BEFORE ALL TEST
  // Dengan hook ini, kode login hanya dijalankan sekali sebelum semua test case
  // ======================
  before(async function () {
    // 🔒 AKTIFKAN INCOGNITO
    const options = new chrome.Options();
    options.addArguments('--incognito');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    loginPages = new LoginPages(driver);
    inventoryPage = new InventoryPage(driver);
    
    fs.mkdirSync(config.screenshotPath, { recursive: true });
    
    // buka halaman login
    await loginPages.open(config.baseUrl);

  });

  beforeEach(async function () {
    // selalu mulai dari halaman login
    await loginPages.open(config.baseUrl);
  });

  // ======================
  // TEST CASE 1: Positive Login
  // ======================
  it('1. Login sukses', async function () {
    await loginPages.login(
      config.validUser.username,
      config.validUser.password
    );

    // tunggu sampai halaman inventory
    await driver.wait(until.urlContains('inventory.html'), config.timeout);
    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.include(
      '/inventory.html',
      'User tidak diarahkan ke halaman inventory setelah login'
    );

    // ambil screenshot halaman inventory
    const screenshot = await driver.takeScreenshot();
    const filePath = `${config.screenshotPath}login-success.png`;

    fs.writeFileSync(filePath, screenshot, 'base64');
  });

  // ======================
  // TEST CASE 2 : Negative Login ( wrong username )
  // ======================

  it('2. Login gagal dengan username salah', async function () {
    await loginPages.login(
      config.invalidUser.username,
      config.invalidUser.password
    );
    const errorMessage = await loginPages.getErrorMessage();
    expect(errorMessage).to.equal(
      'Epic sadface: Username and password do not match any user in this service',
      'Pesan error harus tidak sesuai'
    );

    const screenshot = await driver.takeScreenshot();
    const filePath = `${config.screenshotPath}login-invalid-username.png`;

    fs.writeFileSync(filePath, screenshot, 'base64');

  });

  // ======================
  // TEST CASE 3: Neghative Login ( wrong password )
  // ======================
  it('3. Login gagal dengan password salah', async function () {
    await loginPages.login(
      config.validUser.username,
      config.invalidUser.password
    );

    const errorMessage = await loginPages.getErrorMessage();
    expect(errorMessage).to.equal(
      'Epic sadface: Username and password do not match any user in this service',
      'Pesan error tidak sesuai'
    );

    // ambil ELEMENT error
    const errorElement = await loginPages.getErrorElement();
    const isDisplayed = await errorElement.isDisplayed();

    // pastikan error message tampil
    expect(isDisplayed).to.equal(
      true,
      'Error message harus tampil'
    );

    // ambil screenshot halaman login error
    const screenshot = await driver.takeScreenshot();
    const filePath = `${config.screenshotPath}login-invalid-password.png`;

    fs.writeFileSync(filePath, screenshot, 'base64');

    // assert screenshot tersimpan
    expect(fs.existsSync(filePath)).to.equal(
      true,
      'Screenshot login gagal berhasil dibuat'
    );

  })

  
  // ======================
  // TEST CASE 4 : SORT A-Z
  // ======================
  it('4. Sorting Product', async function () {


    // login dulu
    await loginPages.login(
      config.validUser.username,
      config.validUser.password
    );

    // tunggu sampai halaman inventory
    await driver.wait(until.urlContains('inventory.html'), config.timeout);

    // take an action to sort A-Z from POM method
    await inventoryPage.sortLowToHigh();

    // get the selected value from dropdown
    const selectedValue = await inventoryPage.getSelectedSortOption();

    // assert value dropdown = az
    expect(selectedValue).to.equal(
      'lohi',
      'Produk tidak berhasil diurutkan Z-A'
    );

    // ambil screenshot halaman inventory setelah sort A-Z
    const screenshot = await driver.takeScreenshot();
    const filePath = `${config.screenshotPath}sort-products-az.png`;
    fs.writeFileSync(filePath, screenshot, 'base64');
  });

  // ======================
  // HOOK: AFTER ALL TEST
  // Dengan hook ini, browser akan ditutup setelah semua test case selesai dijalankan
  // ======================
  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
