// Example helper functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const getCurrentDate = () => {
  return new Date().toLocaleDateString();
};
