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
const buildAnnualAssetFormationBalancesByYear = sandbox.buildAnnualAssetFormationBalancesByYear;
const buildCashflowRowsUntilAge = sandbox.buildCashflowRowsUntilAge;
const calculateSuggestedWithdrawMonth = sandbox.calculateSuggestedWithdrawMonth;
const projectPlanAssetDetails = sandbox.projectPlanAssetDetails;
const calculateFinancialAssetTotalAtMonth = sandbox.calculateFinancialAssetTotalAtMonth;
assert.strictEqual(typeof buildAnnualAssetWithdrawalTransfersByYear, 'function');
assert.strictEqual(typeof buildAnnualAssetFormationBalancesByYear, 'function');
assert.strictEqual(typeof buildCashflowRowsUntilAge, 'function');
assert.strictEqual(typeof calculateSuggestedWithdrawMonth, 'function');
assert.strictEqual(typeof projectPlanAssetDetails, 'function');
assert.strictEqual(typeof calculateFinancialAssetTotalAtMonth, 'function');

(function testAmountAndUnsetModes() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'p1',
          expectedReturn: 0,
          currentValue: 1000000,
          initialPrincipalAtStartMonth: 1000000,
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
          initialPrincipalAtStartMonth: 500000,
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
          initialPrincipalAtStartMonth: 1000000,
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
          initialPrincipalAtStartMonth: 1200000,
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
          initialPrincipalAtStartMonth: 1000000,
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
          initialPrincipalAtStartMonth: 200000,
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

(function testAssetFormationBalanceIncludesCurrentValueFromStartYear() {
  const balances = buildAnnualAssetFormationBalancesByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          expectedReturn: 0,
          currentValue: 300000,
          initialPrincipalAtStartMonth: 300000,
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

  assert.strictEqual(balances[2025], 300000);
  assert.strictEqual(balances[2026], 300000);
})();

(function testCashflowRowsUsePostWithdrawalAssetFormationBalance() {
  const rows = buildCashflowRowsUntilAge({
    settings: {
      birthDate: '1990-01-01',
      entryStartMonth: '2025-01',
      plans: [
        {
          id: 'cashflow-withdraw-sync',
          expectedReturn: 0,
          currentValue: 1000000,
          initialPrincipalAtStartMonth: 1000000,
          monthlyContributions: [],
          lumpSums: [],
          withdrawalStartDate: '2025-01',
          withdrawalMode: 'amount',
          withdrawalAmount: 100000,
        },
      ],
    },
    transactions: [],
    recurringExpenses: [],
    lifeEvents: [],
    assumptions: { salaryGrowthRateBefore60: 0, inflationRate: 0 },
    targetAge: 37,
  });

  const row2025 = rows.find((row) => row.year === 2025);
  const row2026 = rows.find((row) => row.year === 2026);
  assert.strictEqual(row2025.annualAssetWithdrawalTransfer, 100000);
  assert.strictEqual(row2025.assetFormationBalance, 900000);
  assert.strictEqual(row2026.annualAssetWithdrawalTransfer, 100000);
  assert.strictEqual(row2026.assetFormationBalance, 800000);
})();

(function testAssetFormationUsesExpectedReturnAndIgnoresCurrentAutoYield() {
  const balances = buildAnnualAssetFormationBalancesByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          expectedReturn: 10,
          currentAutoYield: 99,
          currentValue: 1000000,
          initialPrincipalAtStartMonth: 1000000,
          monthlyContributions: [],
          lumpSums: [],
          useInstallment: true,
          installmentStartDate: '2025-01',
          installmentMode: 'amount',
          installmentAmount: 100000,
        },
      ],
    },
    startYear: 2025,
    endYear: 2026,
    startMonth: '2025-01',
    referenceMonth: '2026-12',
    targetAge: 100,
  });

  assert.strictEqual(balances[2025], 1100000);
  assert.strictEqual(balances[2026], 1210000);
})();

(function testAssetFormationTreatsInstallmentAndLumpAsInvestmentInputs() {
  const balances = buildAnnualAssetFormationBalancesByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          expectedReturn: 10,
          currentValue: 1000000,
          initialPrincipalAtStartMonth: 1000000,
          monthlyContributions: [
            { startMonth: '2025-01', amount: 100000 },
          ],
          lumpSums: [
            { month: '2025-03', amount: 300000 },
          ],
        },
      ],
    },
    startYear: 2025,
    endYear: 2025,
    startMonth: '2025-01',
    referenceMonth: '2025-12',
    targetAge: 100,
  });

  assert.strictEqual(balances[2025], 2688853);
})();

