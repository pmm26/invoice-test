export const currency = (integer: number) => {
  function formatNumber(num: string) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const result = formatNumber(
    "$" + (integer / 100).toFixed(2)
  );

  return result;
};