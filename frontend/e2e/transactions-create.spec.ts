import { test, expect } from "@playwright/test";

test.describe('Создание транзакции', () => {
    test('Успешное создание транзакции', async ({ page }) => {
        await page.goto('/transactions');
        await page.getByRole('button', { name: 'Добавить транзакцию' }).click();

        await page.getByLabel('Название').fill('Тестовая транзакция');
        await page.getByLabel('Сумма (₽)').fill('1000');
        await page.getByLabel('Тип').selectOption('income');
        await page.getByLabel('Категория').selectOption('salary');
        await page.getByRole('button', { name: 'Сохранить' }).click();

        await expect(page.getByRole('cell', { name: 'Тестовая транзакция' })).toBeVisible()
    })
})
