import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
    private usernameInput = this.page.locator('xpath=//*[contains(@type, "email")]');
    private passwordInput = this.page.locator('xpath=//*[contains(@type, "password")]');
    private submitButton = this.page.locator('button[type="submit"]');

    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string) {
        await this.navigate('/');
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }
}