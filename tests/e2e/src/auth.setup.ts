import { test as setup } from '@playwright/test';
import { login } from './common';

setup('authenticate', async ({ page }) => {
    await login(page);
});
