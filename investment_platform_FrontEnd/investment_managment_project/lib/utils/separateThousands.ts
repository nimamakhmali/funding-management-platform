export const separateThousands = (price: number | string): string => {
  const num = typeof price === 'string' ? Number(price) : price;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};