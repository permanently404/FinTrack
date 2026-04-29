import { test, expect } from "@playwright/test";


test.describe('Регистрация', () => {
    test.use({ storageState: { cookies: [], origins: [] } })

    test('Успешная регистрация', async ({ page }) => {
        await page.goto('/register');
        const email = `test${Date.now()}@example.com`;

        await page.getByLabel('Имя (необязательно)').fill('Test User');
        await page.getByLabel('Email').fill(email);
        await page.getByPlaceholder('Минимум 8 символов').fill('123456789Test')
        await page.getByPlaceholder('Повторите пароль').fill('123456789Test')
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

        await expect(page).toHaveURL('/dashboard');
    });
})