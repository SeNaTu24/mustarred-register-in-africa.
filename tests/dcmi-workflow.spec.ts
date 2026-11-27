import { test, expect, Page } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR =
  'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\689fb1c2-e31c-4fb5-b6af-9b2584a7452e\\scratch\\screenshots';

async function completeAssessmentToResults(
  page: Page,
  activityName: string,
  scaleLabel: string,
  step3Options: {
    operating: string;
    registered: string;
    employees: string;
    location: string;
  }
) {
  await page.getByRole('button', { name: /Assess your business/i }).click();

  // Step 1
  await expect(page.getByText('Step 1 of 3')).toBeVisible();
  await page.getByRole('radio', { name: new RegExp(activityName, 'i') }).first().click();
  await page.getByRole('button', { name: /Continue →/i }).click();

  // Step 2
  await expect(page.getByText('Step 2 of 3')).toBeVisible();
  await page.getByRole('radio', { name: scaleLabel }).click();
  await page.getByRole('button', { name: /Continue →/i }).click();

  // Step 3
  await expect(page.getByText('Step 3 of 3')).toBeVisible();
  await page.getByRole('radio', { name: step3Options.operating }).click();
  await page.getByRole('radio', { name: step3Options.registered }).click();
  await page.getByRole('radio', { name: step3Options.employees }).click();
  await page.getByRole('radio', { name: step3Options.location }).click();
  await page.getByRole('button', { name: /View My Result →/i }).click();

  await expect(page.getByText('Your DCMI Assessment Results')).toBeVisible();
}

