import { randomUUID } from 'node:crypto';
import { AccountData } from '../api/api-client';

/** Builds a unique, throwaway account for a single test run (setup via ApiClient.createAccount). */
export function buildRandomAccount(overrides: Partial<AccountData> = {}): AccountData {
  const unique = randomUUID().slice(0, 8);

  return {
    name: `qa-${unique}`,
    email: `qa-${unique}@mailtest.com`,
    password: `Passw0rd!${unique}`,
    title: 'Mrs',
    birthDate: '10',
    birthMonth: '5',
    birthYear: '1990',
    firstName: 'QA',
    lastName: `Auto${unique}`,
    company: 'Test Co',
    address1: '1 Automation Way',
    address2: '',
    country: 'United States',
    zipcode: '10001',
    state: 'NY',
    city: 'New York',
    mobileNumber: '5550000000',
    ...overrides,
  };
}
