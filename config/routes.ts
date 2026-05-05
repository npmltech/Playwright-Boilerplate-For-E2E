export const routes = {
  home: '/',
  login: '/index.php?rt=account/login',
  account: '/index.php?rt=account/account',
  forgottenPassword: '/index.php?rt=account/forgotten/password',
  register: '/index.php?rt=account/create',
  registerSuccess: '/index.php?rt=account/success',
  cart: '/index.php?rt=checkout/cart',
  checkout: '/index.php?rt=checkout/checkout',
  orderConfirm: '/index.php?rt=checkout/confirm',
  productCategory: '/',
} as const;

export const routePatterns = {
  account: /index\.php\?rt=account\/account/,
  forgottenPassword: /index\.php\?rt=account\/forgotten\/password/,
  registerSuccess: /index\.php\?rt=account\/success/,
} as const;
