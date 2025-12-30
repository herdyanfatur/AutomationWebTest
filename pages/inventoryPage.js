import { By, until } from "selenium-webdriver";
import { Select } from 'selenium-webdriver/lib/select.js';

export class InventoryPage {
  constructor(driver) {
    this.driver = driver;
    
    this.sortDropdown = By.css('.product_sort_container');

    }

  // ======================
  // SORT: A - Z
  // ======================
  async sortProductsAZ() {
    const dropdown = await this.driver.wait(
      until.elementLocated(this.sortDropdown),
      10000
    );

    const select = new Select(dropdown);
    await select.selectByValue('az');
  }

  
  // ======================
  // SORT: PRICE LOW → HIGH (lohi)
  // ======================
  async sortLowToHigh() {
    const dropdown = await this.driver.wait(
      until.elementLocated(this.sortDropdown),
      10000
    );

    const select = new Select(dropdown);
    await select.selectByValue('lohi');
  }

    // ======================
    // GET SELECTED SORT VALUE
    // ======================
  async getSelectedSortOption() {
    const dropdown = await this.driver.wait(
      until.elementLocated(this.sortDropdown),
      10000
    );

    return await dropdown.getAttribute('value');
  }
}