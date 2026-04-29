import { test, expect } from "@playwright/test";


test.describe('Авторизация', () => {
    test.use({ storageState: { cookies: [], origins: [] } })

    test('Успешный логин', async ({ page }) => {
        await page.goto('/');

        await page.getByLabel('Email').fill('test@test.com');
        await page.getByLabel('Пароль').fill('12345Test');
        await page.getByRole('button', { name: 'Войти' }).click();

        await expect(page).toHaveURL('/dashboard');
    });

    test('Неверный пароль', async ({ page }) => {
        await page.goto('/');

        await page.getByLabel('Email').fill('test@test.com');
        await page.getByLabel('Пароль').fill('wrongpassword');
        await page.getByRole('button', { name: 'Войти' }).click();

        await expect(page.getByText('Неверный email или пароль')).toBeVisible();
        await expect(page).toHaveURL('/login');
    });

}) 