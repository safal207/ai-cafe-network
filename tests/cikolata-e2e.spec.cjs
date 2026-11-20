const { test, expect } = require('@playwright/test');

const site = 'http://127.0.0.1:8765/';
const dimensions = [
  { label: 'small mobile', width: 320, height: 720 },
  { label: 'mobile', width: 390, height: 844 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'desktop', width: 1280, height: 900 },
];

for (const { label, width, height } of dimensions) {
  test(label + ': official branding, appetizing feed, product flow and basket', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ viewport: { width, height }, locale: 'tr-TR' });
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', err => failures.push(err.message));

    await page.goto(site, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.header .brand img')).toBeVisible();
    await expect(page.locator('#landing .hero-brand-stamp img')).toBeVisible();
    await expect(page.locator('#landing-stories .story-card')).toHaveCount(3);
    await expect(page.locator('#landing-stories .brand-stamp img')).toHaveCount(3);

    const headerLogoLoaded = await page.locator('.header .brand img').evaluate(img => img.complete && img.naturalWidth > 0);
    expect(headerLogoLoaded, 'Original real brand wordmark image must load').toBe(true);

    await page.locator('#landing-stories .story-card').first().scrollIntoViewIfNeeded();
    await expect.poll(async () => page.locator('.story-card .story-media img').first().evaluate(img => img.complete && img.naturalWidth > 0), { timeout: 10000 }).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('home-' + width + '.png'), fullPage: true });

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'No horizontal overflow').toBe(true);

    await page.locator('#landing-stories [data-detail]').first().click();
    await expect(page.locator('#detail')).toBeVisible();
    await expect(page.locator('#detail .brand-stamp img')).toBeVisible();
    await expect(page.locator('#detail-add')).toBeVisible();
    await page.locator('#detail-add').click();
    await expect(page.locator('#detail')).not.toBeVisible();

    const cartButton = width <= 640 ? page.locator('.mobile-nav [data-open-cart]') : page.locator('.header .cart-button');
    await cartButton.click();
    await expect(page.locator('#basket')).toBeVisible();
    await expect(page.locator('#basket .cart-line')).toHaveCount(1);
    await page.locator('#basket [data-close="basket"]').click();

    await page.locator('#lang').selectOption('ru');
    await expect(page.locator('#hero-title')).toContainText('Пауза');
    const menuCta = page.locator('.landing-cta');
    await menuCta.click();
    await expect(page.locator('#menu-page')).toBeVisible();
    await expect(page.locator('#catalog .product').first()).toBeVisible();
    await expect(page.locator('#catalog .product .brand-stamp').first()).toBeVisible();

    const firstProduct = page.locator('#catalog .product').first();
    const rail = firstProduct.locator('.photo-actions');
    const imageBox = await firstProduct.locator('.product-photo').boundingBox();
    const railBox = await rail.boundingBox();
    expect(imageBox && railBox && railBox.x > imageBox.x + imageBox.width / 2, 'Social panel is on the image right edge').toBe(true);

    await firstProduct.locator('[data-favorite]').click();
    await expect(firstProduct.locator('[data-favorite]')).toHaveAttribute('aria-pressed', 'true');

    await page.screenshot({ path: testInfo.outputPath('feed-' + width + '.png'), fullPage: true });
    await page.locator('#views [data-view="pair"]').click();
    await expect(page.locator('#catalog .pair').first()).toBeVisible();
    await expect(page.locator('#catalog .pair .brand-stamp').first()).toBeVisible();
    await page.locator('#lang').selectOption('en');
    await expect(page.locator('#mood-disclosure summary')).toContainText('Choose by mood');

    expect(failures, 'No browser JavaScript runtime errors').toEqual([]);
    await context.close();
  });
}