(function testAssetSnapshotsHandlePlansWithoutIdsIndependently() {
  const balances = buildAnnualAssetFormationBalancesByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          expectedReturn: 0,
          currentValue: 100000,
          initialPrincipalAtStartMonth: 100000,
          monthlyContributions: [],
          lumpSums: [],
          useLumpSum: true,
          lumpSumDate: '2025-03',
          lumpSumMode: 'rate',
          lumpSumRate: 100,
        },
        {
          expectedReturn: 0,
          currentValue: 200000,
          initialPrincipalAtStartMonth: 200000,
          monthlyContributions: [],
          lumpSums: [],
          useLumpSum: false,
        },
      ],
    },
    startYear: 2025,
    endYear: 2025,
    startMonth: '2025-01',
    referenceMonth: '2025-12',
    targetAge: 100,
  });

  assert.strictEqual(balances[2025], 300000);
})();

(function testAssetFormationSumsPerContractWithoutApplyingReturnOnAggregate() {
  const balances = buildAnnualAssetFormationBalancesByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'contract-a',
          expectedReturn: 12,
          currentValue: 1000000,
          initialPrincipalAtStartMonth: 1000000,
          monthlyContributions: [],
          lumpSums: [],
        },
        {
          id: 'contract-b',
          expectedReturn: 0,
          currentValue: 1000000,
          initialPrincipalAtStartMonth: 1000000,
          monthlyContributions: [],
          lumpSums: [],
        },
      ],
    },
    startYear: 2025,
    endYear: 2025,
    startMonth: '2025-01',
    referenceMonth: '2025-12',
    targetAge: 100,
  });

  assert.strictEqual(balances[2025], 2120000);
})();

(function testAssetFormationFirstYearUsesRemainingMonthsOnly() {
  const balances = buildAnnualAssetFormationBalancesByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'partial-year',
          expectedReturn: 12,
          currentValue: 1200000,
          initialPrincipalAtStartMonth: 1200000,
          monthlyContributions: [],
          lumpSums: [],
        },
      ],
    },
    startYear: 2025,
    endYear: 2025,
    startMonth: '2025-07',
    referenceMonth: '2025-12',
    targetAge: 100,
  });

  assert.strictEqual(balances[2025], 1269961);
})();

(function testAssetFormationContributionStopsAfterWithdrawMonthWithoutWithdrawal() {
  const balances = buildAnnualAssetFormationBalancesByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'stop-contribution',
          expectedReturn: 0,
          currentValue: 0,
          initialPrincipalAtStartMonth: 0,
          monthlyContributions: [
            { startMonth: '2025-01', amount: 100000 },
          ],
          lumpSums: [],
          withdrawMonth: '2025-03',
        },
      ],
    },
    startYear: 2025,
    endYear: 2025,
    startMonth: '2025-01',
    referenceMonth: '2025-12',
    targetAge: 100,
  });

  assert.strictEqual(balances[2025], 200000);
})();

(function testAssetFormationDoesNotDoubleCountCurrentTotalAndLumpSum() {
  const balances = buildAnnualAssetFormationBalancesByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'double-count-guard',
          expectedReturn: 0,
          currentValue: 5000000,
          initialPrincipalAtStartMonth: 5000000,
          monthlyContributions: [],
          lumpSums: [
            { month: '2026-02', amount: 200000 },
          ],
        },
      ],
    },
    startYear: 2026,
    endYear: 2026,
    startMonth: '2026-01',
    referenceMonth: '2026-12',
    targetAge: 100,
  });

  assert.strictEqual(balances[2026], 5200000);
})();

