import AxeBuilder from '@axe-core/playwright';
import {expect, test} from '@playwright/test';
import type {Page} from '@playwright/test';

/*
 * WCAG 2.2 AA smoke tests. axe catches roughly a third of issues; the
 * keyboard tests below cover flows axe can't. See docs/accessibility.md for
 * the manual screen reader checklist.
 */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Wait for hydration and lazy content: libraries render transient markup
// while hydrating (e.g. Headless UI focus sentinels) that axe would flag
async function visit(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

async function expectNoSeriousViolations(page: Page, include?: string) {
  let builder = new AxeBuilder({page}).withTags(WCAG_TAGS);
  if (include) builder = builder.include(include);
  const {violations} = await builder.analyze();
  const serious = violations.filter(
    ({impact}) => impact === 'serious' || impact === 'critical',
  );
  const summary = serious.map(
    ({id, help, nodes}) =>
      `${id}: ${help}\n  ${nodes
        .slice(0, 3)
        .map(({target}) => target.join(' '))
        .join('\n  ')}`,
  );
  expect(summary, summary.join('\n\n')).toEqual([]);
}

// Headless UI's role="dialog" wrapper has no box of its own (its panel is
// fixed-position), so match the open dialog by state, not visibility
async function expectOpenDialogIsAccessible(page: Page) {
  const dialog = page.locator('[role="dialog"][data-open]');
  await expect(dialog).toHaveCount(1);
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog).toHaveAccessibleName(/.+/);
  await expectNoSeriousViolations(page, '[role="dialog"][data-open]');
}

async function firstProductPath(page: Page) {
  await visit(page, '/collections/all');
  const href = await page
    .locator('main a[href*="/products/"]')
    .first()
    .getAttribute('href');
  if (!href) throw new Error('No product link found on /collections/all');
  return href;
}

test.describe('axe: pages', () => {
  test('home', async ({page}) => {
    await visit(page, '/');
    await expectNoSeriousViolations(page);
  });

  test('collection', async ({page}) => {
    await visit(page, '/collections/all');
    await expectNoSeriousViolations(page);
  });

  test('product', async ({page}) => {
    await visit(page, await firstProductPath(page));
    await expectNoSeriousViolations(page);
  });

  test('search', async ({page}) => {
    await visit(page, '/search?q=shirt');
    await expectNoSeriousViolations(page);
  });
});

test.describe('axe: overlays', () => {
  test('cart drawer', async ({page}) => {
    await visit(page, '/');
    await page.getByRole('button', {name: /^Open cart/}).click();
    await expectOpenDialogIsAccessible(page);
  });

  test('mobile menu', async ({page, isMobile}) => {
    test.skip(!isMobile, 'mobile only');
    await visit(page, '/');
    await page.getByRole('button', {name: 'Open mobile menu'}).click();
    await expectOpenDialogIsAccessible(page);
  });
});

test.describe('keyboard', () => {
  test('skip link is first and moves focus to main', async ({page}) => {
    await visit(page, '/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', {name: 'Skip to content'});
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#mainContent')).toBeFocused();
  });

  test('desktop menu opens, tabs in, and closes with Escape', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'desktop only');
    await visit(page, '/');
    const toggle = page
      .getByRole('navigation', {name: 'Main'})
      .locator('button[aria-controls]')
      .first();
    test.skip(
      (await toggle.count()) === 0,
      'no nav items with submenus in this store',
    );

    await toggle.focus();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const panel = page.locator(
      `#${await toggle.getAttribute('aria-controls')}`,
    );
    await page.keyboard.press('Tab');
    await expect(panel.locator(':focus')).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('autoplaying carousels can be paused', async ({page}) => {
    await visit(page, '/');
    // Each click renames that button to "Play slideshow", so keep pausing the
    // first visible "Pause slideshow" until none are left
    const visiblePause = page
      .getByRole('button', {name: 'Pause slideshow'})
      .locator('visible=true');
    const total = await visiblePause.count();
    for (let i = 0; i < total; i += 1) {
      await visiblePause.first().click();
      // Wait for the re-render before clicking the next one
      await expect(visiblePause).toHaveCount(total - i - 1);
    }
    await expect(visiblePause).toHaveCount(0);
    await expect(
      page
        .getByRole('button', {name: 'Play slideshow'})
        .locator('visible=true'),
    ).toHaveCount(total);
  });
});
