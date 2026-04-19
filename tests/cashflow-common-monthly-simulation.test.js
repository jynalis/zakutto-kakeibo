const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const source = fs.readFileSync('app.js', 'utf8').replace(/\ninit\(\);\s*$/, '\n');

const sandbox = {
  console,
  Date,
  Math,
  Number,
  String,
  Boolean,
  Array,
  Object,
  JSON,
  Intl,
  Set,
  Map,
  WeakMap,
  crypto: { randomUUID: () => 'test-id' },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  },
  document: {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      appendChild: () => {},
      append: () => {},
      remove: () => {},
      setAttribute: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      innerHTML: '',
      textContent: '',
      style: {},
      dataset: {},
      addEventListener: () => {},
    }),
  },
  window: {
    addEventListener: () => {},
    setTimeout,
    clearTimeout,
    visualViewport: null,
    confirm: () => true,
  },
};

vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const simulatePlanMonthlyBalanceTrajectory = sandbox.simulatePlanMonthlyBalanceTrajectory;
assert.strictEqual(typeof simulatePlanMonthlyBalanceTrajectory, 'function');

(function testMonthlyContributionLumpAndMonthlyCompoundReturn() {
  const result = simulatePlanMonthlyBalanceTrajectory({
    expectedReturn: 12,
    initialPrincipalAtStartMonth: 1000,
    withdrawalDay: 1,
    monthlyContributions: [{ startMonth: '2025-01', amount: 100 }],
    lumpSums: [{ month: '2025-02', amount: 500 }],
  }, '1990-01-01', {
    startMonth: '2025-01',
    endMonth: '2025-03',
  });

  const monthlyRate = Math.pow(1 + 0.12, 1 / 12) - 1;
  const jan = (1000 + 100) * (1 + monthlyRate);
  const feb = (jan + 100 + 500) * (1 + monthlyRate);
  const mar = (feb + 100) * (1 + monthlyRate);

  assert.ok(Math.abs(result.endingBalance - mar) < 1e-9);
  assert.strictEqual(result.rows.length, 3);
  assert.strictEqual(result.rows[1].monthlyLumpSumTotal, 500);
})();

(function testInstallmentWithdrawalAndLumpSumWithdrawalInSameSimulation() {
  const result = simulatePlanMonthlyBalanceTrajectory({
    expectedReturn: 0,
    initialPrincipalAtStartMonth: 1200000,
    withdrawalDay: 1,
    useInstallment: true,
    installmentStartDate: '2025-01',
    installmentMode: 'amount',
    installmentAmount: 120000,
    useLumpSum: true,
    lumpSumDate: '2025-03',
    lumpSumMode: 'rate',
    lumpSumRate: 50,
    monthlyContributions: [{ startMonth: '2025-01', amount: 10000 }],
    lumpSums: [{ month: '2025-02', amount: 100000 }],
  }, '1990-01-01', {
    startMonth: '2025-01',
    endMonth: '2025-04',
  });

  assert.strictEqual(result.rows[0].installmentWithdrawal, 10000);
  assert.strictEqual(result.rows[1].installmentWithdrawal, 10000);
  assert.strictEqual(result.rows[2].lumpSumWithdrawal, 585000);
  assert.strictEqual(result.rows[3].endingBalance, 575000);
})();

(function testCanSkipLumpSumWithdrawalForExistingProjectionCompatibility() {
  const withLump = simulatePlanMonthlyBalanceTrajectory({
    expectedReturn: 0,
    initialPrincipalAtStartMonth: 500000,
    withdrawalDay: 1,
    useLumpSum: true,
    lumpSumDate: '2025-03',
    lumpSumMode: 'amount',
    lumpSumAmount: 100000,
    monthlyContributions: [],
    lumpSums: [],
  }, '1990-01-01', {
    startMonth: '2025-01',
    endMonth: '2025-03',
    includeLumpSumWithdrawal: true,
  });

  const withoutLump = simulatePlanMonthlyBalanceTrajectory({
    expectedReturn: 0,
    initialPrincipalAtStartMonth: 500000,
    withdrawalDay: 1,
    useLumpSum: true,
    lumpSumDate: '2025-03',
    lumpSumMode: 'amount',
    lumpSumAmount: 100000,
    monthlyContributions: [],
    lumpSums: [],
  }, '1990-01-01', {
    startMonth: '2025-01',
    endMonth: '2025-03',
    includeLumpSumWithdrawal: false,
  });

  assert.strictEqual(withLump.endingBalance, 400000);
  assert.strictEqual(withoutLump.endingBalance, 500000);
})();

console.log('cashflow common monthly simulation tests passed');
