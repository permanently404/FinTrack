import { test, expect } from "@playwright/test";

test.describe('Выход из системы', () => {
    test('Успешный выход и переадресация на login', async ({ page }) => {
        await page.goto('/dashboard');
        await page.getByRole('button', { name: 'Выйти' }).click();

        await expect(page).toHaveURL('/login');

        await page.goto('/dashboard');
        await expect(page).toHaveURL('/login');
    });
})