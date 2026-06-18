// e2e/auth.spec.ts

import { expect, test } from '@playwright/test';

test.describe('管理端登录', () => {
  test('正确的凭据应登录成功并跳转到管理面板', async ({ page }) => {
    await page.goto('/admin/login');

    await page.getByLabel('用户名').fill('admin');
    await page.getByLabel('密码').fill('password');
    await page.getByRole('button', { name: '登录' }).click();

    await expect(page).toHaveURL(/\/admin(\/)?$/, { timeout: 10_000 });
    await expect(page.getByText('管理端')).toBeVisible();
  });

  test('错误的凭据应显示错误提示', async ({ page }) => {
    await page.goto('/admin/login');

    await page.getByLabel('用户名').fill('admin');
    await page.getByLabel('密码').fill('wrong-password');
    await page.getByRole('button', { name: '登录' }).click();

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 5_000 });
    // 应停留在登录页
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('空用户名应显示验证提示', async ({ page }) => {
    await page.goto('/admin/login');

    await page.getByRole('button', { name: '登录' }).click();

    await expect(page.getByText('请输入用户名')).toBeVisible();
  });

  test('登录后刷新应保持登录状态', async ({ page }) => {
    await page.goto('/admin/login');

    await page.getByLabel('用户名').fill('admin');
    await page.getByLabel('密码').fill('password');
    await page.getByRole('button', { name: '登录' }).click();

    await expect(page).toHaveURL(/\/admin(\/)?$/, { timeout: 10_000 });

    await page.reload();

    // 刷新后仍应停留在管理面板，不被重定向到登录页
    await expect(page).toHaveURL(/\/admin/, { timeout: 10_000 });
    await expect(page).not.toHaveURL(/\/admin\/login/);
  });
});