test.describe('Mustarred DCMI Registration Workflow', () => {
  test('A & B: Classification levels (OHL, EHL, UHL), Step 3 independence, and demo fees', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.url()} (${req.failure()?.errorText || 'failed'})`);
    });

    await page.goto('/dcmi');

    // 1. OHL classification
    await completeAssessmentToResults(page, 'Primary and secondary schools', '200–999 individuals', {
      operating: '1 - 3 years',
      registered: 'Limited liability company',
      employees: '1 - 10',
      location: 'One location',
    });
    await expect(page.getByText('OHL — Ordinary High Level')).toBeVisible();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-result-ohl.png'),
      fullPage: true,
    });

    await page.getByRole('button', { name: /Proceed to Payment →/i }).click();
    await expect(page.getByText('Complete Your Payment')).toBeVisible();
    await expect(page.getByText('DEMO MODE — NO REAL PAYMENT')).toBeVisible();
    await expect(page.getByText('₦300,000')).toBeVisible();
    await expect(page.getByText('Mustarred Demo Collections')).toBeVisible();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-payment-ohl.png'),
      fullPage: true,
    });

    // Restart and test OHL with completely different Step 3 answers (confirm Step 3 does not alter classification)
    await page.getByRole('button', { name: /Restart Assessment/i }).click();
    await completeAssessmentToResults(page, 'Primary and secondary schools', 'Fewer than 200 individuals', {
      operating: 'Above 8 years',
      registered: 'Incorporated Trustees',
      employees: 'Above 100',
      location: 'Nigeria and other countries',
    });
    await expect(page.getByText('OHL — Ordinary High Level')).toBeVisible();

    // 2. EHL classification
    await page.getByRole('button', { name: /Restart Assessment/i }).click();
    await completeAssessmentToResults(page, 'MDAs', '1,000–4,999 individuals', {
      operating: '3 - 8 years',
      registered: 'Partnership',
      employees: '10 - 50',
      location: 'Multiple locations within the state',
    });
    await expect(page.getByText('EHL — Extra High Level')).toBeVisible();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-result-ehl.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: /Proceed to Payment →/i }).click();
    await expect(page.getByText('₦500,000')).toBeVisible();

    // 3. UHL classification
    await page.getByRole('button', { name: /Restart Assessment/i }).click();
    await completeAssessmentToResults(page, 'Commercial banking', '5,000 and above', {
      operating: 'Above 8 years',
      registered: 'Limited liability company',
      employees: 'Above 100',
      location: 'Across multiple Nigerian states',
    });
    await expect(page.getByText('UHL — Ultra High Level')).toBeVisible();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04-result-uhl.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: /Proceed to Payment →/i }).click();
    await expect(page.getByText('₦800,000')).toBeVisible();

    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test('C, D & E: Simulated payment, 5-section registration, validation, file upload, navigation, review, and demo submission', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.url()} (${req.failure()?.errorText || 'failed'})`);
    });

    await page.goto('/dcmi');
    await completeAssessmentToResults(page, 'Fintechs', '1,000–4,999 individuals', {
      operating: '1 - 3 years',
      registered: 'Limited liability company',
      employees: '10 - 50',
      location: 'Across multiple Nigerian states',
    });
    await expect(page.getByText('UHL — Ultra High Level')).toBeVisible();
    await page.getByRole('button', { name: /Proceed to Payment →/i }).click();

    // Simulated payment confirmation
    await expect(page.getByText('DEMO MODE — NO REAL PAYMENT')).toBeVisible();
    await page.getByRole('button', { name: /I've made the payment/i }).click();

    // Verify transition to Section 1 with simulated_confirmed notice
    await expect(page.getByText('Section 1 of 5 — About Your Business')).toBeVisible();
    await expect(page.getByText(/Status:\s*simulated_confirmed/i)).toBeVisible();

    // Section 1: Test empty validation
    await page.getByRole('button', { name: /Next Section →/i }).click();
    await expect(page.getByText('Company Name is required.')).toBeVisible();
    await expect(page.getByText('Business Email Address is required.')).toBeVisible();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05-section1-validation-errors.png'),
      fullPage: true,
    });

    // Section 1: Test invalid email, then valid entries (leaving optional Referred by empty/nil)
    await page.getByPlaceholder('Your Company Name').fill('Acme Demo Systems Ltd');
    await page.getByPlaceholder('hello@yourcompany.com').fill('invalid-email');
    await page.getByPlaceholder('+234 800 000 0000').fill('+234 800 123 4567');
    await page
      .getByPlaceholder('Include your street, city, LGA, and state.')
      .fill('10 Demo Way, Ikeja, Lagos');
    await page.locator('textarea').fill('Demo financial technology software services.');
    await page.getByRole('button', { name: 'Both businesses and individuals' }).click();
    await page.getByRole('button', { name: /Next Section →/i }).click();
    await expect(page.getByText('Please enter a valid business email address.')).toBeVisible();

    await page.getByPlaceholder('hello@yourcompany.com').fill('compliance@acmedemo.example');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06-section1-filled.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: /Next Section →/i }).click();

    // Section 2: Your Customers and Their Information
    await expect(
      page.getByText('Section 2 of 5 — Your Customers and Their Information')
    ).toBeVisible();

    // Verify exact 4 customer volume options
    await expect(page.getByRole('button', { name: '1 – 200 people' })).toBeVisible();
    await expect(page.getByRole('button', { name: '201 – 999 people' })).toBeVisible();
    await expect(page.getByRole('button', { name: '1,000 – 4,999 people' })).toBeVisible();
    await expect(page.getByRole('button', { name: '5,000 or more' })).toBeVisible();

    await page.getByRole('button', { name: '1,000 – 4,999 people' }).click();

    // Third-party sharing checkboxes: verify independent selection including final option
    const otherBizCheckbox = page.getByLabel('Other businesses in Nigeria');
    const noShareCheckbox = page.getByLabel('We do not share with any third parties');
    await otherBizCheckbox.check();
    await noShareCheckbox.check();
    await expect(otherBizCheckbox).toBeChecked();
    await expect(noShareCheckbox).toBeChecked();
    await noShareCheckbox.uncheck();

    // International transfers Yes/No
    await page.getByRole('button', { name: 'Yes', exact: true }).click();

    // General customer info + conditional "Other, please specify" (optional)
    await page.getByLabel('Full name').check();
    await page.getByLabel('Email address').check();
    const otherInfoCheckbox = page.getByLabel('Other, please specify');
    await otherInfoCheckbox.check();
    await expect(page.getByPlaceholder('Please specify...')).toBeVisible();
    await otherInfoCheckbox.uncheck();
    await expect(page.getByPlaceholder('Please specify...')).toBeHidden();
    await otherInfoCheckbox.check();
    await page.getByPlaceholder('Please specify...').fill('Customer support ticket logs');

    // Special or Sensitive Information + mutually exclusive "None"
    await expect(page.getByText('Special or Sensitive Information')).toBeVisible();
    const financialCheckbox = page.getByLabel('Financial or bank details');
    const noneSensitiveCheckbox = page.getByLabel('None — I only collect general information');
    await financialCheckbox.check();
    await expect(financialCheckbox).toBeChecked();
    await noneSensitiveCheckbox.check();
    await expect(noneSensitiveCheckbox).toBeChecked();
    await expect(financialCheckbox).not.toBeChecked();
    await financialCheckbox.check();
    await expect(financialCheckbox).toBeChecked();
    await expect(noneSensitiveCheckbox).not.toBeChecked();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '07-section2-filled.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: /Next Section →/i }).click();

    // Section 3: DPO Details
    await expect(
      page.getByText('Section 3 of 5 — Data Protection Officer (DPO) Details')
    ).toBeVisible();
    await expect(
      page.getByText(
        "Your DPO's NIN is required for the official NDPC filing. It is held securely and used only for registration."
      )
    ).toBeVisible();

    const s3Inputs = page.locator('input');
    await s3Inputs.nth(0).fill('Amina Demo');
    await s3Inputs.nth(1).fill('dpo@acmedemo.example');
    await s3Inputs.nth(2).fill('+234 800 555 0100');
    await s3Inputs.nth(3).fill('12345abc'); // non-digits stripped, too short
    await expect(s3Inputs.nth(3)).toHaveValue('12345');
    await s3Inputs.nth(4).fill('12 Privacy Lane, Victoria Island, Lagos');

    // Test invalid NIN length
    await page.getByRole('button', { name: /Next Section →/i }).click();
    await expect(page.getByText('NIN must contain exactly 11 digits.')).toBeVisible();

    // Enter valid 11-digit NIN
    await s3Inputs.nth(3).fill('12345678901');

    // Test file upload restrictions: unsupported (.txt), > 5 MB, and valid (.pdf)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'invalid.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('not a cert'),
    });
    await expect(
      page.getByText('Invalid file type. Accepted formats: PDF, JPG, JPEG, PNG.')
    ).toBeVisible();

    await fileInput.setInputFiles({
      name: 'oversized.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(5 * 1024 * 1024 + 1024),
    });
    await expect(page.getByText('File exceeds the 5 MB maximum size limit.')).toBeVisible();

    await fileInput.setInputFiles({
      name: 'dpo-cert-demo.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 demo certificate'),
    });
    await expect(page.getByText('dpo-cert-demo.pdf')).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '08-section3-dpo.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: /Next Section →/i }).click();

    // Section 4: Security and Data Protection Measures
    await expect(
      page.getByText('Section 4 of 5 — Security and Data Protection Measures')
    ).toBeVisible();

    // Test mutually exclusive "None of the above" on Technical Security (7 options)
    const fwCheckbox = page.getByLabel('Firewall and network security');
    const techNone = page.locator('input[type="checkbox"]').nth(6);
    await fwCheckbox.check();
    await techNone.check();
    await expect(techNone).toBeChecked();
    await expect(fwCheckbox).not.toBeChecked();
    await fwCheckbox.check();
    await expect(techNone).not.toBeChecked();

    // Policies (11 options)
    const policyCheckbox = page.getByLabel('A written data protection or privacy policy');
    await policyCheckbox.check();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '09-section4-security.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: /Next Section →/i }).click();

    // Section 5: Data Controller / Processor Representative
    await expect(
      page.getByText('Section 5 of 5 — Data Controller / Processor Representative')
    ).toBeVisible();

    const s5Inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
    await s5Inputs.nth(0).fill('Tunde Representative');
    await s5Inputs.nth(1).fill('rep@acmedemo.example');
    await s5Inputs.nth(2).fill('+234 800 555 0199');
    await page
      .getByLabel(/I confirm that the information I have provided above is accurate/i)
      .check();
    await page
      .getByLabel(/By submitting this form, you consent to Cealed Africa Limited/i)
      .check();

    // Test backward navigation and data retention
    await page.getByRole('button', { name: /Previous Section/i }).click();
    await expect(fwCheckbox).toBeChecked();
    await expect(policyCheckbox).toBeChecked();
    await page.getByRole('button', { name: /Previous Section/i }).click();
    await expect(page.getByText('dpo-cert-demo.pdf')).toBeVisible();
    await page.getByRole('button', { name: /Next Section →/i }).click();
    await page.getByRole('button', { name: /Next Section →/i }).click();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '10-section5-representative.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: /Review Registration →/i }).click();

    // Final Review Page
    await expect(page.getByText('Review Your DCMI Registration')).toBeVisible();
    await expect(page.getByText('UHL — Ultra High Level')).toBeVisible();
    await expect(page.getByText('₦800,000')).toBeVisible();
    await expect(page.getByText('simulated_confirmed (Simulated)')).toBeVisible();
    await expect(page.getByText('Acme Demo Systems Ltd')).toBeVisible();
    await expect(page.getByText('*******8901')).toBeVisible();
    await expect(page.getByText('12345678901')).toHaveCount(0);
    await expect(page.getByText('dpo-cert-demo.pdf')).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '11-final-review.png'),
      fullPage: true,
    });

    // Test Edit button back to Section 1 and return
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await expect(page.getByPlaceholder('Your Company Name')).toHaveValue(
      'Acme Demo Systems Ltd'
    );
    await page.getByRole('button', { name: /Next Section →/i }).click();
    await page.getByRole('button', { name: /Next Section →/i }).click();
    await page.getByRole('button', { name: /Next Section →/i }).click();
    await page.getByRole('button', { name: /Next Section →/i }).click();
    await page.getByRole('button', { name: /Review Registration →/i }).click();

    // Demo Submission
    await page.getByRole('button', { name: /Submit Demo Registration →/i }).click();
    await expect(page.getByText('Demo Submission Completed (Preview Mode)')).toBeVisible();
    await expect(
      page.getByText(/No information or uploaded documents were transmitted to Mustarred or the NDPC/i)
    ).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '12-demo-submission.png'),
      fullPage: true,
    });

    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test('F: Desktop (1280x800) and Mobile (375x812) responsive layout check', async ({
    page,
  }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/dcmi');
    let hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasOverflow).toBe(false);

    // Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await completeAssessmentToResults(page, 'Primary and secondary schools', '200–999 individuals', {
      operating: '1 - 3 years',
      registered: 'Limited liability company',
      employees: '1 - 10',
      location: 'One location',
    });
    hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasOverflow).toBe(false);

    await page.getByRole('button', { name: /Proceed to Payment →/i }).click();
    hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasOverflow).toBe(false);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '13-mobile-payment.png'),
      fullPage: true,
    });

    await page.getByRole('button', { name: /I've made the payment/i }).click();
    hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasOverflow).toBe(false);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '14-mobile-registration-s1.png'),
      fullPage: true,
    });
  });
});
