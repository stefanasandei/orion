import { Page, TestInfo } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

export const login = async (page: Page) => {
    await page.goto('/login');

    (await page.$('#email'))!.fill('asandei.stefanel@gmail.com');
    (await page.$('#password'))!.fill('asandei.stefanel@gmail.com');
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    await page.waitForURL('/');

    await page.context().storageState({ path: authFile });
};

export const addScreenshot = async (page: Page, name: string, testInfo: TestInfo) => {
    await page.waitForLoadState();
    const screenshot = await page.screenshot();
    testInfo.attach(name, {
        body: screenshot,
        contentType: 'image/png',
    });
}