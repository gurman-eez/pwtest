import { test, expect } from '../fixtures/base';
import { LoginSignupPage } from '../pages/login-signup.page';
import { PaymentPage } from '../pages/payment.page';

// Products/Cart/Checkout screens don't have a Page Object yet (no stable data-qa/id per
// the site research — planned for a separate pass), so this spec drives them with
// role/text locators directly rather than inventing an unverified attribute.

test.describe('Checkout', () => {
  test('logged-in user completes an order end to end', {
    annotation: { type: 'testrail', description: 'C51' },
  }, async ({ page, testAccount }) => {
    const loginSignupPage = new LoginSignupPage(page);
    const paymentPage = new PaymentPage(page);

    await test.step('login with the API-provisioned account', async () => {
      await loginSignupPage.goto();
      await loginSignupPage.login(testAccount.email, testAccount.password);
      await expect(loginSignupPage.loggedInAsText).toContainText(testAccount.name);
    });

    await test.step('add a product to the cart', async () => {
      await page.goto('/product_details/1');
      await page.getByRole('button', { name: 'Add to cart' }).click();

      const cartModal = page.locator('#cartModal');
      await expect(cartModal).toContainText('Your product has been added to cart.');
      await cartModal.getByRole('link', { name: 'View Cart' }).click();

      await expect(page).toHaveURL(/\/view_cart$/);
    });
    // источник: флоу 06 исследования — модалка #cartModal с текстом "Added! / Your product
    // has been added to cart." и ссылками View Cart / Continue Shopping, подтверждено живьём.

    await test.step('proceed through checkout to payment', async () => {
      // Not a real <a href> (verified live: <a class="btn btn-default check_out"> with no
      // href, so it never gets an accessible "link" role) — text locator is the reliable one.
      await page.getByText('Proceed To Checkout').click();
      await expect(page).toHaveURL(/\/checkout$/);

      await page.getByRole('link', { name: 'Place Order' }).click();
      await expect(page).toHaveURL(/\/payment$/);
    });
    // источник: флоу 10 исследования — для авторизованного пользователя чекаут доступен
    // напрямую (без модалки с предложением зарегистрироваться, которую видит гость),
    // адрес доставки/биллинга подтягивается из профиля автоматически.

    await test.step('pay and land on the order confirmation screen', async () => {
      await paymentPage.fillCardDetails({
        nameOnCard: testAccount.name,
        cardNumber: '4111111111111111',
        cvc: '123',
        expiryMonth: '12',
        expiryYear: '2030',
      });
      await paymentPage.submitPayment();

      await expect(page).toHaveURL(/\/payment_done\/\d+$/);
      await expect(paymentPage.orderPlacedHeading).toHaveText('Order Placed!');
      await expect(paymentPage.downloadInvoiceLink).toBeVisible();
    });
    // источник: флоу 10 исследования — оплата принимает любые данные карты без Luhn-проверки
    // (задокументированное ограничение окружения в PaymentPage, не тест-кейс) и сразу
    // подтверждает заказ на /payment_done/<order_id> с заголовком "Order Placed!".
  });
});
