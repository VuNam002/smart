module.exports.calcNewPrice = (products) => {
  const newProducts = products.map((item) => {
    const priceNewNum = (item.price * (100 - item.discountPercentage)) / 100;
    item.priceNew = priceNewNum.toFixed(0);
    item.discountAmount = (item.price - parseFloat(item.priceNew)).toFixed(0);
    return item;
  });
  return newProducts;
};