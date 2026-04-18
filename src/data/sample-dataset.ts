import type { DatasetSummary } from '@/types/audit';

// Synthetic lending dataset with known bias patterns
const sampleRows: Record<string, string | number>[] = [];

const genders = ['Male', 'Female'];
const races = ['White', 'Black', 'Hispanic', 'Asian'];
const ages = [22, 25, 28, 30, 33, 35, 38, 40, 45, 50, 55, 60];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

let seed = 42;
for (let i = 0; i < 500; i++) {
  const gender = genders[Math.floor(seededRandom(seed++) * genders.length)];
  const race = races[Math.floor(seededRandom(seed++) * races.length)];
  const age = ages[Math.floor(seededRandom(seed++) * ages.length)];
  const income = Math.round(30000 + seededRandom(seed++) * 90000);
  const creditScore = Math.round(500 + seededRandom(seed++) * 350);
  const debtRatio = +(seededRandom(seed++) * 0.6).toFixed(2);

  // Introduce bias: lower approval for Female, Black, Hispanic, younger
  let approvalProb = 0.5;
  approvalProb += (creditScore - 650) / 800;
  approvalProb += (income - 60000) / 200000;
  approvalProb -= debtRatio * 0.3;
  if (gender === 'Female') approvalProb -= 0.12;
  if (race === 'Black') approvalProb -= 0.15;
  if (race === 'Hispanic') approvalProb -= 0.08;
  if (age < 30) approvalProb -= 0.1;

  const approved = seededRandom(seed++) < Math.max(0.05, Math.min(0.95, approvalProb)) ? 'Yes' : 'No';

  sampleRows.push({ Gender: gender, Race: race, Age: age, Income: income, CreditScore: creditScore, DebtRatio: debtRatio, Approved: approved });
}

export const SAMPLE_DATASET: DatasetSummary = {
  rowCount: sampleRows.length,
  columnCount: 7,
  columns: [
    { name: 'Gender', type: 'categorical', uniqueValues: 2, sampleValues: ['Male', 'Female'], nullCount: 0 },
    { name: 'Race', type: 'categorical', uniqueValues: 4, sampleValues: ['White', 'Black', 'Hispanic', 'Asian'], nullCount: 0 },
    { name: 'Age', type: 'numeric', uniqueValues: 12, sampleValues: ['22', '30', '40', '55', '60'], nullCount: 0 },
    { name: 'Income', type: 'numeric', uniqueValues: sampleRows.length, sampleValues: ['45000', '60000', '80000', '100000', '120000'], nullCount: 0 },
    { name: 'CreditScore', type: 'numeric', uniqueValues: sampleRows.length, sampleValues: ['550', '650', '720', '780', '840'], nullCount: 0 },
    { name: 'DebtRatio', type: 'numeric', uniqueValues: sampleRows.length, sampleValues: ['0.1', '0.2', '0.35', '0.45', '0.55'], nullCount: 0 },
    { name: 'Approved', type: 'categorical', uniqueValues: 2, sampleValues: ['Yes', 'No'], nullCount: 0 },
  ],
  data: sampleRows,
};

export const SAMPLE_AUDIT_CONFIG = {
  targetColumn: 'Approved',
  protectedAttributes: ['Gender', 'Race'],
  positiveOutcomeValue: 'Yes',
};
