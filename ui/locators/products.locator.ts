export const productsLocator = {
  productCards: '.prdocutname, .thumbnail',
  catalogTitle: 'h1',
  categoryFilterLink:
    '#categorymenu a[href*="path="], .thumbnails.grid a[href*="path="]',
  addToCartButton: 'a[title="Add to Cart"], .productcart',
  successNotification: '.alert-success, .success, .contentpanel',
} as const;
