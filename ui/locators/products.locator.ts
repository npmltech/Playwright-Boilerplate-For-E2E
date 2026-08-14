export const productsLocator = {
  productCards: '.prdocutname, .thumbnail',
  catalogTitle: 'h1',
  categoryFilterLink:
    '#categorymenu a[href*="path="], .thumbnails.grid a[href*="path="]',
  addToCartButton: 'a[title="Add to Cart"], .productcart',
  // matches the in-page success banner, the checkout button present on cart-page redirect,
  // or the quick-basket icon shown when adding to cart from the homepage/featured listing
  successNotification:
    '.alert.alert-success, #cart_checkout1, #cart_checkout2, .quick_basket',
} as const;