(function testLumpSumRateModeUsesCurrentValueAsBaselineWithoutCarryInRebuild() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'lump-rate-carry-in',
          expectedReturn: 0,
          currentValue: 400000,
          initialPrincipalAtStartMonth: 400000,
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
  assert.strictEqual(transfers[2025], 400000);
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
          initialPrincipalAtStartMonth: 1000000,
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
          initialPrincipalAtStartMonth: 1000000,
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
          initialPrincipalAtStartMonth: 100000,
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
          initialPrincipalAtStartMonth: 500000,
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
          initialPrincipalAtStartMonth: 500000,
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

(function testInstallmentRateModeUsesCurrentValueAsBaselineWithoutCarryInRebuild() {
  const transfers = buildAnnualAssetWithdrawalTransfersByYear({
    settings: {
      birthDate: '1990-01-01',
      plans: [
        {
          id: 'installment-rate-carry-in',
          expectedReturn: 0,
          currentValue: 500000,
          initialPrincipalAtStartMonth: 500000,
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
  assert.strictEqual(transfers[2025], 50000);
  assert.strictEqual(transfers[2026], 45000);
})();

(function testSuggestedWithdrawMonthUsesRetirementReferenceMonth() {
  assert.strictEqual(
    calculateSuggestedWithdrawMonth({ birthDate: '1990-01-15' }),
    '2050-01'
  );
  assert.strictEqual(calculateSuggestedWithdrawMonth({ birthDate: '' }), '');
})();

(function testProjectionStartsFromInitialPrincipalAtStartMonthAndIgnoresCurrentValue() {
  const plan = {
    expectedReturn: 0,
    currentValue: 0,
    initialPrincipalAtStartMonth: 1000000,
    withdrawalDay: 1,
    monthlyContributions: [
      { startMonth: '2022-01', amount: 30000 },
      { startMonth: '2024-04', amount: 40000 },
    ],
    lumpSums: [
      { month: '2023-06', amount: 500000 },
      { month: '2024-06', amount: 100000 },
    ],
  };

  const projection = projectPlanAssetDetails(plan, '', '2024-07', {
    baseMonth: '2024-05',
    asOfDate: '2024-07-31',
  });

  assert.strictEqual(projection.amount, 1220000);
  assert.strictEqual(projection.baseMonth, '2024-05');
  assert.strictEqual(
    JSON.stringify(projection.appliedMonthly),
    JSON.stringify([
      { month: '2024-05', amount: 40000 },
      { month: '2024-06', amount: 40000 },
      { month: '2024-07', amount: 40000 },
    ])
  );
  assert.strictEqual(
    JSON.stringify(projection.appliedLumpSums),
    JSON.stringify([
      { month: '2024-06', amount: 100000 },
    ])
  );
})();

(function testProjectionIgnoresCurrentValueWhenInitialPrincipalIsSet() {
  const commonPlan = {
    expectedReturn: 0,
    initialPrincipalAtStartMonth: 800000,
    withdrawalDay: 1,
    monthlyContributions: [
      { startMonth: '2024-05', amount: 20000 },
    ],
    lumpSums: [],
  };

  const highCurrentValueProjection = projectPlanAssetDetails({
    ...commonPlan,
    currentValue: 9000000,
  }, '', '2024-06', {
    baseMonth: '2024-05',
    asOfDate: '2024-06-30',
  });
  const zeroCurrentValueProjection = projectPlanAssetDetails({
    ...commonPlan,
    currentValue: 0,
  }, '', '2024-06', {
    baseMonth: '2024-05',
    asOfDate: '2024-06-30',
  });

  assert.strictEqual(highCurrentValueProjection.amount, 840000);
  assert.strictEqual(zeroCurrentValueProjection.amount, 840000);
})();

(function testMonthlyFinancialAssetProjectionAppliesInstallmentWithdrawalAndStopsContribution() {
  const settings = {
    birthDate: '1990-01-01',
    entryStartMonth: '2024-01',
    plans: [
      {
        id: 'installment-monthly-consistency',
        expectedReturn: 0,
        currentValue: 1000000,
        initialPrincipalAtStartMonth: 1000000,
        withdrawalDay: 1,
        monthlyContributions: [
          { startMonth: '2024-01', amount: 10000 },
        ],
        lumpSums: [],
        withdrawalStartDate: '2025-01',
        withdrawalMode: 'amount',
        withdrawalAmount: 120000,
      },
    ],
  };

  assert.strictEqual(
    calculateFinancialAssetTotalAtMonth(settings, '2024-12', { baseMonth: '2024-01', asOfDate: '2026-12-31' }),
    1120000
  );
  assert.strictEqual(
    calculateFinancialAssetTotalAtMonth(settings, '2025-12', { baseMonth: '2024-01', asOfDate: '2026-12-31' }),
    1000000
  );
  assert.strictEqual(
    calculateFinancialAssetTotalAtMonth(settings, '2026-12', { baseMonth: '2024-01', asOfDate: '2026-12-31' }),
    880000
  );
})();

console.log('cashflow asset withdrawal tests passed');
