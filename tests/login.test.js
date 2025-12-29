import { Builder, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { expect } from 'chai';
import 'chromedriver';

import { LoginPages } from '../pages/loginPages.js';
import { InventoryPage } from '../pages/inventoryPage.js';

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
    
    // buka halaman login
    await loginPages.open();

  //   // isi username & password
  //   await loginPages.login('standard_user', 'secret_sauce');

  //   // tunggu sampai halaman inventory
  //   await driver.wait(until.urlContains('inventory.html'), 10000);
  });

  beforeEach(async function () {
    // selalu mulai dari halaman login
    await loginPages.open();
  });

  // ======================
  // TEST CASE 1: Positive Login
  // ======================
  it('1. Login sukses', async function () {
    await loginPages.login('standard_user', 'secret_sauce');

    // tunggu sampai halaman inventory
    await driver.wait(until.urlContains('inventory.html'), 10000);
    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.include(
      '/inventory.html',
      'User berhasil login dan diarahkan ke halaman inventory'
    );
  });

  // ======================
  // TEST CASE 2 : Negative Login ( wrong username )
  // ======================

  it('2. Login gagal dengan username salah', async function () {
    await loginPages.login('hahaha', 'secret_sauces');
    const errorMessage = await loginPages.getErrorMessage();
    expect(errorMessage).to.equal(
      'Epic sadface: Username and password do not match any user in this service',
      'Pesan error harus sesuai'
    );
  });

  // ======================
  // TEST CASE 3: Neghative Login ( wrong password )
  // ======================
  it('3. Login gagal dengan password salah', async function () {
    await loginPages.login('standard_user', 'hahahaha');

    const errorMessage = await loginPages.getErrorMessage();
    expect(errorMessage).to.equal(
      'Epic sadface: Username and password do not match any user in this service',
      'Pesan error harus sesuai'
    );
  })

  
  // ======================
  // TEST CASE 4 : SORT A-Z
  // ======================
  it('4. Urutkan produk dari A-Z', async function () {


    // login dulu
    await loginPages.login('standard_user', 'secret_sauce');

    // tunggu sampai halaman inventory
    await driver.wait(until.urlContains('inventory.html'), 10000);

    // take an action to sort A-Z from POM method
    await inventoryPage.sortProductsAZ();

    // get the selected value from dropdown
    const selectedValue = await inventoryPage.getSelectedSortOption();

    // assert value dropdown = az
    expect(selectedValue).to.equal(
      'az',
      'Produk berhasil diurutkan A-Z'
    );
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
