// const getScannerProgress = (current: number) => Math.min(current + 0.5 * (1 - current / 25), 25);

export const getParserProgress = (found: number, parsed: number) => {
  const base = 25;
  const max = 99;
  const ratio = found > 0 ? parsed / found : 0;
  return base + ratio * (max - base);
};

export const computeOverallProgress = (
  webScanProgress: number,
  leaksScanProgress: number,
  subdomainProgress: number
) => {
  // console.log({ webScanProgress, leaksScanProgress, subdomainProgress });
  const progresses = [webScanProgress, leaksScanProgress, subdomainProgress];
  const validProgresses = progresses.filter(val => typeof val === 'number' && !isNaN(val));
  if (validProgresses.length === 0) return 0;
  const sum = validProgresses.reduce((acc, val) => acc + val, 0);
  return sum / validProgresses.length;
};

export const LEAKS_ESTIMATED_DURATION = 400; // en segundos
export const SUBDOMAINS_ESTIMATED_DURATION = 600; // en segundos
