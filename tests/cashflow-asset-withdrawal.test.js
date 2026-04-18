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

const buildAnnualAssetWithdrawalTransfersByYear = sandbox.buildAnnualAssetWithdrawalTransfersByYear;
const calculateSuggestedWithdrawMonth = sandbox.calculateSuggestedWithdrawMonth;
assert.strictEqual(typeof buildAnnualAssetWithdrawalTransfersByYear, 'function');
assert.strictEqual(typeof calculateSuggestedWithdrawMonth, 'function');

(function testAmountAndUnsetModes() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'p1',
          expectedReturn: 0,
          currentValue: 1000000,
          monthlyContributions: [],
          lumpSums: [],
          withdrawalStartAge: 35,
          withdrawalEndAge: 36,
          withdrawalMode: 'amount',
          withdrawalAmount: 120000,
        },
        {
          id: 'p2',
          expectedReturn: 0,
          currentValue: 500000,
          monthlyContributions: [],
          lumpSums: [],
          withdrawalStartAge: 35,
          withdrawalEndAge: 36,
          withdrawalMode: '',
          withdrawalAmount: 999999,
        },
      ],
    },
    startYear: 2024,
    endYear: 2027,
    startMonth: '2024-01',
    referenceMonth: '2027-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2024], 0);
  assert.strictEqual(transfers[2025], 120000);
  assert.strictEqual(transfers[2026], 120000);
  assert.strictEqual(transfers[2027], 0);
})();

(function testRateModeUsesYearStartBalanceAndCap() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'rate-plan',
          expectedReturn: 10,
          currentValue: 1000000,
          monthlyContributions: [],
          lumpSums: [],
          withdrawalStartAge: 34,
          withdrawalEndAge: null,
          withdrawalMode: 'rate',
          withdrawalRate: 10,
        },
        {
          id: 'cap-plan',
          expectedReturn: 0,
          currentValue: 100000,
          monthlyContributions: [],
          lumpSums: [],
          withdrawalStartAge: 34,
          withdrawalEndAge: null,
          withdrawalMode: 'amount',
          withdrawalAmount: 300000,
        },
      ],
    },
    startYear: 2024,
    endYear: 2026,
    startMonth: '2024-01',
    referenceMonth: '2026-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2024], 200000);
  assert.strictEqual(transfers[2025], 100000);
  assert.strictEqual(transfers[2026], 100000);
})();

(function testEndAgeZeroContinuesUntil100() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'p-end-zero',
          expectedReturn: 0,
          currentValue: 500000,
          monthlyContributions: [],
          lumpSums: [],
          withdrawalStartAge: 35,
          withdrawalEndAge: 0,
          withdrawalMode: 'amount',
          withdrawalAmount: 100000,
        },
      ],
    },
    startYear: 2024,
    endYear: 2028,
    startMonth: '2024-01',
    referenceMonth: '2028-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2025], 100000);
  assert.strictEqual(transfers[2026], 100000);
  assert.strictEqual(transfers[2027], 100000);
  assert.strictEqual(transfers[2028], 100000);
})();

(function testSuggestedWithdrawMonthUsesRetirementReferenceMonth() {
  assert.strictEqual(
    calculateSuggestedWithdrawMonth({ birthDate: '1990-01-15' }),
    '2050-01'
  );
  assert.strictEqual(calculateSuggestedWithdrawMonth({ birthDate: '' }), '');
})();

console.log('cashflow asset withdrawal tests passed');
