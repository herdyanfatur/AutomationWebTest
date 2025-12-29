import { By, until } from "selenium-webdriver";

export class InventoryPage {
  constructor(driver) {
    this.driver = driver;
    
    this.sortDropdown = By.xpath('//*[@id="header_container"]/div[2]/div/span/select');

    }

    async sortProductsAZ() {
        await this.driver.wait(
            until.elementLocated(this.sortDropdown),
            10000
        );
        await this.driver.findElement(this.sortDropdown).sendKeys("az");
    }

    async getSelectedSortOption() {
        await this.driver.wait(
            until.elementLocated(this.sortDropdown),
            10000
        );
        const selectedOption = await this.driver.findElement(this.sortDropdown).getAttribute("value");
        return selectedOption;
    }
}