import { APIRequestContext } from '@playwright/test';

export const API_BASE_URL = 'https://automationexercise.com';

export interface AccountData {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birthDate: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobileNumber: string;
}

export interface ApiResponse<T = unknown> {
  responseCode: number;
  message?: string;
  [key: string]: T | number | string | undefined;
}

function toAccountForm(account: AccountData): Record<string, string> {
  return {
    name: account.name,
    email: account.email,
    password: account.password,
    title: account.title,
    birth_date: account.birthDate,
    birth_month: account.birthMonth,
    birth_year: account.birthYear,
    firstname: account.firstName,
    lastname: account.lastName,
    company: account.company ?? '',
    address1: account.address1,
    address2: account.address2 ?? '',
    country: account.country,
    zipcode: account.zipcode,
    state: account.state,
    city: account.city,
    mobile_number: account.mobileNumber,
  };
}

/**
 * Thin wrapper around https://automationexercise.com/api_list (14 documented endpoints).
 *
 * IMPORTANT: this API always answers with HTTP 200, regardless of outcome — the real
 * result lives in the JSON body's `responseCode` (200/201 success, 400 missing param,
 * 404 not found, 405 method not supported). Never branch on `response.status()`; always
 * read `responseCode` from the parsed body, which is what `request()` below returns.
 *
 * This client does not create a browser session. `createAccount`/`verifyLogin` only
 * prepare/check data — UI tests still need to log in through LoginSignupPage to get
 * cookies in the browser context.
 */
export class ApiClient {
  constructor(private readonly context: APIRequestContext) {}

  async getProductsList(): Promise<ApiResponse> {
    return this.request('GET', '/api/productsList');
  }

  async getBrandsList(): Promise<ApiResponse> {
    return this.request('GET', '/api/brandsList');
  }

  async searchProduct(searchTerm: string): Promise<ApiResponse> {
    return this.request('POST', '/api/searchProduct', { form: { search_product: searchTerm } });
  }

  async verifyLogin(email: string, password: string): Promise<ApiResponse> {
    return this.request('POST', '/api/verifyLogin', { form: { email, password } });
  }

  /** Primary setup fixture call — replaces the ~15-field UI signup form with one request. */
  async createAccount(account: AccountData): Promise<ApiResponse> {
    return this.request('POST', '/api/createAccount', { form: toAccountForm(account) });
  }

  /** Primary teardown fixture call — guarantees cleanup without visiting /delete_account in the UI. */
  async deleteAccount(email: string, password: string): Promise<ApiResponse> {
    return this.request('DELETE', '/api/deleteAccount', { form: { email, password } });
  }

  async updateAccount(account: AccountData): Promise<ApiResponse> {
    return this.request('PUT', '/api/updateAccount', { form: toAccountForm(account) });
  }

  async getUserDetailByEmail(email: string): Promise<ApiResponse> {
    return this.request('GET', '/api/getUserDetailByEmail', { params: { email } });
  }

  private async request(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    options: { form?: Record<string, string>; params?: Record<string, string> } = {}
  ): Promise<ApiResponse> {
    const response = await this.context.fetch(path, { method, ...options });
    return (await response.json()) as ApiResponse;
  }
}

/** Throws if the API's own responseCode doesn't match what the caller expected. */
export function assertResponseCode(response: ApiResponse, expected: number): void {
  if (response.responseCode !== expected) {
    throw new Error(
      `Expected API responseCode ${expected}, got ${response.responseCode}: ${response.message ?? '(no message)'}`
    );
  }
}
