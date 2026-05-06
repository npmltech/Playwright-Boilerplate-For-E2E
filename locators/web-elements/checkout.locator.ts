export const checkoutLocator = {
  categoryMenuLink: '#categorymenu nav ul a[href*="path=36"]',
  productLink:
    'a.prdocutname[href*="product_id=53"], a[href*="path=36"][href*="product_id=53"]',
  productAddToCartLink: 'a.cart[href="#"], a:has-text("Add to Cart")',
  cartItems: '#cart tbody tr, .cart-info tbody tr, .product-list .product',
  checkoutButton: '#cart_checkout1, #cart_checkout2',
  checkoutContinueButton:
    'button[title="Continue"], #button-payment-address, #button-shipping-address, #button-shipping-method, #button-payment-method, a.btn:has-text("Continue")',
  orderSummary: '#totals_table, .cart-info, #maincontainer',
  addressInput:
    '#AddressFrm_address_1, #guestFrm_address_1, input[name="address"], input[name*="address"]',
  confirmButton:
    '#checkout_btn, button[title="Confirm Order"], button:has-text("Confirm"), a:has-text("Confirm Order"), [data-testid="confirm-order"]',
  orderConfirmation:
    '.checkout_heading, #maincontainer h1, [data-testid="order-confirmation"], .confirmation, h1:has-text("Thank")',
} as const;
