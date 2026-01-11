
export const formatPriceWithCode = (price, config) => {
  if (!price || isNaN(price)) return '';

  const { currency } = config;

  return `${currency.code} ${price.toFixed(2)}`;
};

export const formatPriceWithSymbol = (price, config) => {
  if (!price || isNaN(price)) return '';

  const { currency } = config;
  
  if (currency.symbol === "-") {
    return `${currency.code} ${price.toFixed(2)}`;
  }

  if (currency.symbolPosition === "before") {
    return `${currency.symbol}${price}`;
  }

  return `${price}${currency.symbol}`;
};
