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
          withdrawalStartDate: '2025-01',
          withdrawalMode: 'amount',
          withdrawalAmount: 120000,
        },
        {
          id: 'p2',
          expectedReturn: 0,
          currentValue: 500000,
          monthlyContributions: [],
          lumpSums: [],
          withdrawalStartDate: '2025-01',
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
  assert.strictEqual(transfers[2027], 120000);
})();

(function testInstallmentStartMonthProratesFirstYearForAmountMode() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'amount-prorate',
          expectedReturn: 0,
          currentValue: 1000000,
          monthlyContributions: [],
          lumpSums: [],
          installmentStartDate: '2025-07',
          withdrawalMode: 'amount',
          withdrawalAmount: 600000,
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
  assert.strictEqual(transfers[2025], 300000);
  assert.strictEqual(transfers[2026], 600000);
  assert.strictEqual(transfers[2027], 100000);
})();

(function testInstallmentStartMonthProratesFirstYearForRateMode() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'rate-prorate',
          expectedReturn: 0,
          currentValue: 1200000,
          monthlyContributions: [],
          lumpSums: [],
          installmentStartDate: '2025-07',
          withdrawalMode: 'rate',
          withdrawalRate: 4,
        },
      ],
    },
    startYear: 2025,
    endYear: 2026,
    startMonth: '2025-01',
    referenceMonth: '2026-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2025], 24000);
  assert.strictEqual(transfers[2026], 47040);
})();

(function testInstallmentRateModeReadsInstallmentKeys() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'installment-rate-keys',
          expectedReturn: 0,
          currentValue: 1000000,
          monthlyContributions: [],
          lumpSums: [],
          useInstallment: true,
          installmentStartDate: '2025-01',
          installmentMode: 'rate',
          installmentRate: 5,
        },
      ],
    },
    startYear: 2025,
    endYear: 2026,
    startMonth: '2025-01',
    referenceMonth: '2026-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2025], 50000);
  assert.strictEqual(transfers[2026], 47500);
})();

(function testLumpSumRateModeReadsLumpSumDateAndCapsAtBalance() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'lump-rate-keys',
          expectedReturn: 0,
          currentValue: 200000,
          monthlyContributions: [],
          lumpSums: [],
          useLumpSum: true,
          lumpSumDate: '2025-03',
          lumpSumMode: 'rate',
          lumpSumRate: 100,
        },
      ],
    },
    startYear: 2025,
    endYear: 2026,
    startMonth: '2025-01',
    referenceMonth: '2026-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2025], 200000);
  assert.strictEqual(transfers[2026], 0);
})();

(function testLumpSumRateModeIncludesCarryInBalanceBeforeStartMonth() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'lump-rate-carry-in',
          expectedReturn: 0,
          currentValue: 0,
          monthlyContributions: [
            { startMonth: '2022-01', amount: 50000 },
            { startMonth: '2023-01', amount: 0 },
          ],
          lumpSums: [
            { month: '2023-06', amount: 300000 },
          ],
          useLumpSum: true,
          lumpSumDate: '2025-03',
          lumpSumMode: 'rate',
          lumpSumRate: 100,
        },
      ],
    },
    startYear: 2024,
    endYear: 2025,
    startMonth: '2024-01',
    referenceMonth: '2025-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2024], 0);
  assert.strictEqual(transfers[2025], 900000);
})();

(function testUnsetInstallmentStartDateDoesNotApplyWithdrawals() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'unset-start',
          expectedReturn: 0,
          currentValue: 1000000,
          monthlyContributions: [],
          lumpSums: [],
          withdrawalMode: 'amount',
          withdrawalAmount: 120000,
        },
      ],
    },
    startYear: 2024,
    endYear: 2025,
    startMonth: '2024-01',
    referenceMonth: '2025-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2024], 0);
  assert.strictEqual(transfers[2025], 0);
})();

(function testRateModeUsesPostWithdrawalBalanceAndCap() {
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
          withdrawalStartDate: '2024-01',
          withdrawalMode: 'rate',
          withdrawalRate: 10,
        },
        {
          id: 'cap-plan',
          expectedReturn: 0,
          currentValue: 100000,
          monthlyContributions: [],
          lumpSums: [],
          withdrawalStartDate: '2024-01',
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
  assert.strictEqual(transfers[2025], 99000);
  assert.strictEqual(transfers[2026], 98010);
})();

(function testLumpSumAndInstallmentAreCombinedWithAvailableBalanceCap() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'hybrid-plan',
          expectedReturn: 0,
          currentValue: 500000,
          monthlyContributions: [],
          lumpSums: [],
          useLumpSum: true,
          withdrawMonth: '2026-10',
          lumpSumMode: 'amount',
          lumpSumAmount: 400000,
          useInstallment: true,
          installmentStartDate: '2026-07',
          installmentMode: 'amount',
          installmentAmount: 300000,
          withdrawalMode: 'amount',
          withdrawalAmount: 300000,
        },
      ],
    },
    startYear: 2026,
    endYear: 2027,
    startMonth: '2026-01',
    referenceMonth: '2027-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2026], 500000);
  assert.strictEqual(transfers[2027], 0);
})();

(function testStartDateContinuesUntilTargetAge() {
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
          withdrawalStartDate: '2025-01',
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

(function testInstallmentRateModeIncludesCarryInBalanceBeforeStartMonth() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'installment-rate-carry-in',
          expectedReturn: 0,
          currentValue: 0,
          monthlyContributions: [
            { startMonth: '2023-01', amount: 100000 },
            { startMonth: '2024-01', amount: 0 },
          ],
          lumpSums: [],
          withdrawalStartDate: '2025-01',
          withdrawalMode: 'rate',
          withdrawalRate: 10,
        },
      ],
    },
    startYear: 2024,
    endYear: 2026,
    startMonth: '2024-01',
    referenceMonth: '2026-12',
    targetAge: 100,
  });

  assert.strictEqual(transfers[2024], 0);
  assert.strictEqual(transfers[2025], 120000);
  assert.strictEqual(transfers[2026], 108000);
})();

(function testSuggestedWithdrawMonthUsesRetirementReferenceMonth() {
  assert.strictEqual(
    calculateSuggestedWithdrawMonth({ birthDate: '1990-01-15' }),
    '2050-01'
  );
  assert.strictEqual(calculateSuggestedWithdrawMonth({ birthDate: '' }), '');
})();

console.log('cashflow asset withdrawal tests passed');
