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

const buildCashflowRows = sandbox.buildCashflowRows;
const buildCashflowRowsUntilAge = sandbox.buildCashflowRowsUntilAge;
const buildAnnualAssetFormationBalancesByYear = sandbox.buildAnnualAssetFormationBalancesByYear;
const buildAnnualAssetSnapshotsByYear = sandbox.buildAnnualAssetSnapshotsByYear;
const buildAssetOutlookAtAge = sandbox.buildAssetOutlookAtAge;
const calculateAssetFormationBalanceAtAgeYearEnd = sandbox.calculateAssetFormationBalanceAtAgeYearEnd;
const simulatePlanMonthlyBalanceTrajectory = sandbox.simulatePlanMonthlyBalanceTrajectory;
const buildAnnualAssetWithdrawalTransfersByYear = sandbox.buildAnnualAssetWithdrawalTransfersByYear;

assert.strictEqual(typeof buildCashflowRows, 'function');
assert.strictEqual(typeof buildCashflowRowsUntilAge, 'function');
assert.strictEqual(typeof buildAnnualAssetFormationBalancesByYear, 'function');
assert.strictEqual(typeof buildAnnualAssetSnapshotsByYear, 'function');
assert.strictEqual(typeof buildAssetOutlookAtAge, 'function');
assert.strictEqual(typeof calculateAssetFormationBalanceAtAgeYearEnd, 'function');
assert.strictEqual(typeof simulatePlanMonthlyBalanceTrajectory, 'function');
assert.strictEqual(typeof buildAnnualAssetWithdrawalTransfersByYear, 'function');

(function testFourViewParityAtAge65YearEnd() {
  const settings = {
    birthDate: '1990-01-01',
    entryStartMonth: '2025-01',
    plans: [{
      id: 'parity-plan',
      type: 'NISA',
      expectedReturn: 5,
      currentValue: 1000000,
      initialPrincipalAtStartMonth: 1000000,
      monthlyContributions: [{ startMonth: '2025-01', amount: 50000 }],
      lumpSums: [{ month: '2026-06', amount: 300000 }],
    }],
  };
  const payload = {
    settings,
    transactions: [],
    recurringExpenses: [],
    lifeEvents: [],
    assumptions: { salaryGrowthRateBefore60: 0, inflationRate: 0 },
  };

  const rows = buildCashflowRows(payload);
  const rowAt65 = rows.find((row) => row.age === 65);
  assert.ok(rowAt65);

  const annualBalances = buildAnnualAssetFormationBalancesByYear({
    settings,
    startYear: 2025,
    endYear: rowAt65.year,
    startMonth: '2025-01',
    referenceMonth: `${rowAt65.year}-12`,
    targetAge: 65,
  });

  const annualSnapshots = buildAnnualAssetSnapshotsByYear({
    settings,
    startYear: 2025,
    endYear: rowAt65.year,
    startMonth: '2025-01',
    referenceMonth: `${rowAt65.year}-12`,
    targetAge: 65,
  });

  const outlookAt65 = buildAssetOutlookAtAge({ ...payload, targetAge: 65 });
  const yearEndBalanceAt65 = calculateAssetFormationBalanceAtAgeYearEnd({ ...payload, targetAge: 65 });

  assert.strictEqual(rowAt65.assetFormationBalance, annualBalances[rowAt65.year]);
  assert.strictEqual(rowAt65.assetFormationBalance, annualSnapshots[rowAt65.year].endingBalance);
  assert.strictEqual(rowAt65.assetFormationBalance, outlookAt65.contractTotalAtAge);
  assert.strictEqual(rowAt65.assetFormationBalance, yearEndBalanceAt65);
})();

(function testBoundaryWithdrawMonthStopsContributionAndWithdrawalStartsThatMonth() {
  const plan = {
    expectedReturn: 0,
    initialPrincipalAtStartMonth: 1000000,
    withdrawalDay: 1,
    monthlyContributions: [{ startMonth: '2025-01', amount: 10000 }],
    useInstallment: true,
    installmentStartDate: '2025-03',
    installmentMode: 'amount',
    installmentAmount: 120000,
  };

  const simulation = simulatePlanMonthlyBalanceTrajectory(plan, '1990-01-01', {
    startMonth: '2025-01',
    endMonth: '2025-04',
    includeContribution: true,
    includeInstallmentWithdrawal: true,
    includeLumpSumWithdrawal: true,
    includeMonthlyReturn: true,
  });

  assert.strictEqual(simulation.rows[0].monthlyContribution, 10000);
  assert.strictEqual(simulation.rows[1].monthlyContribution, 10000);
  assert.strictEqual(simulation.rows[2].monthlyContribution, 0);
  assert.strictEqual(simulation.rows[2].installmentWithdrawal, 10000);
  assert.strictEqual(simulation.rows[3].installmentWithdrawal, 10000);
})();

(function testBoundaryStartMonthAndPartialYearProrationForWithdrawalTransfer() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [{
        id: 'partial-year-prorate',
        expectedReturn: 0,
        currentValue: 1200000,
        initialPrincipalAtStartMonth: 1200000,
        monthlyContributions: [],
        lumpSums: [],
        installmentStartDate: '2025-07',
        withdrawalMode: 'amount',
        withdrawalAmount: 600000,
      }],
    },
    startYear: 2025,
    endYear: 2025,
    startMonth: '2025-07',
    referenceMonth: '2025-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2025], 300000);
})();

(function testBoundaryExpectedReturnZeroAndPositiveAreHandledConsistently() {
  const zeroReturn = simulatePlanMonthlyBalanceTrajectory({
    expectedReturn: 0,
    initialPrincipalAtStartMonth: 1000000,
    monthlyContributions: [{ startMonth: '2025-01', amount: 100000 }],
    lumpSums: [],
  }, '1990-01-01', {
    startMonth: '2025-01',
    endMonth: '2025-12',
  });

  const positiveReturn = simulatePlanMonthlyBalanceTrajectory({
    expectedReturn: 12,
    initialPrincipalAtStartMonth: 1000000,
    monthlyContributions: [{ startMonth: '2025-01', amount: 100000 }],
    lumpSums: [],
  }, '1990-01-01', {
    startMonth: '2025-01',
    endMonth: '2025-12',
  });

  assert.strictEqual(Math.round(zeroReturn.endingBalance), 2200000);
  assert.ok(positiveReturn.endingBalance > zeroReturn.endingBalance);
})();

console.log('cashflow screen parity and boundary regression tests passed');
