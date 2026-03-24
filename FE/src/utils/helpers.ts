export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

export const calculateTotal = (amount: number, vat: number): number => {
  return amount + (amount * vat / 100);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export default {
  formatCurrency,
  formatDate,
  calculateTotal,
  generateId,
};