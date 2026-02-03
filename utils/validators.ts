
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11 || !!cleanCPF.match(/(\d)\1{10}/)) return false;
  
  const digits = cleanCPF.split('').map(Number);
  
  const calc = (n: number) => 
    (digits.slice(0, n).reduce((acc, digit, i) => acc + (digit * (n + 1 - i)), 0) * 10) % 11 % 10;

  return calc(9) === digits[9] && calc(10) === digits[10];
};

export const isValidCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length !== 14 || !!cleanCNPJ.match(/(\d)\1{13}/)) return false;

  const size = cleanCNPJ.length - 2;
  const numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  
  const calc = (n: string, s: number) => {
    let sum = 0;
    let pos = s - 7;
    for (let i = s; i >= 1; i--) {
      sum += Number(n.charAt(s - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    const res = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return res;
  };

  const digit1 = calc(numbers, size);
  const digit2 = calc(numbers + digit1, size + 1);

  return digit1 === Number(digits.charAt(0)) && digit2 === Number(digits.charAt(1));
};

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

export const formatDocument = (value: string, type: 'PF' | 'PJ' | string) => {
  const digits = value.replace(/\D/g, '').slice(0, type === 'PF' ? 11 : 14);
  
  if (type === 'PF') {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } 
  
  // Formatação CNPJ
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};
