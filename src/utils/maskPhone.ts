export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2);

  if (number.length <= 4) {
    return `(${areaCode}) ${number}`;
  }

  const firstPartLength = digits.length === 11 ? 5 : 4;

  return `(${areaCode}) ${number.slice(0, firstPartLength)}-${number.slice(firstPartLength)}`;
}