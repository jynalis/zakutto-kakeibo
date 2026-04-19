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
const calculateAssetFormationBalanceAtAgeYearEnd = sandbox.calculateAssetFormationBalanceAtAgeYearEnd;
const simulatePlanMonthlyBalanceTrajectory = sandbox.simulatePlanMonthlyBalanceTrajectory;
assert.strictEqual(typeof buildCashflowRows, 'function');
assert.strictEqual(typeof buildCashflowRowsUntilAge, 'function');
assert.strictEqual(typeof calculateAssetFormationBalanceAtAgeYearEnd, 'function');
assert.strictEqual(typeof simulatePlanMonthlyBalanceTrajectory, 'function');

(function testCashflowRowsAreExtendedToAge100() {
  const settings = {
    birthDate: '1990-12-31',
    entryStartMonth: '2024-01',
    plans: [],
  };
  const payload = {
    settings,
    transactions: [],
    recurringExpenses: [],
    lifeEvents: [],
    assumptions: {
      salaryGrowthRateBefore60: 1,
      inflationRate: 1,
    },
  };

  const rowsUntil65 = buildCashflowRowsUntilAge({
    ...payload,
    targetAge: 65,
  });
  const rowsUntil100 = buildCashflowRows(payload);

  assert.ok(rowsUntil65.length > 0);
  assert.ok(rowsUntil100.length > rowsUntil65.length);
  assert.strictEqual(rowsUntil100.at(-1).age, 100);
  assert.deepStrictEqual(rowsUntil100.slice(0, rowsUntil65.length), rowsUntil65);
})();

(function testAgeYearEndBalanceMatchesCashflowRowAtTargetAge() {
  const settings = {
    birthDate: '1990-03-20',
    entryStartMonth: '2024-01',
    plans: [
      {
        id: 'plan-1',
        type: 'NISA',
        expectedReturn: 0,
        initialPrincipalAtStartMonth: 1000000,
        monthlyContributions: [{ startMonth: '2024-01', amount: 10000 }],
        lumpSums: [],
      },
    ],
  };
  const payload = {
    settings,
    transactions: [],
    recurringExpenses: [],
    lifeEvents: [],
    assumptions: {
      salaryGrowthRateBefore60: 1,
      inflationRate: 1,
    },
  };
  const rows = buildCashflowRows(payload);
  const age65Row = rows.find((row) => row.age === 65);
  const age65YearEnd = calculateAssetFormationBalanceAtAgeYearEnd({
    ...payload,
    targetAge: 65,
  });

  assert.ok(age65Row);
  assert.strictEqual(age65YearEnd, age65Row.assetFormationBalance);
})();

(function testCashflowAssetFormationUsesCommonMonthlySimulationYearEnd() {
  const settings = {
    birthDate: '1990-01-01',
    entryStartMonth: '2024-01',
    plans: [
      {
        id: 'plan-monthly-common-sync',
        type: 'NISA',
        expectedReturn: 12,
        initialPrincipalAtStartMonth: 1000000,
        monthlyContributions: [{ startMonth: '2024-01', amount: 100000 }],
        lumpSums: [],
      },
    ],
  };
  const payload = {
    settings,
    transactions: [],
    recurringExpenses: [],
    lifeEvents: [],
    assumptions: {
      salaryGrowthRateBefore60: 0,
      inflationRate: 0,
    },
  };

  const rows = buildCashflowRows(payload);
  const row2024 = rows.find((row) => row.year === 2024);
  assert.ok(row2024);

  const simulation = simulatePlanMonthlyBalanceTrajectory(settings.plans[0], settings.birthDate, {
    startMonth: '2024-01',
    endMonth: '2024-12',
    includeContribution: true,
    includeInstallmentWithdrawal: true,
    includeLumpSumWithdrawal: true,
    includeMonthlyReturn: true,
  });
  const expectedYearEnd = Math.round(simulation.endingBalance);
  assert.strictEqual(row2024.assetFormationBalance, expectedYearEnd);
})();

console.log('cashflow age range tests passed');
