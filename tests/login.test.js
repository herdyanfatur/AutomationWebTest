import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import 'chromedriver';

describe('Login & Sort Product Tests', function () {
  this.timeout(30000);

  let driver;

  // ======================
  // HOOK: BEFORE ALL TEST
  // Dengan hook ini, kode login hanya dijalankan sekali sebelum semua test case
  // ======================
  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();

    // buka halaman login
    await driver.get('https://www.saucedemo.com/');

    // isi username
    const usernameField = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="user-name"]')),
      10000
    );
    await usernameField.sendKeys('standard_user');

    // isi password
    const passwordField = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="password"]')),
      10000
    );
    await passwordField.sendKeys('secret_sauce');

    // klik login
    const loginButton = await driver.findElement(
      By.xpath('//*[@id="login-button"]')
    );
    await loginButton.click();

    // tunggu sampai halaman inventory
    await driver.wait(until.urlContains('inventory.html'), 10000);
  });

  // ======================
  // TEST CASE 1: LOGIN
  // ======================
  it('Login sukses', async function () {
    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.include(
      '/inventory.html',
      'User berhasil login'
    );
  });

  // ======================
  // TEST CASE 2: SORT A-Z
  // ======================
  it('Urutkan produk dari A-Z', async function () {

    // dropdown sort
    const filterDropdown = await driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="header_container"]/div[2]/div/span/select')
      ),
      10000
    );

    await filterDropdown.click();

    // pilih A-Z
    const filterAZ = await driver.findElement(
      By.xpath('//*[@id="header_container"]/div[2]/div/span/select/option[1]')
    );
    await filterAZ.click();

    // assert value dropdown = az
    const selectedValue = await filterDropdown.getAttribute('value');
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
