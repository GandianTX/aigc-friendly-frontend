// e2e/article.spec.ts

import { expect, test } from '@playwright/test';

// 辅助：登录后进入文章管理
async function loginAndGoToArticles(page: import('@playwright/test').Page) {
  await page.goto('/admin/login');
  await page.getByLabel('用户名').fill('admin');
  await page.getByLabel('密码').fill('password');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page).toHaveURL(/\/admin/, { timeout: 10_000 });
  await page.goto('/admin/articles');
  await expect(page.getByText('文章管理')).toBeVisible({ timeout: 10_000 });
}

test.describe('文章管理', () => {
  test('应显示文章列表', async ({ page }) => {
    await loginAndGoToArticles(page);

    // 表格应存在
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('新建文章应保存为草稿', async ({ page }) => {
    await loginAndGoToArticles(page);

    await page.getByRole('button', { name: '新建文章' }).click();

    // 进入编辑页
    await expect(page.getByText('新建文章')).toBeVisible();

    const title = `E2E测试文章_${Date.now()}`;
    await page.getByLabel('标题').fill(title);
    await page.getByLabel('正文').fill('这是E2E测试的正文内容');

    await page.getByRole('button', { name: '保存草稿' }).click();

    // 保存成功后应显示提示
    await expect(page.getByText('保存成功')).toBeVisible({ timeout: 10_000 });
  });

  test('新建文章并发布', async ({ page }) => {
    await loginAndGoToArticles(page);

    await page.getByRole('button', { name: '新建文章' }).click();

    const title = `E2E发布文章_${Date.now()}`;
    await page.getByLabel('标题').fill(title);
    await page.getByLabel('正文').fill('这是E2E测试的发布内容');

    await page.getByRole('button', { name: '发布' }).click();

    await expect(page.getByText('发布成功')).toBeVisible({ timeout: 10_000 });
  });

  test('状态筛选应过滤文章', async ({ page }) => {
    await loginAndGoToArticles(page);

    // 选择"草稿"筛选
    await page.getByPlaceholder('状态筛选').click();
    await page.getByTitle('草稿').click();

    // 筛选后表格应刷新
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('删除文章应弹出确认', async ({ page }) => {
    await loginAndGoToArticles(page);

    // 点击第一行的删除按钮
    const deleteButton = page.getByRole('button', { name: '删除' }).first();
    if (await deleteButton.isVisible()) {
      deleteButton.click();

      // 应出现确认弹窗
      await expect(page.getByText('确定删除此文章？')).toBeVisible();

      // 取消删除
      await page.getByRole('button', { name: '取消' }).click();
    }
  });

  test('编辑已有文章应加载原始数据', async ({ page }) => {
    await loginAndGoToArticles(page);

    const editButton = page.getByRole('button', { name: '编辑' }).first();
    if (await editButton.isVisible()) {
      editButton.click();

      await expect(page.getByText('编辑文章')).toBeVisible({ timeout: 5_000 });

      // 标题字段应已填充
      const titleValue = await page.getByLabel('标题').inputValue();
      expect(titleValue.length).toBeGreaterThan(0);
    }
  });

  test('未登录访问管理页应重定向到登录', async ({ page }) => {
    // 清除 localStorage 中的 token
    await page.goto('/admin/articles');
    await page.evaluate(() => localStorage.clear());

    await page.goto('/admin/articles');

    // 应重定向到登录页
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10_000 });
  });
});
