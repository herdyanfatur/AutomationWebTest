import { By, until } from "selenium-webdriver";
import { Select } from 'selenium-webdriver/lib/select.js';

export class InventoryPage {
  constructor(driver) {
    this.driver = driver;
    
    this.sortDropdown = By.css('.product_sort_container');

    }
    // ======================
    // SORT ALL VALUES METHOD
    // ======================
    async sortByValue(value) {
      const dropdownElement = await this.driver.wait(
        until.elementLocated(this.sortDropdown),
        10000
      );
        const select = new Select(dropdownElement);
        await select.selectByValue(value);
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