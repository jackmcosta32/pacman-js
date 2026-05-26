import { expect, test, type Page } from '@playwright/test';

const canvasSelector = '#game';

const getCanvasSignature = async (page: Page): Promise<string> => {
  return page.locator(canvasSelector).evaluate((canvas) => {
    const context = (canvas as HTMLCanvasElement).getContext('2d');

    if (!context) return '';

    const { width, height } = canvas as HTMLCanvasElement;
    const imageData = context.getImageData(0, 0, width, height).data;
    let sampledPixels = '';

    for (let index = 0; index < imageData.length; index += 64) {
      sampledPixels += `${imageData[index]},${imageData[index + 1]},${imageData[index + 2]},${imageData[index + 3]};`;
    }

    return sampledPixels;
  });
};

const expectCanvasNonblank = async (page: Page): Promise<void> => {
  await expect
    .poll(async () => {
      return page.locator(canvasSelector).evaluate((canvas) => {
        const context = (canvas as HTMLCanvasElement).getContext('2d');

        if (!context) return false;

        const { width, height } = canvas as HTMLCanvasElement;

        if (!width || !height) return false;

        const imageData = context.getImageData(0, 0, width, height).data;

        for (let index = 3; index < imageData.length; index += 4) {
          if (imageData[index] !== 0) return true;
        }

        return false;
      });
    })
    .toBe(true);
};

const expectCanvasChange = async (page: Page, action: () => Promise<void>): Promise<void> => {
  const before = await getCanvasSignature(page);

  await action();

  await expect.poll(() => getCanvasSignature(page)).not.toBe(before);
};

test('Pac-Man canvas smoke flow', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Pac-Man JS');
  await expect(page.locator(canvasSelector)).toBeVisible();
  await expectCanvasNonblank(page);

  await expectCanvasChange(page, async () => {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);
  });

  await expectCanvasChange(page, async () => {
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(350);
  });

  await expectCanvasChange(page, async () => {
    await page.keyboard.press('KeyP');
    await page.waitForTimeout(150);
  });

  await expectCanvasChange(page, async () => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
  });
});
