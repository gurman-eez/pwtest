import { Locator, Page } from '@playwright/test';

export interface CardDetails {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

/**
 * Covers /payment and its /payment_done/<order_id> confirmation screen.
 * Every input field has a confirmed `data-qa` attribute — same stability as
 * the Login/Signup forms.
 *
 * KNOWN ENVIRONMENT LIMITATION (not a test case to write): the card number
 * field accepts any input with no format check and no Luhn validation —
 * confirmed live with 4111111111111111 as well as arbitrary digit strings,
 * both submitted successfully. There is also no sandbox/test-card disclaimer
 * anywhere on the page. This is a property of the demo site's fake payment
 * processing, not something under test — do not write a "rejects invalid
 * card number" negative test against it, it will never fail.
 */
export class PaymentPage {
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;

  // Confirmation screen (/payment_done/<order_id>) — no data-qa confirmed live, role+text used.
  readonly orderPlacedHeading: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payButton = page.locator('[data-qa="pay-button"]');

    this.orderPlacedHeading = page.getByRole('heading', { name: 'Order Placed!' });
    this.downloadInvoiceLink = page.getByRole('link', { name: 'Download Invoice' });
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  async fillCardDetails(card: CardDetails): Promise<void> {
    await this.nameOnCardInput.fill(card.nameOnCard);
    await this.cardNumberInput.fill(card.cardNumber);
    await this.cvcInput.fill(card.cvc);
    await this.expiryMonthInput.fill(card.expiryMonth);
    await this.expiryYearInput.fill(card.expiryYear);
  }

  async submitPayment(): Promise<void> {
    await this.payButton.click();
  }
}
