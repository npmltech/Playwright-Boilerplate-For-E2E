import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    async navigate(path: string) {
        const base = process.env.BASE_URL || 'https://testerbud.com/practice-login-form';
        const url = path === '/' ? base : `${base}${path}`;
        console.log('Navigating to:', url);
        await this.page.goto(url);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}