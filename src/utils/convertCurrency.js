export const convertCurrency = (value) => {
  // Convert the value to a number
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numberValue)) {
    throw new Error('Invalid value');
  }
  return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}