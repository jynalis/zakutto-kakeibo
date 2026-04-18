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

const calculateAnnualAssetFormationExpense = sandbox.calculateAnnualAssetFormationExpense;
const formatAmountInputValue = sandbox.formatAmountInputValue;
assert.strictEqual(typeof calculateAnnualAssetFormationExpense, 'function');
assert.strictEqual(typeof formatAmountInputValue, 'function');

(function testHistorySwitchTo1000() {
  const settings = {
    birthDate: '1990-01-01',
    plans: [{
      monthlyContributions: [
        { startMonth: '2024-01', amount: 35000 },
        { startMonth: '2034-03', amount: 1000 },
      ],
      withdrawMonth: '',
    }],
  };
  const total2034 = calculateAnnualAssetFormationExpense(settings, 2034, '2034-01', '2034-12');
  assert.strictEqual(total2034, 80000);
})();

(function testHistorySwitchToZero() {
  const settings = {
    birthDate: '1990-01-01',
    plans: [{
      monthlyContributions: [
        { startMonth: '2024-01', amount: 35000 },
        { startMonth: '2034-03', amount: 0 },
      ],
      withdrawMonth: '',
    }],
  };
  const total2034 = calculateAnnualAssetFormationExpense(settings, 2034, '2034-01', '2034-12');
  assert.strictEqual(total2034, 70000);
})();

(function testSingleHistory() {
  const settings = {
    birthDate: '1990-01-01',
    plans: [{
      monthlyContributions: [
        { startMonth: '2024-01', amount: 35000 },
      ],
      withdrawMonth: '',
    }],
  };
  const total2025 = calculateAnnualAssetFormationExpense(settings, 2025, '2025-01', '2025-12');
  assert.strictEqual(total2025, 420000);
})();

(function testInputOrderDoesNotMatter() {
  const settings = {
    birthDate: '1990-01-01',
    plans: [{
      monthlyContributions: [
        { startMonth: '2034-03', amount: 1000 },
        { startMonth: '2024-01', amount: 35000 },
      ],
      withdrawMonth: '',
    }],
  };
  const total2034 = calculateAnnualAssetFormationExpense(settings, 2034, '2034-01', '2034-12');
  assert.strictEqual(total2034, 80000);
})();

(function testFormatAmountInputValueDistinguishesZeroFromBlank() {
  assert.strictEqual(formatAmountInputValue('', { allowZero: true }), '');
  assert.strictEqual(formatAmountInputValue('0', { allowZero: true }), '0');
  assert.strictEqual(formatAmountInputValue('0', { allowZero: false }), '');
  assert.strictEqual(formatAmountInputValue('35000', { allowZero: true }), '35,000');
})();

console.log('cashflow monthly contribution tests passed');
