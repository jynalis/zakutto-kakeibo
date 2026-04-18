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

const buildAssetLumpInvestmentsByMonth = sandbox.buildAssetLumpInvestmentsByMonth;
const sumMonthlyAmountsInYear = sandbox.sumMonthlyAmountsInYear;
assert.strictEqual(typeof buildAssetLumpInvestmentsByMonth, 'function');
assert.strictEqual(typeof sumMonthlyAmountsInYear, 'function');

(function testLumpInvestmentAppliedOnlyInExecutionYear() {
  const settings = {
    birthDate: '1990-01-01',
    plans: [{
      withdrawMonth: '',
      lumpSums: [{ month: '2026-02', amount: 500000 }],
    }],
  };

  const lumpMap = buildAssetLumpInvestmentsByMonth(settings);
  assert.strictEqual(sumMonthlyAmountsInYear(lumpMap, 2026, '2026-01', '2026-12'), 500000);
  assert.strictEqual(sumMonthlyAmountsInYear(lumpMap, 2027, '2027-01', '2027-12'), 0);
})();

(function testLumpInvestmentZeroAmountHasNoImpact() {
  const settings = {
    birthDate: '1990-01-01',
    plans: [{
      withdrawMonth: '',
      lumpSums: [{ month: '2026-02', amount: 0 }],
    }],
  };

  const lumpMap = buildAssetLumpInvestmentsByMonth(settings);
  assert.strictEqual(sumMonthlyAmountsInYear(lumpMap, 2026, '2026-01', '2026-12'), 0);
})();

(function testLumpInvestmentNoDoubleCountInSameMonth() {
  const settings = {
    birthDate: '1990-01-01',
    plans: [{
      withdrawMonth: '',
      lumpSums: [
        { month: '2026-02', amount: 500000 },
        { month: '2026-02', amount: 500000 },
      ],
    }],
  };

  const lumpMap = buildAssetLumpInvestmentsByMonth(settings);
  assert.strictEqual(sumMonthlyAmountsInYear(lumpMap, 2026, '2026-01', '2026-12'), 500000);
})();

console.log('cashflow lump investment tests passed');
