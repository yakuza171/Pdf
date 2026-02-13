
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatNumber(num: number) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}
