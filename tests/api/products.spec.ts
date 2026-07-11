import { test, expect } from '../../fixtures/base';
import { assertResponseCode } from '../../api/api-client';

/**
 * Contract tests for the read-only product endpoints (productsList, searchProduct). Pure
 * API — only the `apiClient` fixture is used, no browser/cookies.
 */
test.describe('Products API', () => {
  test('getProductsList returns a non-empty list with the expected product shape', async ({ apiClient }) => {
    const response = await apiClient.getProductsList();

    assertResponseCode(response, 200);
    const products = response.products as Array<Record<string, unknown>>;
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    const [first] = products;
    expect(first).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.stringMatching(/^Rs\. \d+$/),
      brand: expect.any(String),
      category: {
        usertype: { usertype: expect.any(String) },
        category: expect.any(String),
      },
    });
  });

  test('searchProduct with a valid keyword returns matching products', async ({ apiClient }) => {
    const response = await apiClient.searchProduct('top');

    assertResponseCode(response, 200);
    const products = response.products as Array<{ name: string; category: { category: string } }>;
    expect(products.length).toBeGreaterThan(0);
    // Quirk verified live: the match isn't name-only. E.g. "Little Girls Mr. Panda Shirt"
    // (id 18, category "Tops & Shirts") is returned for the keyword "top" even though "top"
    // never appears in its name — matching also considers the category text. The honest
    // assertion checks name OR category, not name alone.
    for (const product of products) {
      const haystack = `${product.name} ${product.category.category}`.toLowerCase();
      expect(haystack).toContain('top');
    }
  });

  test('searchProduct with a keyword matching no product returns an empty list, not an error', async ({
    apiClient,
  }) => {
    const response = await apiClient.searchProduct('zzzznonexistentproductxyz123');

    // Verified live: a no-match search is still responseCode 200 with products: [] — this
    // endpoint only ever 400s for a malformed request, never for "nothing found".
    assertResponseCode(response, 200);
    expect(response.products).toEqual([]);
  });

  test('searchProduct without the search_product parameter returns 400', async ({ apiClient }) => {
    // Verified live with a standalone probe against Playwright's request context: passing
    // `undefined` here makes the `form` option omit the key entirely (not send the literal
    // string "undefined"), reproducing a genuinely missing POST field. Separately confirmed
    // that a *present but empty* search_product (search_product=) instead returns 200 with
    // the full, unfiltered product list — so "omitted" and "empty" are different, and both
    // are legitimate but distinct behaviors worth knowing apart.
    const response = await apiClient.searchProduct(undefined as unknown as string);

    assertResponseCode(response, 400);
    expect(response.message).toBe('Bad request, search_product parameter is missing in POST request.');
  });
});
