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
assert.strictEqual(typeof buildCashflowRows, 'function');
assert.strictEqual(typeof buildCashflowRowsUntilAge, 'function');

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

console.log('cashflow age range tests passed');
