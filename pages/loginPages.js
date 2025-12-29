import { By, until } from "selenium-webdriver";

export class LoginPages {
  constructor(driver) {
    this.driver = driver;

    // Locators
    this.usernameField = By.xpath('//input[@id="user-name"]');
    this.passwordField = By.xpath('//input[@id="password"]');
    this.loginButton = By.xpath('//input[@id="login-button"]');

    // locator error message
    this.errorMessage = By.xpath('//*[@id="login_button_container"]/div/form/div[3]/h3');  
  }

  async open() {
        await this.driver.get('https://www.saucedemo.com/');
    }

    async login(username, password) {
        await this.driver.wait(
            until.elementLocated(this.usernameField),
            10000
        );
        await this.driver.findElement(this.usernameField).sendKeys(username);

        await this.driver.wait(
            until.elementLocated(this.passwordField),
            10000
        );
        await this.driver.findElement(this.passwordField).sendKeys(password);

        await this.driver.wait(
            until.elementLocated(this.loginButton),
            10000
        );
        await this.driver.findElement(this.loginButton).click();
    }

    async getErrorElement() {
        return await this.driver.findElement(By.xpath('//*[@id="login_button_container"]/div/form/div[3]/h3'));
    }

    async getErrorMessage() {
        await this.driver.wait(
            until.elementLocated(this.errorMessage),
            10000
        );
        const errorText = await this.driver.findElement(this.errorMessage).getText();
        return errorText;
    }
}