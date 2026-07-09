import { Locator, Page } from '@playwright/test';
import { AccountData } from '../api/api-client';

/**
 * Covers /login, /signup ("Enter Account Information"), /account_created,
 * /logout and /delete_account — one cohesive auth lifecycle.
 *
 * Locator strategy per the site research: the /login page's two forms (Login,
 * and the "New User Signup!" mini-form) are the only place on the whole site
 * with stable `data-qa` attributes, so those are used directly. The Account
 * Information step (/signup) only has confirmed `id` attributes (`data-qa` is
 * present on some fields, e.g. first_name, but wasn't exhaustively verified
 * live) — id locators are used there instead. The Create Account / Continue
 * buttons and the confirmation headings weren't captured with an attribute in
 * the research pass, so they use role+text locators, which are stable enough
 * without guessing an unconfirmed data-qa value.
 */
export class LoginSignupPage {
  // --- Login form (data-qa confirmed) ---
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  // --- Signup mini-form on /login (data-qa confirmed) ---
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly signupErrorMessage: Locator;

  // --- Account Information step on /signup (id confirmed) ---
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly accountPasswordInput: Locator;
  readonly birthDaySelect: Locator;
  readonly birthMonthSelect: Locator;
  readonly birthYearSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly optinCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  // --- Confirmation / lifecycle screens (role+text, unconfirmed attributes) ---
  readonly accountCreatedHeading: Locator;
  readonly accountDeletedHeading: Locator;
  readonly continueButton: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInAsText: Locator;

  constructor(private readonly page: Page) {
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.loginErrorMessage = page.getByText('Your email or password is incorrect!');

    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.signupErrorMessage = page.getByText('Email Address already exist!');

    this.titleMrRadio = page.locator('#id_gender1');
    this.titleMrsRadio = page.locator('#id_gender2');
    this.accountPasswordInput = page.locator('#password');
    this.birthDaySelect = page.locator('#days');
    this.birthMonthSelect = page.locator('#months');
    this.birthYearSelect = page.locator('#years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });

    this.accountCreatedHeading = page.getByRole('heading', { name: 'Account Created!' });
    this.accountDeletedHeading = page.getByRole('heading', { name: 'Account Deleted!' });
    this.continueButton = page.getByRole('link', { name: 'Continue' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.loggedInAsText = page.getByText('Logged in as');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  /** Step 1 of registration: name + email on /login, submits into /signup. */
  async startSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  /** Step 2 of registration: full "Enter Account Information" form on /signup. */
  async fillAccountInformation(account: AccountData): Promise<void> {
    await (account.title === 'Mr' ? this.titleMrRadio : this.titleMrsRadio).check();
    await this.accountPasswordInput.fill(account.password);
    await this.birthDaySelect.selectOption(account.birthDate);
    await this.birthMonthSelect.selectOption(account.birthMonth);
    await this.birthYearSelect.selectOption(account.birthYear);

    await this.firstNameInput.fill(account.firstName);
    await this.lastNameInput.fill(account.lastName);
    if (account.company) await this.companyInput.fill(account.company);
    await this.address1Input.fill(account.address1);
    if (account.address2) await this.address2Input.fill(account.address2);
    await this.countrySelect.selectOption(account.country);
    await this.stateInput.fill(account.state);
    await this.cityInput.fill(account.city);
    await this.zipcodeInput.fill(account.zipcode);
    await this.mobileNumberInput.fill(account.mobileNumber);
  }

  async submitAccountCreation(): Promise<void> {
    await this.createAccountButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }
}
