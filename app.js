const STORAGE_KEY = "kakeibo_transactions_v1";
const SETTINGS_KEY = "kakeibo_settings_v1";
const RECURRING_EXPENSES_KEY = "kakeibo_recurring_expenses_v1";
const LIFE_EVENTS_KEY = "kakeibo_life_events_v1";
const CASHFLOW_ASSUMPTIONS_KEY = "kakeibo_cashflow_assumptions_v1";
const CASHFLOW_INCOME_SETTINGS_KEY = "kakeibo_cashflow_income_settings_v1";
const CASHFLOW_EXPENSE_SETTINGS_KEY = "kakeibo_cashflow_expense_settings_v1";
const BACKUP_SCHEMA_VERSION = 1;
const BACKUP_STORAGE_KEYS = [
  SETTINGS_KEY,
  STORAGE_KEY,
  RECURRING_EXPENSES_KEY,
  LIFE_EVENTS_KEY,
  CASHFLOW_ASSUMPTIONS_KEY,
  CASHFLOW_INCOME_SETTINGS_KEY,
  CASHFLOW_EXPENSE_SETTINGS_KEY,
];

const form = document.getElementById("transaction-form");
const dateInput = document.getElementById("date");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const memoInput = document.getElementById("memo");
const transactionSubmitButton = document.getElementById("transaction-submit-button") || form?.querySelector('button[type="submit"]');
const transactionCancelButton = document.getElementById("transaction-cancel-button");
const transactionEditStatus = document.getElementById("transaction-edit-status");
const plannedHistoryBlock = document.getElementById("planned-history-block");
const historyViewFilterControls = {
  year: document.getElementById("history-year-filter"),
  month: document.getElementById("history-month-filter"),
};
const dashboardViewFilterControls = {
  mode: document.getElementById("dashboard-view-mode"),
  year: document.getElementById("dashboard-year-filter"),
  month: document.getElementById("dashboard-month-filter"),
};
const expenseViewFilterControls = {
  mode: document.getElementById("expense-view-mode"),
  year: document.getElementById("expense-year-filter"),
  month: document.getElementById("expense-month-filter"),
};

const profileForm = document.getElementById("profile-form");
const entryStartMonthInput = document.getElementById("entry-start-month");
const birthDateInput = document.getElementById("birth-date");
const profileBasicSaveButton = document.getElementById("profile-basic-save-button");
const profileSubmitButton = document.getElementById("profile-submit-button") || profileForm?.querySelector('button[type="submit"]');
const profileCancelButton = document.getElementById("profile-cancel-button");
const assetProfileSubmitButton = document.getElementById("asset-profile-submit-button");
const assetProfileCancelButton = document.getElementById("asset-profile-cancel-button");
const profileBackupExportButton = document.getElementById("profile-backup-export-button");
const profileBackupImportButton = document.getElementById("profile-backup-import-button");
const profileBackupFileInput = document.getElementById("profile-backup-file-input");
const basicEditStatus = document.getElementById("basic-edit-status");
const assetBasicEditStatus = document.getElementById("asset-basic-edit-status");
const planList = document.getElementById("plan-list");
const planEditorList = document.getElementById("plan-editor-list");
const assetPlanEditorList = document.getElementById("asset-plan-editor-list");
const planEditorLists = [planEditorList, assetPlanEditorList].filter(Boolean);
const profileEditStatusNodes = [basicEditStatus, assetBasicEditStatus].filter(Boolean);
const basicRegisteredSummary = document.getElementById("basic-registered-summary");
const basicRegisteredPlanCount = document.getElementById("basic-registered-plan-count");
const assetForecast = document.getElementById("asset-forecast");
const assetWithdrawForecast = document.getElementById("asset-withdraw-forecast");
const recurringForm = document.getElementById("recurring-form");
const recurringCategoryInput = document.getElementById("recurring-category");
const recurringAmountInput = document.getElementById("recurring-amount");
const recurringDayInput = document.getElementById("recurring-day");
const recurringStartMonthInput = document.getElementById("recurring-start-month");
const recurringEndMonthInput = document.getElementById("recurring-end-month");
const recurringMemoInput = document.getElementById("recurring-memo");
const recurringList = document.getElementById("recurring-list");
const recurringSubmitButton = document.getElementById("recurring-submit-button") || recurringForm?.querySelector('button[type="submit"]');
const recurringCancelButton = document.getElementById("recurring-cancel-button");
const recurringEditStatus = document.getElementById("recurring-edit-status");
const recurringSection = document.getElementById("section-recurring");
const inputSection = document.getElementById("section-input");
const basicRegisterPanel = document.getElementById("input-sub-panel-basic-register");
const recurringRegisterPanel = document.getElementById("input-sub-panel-recurring-register");
const lifeRegisterPanel = document.getElementById("input-sub-panel-life-register");
const assetFormationRegisterPanel = document.getElementById("input-sub-panel-asset-formation-register");

const lifeEventForm = document.getElementById("life-event-form");
const lifeEventMonthInput = document.getElementById("life-event-month");
const lifeEventAgePreview = document.getElementById("life-event-age-preview");
const lifeEventTypeInput = document.getElementById("life-event-type");
const lifeEventCategoryInput = document.getElementById("life-event-category");
const lifeEventAmountInput = document.getElementById("life-event-amount");
const lifeEventMemoInput = document.getElementById("life-event-memo");
const lifeEventList = document.getElementById("life-event-list");
const lifeEventSubmitButton = document.getElementById("life-event-submit-button") || lifeEventForm?.querySelector('button[type="submit"]');
const lifeEventCancelButton = document.getElementById("life-event-cancel-button");
const lifeEventEditStatus = document.getElementById("life-event-edit-status");
const lifeEventError = document.getElementById("life-event-error");
const lifeEventsSection = document.getElementById("section-life-events");
const appTitleHeading = document.querySelector(".page-header h1");

const list = document.getElementById("transaction-list");
const plannedList = document.getElementById("planned-transaction-list");
const plannedHistoryTitle = document.getElementById("planned-history-title");
const template = document.getElementById("transaction-item-template");
const dashboardIncomeTotal = document.getElementById("dashboard-income-total");
const dashboardExpenseTotal = document.getElementById("dashboard-expense-total");
const dashboardBalanceTotal = document.getElementById("dashboard-balance-total");
const dashboardAge65Total = document.getElementById("dashboard-age65-total");
const dashboardDiagnosisComment = document.getElementById("dashboard-diagnosis-comment");
const dashboardAssetGraphTabs = Array.from(document.querySelectorAll("[data-dashboard-asset-graph-tab]"));
const dashboardAssetGraphPanels = Array.from(document.querySelectorAll("[data-dashboard-asset-graph-panel]"));
const dashboardCurrentAssetForecast = document.getElementById("dashboard-current-asset-forecast");
const dashboardAge65AssetForecast = document.getElementById("dashboard-age65-asset-forecast");
const dashboardWithdrawAssetForecast = document.getElementById("dashboard-withdraw-asset-forecast");
const dashboardRetirementCard = document.getElementById("dashboard-retirement-card");
const dashboardAge65AssetsTab = document.getElementById("dashboard-tab-age65-assets");
const dashboardAge65AssetsPanel = document.getElementById("dashboard-panel-age65-assets");
const dashboardAssetGraphTabbar = document.querySelector(".dashboard-asset-graph-tabbar");
const dashboardAssetFormationChart = document.getElementById("dashboard-asset-formation-chart");
const assetGrowthMonthlyChip = document.getElementById("asset-growth-monthly-chip");
const assetGrowthMetricToggle = document.getElementById("asset-growth-metric-toggle");
const expenseChart = document.getElementById("expense-chart");
const dashboardJumpCards = Array.from(document.querySelectorAll("[data-dashboard-jump-section]"));
const floatingTopButton = document.getElementById("floating-top-button");
const primaryMainTabbar = document.querySelector(".primary-main-tabbar");
const accordionSections = Array.from(document.querySelectorAll("[data-accordion-section]"));
const dashboardSection = document.getElementById("section-home");
const assetsSection = document.getElementById("section-assets");
const assetMainTabs = Array.from(document.querySelectorAll("[data-asset-main-tab]"));
const assetMainPanels = Array.from(document.querySelectorAll("[data-asset-main-panel]"));
const incomeMainTabs = Array.from(document.querySelectorAll("[data-income-main-tab]"));
const incomeMainPanels = Array.from(document.querySelectorAll("[data-income-main-panel]"));
const inputMainTabs = Array.from(document.querySelectorAll("[data-input-main-tab]"));
const inputMainPanels = Array.from(document.querySelectorAll("[data-input-main-panel]"));
const primaryMainTabs = Array.from(document.querySelectorAll("[data-primary-main-tab]"));
const primaryMainPanels = Array.from(document.querySelectorAll("[data-primary-main-panel]"));
const inputSubSwitches = Array.from(document.querySelectorAll("[data-input-sub-switch]"));
const cashflowSalaryGrowthRateBefore60Input = document.getElementById("cashflow-salary-growth-rate-before-60");
const cashflowInflationRateInput = document.getElementById("cashflow-inflation-rate");
const cashflowIncomeRetirementMonthInput = document.getElementById("cashflow-income-retirement-month");
const cashflowIncomeSettingsForm = document.getElementById("cashflow-income-settings-form");
const cashflowExpenseSettingsForm = document.getElementById("cashflow-expense-settings-form");
const cashflowIncomeScenarioList = document.getElementById("cashflow-income-scenario-list");
const cashflowIncomeScenarioAddButton = document.getElementById("cashflow-income-scenario-add");
const cashflowExpenseScenarioList = document.getElementById("cashflow-expense-scenario-list");
const cashflowExpenseScenarioAddButton = document.getElementById("cashflow-expense-scenario-add");
const cashflowTableWrap = document.getElementById("cashflow-table-wrap");
const cashflowDownloadPdfButton = document.getElementById("cashflow-download-pdf-button");
const cashflowSubTabs = Array.from(document.querySelectorAll("[data-cashflow-sub-tab]"));
const cashflowSubPanels = Array.from(document.querySelectorAll("[data-cashflow-sub-panel]"));
const memoModal = document.getElementById("memo-modal");
const memoModalTitle = document.getElementById("memo-modal-title");
const memoModalInput = document.getElementById("memo-modal-input");
const memoModalSaveButton = document.getElementById("memo-modal-save");
const memoModalCancelButton = document.getElementById("memo-modal-cancel");
const memoModalCloseControls = Array.from(document.querySelectorAll("[data-memo-modal-close]"));
const memoTriggerButtons = Array.from(document.querySelectorAll("[data-memo-trigger]"));
const accordionCloseTimers = new WeakMap();
const accordionCollapseWaiters = new WeakMap();
const NAV_CLOSE_FAR_DISTANCE = 520;
const KEYBOARD_BASE_BOTTOM_MARGIN = 28;
const KEYBOARD_BOTTOM_FIELD_MARGIN = 78;
const KEYBOARD_SCROLL_SETTLE_EPSILON = 3;
const KEYBOARD_SCROLL_MIN_STEP = 2;
const KEYBOARD_BOTTOM_FIELD_THRESHOLD = 220;
let mobileUpdateScrollToken = 0;
let baselineVisualViewportHeight = 0;
const keyboardFocusScrollState = {
  target: null,
  rafId: 0,
  timeoutId: 0,
  settledTargetY: null,
};
const memoModalFocusState = {
  rafIds: [],
  timeoutId: 0,
};

let latestAssetForecastSettings = null;
let assetForecastDirty = true;
let assetForecastRenderRafId = 0;
let recurringEditingId = null;
let transactionEditingId = null;
let lifeEventEditingId = null;
let basicEditingPlanId = null;
let sharedYearMonthState = { year: "", month: "" };
let sharedAverageViewState = { averageMode: "month" };
let dashboardAssetGrowthMetric = "endingBalance";
let activeDashboardAssetGraphTab = "current-assets";
let activeAssetMainTab = "formation";
let activeIncomeMainTab = "expense-balance";
let activeInputMainTab = "monthly";
let activePrimaryMainTab = "dashboard";
let activeCashflowSubTab = "income-settings";
let activeMemoDraft = null;
const activeInputSubTabs = {
  basic: "register",
  "asset-formation": "register",
  recurring: "register",
  life: "register",
  monthly: "register",
};

const PRIMARY_MAIN_SECTION_IDS = {
  start: ["section-start"],
  dashboard: ["section-home"],
  assets: ["section-assets"],
  input: ["section-input-main", "section-profile", "section-recurring", "section-life-events", "section-input"],
};

const INCOME_MAIN_SECTION_IDS = {};

const INPUT_MAIN_SECTION_IDS = {
  basic: ["section-profile"],
  recurring: ["section-recurring"],
  life: ["section-life-events"],
  monthly: ["section-input"],
};

const INPUT_SUB_SECTION_IDS = {
  basic: {
    register: ["profile-form"],
    registered: ["basic-registered-summary"],
  },
  "asset-formation": {
    register: ["input-sub-panel-asset-formation-register"],
    registered: ["plan-list"],
  },
  recurring: {
    register: ["recurring-form"],
    registered: ["recurring-list"],
  },
  life: {
    register: ["life-event-form"],
    registered: ["life-event-list"],
  },
  monthly: {
    register: ["transaction-form"],
    history: ["input-sub-panel-monthly-history", "section-history"],
    "expense-balance": ["input-sub-panel-monthly-expense-balance", "section-expense"],
  },
};

const DEFAULT_CASHFLOW_ASSUMPTIONS = {
  salaryGrowthRateBefore60: 1,
  inflationRate: 1,
};

const MAX_CASHFLOW_INCOME_SCENARIOS = 5;
const DEFAULT_CASHFLOW_INCOME_MAINTENANCE_RATE = 100;
const DEFAULT_CASHFLOW_INCOME_SETTINGS = {
  retirementMonth: "",
  scenarios: [],
};
const MAX_CASHFLOW_EXPENSE_SCENARIOS = 5;
const DEFAULT_CASHFLOW_EXPENSE_SETTINGS = {
  scenarios: [],
};

const TARGET_AGE_PRIMARY = 60;
const TARGET_AGE_SECONDARY = 65;
const RETIREMENT_REFERENCE_AGE = TARGET_AGE_PRIMARY;
const RETIREMENT_REFERENCE_DAY_OFFSET = 2;

const EXPENSE_CATEGORIES = ["日常費", "レジャー費", "ガソリン費", "雑費", "出金"];
const LEGACY_EXPENSE_CATEGORY_ALIASES = {
  "趣味・レジャー費": "レジャー費",
  "雑費・予備費": "雑費",
  家賃: "家賃・住宅ローン",
};
const LEGACY_EXPENSE_CATEGORIES = ["家賃・マイホーム費", "生命保険"];
const RECURRING_EXPENSE_CATEGORIES = ["家賃・住宅ローン", "通信費", "保険料", "カーローン", "教育費", "その他固定費"];
const LEGACY_RECURRING_EXPENSE_CATEGORY_ALIASES = {
  家賃: "家賃・住宅ローン",
};
const LIFE_EVENT_TYPES = {
  income: "臨時収入",
  expense: "臨時支出",
};
const LIFE_EVENT_CATEGORY_OPTIONS = {
  income: ["退職金", "相続・贈与", "売却収入", "給付金・補助金", "その他"],
  expense: ["車購入", "教育費", "住宅", "リフォーム", "旅行", "その他"],
};
const LEGACY_LIFE_EVENT_CATEGORY_ALIASES = {
  "保険満期・解約返戻金": "その他",
};
const CATEGORY_OPTIONS = {
  expense: EXPENSE_CATEGORIES,
  income: ["定期収入", "臨時収入", "入金"],
};
const PLAN_TYPES = ["NISA", "iDeCo", "貯蓄性保険", "貯金"];
const PLAN_TYPE_CLASS = {
  NISA: "is-nisa",
  iDeCo: "is-ideco",
  貯蓄性保険: "is-insurance",
  貯金: "is-savings",
};
const ASSET_FORMATION_CATEGORY = "資産形成支出";
const ALLOWED_EXPENSE_CATEGORIES = [
  ...EXPENSE_CATEGORIES,
  ...LEGACY_EXPENSE_CATEGORIES,
  ASSET_FORMATION_CATEGORY,
  ...RECURRING_EXPENSE_CATEGORIES,
];
const ASSET_PIE_COLORS = ["#2b85e4", "#18b8c9", "#41b86f", "#f3a64c", "#9d86eb", "#ef7fa8", "#e3c44b", "#57bce8", "#66a8f1", "#79c99a"];
const EXPENSE_COMPOSITION_ITEMS = [
  "日常費",
  "レジャー費",
  "ガソリン費",
  "雑費",
  "出金",
  "家賃・マイホーム費",
  "家賃・住宅ローン",
  "通信費",
  "保険料",
  "カーローン",
  "教育費",
  "その他固定費",
  "NISA",
  "iDeCo",
  "貯蓄性保険",
  "貯金",
  "生命保険",
];
const EXPENSE_CHART_COLORS = ["#ff6b6b", "#ff922b", "#ffd43b", "#38d9a9", "#4dabf7", "#9775fa", "#f06595", "#74c0fc", "#2f9e44", "#5c7cfa", "#e64980", "#15aabf"];
const DASHBOARD_ASSET_GROWTH_METRICS = {
  endingBalance: {
    label: "残高",
    emptyText: "残高データがないため、グラフを表示できません。",
    ariaLabel: "年ごとの残高棒グラフ",
  },
  assetFormationBalance: {
    label: "資産形成額",
    emptyText: "資産形成額データがないため、グラフを表示できません。",
    ariaLabel: "年ごとの資産形成額棒グラフ",
  },
  financialAssetTotal: {
    label: "金融資産",
    emptyText: "金融資産合計データがないため、グラフを表示できません。",
    ariaLabel: "年ごとの金融資産合計棒グラフ",
  },
};

const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

function isEditableField(element) {
  if (!(element instanceof HTMLElement)) return false;
  if (element.isContentEditable) return true;
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) return true;
  if (!(element instanceof HTMLInputElement)) return false;
  const blockedTypes = new Set(["button", "checkbox", "radio", "range", "color", "file", "image", "submit", "reset", "hidden"]);
  return !blockedTypes.has(element.type);
}

function blurActiveEditableField() {
  const activeElement = document.activeElement;
  if (isEditableField(activeElement) && typeof activeElement.blur === "function") {
    activeElement.blur();
    return true;
  }
  return false;
}

function resolveInputMenuScrollAnchor() {
  return document.getElementById("section-input-main")
    || document.getElementById("section-profile")
    || null;
}

function restoreInputMenuViewportPosition({ force = false } = {}) {
  if (activePrimaryMainTab !== "input") return;
  const anchor = resolveInputMenuScrollAnchor();
  if (!anchor) return;
  const targetY = getSectionHeadingTargetY(anchor);
  if (!force && Math.abs(window.scrollY - targetY) < 24) return;
  scrollToElementWithOffset(anchor, { behavior: "auto" });
}

function isIPhoneSafari() {
  const ua = window.navigator.userAgent || "";
  const isIPhone = /iPhone/i.test(ua);
  const isSafariEngine = /Safari/i.test(ua) && !/(CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser)/i.test(ua);
  return isIPhone && isSafariEngine;
}

function resolveKeyboardOverlayInset({ keyboardOpen = false } = {}) {
  if (!keyboardOpen) return 20;
  const visualViewport = window.visualViewport;
  const viewportTop = visualViewport?.offsetTop ?? 0;
  const viewportHeight = visualViewport?.height ?? window.innerHeight ?? 0;
  const layoutHeight = window.innerHeight || viewportHeight || 0;
  const keyboardOccludedHeight = Math.max(0, layoutHeight - (viewportTop + viewportHeight));
  const safariAccessoryInset = isIPhoneSafari() ? 44 : 0;
  return Math.max(16, keyboardOccludedHeight + safariAccessoryInset);
}

function isBottomAreaField(target) {
  if (!(target instanceof HTMLElement)) return false;
  const form = target.closest("form");
  if (!(form instanceof HTMLElement)) return false;
  const formRect = form.getBoundingClientRect();
  const fieldRect = target.getBoundingClientRect();
  return formRect.bottom - fieldRect.bottom <= KEYBOARD_BOTTOM_FIELD_THRESHOLD;
}

function isMemoModalFocusTarget(target = document.activeElement) {
  if (!(memoModal instanceof HTMLElement) || memoModal.hidden) return false;
  if (!(target instanceof Node)) return false;
  return memoModal.contains(target);
}

function ensureEditableFieldInViewport(target, { prioritizeBottomEdge = false, force = false } = {}) {
  if (!isEditableField(target)) return;
  if (activePrimaryMainTab !== "input") return;
  if (isMemoModalFocusTarget(target)) return;
  const visualViewport = window.visualViewport;
  const viewportTop = visualViewport?.offsetTop ?? 0;
  const viewportHeight = visualViewport?.height ?? window.innerHeight ?? 0;
  if (viewportHeight <= 0) return;

  const topOffset = getViewportTopOffset();
  const keyboardOpen = document.body?.classList.contains("is-keyboard-open");
  const bottomSafeInset = resolveKeyboardOverlayInset({ keyboardOpen });
  const isBottomField = isBottomAreaField(target);
  const bottomMargin = prioritizeBottomEdge
    ? (isBottomField ? KEYBOARD_BOTTOM_FIELD_MARGIN : KEYBOARD_BASE_BOTTOM_MARGIN)
    : KEYBOARD_BASE_BOTTOM_MARGIN;
  const targetRect = target.getBoundingClientRect();
  const label = target.closest(".field, .stacked-field, .plan-form-row, .life-event-form-grid > label");
  const labelRect = label?.getBoundingClientRect() || targetRect;
  const visibleFieldBottom = Math.max(targetRect.bottom, labelRect.bottom);
  const preferredTop = viewportTop + topOffset + 8;
  const preferredBottom = viewportTop + viewportHeight - bottomSafeInset - bottomMargin;
  const effectiveBottom = prioritizeBottomEdge ? preferredBottom : preferredBottom - Math.min(24, Math.max(0, (preferredBottom - preferredTop) * 0.08));

  let delta = 0;
  if (labelRect.top < preferredTop) {
    delta = labelRect.top - preferredTop;
  } else if (visibleFieldBottom > effectiveBottom) {
    delta = visibleFieldBottom - effectiveBottom;
  }
  if (Math.abs(delta) < KEYBOARD_SCROLL_MIN_STEP) return;
  const nextY = window.scrollY + delta;
  const maxScrollableY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  const clampedY = Math.min(Math.max(nextY, 0), maxScrollableY);
  if (Math.abs(clampedY - window.scrollY) < KEYBOARD_SCROLL_MIN_STEP) {
    keyboardFocusScrollState.settledTargetY = clampedY;
    return;
  }
  if (!force && keyboardFocusScrollState.target === target && keyboardFocusScrollState.settledTargetY !== null) {
    if (Math.abs(keyboardFocusScrollState.settledTargetY - clampedY) <= KEYBOARD_SCROLL_SETTLE_EPSILON) {
      return;
    }
  }
  window.scrollTo({ top: clampedY, behavior: "auto" });
  keyboardFocusScrollState.target = target;
  keyboardFocusScrollState.settledTargetY = clampedY;
}

function scheduleEnsureEditableFieldInViewport(target, options = {}, { delay = 0, force = false } = {}) {
  if (!isEditableField(target)) return;
  if (keyboardFocusScrollState.rafId) {
    window.cancelAnimationFrame(keyboardFocusScrollState.rafId);
    keyboardFocusScrollState.rafId = 0;
  }
  if (keyboardFocusScrollState.timeoutId) {
    window.clearTimeout(keyboardFocusScrollState.timeoutId);
    keyboardFocusScrollState.timeoutId = 0;
  }
  const run = () => {
    keyboardFocusScrollState.rafId = 0;
    ensureEditableFieldInViewport(target, { ...options, force });
  };
  if (delay > 0) {
    keyboardFocusScrollState.timeoutId = window.setTimeout(() => {
      keyboardFocusScrollState.timeoutId = 0;
      keyboardFocusScrollState.rafId = window.requestAnimationFrame(run);
    }, delay);
    return;
  }
  keyboardFocusScrollState.rafId = window.requestAnimationFrame(run);
}

function closeKeyboardAndReflowInputLayout({ restoreScroll = false, forceScrollRestore = false } = {}) {
  const activeElementBeforeBlur = document.activeElement;
  blurActiveEditableField();
  const runRestore = () => {
    if (!restoreScroll) return;
    if (isEditableField(activeElementBeforeBlur)) {
      ensureEditableFieldInViewport(activeElementBeforeBlur, { prioritizeBottomEdge: false });
      return;
    }
    restoreInputMenuViewportPosition({ force: forceScrollRestore });
  };
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      runRestore();
      window.setTimeout(() => {
        window.requestAnimationFrame(runRestore);
      }, 90);
    });
  });
}

function setupKeyboardLayoutStability() {
  const root = document.documentElement;
  const body = document.body;
  if (!root || !body) return;

  const visualViewport = window.visualViewport;
  const resolveViewportHeight = () => visualViewport?.height || window.innerHeight || 0;
  baselineVisualViewportHeight = Math.max(baselineVisualViewportHeight, resolveViewportHeight());
  let wasKeyboardOpen = false;

  const clampScrollToDocumentBounds = () => {
    const maxScrollableY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    if (window.scrollY > maxScrollableY + 1) {
      window.scrollTo({ top: maxScrollableY, behavior: "auto" });
    }
  };

  const updateKeyboardState = () => {
    const activeElement = document.activeElement;
    const hasFocusedEditable = isEditableField(activeElement);
    const currentViewportHeight = resolveViewportHeight();
    baselineVisualViewportHeight = Math.max(baselineVisualViewportHeight, currentViewportHeight);
    const heightDelta = Math.max(0, baselineVisualViewportHeight - currentViewportHeight);
    const isKeyboardOpen = hasFocusedEditable && heightDelta > 120;

    body.classList.toggle("is-input-focused", hasFocusedEditable);
    root.classList.toggle("is-input-focused", hasFocusedEditable);
    body.classList.toggle("is-keyboard-open", isKeyboardOpen);

    if (wasKeyboardOpen && !isKeyboardOpen) {
      clampScrollToDocumentBounds();
    }
    wasKeyboardOpen = isKeyboardOpen;
  };

  const scheduleUpdate = () => window.requestAnimationFrame(updateKeyboardState);
  document.addEventListener("focusin", (event) => {
    if (activePrimaryMainTab !== "input") return;
    scheduleUpdate();
    const nextTarget = event.target;
    if (isMemoModalFocusTarget(nextTarget)) return;
    keyboardFocusScrollState.target = nextTarget;
    keyboardFocusScrollState.settledTargetY = null;
    scheduleEnsureEditableFieldInViewport(nextTarget, { prioritizeBottomEdge: true }, { force: true });
    scheduleEnsureEditableFieldInViewport(nextTarget, { prioritizeBottomEdge: true }, { delay: 120, force: true });
  }, true);
  document.addEventListener("focusout", (event) => {
    const blurredElement = event.target;
    window.setTimeout(scheduleUpdate, 40);
    if (!(blurredElement instanceof HTMLElement) || activePrimaryMainTab !== "input") return;
    const wasEditable = isEditableField(blurredElement);
    const movedToEditable = isEditableField(document.activeElement);
    if (!movedToEditable) {
      keyboardFocusScrollState.target = null;
      keyboardFocusScrollState.settledTargetY = null;
    }
    if (!wasEditable || movedToEditable) return;
    window.setTimeout(() => {
      const nextActiveElement = document.activeElement;
      if (isEditableField(nextActiveElement)) {
        scheduleEnsureEditableFieldInViewport(nextActiveElement, { prioritizeBottomEdge: true }, { force: true });
      }
    }, 120);
  }, true);
  window.addEventListener("orientationchange", () => {
    baselineVisualViewportHeight = 0;
    scheduleUpdate();
  });
  window.addEventListener("resize", scheduleUpdate);
  visualViewport?.addEventListener("resize", () => {
    scheduleUpdate();
    if (activePrimaryMainTab !== "input") return;
    const activeElement = document.activeElement;
    if (!isEditableField(activeElement)) return;
    if (isMemoModalFocusTarget(activeElement)) return;
    scheduleEnsureEditableFieldInViewport(activeElement, { prioritizeBottomEdge: true });
  });
  visualViewport?.addEventListener("scroll", () => {
    scheduleUpdate();
    if (activePrimaryMainTab !== "input") return;
    // iPhone Safari fires frequent visualViewport scroll updates while the keyboard is shown.
    // Forcing scroll correction on every update can fight native scrolling and cause visible jitter.
    if (isIPhoneSafari()) return;
    const activeElement = document.activeElement;
    if (!isEditableField(activeElement)) return;
    if (isMemoModalFocusTarget(activeElement)) return;
    scheduleEnsureEditableFieldInViewport(activeElement, { prioritizeBottomEdge: true });
  });
  updateKeyboardState();
}
const numberWithComma = new Intl.NumberFormat("ja-JP");

function parseRateInput(value, fallback = 0) {
  const parsed = Number.parseFloat(String(value ?? "").trim());
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseAmountInput(value) {
  if (typeof value !== "string") return 0;
  const normalized = value.replace(/[^\d]/g, "");
  return normalized ? Number(normalized) : 0;
}

function formatAmountInputValue(value, { allowZero = false } = {}) {
  const amount = parseAmountInput(value);
  if (amount > 0) return numberWithComma.format(amount);
  if (allowZero && amount === 0 && String(value ?? "").trim() !== "") return "0";
  return "";
}

function normalizeLegacyExpenseCategory(category) {
  return LEGACY_EXPENSE_CATEGORY_ALIASES[category] || category;
}

function normalizeRecurringExpenseCategory(category) {
  const normalized = LEGACY_RECURRING_EXPENSE_CATEGORY_ALIASES[category] || category;
  if (RECURRING_EXPENSE_CATEGORIES.includes(normalized)) {
    return normalized;
  }
  return RECURRING_EXPENSE_CATEGORIES[0];
}

function syncCategoryOptions() {
  const options = CATEGORY_OPTIONS[typeInput.value] ?? [];
  categoryInput.innerHTML = "";
  options.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryInput.appendChild(option);
  });
}

function syncRecurringCategoryOptions() {
  if (!recurringCategoryInput) return;
  recurringCategoryInput.innerHTML = "";
  RECURRING_EXPENSE_CATEGORIES.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    recurringCategoryInput.appendChild(option);
  });
}

function syncLifeEventCategoryOptions() {
  if (!lifeEventCategoryInput) return;
  const categoryOptions = LIFE_EVENT_CATEGORY_OPTIONS[lifeEventTypeInput?.value] ?? [];
  const currentCategory = normalizeLegacyLifeEventCategory(lifeEventCategoryInput.value);
  const canKeepCurrentCategory = categoryOptions.includes(currentCategory);
  lifeEventCategoryInput.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "選択してください";
  lifeEventCategoryInput.appendChild(placeholder);
  categoryOptions.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    lifeEventCategoryInput.appendChild(option);
  });
  lifeEventCategoryInput.value = canKeepCurrentCategory ? currentCategory : "";
}

function syncRecurringDayOptions() {
  if (!recurringDayInput) return;
  recurringDayInput.innerHTML = "";
  for (let day = 1; day <= 31; day += 1) {
    const option = document.createElement("option");
    option.value = String(day);
    option.textContent = `${day}日`;
    recurringDayInput.appendChild(option);
  }
}

function renderRecurringExpenses(items) {
  if (!recurringList) return;
  recurringList.innerHTML = "";
  if (recurringEditingId && !items.some((item) => item.id === recurringEditingId)) {
    recurringEditingId = null;
    setRecurringFormMode(false);
  }
  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "登録済みの定期支出はありません。";
    recurringList.appendChild(empty);
    return;
  }

  items
    .slice()
    .sort((a, b) => compareMonth(a.startMonth, b.startMonth))
    .forEach((item) => {
      const card = document.createElement("article");
      card.className = "recurring-card";
      card.innerHTML = `
        <div class="recurring-card-header">
          <h4>${item.category}</h4>
          <p class="recurring-amount">${yen.format(item.amount)}</p>
        </div>
        <ul class="recurring-meta-list">
          <li><span>引落日</span><strong>${item.day}日</strong></li>
          <li><span>開始月</span><strong>${item.startMonth}</strong></li>
          <li><span>終了月</span><strong>${item.endMonth || "継続中"}</strong></li>
          <li><span>メモ</span><strong>${item.memo || "なし"}</strong></li>
        </ul>
      `;
      const actionRow = document.createElement("div");
      actionRow.className = "recurring-actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "small";
      editButton.textContent = "修正";
      editButton.addEventListener("click", () => {
        startRecurringExpenseEdit(item.id);
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "small danger";
      deleteButton.textContent = "削除";
      deleteButton.addEventListener("click", () => {
        const next = loadRecurringExpenses().filter((target) => target.id !== item.id);
        saveRecurringExpenses(next);
        render();
      });

      actionRow.append(editButton, deleteButton);
      card.appendChild(actionRow);
      recurringList.appendChild(card);
    });
}

function loadTransactions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => ({
        ...item,
        category: item?.type === "expense" ? normalizeLegacyExpenseCategory(item.category) : item.category,
        amount: Number(item.amount) || 0,
      }))
      .filter((item) => {
        if (!item?.date || !item?.type || !item?.category || item.amount <= 0) return false;
        if (item.type === "expense") return ALLOWED_EXPENSE_CATEGORIES.includes(item.category);
        return true;
      });
  } catch {
    return [];
  }
}

function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function defaultSettings() {
  return { birthDate: "", entryStartMonth: "", plans: [] };
}

function parseMonth(month) {
  if (typeof month !== "string") return null;
  const match = month.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (!Number.isInteger(year) || monthIndex < 0 || monthIndex > 11) return null;
  return { year, monthIndex };
}

function formatMonth(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function compareMonth(a, b) {
  return a.localeCompare(b);
}

function isMonthOnOrAfter(targetMonth, baseMonth) {
  if (!parseMonth(targetMonth) || !parseMonth(baseMonth)) return false;
  return compareMonth(targetMonth, baseMonth) >= 0;
}

function isSameMonth(a, b) {
  if (!parseMonth(a) || !parseMonth(b)) return false;
  return compareMonth(a, b) === 0;
}

function getLatestMonthFromTransactions(items) {
  return items.reduce((latest, item) => {
    const month = monthISO(item?.date);
    if (!parseMonth(month)) return latest;
    if (!latest) return month;
    return compareMonth(month, latest) > 0 ? month : latest;
  }, "");
}

function getMonthsWithData(items) {
  const monthSet = new Set();
  items.forEach((item) => {
    const month = monthISO(item?.date);
    if (!parseMonth(month)) return;
    monthSet.add(month);
  });
  return Array.from(monthSet).sort((a, b) => compareMonth(a, b));
}

function resolveInitialYearMonthState(baseMonth) {
  const parsed = parseMonth(baseMonth) || parseMonth(todayISO().slice(0, 7));
  return {
    year: String(parsed.year),
    month: String(parsed.monthIndex + 1).padStart(2, "0"),
  };
}

function resolveViewMonthFromState(state) {
  const year = Number(state?.year);
  const month = Number(state?.month);
  if (!Number.isInteger(year) || month < 1 || month > 12) return "";
  return formatMonth(year, month - 1);
}

function resolveSharedViewMonthBounds(settings, transactions, options = {}) {
  const resolvedEntryStartMonth = resolveEntryStartMonth(settings, transactions);
  const fallbackMaxMonth = getLatestMonthFromTransactions(transactions) || todayISO().slice(0, 7);
  const requestedMaxMonth = parseMonth(options?.maxMonth) ? options.maxMonth : fallbackMaxMonth;
  const minMonth = parseMonth(resolvedEntryStartMonth) ? resolvedEntryStartMonth : todayISO().slice(0, 7);
  const maxMonth = compareMonth(requestedMaxMonth, minMonth) < 0 ? minMonth : requestedMaxMonth;
  const parsedMin = parseMonth(minMonth);
  const parsedMax = parseMonth(maxMonth);
  return {
    minMonth,
    maxMonth,
    minYear: parsedMin?.year ?? Number(todayISO().slice(0, 4)),
    maxYear: parsedMax?.year ?? Number(todayISO().slice(0, 4)),
    minMonthIndex: parsedMin?.monthIndex ?? 0,
    maxMonthIndex: parsedMax?.monthIndex ?? 11,
  };
}

function buildYearOptionsForBounds(bounds, options = {}) {
  const years = [];
  if (!Number.isInteger(bounds?.minYear) || !Number.isInteger(bounds?.maxYear)) return years;
  const { prioritizeCurrentYear = false } = options;
  for (let year = bounds.minYear; year <= bounds.maxYear; year += 1) {
    years.push(year);
  }
  if (!prioritizeCurrentYear) return years;
  return years;
}

function buildMonthOptionsForYear(year, bounds) {
  if (!Number.isInteger(year)) return [];
  let startMonth = 1;
  let endMonth = 12;
  if (year === bounds.minYear) {
    startMonth = Math.max(startMonth, (bounds.minMonthIndex ?? 0) + 1);
  }
  if (year === bounds.maxYear) {
    endMonth = Math.min(endMonth, (bounds.maxMonthIndex ?? 11) + 1);
  }
  if (startMonth > endMonth) return [];
  return Array.from({ length: endMonth - startMonth + 1 }, (_, index) => startMonth + index);
}

function clampYearMonthToBounds(state, bounds) {
  const fallbackMonth = bounds.maxMonth || bounds.minMonth || todayISO().slice(0, 7);
  const selectedMonth = resolveViewMonthFromState(state) || fallbackMonth;
  const clampedMonth = compareMonth(selectedMonth, bounds.minMonth) < 0
    ? bounds.minMonth
    : compareMonth(selectedMonth, bounds.maxMonth) > 0
      ? bounds.maxMonth
      : selectedMonth;
  const parsed = parseMonth(clampedMonth) || parseMonth(fallbackMonth);
  return {
    year: String(parsed?.year ?? Number(todayISO().slice(0, 4))),
    month: String((parsed?.monthIndex ?? 0) + 1).padStart(2, "0"),
  };
}

function syncViewFilterOptions(controls, state, bounds, options = {}) {
  if (!controls?.year || !controls.month) return;
  const { includeAverageMode = false, prioritizeCurrentYear = false } = options;
  const normalized = clampYearMonthToBounds(state, bounds);
  state.year = normalized.year;
  state.month = normalized.month;
  const years = buildYearOptionsForBounds(bounds, { prioritizeCurrentYear });
  const selectedYear = Number(state.year);
  if (years.length === 0) return;

  if (controls.mode) {
    controls.mode.value = includeAverageMode && state.averageMode === "average" ? "average" : "month";
  }

  controls.year.innerHTML = years.map((year) => `<option value="${year}">${year}年</option>`).join("");
  controls.year.value = years.includes(selectedYear) ? state.year : String(years[0]);
  if (controls.year.value !== state.year) {
    state.year = controls.year.value;
  }
  const monthCandidates = buildMonthOptionsForYear(Number(state.year), bounds);
  controls.month.innerHTML = monthCandidates.map((month) => {
    const value = String(month).padStart(2, "0");
    return `<option value="${value}">${month}月</option>`;
  }).join("");
  const hasSelectedMonth = monthCandidates.includes(Number(state.month));
  controls.month.value = hasSelectedMonth
    ? state.month
    : String(monthCandidates[0] || 1).padStart(2, "0");
  if (controls.month.value !== state.month) {
    state.month = controls.month.value;
  }

  const isAverage = includeAverageMode && state.averageMode === "average";
  controls.year.disabled = isAverage;
  controls.month.disabled = isAverage;
}

function normalizeMonthlyContributionHistory(plan) {
  if (Array.isArray(plan.monthlyContributions) && plan.monthlyContributions.length > 0) {
    return plan.monthlyContributions
      .map((item) => ({
        startMonth: item.startMonth,
        amount: Math.max(Number(item.amount) || 0, 0),
      }))
      .filter((item) => parseMonth(item.startMonth))
      .sort((a, b) => compareMonth(a.startMonth, b.startMonth));
  }

  const migrated = [];
  if (parseMonth(plan.startMonth)) {
    migrated.push({ startMonth: plan.startMonth, amount: Math.max(Number(plan.baseAmount) || 0, 0) });
  }

  const oldChanges = Array.isArray(plan.changes) ? plan.changes : [];
  oldChanges.forEach((change) => {
    if (!parseMonth(change.month)) return;
    migrated.push({
      startMonth: change.month,
      amount: Math.max(Number(change.amount) || 0, 0),
    });
  });

  return migrated.sort((a, b) => compareMonth(a.startMonth, b.startMonth));
}

function normalizeLumpSumHistory(plan) {
  if (!Array.isArray(plan.lumpSums)) return [];
  return plan.lumpSums
    .map((item) => ({
      month: item.month,
      amount: Math.max(Number(item.amount) || 0, 0),
    }))
    .filter((item) => parseMonth(item.month))
    .sort((a, b) => compareMonth(a.month, b.month));
}

function normalizePlan(rawPlan) {
  const plan = rawPlan ?? {};
  const normalizedCurrentValue = Number(plan.currentValue);
  const currentValue = Number.isFinite(normalizedCurrentValue) ? normalizedCurrentValue : null;
  const normalizedCurrentAutoYield = Number(plan.currentAutoYield);
  return {
    id: plan.id || crypto.randomUUID(),
    type: PLAN_TYPES.includes(plan.type) ? plan.type : "NISA",
    name: typeof plan.name === "string" ? plan.name : "",
    expectedReturn: parseRateInput(plan.expectedReturn),
    currentValue,
    currentAutoYield: Number.isFinite(normalizedCurrentAutoYield) ? normalizedCurrentAutoYield : null,
    withdrawalDay: Math.max(Number(plan.withdrawalDay) || 1, 1),
    withdrawMonth: parseMonth(plan.withdrawMonth) ? plan.withdrawMonth : "",
    lumpSums: normalizeLumpSumHistory(plan),
    monthlyContributions: normalizeMonthlyContributionHistory(plan),
  };
}

function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings();

  try {
    const data = JSON.parse(raw);
    const plans = Array.isArray(data.plans) ? data.plans : [];
    return {
      birthDate: data.birthDate ?? "",
      entryStartMonth: parseMonth(data.entryStartMonth) ? data.entryStartMonth : "",
      plans: plans.map((plan) => normalizePlan(plan)),
    };
  } catch {
    return defaultSettings();
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function parseBackupStorageEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  if (entry.present !== true) return null;
  if (entry.format === "json") {
    return JSON.stringify(entry.value ?? null);
  }
  if (entry.format === "string") {
    return String(entry.value ?? "");
  }
  return null;
}

function buildBackupPayload() {
  const storage = BACKUP_STORAGE_KEYS.reduce((acc, key) => {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      acc[key] = { present: false };
      return acc;
    }
    try {
      acc[key] = {
        present: true,
        format: "json",
        value: JSON.parse(raw),
      };
    } catch {
      acc[key] = {
        present: true,
        format: "string",
        value: raw,
      };
    }
    return acc;
  }, {});

  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    appId: "kakeibo",
    exportedAt: new Date().toISOString(),
    storage,
  };
}

function formatBackupTimestampForFilename(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

function downloadBackupFile() {
  try {
    const backupPayload = buildBackupPayload();
    const backupJson = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([backupJson], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `kakeibo-backup-${formatBackupTimestampForFilename(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error(error);
    window.alert("バックアップ保存に失敗しました。時間をおいて再度お試しください。");
  }
}

function applyBackupPayload(payload) {
  const storage = payload?.storage;
  if (!storage || typeof storage !== "object") {
    throw new Error("バックアップ形式が不正です。");
  }

  BACKUP_STORAGE_KEYS.forEach((key) => {
    const nextValue = parseBackupStorageEntry(storage[key]);
    if (nextValue === null) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, nextValue);
  });
}

function importBackupFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = typeof reader.result === "string" ? reader.result : "";
      const payload = JSON.parse(text);
      if (!payload || typeof payload !== "object") {
        throw new Error("バックアップファイルの読み取りに失敗しました。");
      }
      const schemaVersion = Number(payload.schemaVersion);
      if (!Number.isInteger(schemaVersion) || schemaVersion <= 0) {
        throw new Error("バックアップのバージョン情報が見つかりません。");
      }
      if (!window.confirm("バックアップを読み込むと現在の保存データは上書きされます。続行しますか？")) {
        return;
      }
      applyBackupPayload(payload);
      render();
      window.alert("バックアップを読み込みました。");
    } catch (error) {
      console.error(error);
      window.alert(`バックアップ読込に失敗しました。${error instanceof Error ? error.message : ""}`.trim());
    } finally {
      if (profileBackupFileInput) {
        profileBackupFileInput.value = "";
      }
    }
  };
  reader.onerror = () => {
    window.alert("バックアップファイルの読み取りに失敗しました。");
    if (profileBackupFileInput) {
      profileBackupFileInput.value = "";
    }
  };
  reader.readAsText(file);
}

function normalizeRecurringExpense(item) {
  return {
    id: typeof item?.id === "string" ? item.id : crypto.randomUUID(),
    category: normalizeRecurringExpenseCategory(item?.category),
    amount: Math.max(Number(item?.amount) || 0, 0),
    day: Math.min(Math.max(Number(item?.day) || 1, 1), 31),
    startMonth: parseMonth(item?.startMonth) ? item.startMonth : "",
    endMonth: parseMonth(item?.endMonth) ? item.endMonth : "",
    memo: typeof item?.memo === "string" ? item.memo : "",
    createdAt: typeof item?.createdAt === "string" ? item.createdAt : new Date().toISOString(),
  };
}

function loadRecurringExpenses() {
  const raw = localStorage.getItem(RECURRING_EXPENSES_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => normalizeRecurringExpense(item))
      .filter((item) => item.amount > 0 && parseMonth(item.startMonth));
  } catch {
    return [];
  }
}

function saveRecurringExpenses(items) {
  localStorage.setItem(RECURRING_EXPENSES_KEY, JSON.stringify(items));
}

function resetRecurringFormFields() {
  if (!recurringForm) return;
  recurringCategoryInput.value = RECURRING_EXPENSE_CATEGORIES[0];
  recurringDayInput.value = "1";
  recurringAmountInput.value = "";
  recurringEndMonthInput.value = "";
  recurringMemoInput.value = "";
  updateMemoPreviewByInputId("recurring-memo");
  recurringStartMonthInput.value = resolveViewMonthFromState() || todayISO().slice(0, 7);
  recurringEditingId = null;
  closeMemoModal();
  setRecurringFormMode(false);
}

function isRecurringExpenseApplicable(item, month) {
  if (!parseMonth(item.startMonth) || !parseMonth(month)) return false;
  if (compareMonth(month, item.startMonth) < 0) return false;
  if (parseMonth(item.endMonth) && compareMonth(month, item.endMonth) > 0) return false;
  return true;
}

function createRecurringExpenseAutoTransactions(recurringExpenses, month) {
  if (!parseMonth(month)) return [];
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const monthNum = Number(monthStr);

  return recurringExpenses
    .filter((item) => isRecurringExpenseApplicable(item, month))
    .map((item) => {
      const day = clampDay(year, monthNum, item.day);
      const date = `${month}-${String(day).padStart(2, "0")}`;
      return {
        id: `auto-recurring-${item.id}-${month}`,
        date,
        type: "expense",
        category: item.category,
        amount: item.amount,
        memo: item.memo || `${item.category}（定期支出）`,
        isAuto: true,
        autoKind: "recurring-expense",
        isAutoGenerated: true,
        recurringId: item.id,
        targetMonth: month,
      };
    });
}

function syncRecurringAutoTransactions(transactions, recurringExpenses, month) {
  const nextTransactions = transactions.filter((item) => !(item.isAutoGenerated && item.autoKind === "recurring-expense"));
  let changed = nextTransactions.length !== transactions.length;
  if (!parseMonth(month) || recurringExpenses.length === 0) {
    if (changed) {
      saveTransactions(nextTransactions);
    }
    return nextTransactions;
  }

  const earliestMonth = recurringExpenses
    .map((item) => item.startMonth)
    .filter((target) => parseMonth(target))
    .sort(compareMonth)[0];
  if (!earliestMonth || compareMonth(earliestMonth, month) > 0) {
    if (changed) {
      saveTransactions(nextTransactions);
    }
    return nextTransactions;
  }

  let cursor = earliestMonth;
  while (compareMonth(cursor, month) <= 0) {
    const generated = createRecurringExpenseAutoTransactions(recurringExpenses, cursor);
    generated.forEach((autoTx) => {
      const exists = nextTransactions.some((item) => item.id === autoTx.id || (
        item.isAutoGenerated &&
        item.recurringId === autoTx.recurringId &&
        item.targetMonth === autoTx.targetMonth
      ));
      if (!exists) {
        nextTransactions.push(autoTx);
        changed = true;
      }
    });
    cursor = addOneMonth(cursor);
  }

  if (changed) {
    saveTransactions(nextTransactions);
  }
  return nextTransactions;
}

function setRecurringFormMode(isEditing) {
  if (recurringSubmitButton) {
    recurringSubmitButton.textContent = isEditing ? "更新" : "追加";
  }
  if (recurringEditStatus) {
    recurringEditStatus.hidden = !isEditing;
  }
  if (recurringCancelButton) {
    recurringCancelButton.hidden = !isEditing;
  }
}

function setTransactionFormMode(isEditing, editingType = "expense") {
  if (transactionSubmitButton) {
    transactionSubmitButton.textContent = isEditing ? "更新する" : "追加する";
  }
  if (transactionEditStatus) {
    transactionEditStatus.textContent = editingType === "income"
      ? "日ごとの収入を編集中"
      : "日ごとの支出を編集中";
    transactionEditStatus.hidden = !isEditing;
  }
  if (transactionCancelButton) {
    transactionCancelButton.hidden = !isEditing;
  }
}

function resolveMemoPreviewText(value, placeholder = "任意") {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return placeholder;
  return text.length > 24 ? `${text.slice(0, 24)}…` : text;
}

function updateMemoPreviewByInputId(inputId) {
  const trigger = memoTriggerButtons.find((button) => button.dataset.memoTarget === inputId);
  if (!trigger) return;
  const input = document.getElementById(inputId);
  const preview = trigger.querySelector("[data-memo-preview]");
  if (!(input instanceof HTMLInputElement) || !(preview instanceof HTMLElement)) return;
  const placeholder = trigger.dataset.memoPlaceholder || "任意";
  const trimmedValue = input.value.trim();
  preview.textContent = resolveMemoPreviewText(trimmedValue, placeholder);
  preview.classList.toggle("is-placeholder", !trimmedValue);
}

function closeMemoModal({ keepDraft = false } = {}) {
  memoModalFocusState.rafIds.forEach((rafId) => window.cancelAnimationFrame(rafId));
  memoModalFocusState.rafIds = [];
  if (memoModalFocusState.timeoutId) {
    window.clearTimeout(memoModalFocusState.timeoutId);
    memoModalFocusState.timeoutId = 0;
  }
  if (!memoModal) return;
  memoModal.hidden = true;
  document.body.classList.remove("is-memo-modal-open");
  if (!keepDraft) {
    activeMemoDraft = null;
  }
}

function saveMemoModalValue() {
  if (!activeMemoDraft || !(memoModalInput instanceof HTMLInputElement)) {
    closeMemoModal();
    return;
  }
  const targetInput = document.getElementById(activeMemoDraft.targetId);
  if (!(targetInput instanceof HTMLInputElement)) {
    closeMemoModal();
    return;
  }
  targetInput.value = memoModalInput.value.trim();
  updateMemoPreviewByInputId(activeMemoDraft.targetId);
  closeMemoModal();
}

function openMemoModalFromTrigger(trigger) {
  if (!(trigger instanceof HTMLElement)) return;
  const targetId = trigger.dataset.memoTarget;
  if (!targetId || !(memoModal instanceof HTMLElement) || !(memoModalInput instanceof HTMLInputElement)) return;
  const targetInput = document.getElementById(targetId);
  if (!(targetInput instanceof HTMLInputElement)) return;
  const title = trigger.dataset.memoTitle || "メモを入力";
  const placeholder = trigger.dataset.memoPlaceholder || "任意";
  const maxLength = Math.max(Number(trigger.dataset.memoMaxlength) || 120, 1);
  activeMemoDraft = { targetId };
  memoModalTitle.textContent = title;
  memoModalInput.placeholder = placeholder;
  memoModalInput.maxLength = maxLength;
  memoModalInput.value = targetInput.value || "";
  memoModal.hidden = false;
  document.body.classList.add("is-memo-modal-open");
  memoModalFocusState.rafIds.forEach((rafId) => window.cancelAnimationFrame(rafId));
  memoModalFocusState.rafIds = [];
  if (memoModalFocusState.timeoutId) {
    window.clearTimeout(memoModalFocusState.timeoutId);
    memoModalFocusState.timeoutId = 0;
  }
  const focusInput = () => {
    if (!(memoModalInput instanceof HTMLInputElement) || memoModal.hidden) return;
    memoModalInput.focus({ preventScroll: true });
    memoModalInput.setSelectionRange(memoModalInput.value.length, memoModalInput.value.length);
  };
  const firstRaf = window.requestAnimationFrame(() => {
    const secondRaf = window.requestAnimationFrame(() => {
      focusInput();
      memoModalFocusState.timeoutId = window.setTimeout(() => {
        memoModalFocusState.timeoutId = 0;
        focusInput();
      }, 80);
      memoModalFocusState.rafIds = [];
    });
    memoModalFocusState.rafIds = [secondRaf];
  });
  memoModalFocusState.rafIds = [firstRaf];
}

function setupMemoCompactInputs() {
  memoTriggerButtons.forEach((trigger) => {
    trigger.addEventListener("click", () => openMemoModalFromTrigger(trigger));
    const targetId = trigger.dataset.memoTarget;
    if (targetId) {
      updateMemoPreviewByInputId(targetId);
    }
  });
  memoModalSaveButton?.addEventListener("click", saveMemoModalValue);
  memoModalCancelButton?.addEventListener("click", () => closeMemoModal());
  memoModalCloseControls.forEach((control) => {
    control.addEventListener("click", () => closeMemoModal());
  });
  memoModalInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveMemoModalValue();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeMemoModal();
    }
  });
}

function scrollToEditFormStart(primaryTarget, fallbackTarget) {
  if (primaryTarget) {
    primaryTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (fallbackTarget) {
    fallbackTarget.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function resolveInputRegisterTopAnchor(groupName) {
  switch (groupName) {
    case "basic":
      return basicRegisterPanel || profileForm || document.getElementById("section-profile");
    case "asset-formation":
      return assetFormationRegisterPanel || assetPlanEditorList || document.getElementById("section-assets");
    case "recurring":
      return recurringRegisterPanel || recurringForm || document.getElementById("section-recurring");
    case "life":
      return lifeRegisterPanel || lifeEventForm || document.getElementById("section-life-events");
    case "monthly":
      return form || document.getElementById("section-input");
    default:
      return null;
  }
}

function resolveInputSubTabTopAnchor(groupName, tabName = "register") {
  if (!groupName) return null;
  const sectionIds = INPUT_SUB_SECTION_IDS[groupName]?.[tabName];
  if (Array.isArray(sectionIds)) {
    for (const sectionId of sectionIds) {
      const anchor = document.getElementById(sectionId);
      if (anchor) return anchor;
    }
  }
  if (tabName === "register") {
    return resolveInputRegisterTopAnchor(groupName);
  }
  return null;
}

function scrollTargetIntoTopOnce(target) {
  if (!target) return;
  ++mobileUpdateScrollToken;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      scrollToElementWithOffset(target, { behavior: "auto" });
    });
  });
}

function scrollInputRegisterTopStable(groupName) {
  scrollTargetIntoTopOnce(resolveInputRegisterTopAnchor(groupName));
}

function isVerticallyScrollable(element) {
  if (!element) return false;
  if (element === document.body || element === document.documentElement) return true;
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  const allowsScroll = overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
  return allowsScroll && element.scrollHeight > element.clientHeight;
}

function collectScrollableAncestors(element) {
  const ancestors = [];
  let current = element?.parentElement || null;
  while (current) {
    if (isVerticallyScrollable(current)) ancestors.push(current);
    current = current.parentElement;
  }
  const scrollingElement = document.scrollingElement;
  if (scrollingElement && !ancestors.includes(scrollingElement)) {
    ancestors.push(scrollingElement);
  }
  return ancestors;
}

function scrollAppToAbsoluteTopAfterCancel() {
  ++mobileUpdateScrollToken;
  const token = mobileUpdateScrollToken;
  const titleAnchor = appTitleHeading || document.querySelector(".page-header") || document.body;
  const scrollTargets = collectScrollableAncestors(titleAnchor);

  const moveToTop = () => {
    if (token !== mobileUpdateScrollToken) return;
    scrollTargets.forEach((target) => {
      if (typeof target.scrollTo === "function") {
        target.scrollTo({ top: 0, behavior: "auto" });
      } else {
        target.scrollTop = 0;
      }
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    titleAnchor.scrollIntoView({ behavior: "auto", block: "start" });
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      moveToTop();
      window.setTimeout(() => {
        window.requestAnimationFrame(moveToTop);
      }, 80);
    });
  });
}

function handleCancelEditFromRegistered(groupName, options = {}) {
  const wasEditing = Boolean(options.isEditing);
  options.resetForm?.();
  if (!wasEditing) return;
  setPrimaryMainTab("input");
  setInputMainTab(groupName);
  setInputSubTab(groupName, "register");
  scrollAppToAbsoluteTopAfterCancel();
}

function resetTransactionFormFields(options = {}) {
  const nextDate = options.date ?? dateInput.value ?? todayISO();
  transactionEditingId = null;
  form.reset();
  dateInput.value = nextDate;
  typeInput.value = "expense";
  syncCategoryOptions();
  amountInput.value = "";
  memoInput.value = "";
  updateMemoPreviewByInputId("memo");
  closeMemoModal();
  setTransactionFormMode(false);
}

function startTransactionEdit(id) {
  const transaction = loadTransactions().find((item) => item.id === id);
  if (!transaction) return;

  transactionEditingId = transaction.id;
  dateInput.value = transaction.date;
  typeInput.value = transaction.type;
  syncCategoryOptions();
  categoryInput.value = transaction.category;
  amountInput.value = numberWithComma.format(transaction.amount);
  memoInput.value = transaction.memo || "";
  updateMemoPreviewByInputId("memo");
  setTransactionFormMode(true, transaction.type);
  setPrimaryMainTab("input");
  setInputMainTab("monthly");
  setInputSubTab("monthly", "register");
  scrollToEditFormStart(inputSection, form);
}

function startRecurringExpenseEdit(id) {
  const recurringExpense = loadRecurringExpenses().find((item) => item.id === id);
  if (!recurringExpense) return;

  setPrimaryMainTab("input");
  setInputMainTab("recurring");
  setInputSubTab("recurring", "register");

  recurringEditingId = recurringExpense.id;
  recurringCategoryInput.value = recurringExpense.category;
  recurringAmountInput.value = numberWithComma.format(recurringExpense.amount);
  recurringDayInput.value = String(recurringExpense.day);
  recurringStartMonthInput.value = recurringExpense.startMonth;
  recurringEndMonthInput.value = recurringExpense.endMonth || "";
  recurringMemoInput.value = recurringExpense.memo || "";
  updateMemoPreviewByInputId("recurring-memo");
  setRecurringFormMode(true);
  scrollToEditFormStart(recurringSection, recurringForm);
}

function normalizeLifeEvent(item) {
  const type = item?.type === "income" ? "income" : "expense";
  const validCategories = LIFE_EVENT_CATEGORY_OPTIONS[type] ?? [];
  const normalizedCategory = normalizeLegacyLifeEventCategory(item?.category);
  const settings = loadSettings();
  const birth = parseBirthDate(settings?.birthDate);
  const legacyAge = Math.min(Math.max(Number(item?.age) || 0, 0), 120);
  const normalizedMonth = parseMonth(item?.month)
    ? item.month
    : (birth ? formatMonth(birth.getFullYear() + legacyAge, birth.getMonth()) : "");
  return {
    id: typeof item?.id === "string" ? item.id : crypto.randomUUID(),
    month: normalizedMonth,
    type,
    category: validCategories.includes(normalizedCategory) ? normalizedCategory : "その他",
    amount: Math.max(Number(item?.amount) || 0, 0),
    memo: typeof item?.memo === "string" ? item.memo : "",
    createdAt: typeof item?.createdAt === "string" ? item.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeLegacyLifeEventCategory(category) {
  return LEGACY_LIFE_EVENT_CATEGORY_ALIASES[category] || category;
}

function isValidLifeEventCategoryForType(type, category) {
  const normalizedCategory = normalizeLegacyLifeEventCategory(category);
  const categoryOptions = LIFE_EVENT_CATEGORY_OPTIONS[type] ?? [];
  return categoryOptions.includes(normalizedCategory);
}

function handleLifeEventTypeChange() {
  syncLifeEventCategoryOptions();
}

function loadLifeEvents() {
  const raw = localStorage.getItem(LIFE_EVENTS_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => normalizeLifeEvent(item))
      .filter((item) => item.amount > 0 && parseMonth(item.month));
  } catch {
    return [];
  }
}

function saveLifeEvents(items) {
  localStorage.setItem(LIFE_EVENTS_KEY, JSON.stringify(items));
}

function loadCashflowAssumptions() {
  const raw = localStorage.getItem(CASHFLOW_ASSUMPTIONS_KEY);
  if (!raw) return { ...DEFAULT_CASHFLOW_ASSUMPTIONS };
  try {
    const data = JSON.parse(raw);
    const legacySalaryGrowthRate = parseRateInput(data?.salaryGrowthRate, Number.NaN);
    const normalizedLegacySalaryGrowthRate = Number.isFinite(legacySalaryGrowthRate)
      ? legacySalaryGrowthRate
      : DEFAULT_CASHFLOW_ASSUMPTIONS.salaryGrowthRateBefore60;
    const salaryGrowthRateBefore60 = Number.isFinite(parseRateInput(data?.salaryGrowthRateBefore60, Number.NaN))
      ? parseRateInput(data.salaryGrowthRateBefore60)
      : normalizedLegacySalaryGrowthRate;
    return {
      salaryGrowthRateBefore60,
      inflationRate: Number.isFinite(parseRateInput(data?.inflationRate, Number.NaN))
        ? parseRateInput(data.inflationRate)
        : DEFAULT_CASHFLOW_ASSUMPTIONS.inflationRate,
    };
  } catch {
    return { ...DEFAULT_CASHFLOW_ASSUMPTIONS };
  }
}

function saveCashflowAssumptions(assumptions) {
  localStorage.setItem(CASHFLOW_ASSUMPTIONS_KEY, JSON.stringify({
    salaryGrowthRateBefore60: parseRateInput(assumptions?.salaryGrowthRateBefore60),
    inflationRate: parseRateInput(assumptions?.inflationRate),
  }));
}

function normalizeCashflowIncomeScenario(item) {
  const rawMaintenanceRate = Number.isFinite(parseRateInput(item?.annualIncomeMaintenanceRate, Number.NaN))
    ? item.annualIncomeMaintenanceRate
    : item?.annualAdjustmentRate;
  return {
    id: typeof item?.id === "string" && item.id ? item.id : crypto.randomUUID(),
    startMonth: parseMonth(item?.startMonth) ? item.startMonth : "",
    monthlyTakeHome: Math.max(parseAmountInput(String(item?.monthlyTakeHome ?? "")), 0),
    annualIncomeMaintenanceRate: parseRateInput(rawMaintenanceRate, DEFAULT_CASHFLOW_INCOME_MAINTENANCE_RATE),
  };
}

function loadCashflowIncomeSettings() {
  const raw = localStorage.getItem(CASHFLOW_INCOME_SETTINGS_KEY);
  if (!raw) return { ...DEFAULT_CASHFLOW_INCOME_SETTINGS };
  try {
    const data = JSON.parse(raw);
    const scenarios = Array.isArray(data?.scenarios)
      ? data.scenarios
          .map((item) => normalizeCashflowIncomeScenario(item))
          .slice(0, MAX_CASHFLOW_INCOME_SCENARIOS)
      : [];
    return {
      retirementMonth: parseMonth(data?.retirementMonth) ? data.retirementMonth : "",
      scenarios,
    };
  } catch {
    return { ...DEFAULT_CASHFLOW_INCOME_SETTINGS };
  }
}

function saveCashflowIncomeSettings(settings) {
  const normalized = {
    retirementMonth: parseMonth(settings?.retirementMonth) ? settings.retirementMonth : "",
    scenarios: Array.isArray(settings?.scenarios)
      ? settings.scenarios
          .map((item) => normalizeCashflowIncomeScenario(item))
          .slice(0, MAX_CASHFLOW_INCOME_SCENARIOS)
      : [],
  };
  localStorage.setItem(CASHFLOW_INCOME_SETTINGS_KEY, JSON.stringify(normalized));
}

function normalizeCashflowExpenseScenario(item) {
  return {
    id: typeof item?.id === "string" && item.id ? item.id : crypto.randomUUID(),
    startMonth: parseMonth(item?.startMonth) ? item.startMonth : "",
    monthlyExpense: Math.max(parseAmountInput(String(item?.monthlyExpense ?? "")), 0),
  };
}

function loadCashflowExpenseSettings() {
  const raw = localStorage.getItem(CASHFLOW_EXPENSE_SETTINGS_KEY);
  if (!raw) return { ...DEFAULT_CASHFLOW_EXPENSE_SETTINGS };
  try {
    const data = JSON.parse(raw);
    const scenarios = Array.isArray(data?.scenarios)
      ? data.scenarios
          .map((item) => normalizeCashflowExpenseScenario(item))
          .slice(0, MAX_CASHFLOW_EXPENSE_SCENARIOS)
      : [];
    return { scenarios };
  } catch {
    return { ...DEFAULT_CASHFLOW_EXPENSE_SETTINGS };
  }
}

function saveCashflowExpenseSettings(settings) {
  const normalized = {
    scenarios: Array.isArray(settings?.scenarios)
      ? settings.scenarios
          .map((item) => normalizeCashflowExpenseScenario(item))
          .slice(0, MAX_CASHFLOW_EXPENSE_SCENARIOS)
      : [],
  };
  localStorage.setItem(CASHFLOW_EXPENSE_SETTINGS_KEY, JSON.stringify(normalized));
}

function updateCashflowIncomeSettingsInputs(settings) {
  if (!cashflowIncomeRetirementMonthInput) return;
  if (document.activeElement !== cashflowIncomeRetirementMonthInput) {
    cashflowIncomeRetirementMonthInput.value = settings.retirementMonth || "";
  }
  renderCashflowIncomeScenarioList(settings.scenarios || []);
}

function renderCashflowIncomeScenarioList(scenarios = []) {
  if (!cashflowIncomeScenarioList || !cashflowIncomeScenarioAddButton) return;
  cashflowIncomeScenarioList.innerHTML = "";

  if (!Array.isArray(scenarios) || scenarios.length === 0) {
    const empty = document.createElement("p");
    empty.className = "cashflow-income-scenario-empty";
    empty.textContent = "シナリオは未設定です。必要な分だけ追加できます。";
    cashflowIncomeScenarioList.appendChild(empty);
  } else {
    scenarios.forEach((scenario, index) => {
      const block = document.createElement("section");
      block.className = "cashflow-income-scenario";
      block.dataset.scenarioId = scenario.id;

      const canDelete = index > 0;
      block.innerHTML = `
        <div class="cashflow-income-scenario-header">
          <p class="cashflow-income-scenario-title">シナリオ${index + 1}</p>
          ${canDelete ? '<button type="button" class="small danger" data-income-scenario-action="remove">削除</button>' : ""}
        </div>
        <div class="cashflow-income-scenario-grid">
          <label>
            開始年月
            <input type="month" value="${scenario.startMonth || ""}" data-income-scenario-field="startMonth" />
          </label>
          <label>
            手取り月額
            <input type="text" inputmode="numeric" value="${formatAmountInputValue(String(scenario.monthlyTakeHome || ""))}" placeholder="例）250,000" data-income-scenario-field="monthlyTakeHome" />
          </label>
          <label>
            年間収入維持率（%）
            <input type="number" inputmode="decimal" step="any" value="${Number.isFinite(scenario.annualIncomeMaintenanceRate) ? scenario.annualIncomeMaintenanceRate : DEFAULT_CASHFLOW_INCOME_MAINTENANCE_RATE}" data-income-scenario-field="annualIncomeMaintenanceRate" />
          </label>
        </div>
      `;
      cashflowIncomeScenarioList.appendChild(block);
      const monthlyInput = block.querySelector('[data-income-scenario-field="monthlyTakeHome"]');
      if (monthlyInput) {
        setupFormattedAmountInput(monthlyInput);
      }
    });
  }

  cashflowIncomeScenarioAddButton.disabled = scenarios.length >= MAX_CASHFLOW_INCOME_SCENARIOS;
}

function updateCashflowExpenseSettingsInputs(settings) {
  renderCashflowExpenseScenarioList(settings?.scenarios || []);
}

function renderCashflowExpenseScenarioList(scenarios = []) {
  if (!cashflowExpenseScenarioList || !cashflowExpenseScenarioAddButton) return;
  cashflowExpenseScenarioList.innerHTML = "";

  if (!Array.isArray(scenarios) || scenarios.length === 0) {
    const empty = document.createElement("p");
    empty.className = "cashflow-income-scenario-empty";
    empty.textContent = "シナリオは未設定です。必要な分だけ追加できます。";
    cashflowExpenseScenarioList.appendChild(empty);
  } else {
    scenarios.forEach((scenario, index) => {
      const block = document.createElement("section");
      block.className = "cashflow-income-scenario";
      block.dataset.scenarioId = scenario.id;

      const canDelete = index > 0;
      block.innerHTML = `
        <div class="cashflow-income-scenario-header">
          <p class="cashflow-income-scenario-title">シナリオ${index + 1}</p>
          ${canDelete ? '<button type="button" class="small danger" data-expense-scenario-action="remove">削除</button>' : ""}
        </div>
        <div class="cashflow-income-scenario-grid">
          <label>
            開始年月
            <input type="month" value="${scenario.startMonth || ""}" data-expense-scenario-field="startMonth" />
          </label>
          <label>
            通常支出月額
            <input type="text" inputmode="numeric" value="${formatAmountInputValue(String(scenario.monthlyExpense || ""))}" placeholder="例）180,000" data-expense-scenario-field="monthlyExpense" />
          </label>
        </div>
      `;
      cashflowExpenseScenarioList.appendChild(block);
      const monthlyInput = block.querySelector('[data-expense-scenario-field="monthlyExpense"]');
      if (monthlyInput) {
        setupFormattedAmountInput(monthlyInput);
      }
    });
  }

  cashflowExpenseScenarioAddButton.disabled = scenarios.length >= MAX_CASHFLOW_EXPENSE_SCENARIOS;
}

function updateCashflowAssumptionInputs(assumptions) {
  if (!cashflowSalaryGrowthRateBefore60Input || !cashflowInflationRateInput) return;
  const activeElement = document.activeElement;
  if (activeElement !== cashflowSalaryGrowthRateBefore60Input) {
    cashflowSalaryGrowthRateBefore60Input.value = String(
      assumptions.salaryGrowthRateBefore60 ?? DEFAULT_CASHFLOW_ASSUMPTIONS.salaryGrowthRateBefore60
    );
  }
  if (activeElement !== cashflowInflationRateInput) {
    cashflowInflationRateInput.value = String(assumptions.inflationRate ?? DEFAULT_CASHFLOW_ASSUMPTIONS.inflationRate);
  }
}

function addCashflowIncomeScenario() {
  const settings = loadCashflowIncomeSettings();
  if (settings.scenarios.length >= MAX_CASHFLOW_INCOME_SCENARIOS) return;
  settings.scenarios.push(normalizeCashflowIncomeScenario({}));
  saveCashflowIncomeSettings(settings);
  render();
}

function removeCashflowIncomeScenarioById(scenarioId) {
  if (!scenarioId) return;
  const settings = loadCashflowIncomeSettings();
  settings.scenarios = settings.scenarios.filter((scenario) => scenario.id !== scenarioId);
  saveCashflowIncomeSettings(settings);
  render();
}

function updateCashflowIncomeScenarioField(scenarioId, fieldName, value) {
  if (!scenarioId || !fieldName) return;
  const settings = loadCashflowIncomeSettings();
  const scenario = settings.scenarios.find((item) => item.id === scenarioId);
  if (!scenario) return;
  if (fieldName === "startMonth") {
    scenario.startMonth = parseMonth(value) ? value : "";
  } else if (fieldName === "monthlyTakeHome") {
    scenario.monthlyTakeHome = parseAmountInput(String(value ?? ""));
  } else if (fieldName === "annualIncomeMaintenanceRate") {
    scenario.annualIncomeMaintenanceRate = parseRateInput(value, DEFAULT_CASHFLOW_INCOME_MAINTENANCE_RATE);
  } else {
    return;
  }
  saveCashflowIncomeSettings(settings);
}

function addCashflowExpenseScenario() {
  const settings = loadCashflowExpenseSettings();
  if (settings.scenarios.length >= MAX_CASHFLOW_EXPENSE_SCENARIOS) return;
  settings.scenarios.push(normalizeCashflowExpenseScenario({}));
  saveCashflowExpenseSettings(settings);
  render();
}

function removeCashflowExpenseScenarioById(scenarioId) {
  if (!scenarioId) return;
  const settings = loadCashflowExpenseSettings();
  settings.scenarios = settings.scenarios.filter((scenario) => scenario.id !== scenarioId);
  saveCashflowExpenseSettings(settings);
  render();
}

function updateCashflowExpenseScenarioField(scenarioId, fieldName, value) {
  if (!scenarioId || !fieldName) return;
  const settings = loadCashflowExpenseSettings();
  const scenario = settings.scenarios.find((item) => item.id === scenarioId);
  if (!scenario) return;
  if (fieldName === "startMonth") {
    scenario.startMonth = parseMonth(value) ? value : "";
  } else if (fieldName === "monthlyExpense") {
    scenario.monthlyExpense = parseAmountInput(String(value ?? ""));
  } else {
    return;
  }
  saveCashflowExpenseSettings(settings);
}

function setLifeEventFormMode(isEditing) {
  if (lifeEventSubmitButton) {
    lifeEventSubmitButton.textContent = isEditing ? "更新" : "追加";
  }
  if (lifeEventCancelButton) {
    lifeEventCancelButton.hidden = !isEditing;
  }
  if (lifeEventEditStatus) {
    lifeEventEditStatus.hidden = !isEditing;
  }
}

function setProfileFormMode(isEditing) {
  if (profileSubmitButton) {
    profileSubmitButton.textContent = isEditing ? "更新" : "設定を保存";
  }
  if (assetProfileSubmitButton) {
    assetProfileSubmitButton.textContent = isEditing ? "更新" : "設定を保存";
  }
  profileEditStatusNodes.forEach((node) => {
    node.hidden = !isEditing;
  });
  if (profileCancelButton) {
    profileCancelButton.hidden = !isEditing;
  }
  if (assetProfileCancelButton) {
    assetProfileCancelButton.hidden = !isEditing;
  }
}

function isBasicEditingMode() {
  return Boolean(basicEditingPlanId);
}

function getInitialProfileFormState() {
  const settings = loadSettings();
  const transactions = loadTransactions();
  return {
    entryStartMonth: resolveEntryStartMonth(settings, transactions),
    birthDate: settings?.birthDate || "",
  };
}

function resetProfileRegisterForm() {
  const initialState = getInitialProfileFormState();
  basicEditingPlanId = null;
  if (profileForm) {
    profileForm.reset();
  }
  entryStartMonthInput.value = initialState.entryStartMonth;
  birthDateInput.value = initialState.birthDate;
  planEditorLists.forEach((editorList) => {
    editorList.innerHTML = "";
  });
  renderPlans(loadSettings());
  setProfileFormMode(false);
}

function resetProfileFormFields() {
  resetProfileRegisterForm();
}

function scrollToBasicRegisterStart() {
  const target = profileForm || document.getElementById("section-profile");
  scrollTargetIntoTopOnce(target);
}

function scrollToBasicRegisteredTop() {
  const target = basicRegisteredSummary || document.getElementById("input-sub-panel-basic-registered");
  scrollTargetIntoTopOnce(target);
}

function cancelProfileEdit() {
  handleCancelEditFromRegistered("basic", {
    isEditing: isBasicEditingMode(),
    resetForm: () => resetProfileFormFields(),
  });
}

function cancelAssetProfileEdit() {
  const wasEditing = isBasicEditingMode();
  resetProfileFormFields();
  if (!wasEditing) return;
  setPrimaryMainTab("assets");
  setAssetMainTab("formation");
  setInputSubTab("asset-formation", "register");
  scrollAppToAbsoluteTopAfterCancel();
}

function setLifeEventError(message = "") {
  if (!lifeEventError) return;
  const hasError = Boolean(message);
  lifeEventError.textContent = message;
  lifeEventError.hidden = !hasError;
}

function resetLifeEventFormFields() {
  if (!lifeEventForm) return;
  lifeEventForm.reset();
  lifeEventEditingId = null;
  lifeEventTypeInput.value = "";
  if (lifeEventMonthInput) {
    lifeEventMonthInput.value = "";
  }
  syncLifeEventCategoryOptions();
  lifeEventAmountInput.value = "";
  lifeEventMemoInput.value = "";
  updateMemoPreviewByInputId("life-event-memo");
  closeMemoModal();
  updateLifeEventAgePreview();
  setLifeEventError("");
  setLifeEventFormMode(false);
}

function startLifeEventEdit(id) {
  const lifeEvent = loadLifeEvents().find((item) => item.id === id);
  if (!lifeEvent) return;
  setPrimaryMainTab("input");
  setInputMainTab("life");
  setInputSubTab("life", "register");
  lifeEventEditingId = lifeEvent.id;
  lifeEventMonthInput.value = lifeEvent.month;
  lifeEventTypeInput.value = lifeEvent.type;
  syncLifeEventCategoryOptions();
  lifeEventCategoryInput.value = normalizeLegacyLifeEventCategory(lifeEvent.category);
  lifeEventAmountInput.value = numberWithComma.format(lifeEvent.amount);
  lifeEventMemoInput.value = lifeEvent.memo || "";
  updateMemoPreviewByInputId("life-event-memo");
  updateLifeEventAgePreview();
  setLifeEventError("");
  setLifeEventFormMode(true);
  scrollToEditFormStart(lifeEventsSection, lifeEventForm);
}

function resolveLifeEventHistoryPeriodLabel(item, settings) {
  const monthLabel = formatScheduledMonthLabel(item.month);
  const age = resolveAgeAtMonth(settings?.birthDate, item.month);
  if (!Number.isFinite(age)) return `${monthLabel}の予定`;
  return `${monthLabel}（${age}歳）の予定`;
}

function buildLifeEventHistoryItems(lifeEvents, settings) {
  return lifeEvents
    .slice()
    .sort((a, b) => (a.month !== b.month ? compareMonth(a.month, b.month) : a.createdAt.localeCompare(b.createdAt)))
    .map((item, index) => ({
      id: `life-event-history-${item.id}`,
      source: "lifeEvent",
      originalId: item.id,
      type: item.type,
      category: item.category,
      amount: item.amount,
      memo: item.memo,
      age: resolveAgeAtMonth(settings?.birthDate, item.month),
      classificationLabel: LIFE_EVENT_TYPES[item.type],
      scheduledLabel: resolveLifeEventHistoryPeriodLabel(item, settings),
      scheduledMonth: item.month,
      date: "",
      order: index,
    }));
}

function resolveAgeAtDate(birthDate, dateString) {
  const birth = parseBirthDate(birthDate);
  const target = parseISODateParts(dateString);
  if (!birth || !target) return null;
  const targetDate = new Date(target.year, target.month - 1, target.day);
  let age = targetDate.getFullYear() - birth.getFullYear();
  const hadBirthday =
    targetDate.getMonth() > birth.getMonth()
    || (targetDate.getMonth() === birth.getMonth() && targetDate.getDate() >= birth.getDate());
  if (!hadBirthday) age -= 1;
  return Math.max(age, 0);
}

function resolveAgeAtMonth(birthDate, monthString) {
  const birth = parseBirthDate(birthDate);
  const targetMonth = parseMonth(monthString);
  if (!birth || !targetMonth) return null;
  let age = targetMonth.year - birth.getFullYear();
  if (targetMonth.monthIndex < birth.getMonth()) age -= 1;
  return Math.max(age, 0);
}

function formatScheduledMonthLabel(month) {
  const parsed = parseMonth(month);
  if (!parsed) return month;
  return `${parsed.year}年${parsed.monthIndex + 1}月`;
}

function formatWithdrawMonthLabelWithAge(withdrawMonth, birthDate) {
  const monthLabel = formatScheduledMonthLabel(withdrawMonth);
  if (!parseMonth(withdrawMonth)) return monthLabel;
  const age = resolveAgeAtMonth(birthDate, withdrawMonth);
  if (!Number.isFinite(age)) return monthLabel;
  return `${monthLabel}（${age}歳）`;
}

function buildFutureTransactionHistoryItems(transactions, settings, baseMonth) {
  if (!parseMonth(baseMonth)) return [];
  return (Array.isArray(transactions) ? transactions : [])
    .filter((item) => item?.date && !item.isAutoGenerated)
    .filter((item) => {
      const month = monthISO(item.date);
      return parseMonth(month) && compareMonth(month, baseMonth) > 0;
    })
    .sort(compareTransactionHistoryRecency)
    .map((item, index) => {
      const scheduledMonth = monthISO(item.date);
      return {
        id: `future-transaction-history-${item.id}`,
        source: "transaction",
        originalId: item.id,
        type: item.type,
        category: item.category,
        amount: item.amount,
        memo: item.memo,
        age: resolveAgeAtDate(settings?.birthDate, item.date),
        classificationLabel: item.type === "income" ? "収入" : "支出",
        scheduledLabel: `${formatScheduledMonthLabel(scheduledMonth)}（${item.date}）`,
        scheduledMonth,
        date: item.date,
        order: index,
      };
    });
}

const PLANNED_HISTORY_AGE_BRACKETS = [
  { key: "20s", label: "20代", minAge: 20, maxAge: 29 },
  { key: "30s", label: "30代", minAge: 30, maxAge: 39 },
  { key: "40s", label: "40代", minAge: 40, maxAge: 49 },
  { key: "50plus", label: "50代以降", minAge: 50, maxAge: Number.POSITIVE_INFINITY },
];

function resolvePlannedHistoryAgeBracket(age) {
  const numericAge = Number(age);
  if (!Number.isFinite(numericAge)) return null;
  const normalizedAge = Math.floor(numericAge);
  return PLANNED_HISTORY_AGE_BRACKETS.find((bracket) => normalizedAge >= bracket.minAge && normalizedAge <= bracket.maxAge) || null;
}

function groupPlannedHistoryItemsByAgeBracket(items) {
  const grouped = new Map();
  PLANNED_HISTORY_AGE_BRACKETS.forEach((bracket) => grouped.set(bracket.key, []));
  items.forEach((item) => {
    const bracket = resolvePlannedHistoryAgeBracket(item.age);
    if (!bracket) return;
    grouped.get(bracket.key).push(item);
  });
  return PLANNED_HISTORY_AGE_BRACKETS
    .map((bracket) => ({
      ...bracket,
      items: grouped.get(bracket.key)
        .slice()
        .sort((a, b) => {
          const monthA = parseMonth(a.scheduledMonth) ? a.scheduledMonth : "";
          const monthB = parseMonth(b.scheduledMonth) ? b.scheduledMonth : "";
          if (monthA && monthB && monthA !== monthB) {
            return compareMonth(monthA, monthB);
          }
          if (monthA && !monthB) return -1;
          if (!monthA && monthB) return 1;
          if (a.date && b.date && a.date !== b.date) {
            return a.date.localeCompare(b.date);
          }
          if (a.age !== b.age) return a.age - b.age;
          return a.order - b.order;
        }),
    }))
    .filter((group) => group.items.length > 0);
}

function buildTransactionHistoryItems(transactions, autoTransactions, currentMonth) {
  const allTransactions = [...transactions, ...autoTransactions];
  const filtered = currentMonth
    ? allTransactions.filter((item) => monthISO(item.date) === currentMonth)
    : allTransactions;

  return filtered
    .slice()
    .sort(compareTransactionHistoryRecency)
    .map((item) => ({
      ...item,
      source: item.isAuto ? "autoTransaction" : "transaction",
      originalId: item.id,
    }));
}

function buildAverageTransactionHistoryItems(transactions, targetMonths) {
  if (!Array.isArray(targetMonths) || targetMonths.length === 0) return [];
  const monthCount = targetMonths.length;
  const targetMonthSet = new Set(targetMonths);
  const totals = new Map();

  transactions.forEach((item) => {
    const month = monthISO(item.date);
    if (!targetMonthSet.has(month)) return;
    const key = `${item.type}:${item.category}`;
    const current = totals.get(key) || {
      type: item.type,
      category: item.category,
      total: 0,
    };
    current.total += item.amount;
    totals.set(key, current);
  });

  return Array.from(totals.values())
    .map((item) => ({
      ...item,
      average: item.total / monthCount,
    }))
    .filter((item) => item.average > 0)
    .sort((a, b) => {
      if (b.average !== a.average) return b.average - a.average;
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.category.localeCompare(b.category, "ja");
    });
}

function compareTransactionHistoryRecency(a, b) {
  if (a.date !== b.date) {
    return a.date < b.date ? 1 : -1;
  }

  if (a.createdAt && b.createdAt && a.createdAt !== b.createdAt) {
    return a.createdAt < b.createdAt ? 1 : -1;
  }

  return 0;
}

function parseISODateParts(dateString) {
  if (typeof dateString !== "string") return null;
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function createTransactionItemNode(item) {
  const node = template.content.cloneNode(true);
  const row = node.querySelector(".item");
  const meta = node.querySelector(".meta");
  const memo = node.querySelector(".memo");
  const amount = node.querySelector(".amount");
  const edit = node.querySelector(".edit");
  const del = node.querySelector(".delete");

  meta.textContent = item.isAuto
    ? item.autoKind === "recurring-expense"
      ? `${item.date} / 自動反映 / 定期支出`
      : `${item.date} / 自動反映 / ${item.sourceType}`
    : `${item.date} / ${item.category}`;
  memo.textContent = item.memo || "メモなし";
  amount.textContent = `${item.type === "income" ? "+" : "-"}${yen.format(item.amount)}`;
  amount.classList.add(item.type);

  if (item.isAuto) {
    edit.remove();
    del.remove();
  } else {
    edit.addEventListener("click", () => {
      startTransactionEdit(item.id);
    });
    del.addEventListener("click", () => {
      if (transactionEditingId === item.id) {
        resetTransactionFormFields();
      }
      const next = loadTransactions().filter((tx) => tx.id !== item.id);
      saveTransactions(next);
      render();
    });
  }

  row.dataset.id = item.id;
  row.dataset.source = item.source;
  row.dataset.originalId = item.originalId;
  return node;
}

function createPlannedTransactionItemNode(item) {
  const node = template.content.cloneNode(true);
  const row = node.querySelector(".item");
  const meta = node.querySelector(".meta");
  const memo = node.querySelector(".memo");
  const amount = node.querySelector(".amount");
  const edit = node.querySelector(".edit");
  const del = node.querySelector(".delete");

  row.classList.add("is-planned-transaction");

  meta.textContent = "";
  const plannedLabel = document.createElement("span");
  plannedLabel.className = "transaction-source-badge";
  plannedLabel.textContent = "予定";
  const plannedMetaText = document.createElement("span");
  plannedMetaText.className = "planned-meta-text";
  plannedMetaText.textContent = `${item.classificationLabel} / ${item.category} / ${item.scheduledLabel}`;
  meta.append(plannedLabel, plannedMetaText);

  if (item.source === "lifeEvent") {
    memo.textContent = item.memo
      ? `発生年月: ${item.scheduledMonth} / メモ: ${item.memo}`
      : `発生年月: ${item.scheduledMonth}`;
  } else {
    const ageText = Number.isFinite(item.age) ? `予定時年齢: ${item.age}歳 / ` : "";
    memo.textContent = item.memo
      ? `${ageText}予定日: ${item.date} / メモ: ${item.memo}`
      : `${ageText}予定日: ${item.date}`;
  }
  amount.textContent = `${item.type === "income" ? "+" : "-"}${yen.format(item.amount)}`;
  amount.classList.add(item.type);

  if (item.source === "lifeEvent") {
    edit.addEventListener("click", () => {
      startLifeEventEdit(item.originalId);
    });
    del.addEventListener("click", () => {
      if (!window.confirm("この予定取引（ライフイベント）を削除しますか？")) return;
      const next = loadLifeEvents().filter((target) => target.id !== item.originalId);
      saveLifeEvents(next);
      if (lifeEventEditingId === item.originalId) {
        resetLifeEventFormFields();
      }
      render();
    });
  } else {
    edit.addEventListener("click", () => {
      startTransactionEdit(item.originalId);
    });
    del.addEventListener("click", () => {
      if (!window.confirm("この予定取引を削除しますか？")) return;
      if (transactionEditingId === item.originalId) {
        resetTransactionFormFields();
      }
      const next = loadTransactions().filter((target) => target.id !== item.originalId);
      saveTransactions(next);
      render();
    });
  }

  row.dataset.id = item.id;
  row.dataset.source = item.source;
  row.dataset.originalId = item.originalId;
  return node;
}

function createPlannedAgeAccordion(group) {
  const accordion = document.createElement("section");
  accordion.className = "child-accordion history-planned-age-accordion";
  accordion.dataset.childAccordion = "";
  accordion.dataset.accordionStateKey = `planned-age:${group.key}`;
  const panelId = `panel-history-planned-${group.key}`;
  const triggerId = `trigger-history-planned-${group.key}`;
  const countLabel = `（${group.items.length}件）`;

  accordion.innerHTML = `
    <button
      type="button"
      class="child-accordion-trigger history-planned-age-trigger"
      aria-expanded="false"
      aria-controls="${panelId}"
      id="${triggerId}"
    >
      <h3>${group.label}${countLabel}</h3>
      <span class="child-accordion-toggle" aria-hidden="true">＋</span>
    </button>
    <div
      class="child-accordion-panel history-planned-age-panel"
      id="${panelId}"
      role="region"
      aria-labelledby="${triggerId}"
      aria-hidden="true"
      hidden
    >
      <div class="child-accordion-panel-inner history-planned-age-panel-inner">
        <ul class="list transaction-list planned-age-list"></ul>
      </div>
    </div>
  `;

  const listElement = accordion.querySelector(".planned-age-list");
  const renderItems = () => {
    if (!listElement || accordion.dataset.rendered === "true") return;
    const fragment = document.createDocumentFragment();
    group.items.forEach((item) => fragment.appendChild(createPlannedTransactionItemNode(item)));
    listElement.appendChild(fragment);
    accordion.dataset.rendered = "true";
  };
  const clearItems = () => {
    if (!listElement || accordion.dataset.rendered !== "true") return;
    listElement.replaceChildren();
    accordion.dataset.rendered = "false";
  };

  accordion.addEventListener("childaccordiontoggle", (event) => {
    if (event.detail?.expanded) {
      renderItems();
    } else {
      clearItems();
    }
  });

  return accordion;
}

function renderPlannedTransactionHistory(items) {
  if (!plannedList) return;
  const accordionState = captureChildAccordionState(plannedList);
  plannedList.replaceChildren();
  if (plannedHistoryTitle) {
    plannedHistoryTitle.textContent = `予定の取引履歴${items.length > 0 ? `（${items.length}件）` : ""}`;
  }

  const ageGroups = groupPlannedHistoryItemsByAgeBracket(items);
  if (ageGroups.length === 0) {
    const empty = document.createElement("p");
    empty.className = "chart-empty history-planned-empty";
    empty.textContent = "予定の取引はまだありません。";
    plannedList.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  ageGroups.forEach((group) => {
    fragment.appendChild(createPlannedAgeAccordion(group));
  });
  plannedList.appendChild(fragment);
  setupChildAccordions(plannedList);
  restoreChildAccordionState(plannedList, accordionState);
}

function renderTransactionHistory(items) {
  list.innerHTML = "";
  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "まだ取引がありません。";
    empty.className = "item";
    list.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item) => fragment.appendChild(createTransactionItemNode(item)));

  list.appendChild(fragment);
}

function renderAverageTransactionHistory(items, targetMonths) {
  list.innerHTML = "";
  if (!Array.isArray(targetMonths) || targetMonths.length === 0) {
    const empty = document.createElement("li");
    empty.className = "item";
    empty.textContent = "平均対象となる取引データがありません。";
    list.appendChild(empty);
    return;
  }
  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "item";
    empty.textContent = "平均対象期間に取引がありません。";
    list.appendChild(empty);
    return;
  }
  const header = document.createElement("li");
  header.className = "item history-average-header";
  header.textContent = `平均対象: ${targetMonths.length}か月（データがある月のみ）`;
  list.appendChild(header);

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const row = document.createElement("li");
    row.className = "item history-average-item";
    const sign = item.type === "income" ? "+" : "-";
    row.innerHTML = `
      <div>
        <p class="meta">${item.type === "income" ? "収入" : "支出"} / ${item.category}</p>
        <p class="memo">月平均（データ月ベース）</p>
      </div>
      <p class="amount ${item.type}">${sign}${yen.format(item.average)}</p>
    `;
    fragment.appendChild(row);
  });
  list.appendChild(fragment);
}

function getChildAccordionStateKey(childAccordion, index = 0) {
  if (!childAccordion) return `index:${index}`;
  const explicitKey = childAccordion.dataset.accordionStateKey;
  if (explicitKey) return explicitKey;
  const triggerId = childAccordion.querySelector(".child-accordion-trigger")?.id;
  if (triggerId) return `trigger:${triggerId}`;
  return `index:${index}`;
}

function captureChildAccordionState(root) {
  if (!root) return null;
  const expandedKeys = new Set();
  const childAccordions = Array.from(root.querySelectorAll("[data-child-accordion]"));
  childAccordions.forEach((childAccordion, index) => {
    const trigger = childAccordion.querySelector(".child-accordion-trigger");
    if (trigger?.getAttribute("aria-expanded") !== "true") return;
    expandedKeys.add(getChildAccordionStateKey(childAccordion, index));
  });
  return {
    expandedKeys,
    anchorTop: root.getBoundingClientRect().top,
  };
}

function restoreChildAccordionState(root, state) {
  if (!root || !state) return;
  const childAccordions = Array.from(root.querySelectorAll("[data-child-accordion]"));
  childAccordions.forEach((childAccordion, index) => {
    const key = getChildAccordionStateKey(childAccordion, index);
    if (!state.expandedKeys.has(key)) return;
    setChildAccordionExpanded(childAccordion, true);
  });

  if (!Number.isFinite(state.anchorTop)) return;
  const nextTop = root.getBoundingClientRect().top;
  const topDelta = nextTop - state.anchorTop;
  if (Math.abs(topDelta) <= 1) return;
  window.scrollBy({ top: topDelta, behavior: "auto" });
}

function renderLifeEvents(items) {
  if (!lifeEventList) return;
  lifeEventList.innerHTML = "";
  const settings = loadSettings();

  if (lifeEventEditingId && !items.some((item) => item.id === lifeEventEditingId)) {
    lifeEventEditingId = null;
    setLifeEventFormMode(false);
  }

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "まだライフイベントは登録されていません。";
    lifeEventList.appendChild(empty);
    return;
  }

  items
    .slice()
    .sort((a, b) => (a.month !== b.month ? compareMonth(a.month, b.month) : a.createdAt.localeCompare(b.createdAt)))
    .forEach((item) => {
      const monthLabel = formatScheduledMonthLabel(item.month);
      const age = resolveAgeAtMonth(settings?.birthDate, item.month);
      const monthWithAgeLabel = Number.isFinite(age) ? `${monthLabel}（${age}歳）` : monthLabel;
      const card = document.createElement("article");
      card.className = "life-event-card";
      card.innerHTML = `
        <div class="life-event-card-header">
          <h4>${monthWithAgeLabel} / ${item.category}</h4>
          <p class="life-event-amount ${item.type}">${yen.format(item.amount)}</p>
        </div>
        <ul class="life-event-meta-list">
          <li><span>区分</span><strong>${LIFE_EVENT_TYPES[item.type]}</strong></li>
          <li><span>費目</span><strong>${item.category}</strong></li>
          ${item.memo ? `<li><span>メモ</span><strong>${item.memo}</strong></li>` : ""}
        </ul>
      `;

      const actions = document.createElement("div");
      actions.className = "life-event-actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "small";
      editButton.textContent = "修正";
      editButton.addEventListener("click", () => startLifeEventEdit(item.id));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "small danger";
      deleteButton.textContent = "削除";
      deleteButton.addEventListener("click", () => {
        if (!window.confirm("このライフイベントを削除しますか？")) return;
        const next = loadLifeEvents().filter((target) => target.id !== item.id);
        saveLifeEvents(next);
        if (lifeEventEditingId === item.id) {
          resetLifeEventFormFields();
        }
        render();
      });

      actions.append(editButton, deleteButton);
      card.appendChild(actions);
      lifeEventList.appendChild(card);
    });
}

function addLifeEvent(event) {
  event.preventDefault();
  const month = lifeEventMonthInput.value;
  const type = lifeEventTypeInput.value;
  const category = lifeEventCategoryInput.value;
  const amount = parseAmountInput(lifeEventAmountInput.value);
  const memo = lifeEventMemoInput.value.trim();

  if (!parseMonth(month)) {
    setLifeEventError("発生年月を入力してください。");
    lifeEventMonthInput.focus();
    return;
  }
  if (!(type in LIFE_EVENT_TYPES)) {
    setLifeEventError("区分を選択してください。");
    lifeEventTypeInput.focus();
    return;
  }
  if (!isValidLifeEventCategoryForType(type, category)) {
    setLifeEventError("区分に対応する費目を選択してください。");
    lifeEventCategoryInput.focus();
    return;
  }
  if (amount <= 0) {
    setLifeEventError("金額は1円以上で入力してください。");
    lifeEventAmountInput.focus();
    return;
  }
  setLifeEventError("");

  const current = loadLifeEvents();
  if (lifeEventEditingId) {
    const next = current.map((item) => (item.id === lifeEventEditingId
      ? normalizeLifeEvent({
          ...item,
          month,
          type,
          category: normalizeLegacyLifeEventCategory(category),
          amount,
          memo,
          updatedAt: new Date().toISOString(),
        })
      : item));
    saveLifeEvents(next);
  } else {
    current.push(normalizeLifeEvent({
      id: crypto.randomUUID(),
      month,
      type,
      category: normalizeLegacyLifeEventCategory(category),
      amount,
      memo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    saveLifeEvents(current);
  }

  resetLifeEventFormFields();
  handlePostSaveCompletion({ groupName: "life" });
}

function cancelLifeEventEdit() {
  handleCancelEditFromRegistered("life", {
    isEditing: lifeEventEditingId,
    resetForm: resetLifeEventFormFields,
  });
}

function updateLifeEventAgePreview() {
  if (!lifeEventAgePreview || !lifeEventMonthInput) return;
  const month = lifeEventMonthInput.value;
  if (!parseMonth(month)) {
    lifeEventAgePreview.textContent = "";
    return;
  }
  const monthLabel = formatScheduledMonthLabel(month);
  const age = resolveAgeAtMonth(loadSettings()?.birthDate, month);
  lifeEventAgePreview.textContent = Number.isFinite(age)
    ? `想定年齢: ${monthLabel}（${age}歳）`
    : `予定: ${monthLabel}`;
}

function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthISO(dateString) {
  return dateString.slice(0, 7);
}

function clampDay(year, month, day) {
  const lastDay = new Date(year, month, 0).getDate();
  return Math.min(Math.max(day, 1), lastDay);
}

function addOneMonth(month) {
  const parsed = parseMonth(month);
  if (!parsed) return month;
  const next = new Date(parsed.year, parsed.monthIndex + 1, 1);
  return formatMonth(next.getFullYear(), next.getMonth());
}

function subtractOneMonth(month) {
  const parsed = parseMonth(month);
  if (!parsed) return month;
  const previous = new Date(parsed.year, parsed.monthIndex - 1, 1);
  return formatMonth(previous.getFullYear(), previous.getMonth());
}

function getMonthRangeInclusive(startMonth, endMonth) {
  if (!parseMonth(startMonth) || !parseMonth(endMonth)) return [];
  if (compareMonth(startMonth, endMonth) > 0) return [];
  const months = [];
  let cursor = startMonth;
  while (compareMonth(cursor, endMonth) <= 0) {
    months.push(cursor);
    cursor = addOneMonth(cursor);
  }
  return months;
}

function resolvePlanExecutionDate(month, withdrawalDay) {
  const parsed = parseMonth(month);
  if (!parsed) return null;
  const day = clampDay(parsed.year, parsed.monthIndex + 1, Number(withdrawalDay) || 1);
  return new Date(parsed.year, parsed.monthIndex, day);
}

function calculateXnpv(rate, cashflows) {
  if (!Number.isFinite(rate) || rate <= -1 || !Array.isArray(cashflows) || cashflows.length === 0) return null;
  const baseTime = cashflows[0].date.getTime();
  return cashflows.reduce((sum, flow) => {
    const years = (flow.date.getTime() - baseTime) / (365 * 24 * 60 * 60 * 1000);
    return sum + (flow.amount / ((1 + rate) ** years));
  }, 0);
}

function solveXirr(cashflows) {
  if (!Array.isArray(cashflows) || cashflows.length < 2) return null;
  const sortedFlows = cashflows
    .filter((flow) => flow?.date instanceof Date && Number.isFinite(flow.amount) && flow.amount !== 0)
    .sort((a, b) => a.date - b.date);
  if (sortedFlows.length < 2) return null;
  const hasPositive = sortedFlows.some((flow) => flow.amount > 0);
  const hasNegative = sortedFlows.some((flow) => flow.amount < 0);
  if (!hasPositive || !hasNegative) return null;

  const candidates = [-0.9999, -0.9, -0.75, -0.5, -0.25, -0.1, 0, 0.1, 0.25, 0.5, 1, 2, 5, 10];
  let low = null;
  let high = null;
  for (let index = 0; index < candidates.length - 1; index += 1) {
    const left = candidates[index];
    const right = candidates[index + 1];
    const fLeft = calculateXnpv(left, sortedFlows);
    const fRight = calculateXnpv(right, sortedFlows);
    if (!Number.isFinite(fLeft) || !Number.isFinite(fRight)) continue;
    if (fLeft === 0) return left;
    if (fRight === 0) return right;
    if (fLeft * fRight < 0) {
      low = left;
      high = right;
      break;
    }
  }
  if (!Number.isFinite(low) || !Number.isFinite(high)) return null;

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const mid = (low + high) / 2;
    const fLow = calculateXnpv(low, sortedFlows);
    const fMid = calculateXnpv(mid, sortedFlows);
    if (!Number.isFinite(fLow) || !Number.isFinite(fMid)) return null;
    if (Math.abs(fMid) < 1e-7) return mid;
    if (fLow * fMid < 0) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return (low + high) / 2;
}

function buildPlanAutoYieldCashflows(plan, asOfDate = new Date()) {
  const normalizedPlan = normalizePlan(plan);
  const today = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), asOfDate.getDate());
  const currentMonth = formatMonth(today.getFullYear(), today.getMonth());
  const cashflows = [];

  normalizedPlan.lumpSums.forEach((history) => {
    const amount = Number(history.amount) || 0;
    if (!parseMonth(history.month) || amount <= 0) return;
    const executionDate = resolvePlanExecutionDate(history.month, normalizedPlan.withdrawalDay);
    if (!(executionDate instanceof Date) || Number.isNaN(executionDate.getTime()) || executionDate > today) return;
    cashflows.push({ date: executionDate, amount: -amount });
  });

  normalizedPlan.monthlyContributions.forEach((history) => {
    const amount = Number(history.amount) || 0;
    if (!parseMonth(history.startMonth) || amount <= 0) return;
    const months = getMonthRangeInclusive(history.startMonth, currentMonth);
    months.forEach((month) => {
      const executionDate = resolvePlanExecutionDate(month, normalizedPlan.withdrawalDay);
      if (!(executionDate instanceof Date) || Number.isNaN(executionDate.getTime()) || executionDate > today) return;
      cashflows.push({ date: executionDate, amount: -amount });
    });
  });

  return cashflows.sort((a, b) => a.date - b.date);
}

function calculatePlanOperationMonths(plan, asOfDate = new Date()) {
  const cashflows = buildPlanAutoYieldCashflows(plan, asOfDate);
  const firstContribution = cashflows.find((flow) => flow.amount < 0);
  if (!firstContribution?.date) return 0;
  const today = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), asOfDate.getDate());
  return ((today.getFullYear() - firstContribution.date.getFullYear()) * 12)
    + (today.getMonth() - firstContribution.date.getMonth())
    + 1;
}

function calculateCurrentAutoYield(plan) {
  const normalizedPlan = normalizePlan(plan);
  if (!Number.isFinite(normalizedPlan.currentValue) || normalizedPlan.currentValue <= 0) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const cashflows = buildPlanAutoYieldCashflows(normalizedPlan, today);
  if (cashflows.length === 0) return null;
  cashflows.push({ date: today, amount: normalizedPlan.currentValue });
  const solved = solveXirr(cashflows);
  return Number.isFinite(solved) ? solved * 100 : null;
}

function calculateSuggestedExpectedReturn(plan) {
  const baseReturn = 4.0;
  const autoYield = calculateCurrentAutoYield(plan);
  const operationMonths = calculatePlanOperationMonths(plan);
  if (!Number.isFinite(autoYield)) {
    return Number(baseReturn.toFixed(2));
  }
  const boundedAutoYield = Math.min(Math.max(autoYield, 0), 8.5);
  const weight = Math.min(operationMonths / 60, 1);
  return Number(((1 - weight) * baseReturn + (weight * boundedAutoYield)).toFixed(2));
}

function formatAutoYieldPercent(value) {
  if (!Number.isFinite(value)) return "--";
  return `${value.toFixed(2)}%`;
}

function monthsBetweenInclusive(startMonth, endMonth) {
  const start = parseMonth(startMonth);
  const end = parseMonth(endMonth);
  if (!start || !end) return 0;
  return (end.year - start.year) * 12 + (end.monthIndex - start.monthIndex) + 1;
}

function findActiveMonthlyContribution(plan, month) {
  const histories = (Array.isArray(plan?.monthlyContributions) ? plan.monthlyContributions : [])
    .filter((history) => parseMonth(history?.startMonth))
    .filter((history) => history?.amount !== "" && history?.amount !== null && history?.amount !== undefined)
    .map((history) => ({
      startMonth: history.startMonth,
      amount: Math.max(Number(history.amount) || 0, 0),
    }));
  const active = histories
    .filter((history) => history.startMonth && isMonthOnOrAfter(month, history.startMonth))
    .sort((a, b) => compareMonth(a.startMonth, b.startMonth));
  if (active.length === 0) return 0;
  return Math.max(Number(active[active.length - 1].amount) || 0, 0);
}

function getLumpSumsOnMonth(plan, month) {
  const histories = Array.isArray(plan.lumpSums) ? plan.lumpSums : [];
  return histories.filter((history) => isSameMonth(history.month, month)).map((history) => Math.max(Number(history.amount) || 0, 0));
}

function createAutoExpensesForMonth(settings, month) {
  if (!month) return [];
  if (parseMonth(settings.entryStartMonth) && compareMonth(month, settings.entryStartMonth) < 0) return [];
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const monthNum = Number(monthStr);

  return settings.plans.flatMap((plan) => {
    const day = clampDay(year, monthNum, Number(plan.withdrawalDay) || 1);
    const date = `${month}-${String(day).padStart(2, "0")}`;

    const canApplyMonthlyContribution = shouldApplyPlanContributionForMonth(plan, settings.birthDate, month);
    const monthlyAmount = canApplyMonthlyContribution ? findActiveMonthlyContribution(plan, month) : 0;
    const monthlyTx = monthlyAmount
      ? [{
          id: `auto-monthly-${plan.id}-${month}`,
          date,
          type: "expense",
          category: ASSET_FORMATION_CATEGORY,
          amount: monthlyAmount,
          memo: `月額積立: ${plan.type}${plan.name ? `（${plan.name}）` : ""}`,
          isAuto: true,
          sourceType: plan.type,
          sourceKind: "monthly",
        }]
      : [];

    const lumpTx = getLumpSumsOnMonth(plan, month).map((amount, index) => ({
      id: `auto-lump-${plan.id}-${month}-${index}`,
      date,
      type: "expense",
      category: ASSET_FORMATION_CATEGORY,
      amount,
      memo: `一括入金: ${plan.type}${plan.name ? `（${plan.name}）` : ""}`,
      isAuto: true,
      sourceType: plan.type,
      sourceKind: "lump",
    }));

    const withdrawTargetMonth = resolveWithdrawExecutionMonth(plan);
    const withdrawTx = [];
    if (withdrawTargetMonth && isSameMonth(withdrawTargetMonth, month)) {
      const projection = projectPlanAssetDetails(plan, settings.birthDate, withdrawTargetMonth);
      const amount = Math.max(Number(projection?.amount) || 0, 0);
      if (amount > 0) {
        withdrawTx.push({
          id: `auto-withdraw-${plan.id}-${month}`,
          date,
          type: "income",
          category: "臨時収入",
          amount,
          memo: `資産取崩: ${plan.type}${plan.name ? `（${plan.name}）` : ""}`,
          isAuto: true,
          sourceType: plan.type,
          sourceKind: "withdraw",
        });
      }
    }

    return [...monthlyTx, ...lumpTx, ...withdrawTx];
  });
}

function resolveEntryStartMonth(settings, transactions) {
  if (parseMonth(settings.entryStartMonth)) return settings.entryStartMonth;

  const earliestManual = transactions
    .map((item) => item.date)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))[0];
  if (earliestManual) return monthISO(earliestManual);
  return todayISO().slice(0, 7);
}

function resolveAverageTargetMonths(settings, transactions) {
  const entryStartMonth = resolveEntryStartMonth(settings, transactions);
  const operationMonth = todayISO().slice(0, 7);
  const endMonth = subtractOneMonth(operationMonth);
  return getMonthRangeInclusive(entryStartMonth, endMonth);
}

function buildAverageModeDataset(settings, transactions, targetMonths) {
  const averageTransactions = [...transactions];
  targetMonths.forEach((month) => {
    const autoTransactions = createEligibleAutoExpensesForMonth(settings, transactions, month);
    averageTransactions.push(...autoTransactions);
  });

  const expenseComposition = buildAverageExpenseComposition(averageTransactions, targetMonths);
  const summary = calculateAverageMonthlySummary(transactions, settings, targetMonths);

  return {
    targetMonths,
    expenseComposition,
    summary,
  };
}

function createEligibleAutoExpensesForMonth(settings, transactions, month) {
  if (!month) return [];
  const entryStartMonth = resolveEntryStartMonth(settings, transactions);
  if (entryStartMonth && compareMonth(month, entryStartMonth) < 0) return [];

  const generated = createAutoExpensesForMonth(settings, month);
  return generated.filter((autoTx) => {
    return !transactions.some((item) => {
      return (
        item.type === autoTx.type &&
        item.date === autoTx.date &&
        item.category === autoTx.category &&
        item.amount === autoTx.amount &&
        item.memo === autoTx.memo
      );
    });
  });
}

function resolveAutoExpenseStartMonth(settings) {
  const planMonths = (settings.plans ?? []).flatMap((plan) => {
    const monthlyMonths = (Array.isArray(plan.monthlyContributions) ? plan.monthlyContributions : [])
      .map((history) => history.startMonth)
      .filter((month) => parseMonth(month));
    const lumpMonths = (Array.isArray(plan.lumpSums) ? plan.lumpSums : [])
      .map((history) => history.month)
      .filter((month) => parseMonth(month));
    return [...monthlyMonths, ...lumpMonths];
  });

  if (planMonths.length === 0) return null;
  return planMonths.sort(compareMonth)[0];
}

function resolveEffectiveAutoStartMonth(settings) {
  const autoStartMonth = resolveAutoExpenseStartMonth(settings);
  const entryStartMonth = parseMonth(settings.entryStartMonth) ? settings.entryStartMonth : null;

  if (!autoStartMonth) return null;
  if (!entryStartMonth) return autoStartMonth;
  return compareMonth(autoStartMonth, entryStartMonth) < 0 ? entryStartMonth : autoStartMonth;
}

function calculateCarryover(transactions, settings, targetMonth) {
  if (!targetMonth) return 0;

  const manual = transactions.reduce((sum, item) => {
    const txMonth = monthISO(item.date);
    if (compareMonth(txMonth, targetMonth) >= 0) return sum;
    return sum + (item.type === "income" ? item.amount : -item.amount);
  }, 0);

  let auto = 0;
  const autoStartMonth = resolveEffectiveAutoStartMonth(settings);
  if (autoStartMonth) {
    let month = autoStartMonth;
    while (compareMonth(month, targetMonth) < 0) {
      const autoTransactions = createEligibleAutoExpensesForMonth(settings, transactions, month);
      auto += autoTransactions.reduce((sum, item) => sum + (item.type === "income" ? item.amount : -item.amount), 0);
      month = addOneMonth(month);
    }
  }

  return manual + auto;
}

function calculateMonthlySummary(transactions, settings, targetMonth) {
  if (!targetMonth) {
    return {
      carryover: 0,
      income: 0,
      regularExpense: 0,
      recurringExpense: 0,
      assetFormationExpense: 0,
      expense: 0,
      endingBalance: 0,
    };
  }

  const carryover = calculateCarryover(transactions, settings, targetMonth);
  const autoTransactions = createEligibleAutoExpensesForMonth(settings, transactions, targetMonth);
  const monthly = [...transactions, ...autoTransactions].reduce(
    (totals, item) => {
      if (monthISO(item.date) !== targetMonth) return totals;
      if (item.type === "income") {
        totals.income += item.amount;
      } else if (item.autoKind === "recurring-expense") {
        totals.recurringExpense += item.amount;
      } else if (item.category === ASSET_FORMATION_CATEGORY) {
        totals.assetFormationExpense += item.amount;
      } else {
        totals.regularExpense += item.amount;
      }
      return totals;
    },
    { income: 0, regularExpense: 0, recurringExpense: 0, assetFormationExpense: 0 }
  );
  const totalExpense = monthly.regularExpense + monthly.recurringExpense + monthly.assetFormationExpense;

  return {
    carryover,
    income: monthly.income,
    regularExpense: monthly.regularExpense,
    recurringExpense: monthly.recurringExpense,
    assetFormationExpense: monthly.assetFormationExpense,
    expense: totalExpense,
    endingBalance: carryover + monthly.income - totalExpense,
  };
}

function calculateAverageMonthlySummary(transactions, settings, months) {
  if (!Array.isArray(months) || months.length === 0) {
    return {
      summary: { carryover: 0, income: 0, expense: 0, endingBalance: 0 },
      monthlySavingTotal: 0,
      manualTransactionCount: 0,
      monthCount: 0,
    };
  }
  const totals = months.reduce((acc, month) => {
    const summary = calculateMonthlySummary(transactions, settings, month);
    acc.carryover += summary.carryover;
    acc.income += summary.income;
    acc.expense += summary.expense;
    acc.endingBalance += summary.endingBalance;
    acc.monthlySavingTotal += calculateMonthlyContributionTotal(settings, month);
    acc.manualTransactionCount += transactions.filter((item) => monthISO(item.date) === month).length;
    return acc;
  }, {
    carryover: 0,
    income: 0,
    expense: 0,
    endingBalance: 0,
    monthlySavingTotal: 0,
    manualTransactionCount: 0,
  });
  const monthCount = months.length;
  return {
    summary: {
      carryover: totals.carryover / monthCount,
      income: totals.income / monthCount,
      expense: totals.expense / monthCount,
      endingBalance: totals.endingBalance / monthCount,
    },
    monthlySavingTotal: totals.monthlySavingTotal / monthCount,
    manualTransactionCount: totals.manualTransactionCount / monthCount,
    monthCount,
  };
}

function calculateMonthlyContributionTotal(settings, month) {
  if (!month || !Array.isArray(settings.plans)) return 0;
  return settings.plans.reduce((sum, plan) => sum + findActiveMonthlyContribution(plan, month), 0);
}

function isPlanHeldUntilAge(plan, age, birthDate = "") {
  if (!parseMonth(plan?.withdrawMonth) || !parseBirthDate(birthDate)) return true;
  const withdrawDate = `${plan.withdrawMonth}-01`;
  const withdrawAgeByMonth = resolveAgeAtDate(birthDate, withdrawDate);
  if (!Number.isFinite(withdrawAgeByMonth)) return true;
  return withdrawAgeByMonth >= age;
}

function calculateAssetFormationBalanceAtAge({
  settings,
  transactions,
  recurringExpenses,
  lifeEvents,
  assumptions,
  targetAge = RETIREMENT_REFERENCE_AGE,
}) {
  const cashflowRows = buildCashflowRowsUntilAge({
    settings,
    transactions,
    recurringExpenses,
    lifeEvents,
    assumptions,
    targetAge,
  });
  const referenceYear = resolveReferenceYearByAge(settings.birthDate, targetAge);
  const targetRow = cashflowRows.find((row) => row.year === referenceYear)
    || cashflowRows[cashflowRows.length - 1]
    || null;
  return targetRow?.assetFormationBalance ?? 0;
}

function resolveAge60AssetFormationBalance({ settings, transactions, recurringExpenses, lifeEvents, assumptions }) {
  return calculateAssetFormationBalanceAtAge({
    settings,
    transactions,
    recurringExpenses,
    lifeEvents,
    assumptions,
    targetAge: TARGET_AGE_PRIMARY,
  });
}

function normalizeExpenseCompositionCategory(item) {
  if (item?.type !== "expense") return "";
  if (item.category === ASSET_FORMATION_CATEGORY && PLAN_TYPES.includes(item.sourceType)) {
    return item.sourceType;
  }
  return normalizeLegacyExpenseCategory(item.category || "");
}

function shouldExcludeFromExpenseComposition(item) {
  if (item?.type !== "expense") return false;
  return item.category === ASSET_FORMATION_CATEGORY
    && item.sourceType === "NISA"
    && item.sourceKind === "lump";
}

function buildMonthlyExpenseComposition(transactions, targetMonth) {
  const baseTotals = EXPENSE_COMPOSITION_ITEMS.reduce((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {});

  if (!targetMonth) {
    return {
      totalExpense: 0,
      entries: [],
      itemRatios: EXPENSE_COMPOSITION_ITEMS.reduce((acc, name) => ({ ...acc, [name]: 0 }), {}),
    };
  }

  const totals = transactions.reduce((acc, item) => {
    if (item.type !== "expense" || monthISO(item.date) !== targetMonth) return acc;
    if (shouldExcludeFromExpenseComposition(item)) return acc;
    const category = normalizeExpenseCompositionCategory(item);
    if (!category) return acc;
    if (!(category in acc)) {
      acc[category] = 0;
    }
    acc[category] += item.amount;
    return acc;
  }, { ...baseTotals });

  const positiveEntries = Object.entries(totals)
    .filter(([, amount]) => amount > 0)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => {
      if (b.amount !== a.amount) return b.amount - a.amount;
      return EXPENSE_COMPOSITION_ITEMS.indexOf(a.name) - EXPENSE_COMPOSITION_ITEMS.indexOf(b.name);
    });
  const totalExpense = positiveEntries.reduce((sum, item) => sum + item.amount, 0);
  const entries = positiveEntries.map((item) => ({
    ...item,
    ratio: totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0,
  }));

  const itemRatios = EXPENSE_COMPOSITION_ITEMS.reduce((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {});
  entries.forEach((item) => {
    itemRatios[item.name] = item.ratio;
  });

  return {
    totalExpense,
    entries,
    itemRatios,
  };
}

function buildAverageExpenseComposition(transactions, targetMonths) {
  if (!Array.isArray(targetMonths) || targetMonths.length === 0) {
    return {
      totalExpense: 0,
      entries: [],
      itemRatios: EXPENSE_COMPOSITION_ITEMS.reduce((acc, name) => ({ ...acc, [name]: 0 }), {}),
    };
  }
  const monthSet = new Set(targetMonths);
  const monthCount = targetMonths.length;
  const totals = EXPENSE_COMPOSITION_ITEMS.reduce((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {});

  transactions.forEach((item) => {
    if (item.type !== "expense") return;
    if (!monthSet.has(monthISO(item.date))) return;
    if (shouldExcludeFromExpenseComposition(item)) return;
    const category = normalizeExpenseCompositionCategory(item);
    if (!category) return;
    if (!(category in totals)) totals[category] = 0;
    totals[category] += item.amount;
  });

  const avgEntries = Object.entries(totals)
    .map(([name, amount]) => ({ name, amount: amount / monthCount }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const totalExpense = avgEntries.reduce((sum, item) => sum + item.amount, 0);
  const entries = avgEntries.map((item) => ({ ...item, ratio: totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0 }));
  const itemRatios = EXPENSE_COMPOSITION_ITEMS.reduce((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {});
  entries.forEach((item) => {
    itemRatios[item.name] = item.ratio;
  });
  return { totalExpense, entries, itemRatios };
}

function createDashboardDiagnosisComment({ summary, monthlySavingTotal, manualTransactionCount, expenseComposition }) {
  if (manualTransactionCount < 3) {
    return "まだ入力が少ないため簡易診断です。定期支出や日々の収支を追加すると、固定費の重さや黒字余力が見えやすくなります。";
  }

  const balance = summary.endingBalance;
  const income = summary.income;
  const itemRatios = expenseComposition?.itemRatios || {};
  const fixedExpenseRatio = (itemRatios["家賃・マイホーム費"] || 0) + (itemRatios["家賃・住宅ローン"] || 0) + (itemRatios["家賃"] || 0) + (itemRatios["通信費"] || 0) + (itemRatios["保険料"] || 0) + (itemRatios["カーローン"] || 0) + (itemRatios["教育費"] || 0) + (itemRatios["その他固定費"] || 0);
  const dailyExpenseRatio = itemRatios["日常費"] || 0;
  const leisureRatio = itemRatios["レジャー費"] || 0;
  const miscRatio = (itemRatios["雑費"] || 0) + (itemRatios["出金"] || 0);
  const reserveRatio = income > 0 ? balance / income : 0;
  const savingRate = income > 0 ? monthlySavingTotal / income : 0;

  const insights = [];

  if (balance < 0) {
    insights.push({
      key: "balance-deficit",
      priority: 120,
      text: "今月は支出が収入を上回る赤字傾向です。赤字が続くと貯蓄や資産形成を圧迫する可能性があるため、まずは毎月固定で出る支出から見直すのが効果的です。",
    });
  } else if (reserveRatio <= 0.05) {
    insights.push({
      key: "balance-tight",
      priority: 90,
      text: "収支は均衡に近く、月末に残る余力はやや限定的です。突発費用に備えて、少額でも先取りで残す流れを作れると安心です。",
    });
  } else if (reserveRatio >= 0.2) {
    insights.push({
      key: "balance-healthy",
      priority: 70,
      text: "収支は黒字で、毎月の余力を確保できています。余剰分の使い道を生活防衛資金と積立に分けると、家計の安定性がさらに高まります。",
    });
  }

  if (fixedExpenseRatio >= 38) {
    insights.push({
      key: "expense-fixed-heavy",
      priority: balance < 0 ? 115 : 100,
      text: "家賃・住宅ローンを中心とした固定費の比率が高めです。固定費は一度下げると効果が続くため、住居費や通信費の最適化余地を確認してみましょう。",
    });
  } else if (dailyExpenseRatio >= 33) {
    insights.push({
      key: "expense-daily-heavy",
      priority: 80,
      text: "日常費の比率がやや高く、日々の支出が家計を押し上げている可能性があります。買い方や頻度を見直すだけでも改善につながります。",
    });
  } else if (leisureRatio >= 18) {
    insights.push({
      key: "expense-leisure-heavy",
      priority: 80,
      text: "レジャー費の比率が高めで、楽しみへの支出が家計に占める割合が大きい状態です。満足度を維持しながら予算上限を決めると管理しやすくなります。",
    });
  } else if (miscRatio >= 16) {
    insights.push({
      key: "expense-misc-heavy",
      priority: 72,
      text: "雑費・予備費の比率が高く、使途の曖昧な支出が増えている可能性があります。内容を小分けで記録すると、削減ポイントが見えやすくなります。",
    });
  } else {
    insights.push({
      key: "expense-balanced",
      priority: 60,
      text: "支出は特定費目に偏りにくく、全体としてバランス良く配分できています。この状態を維持しつつ、変動しやすい費目だけ定期確認すると安心です。",
    });
  }

  if (monthlySavingTotal > 0 && reserveRatio >= 0.1 && savingRate >= 0.15) {
    insights.push({
      key: "asset-good-progress",
      priority: 95,
      text: "毎月の積立を継続できており、資産形成は良好に進んでいます。現在の収支バランスを保てれば、将来への備えを積み上げやすい状況です。",
    });
  } else if (monthlySavingTotal > 0 && reserveRatio < 0.1) {
    insights.push({
      key: "asset-tight-progress",
      priority: 88,
      text: "積立は継続できていますが、収支に対する余力はやや限られています。積立額と手元資金のバランスを定期的に点検するのがおすすめです。",
    });
  } else {
    insights.push({
      key: "asset-review-needed",
      priority: 84,
      text: "積立余力はまだ大きくないため、支出の見直しとあわせて無理のない金額から資産形成を始める余地があります。",
    });
  }

  const selectedInsights = insights
    .sort((a, b) => b.priority - a.priority)
    .reduce((acc, item) => {
      if (acc.some((picked) => picked.key === item.key)) return acc;
      acc.push(item);
      return acc;
    }, [])
    .slice(0, 3)
    .map((item) => item.text);

  return selectedInsights.join(" ");
}

function formatYenAsManYenLabel(value) {
  const manYen = Math.round((Number(value) || 0) / 10000);
  return `${numberWithComma.format(manYen)}万円`;
}

function calculateNiceYAxisStep(range) {
  if (!Number.isFinite(range) || range <= 0) return 1000000;
  const roughStep = range / 4;
  const exponent = 10 ** Math.floor(Math.log10(roughStep));
  const fraction = roughStep / exponent;
  let niceFraction = 1;
  if (fraction <= 1) {
    niceFraction = 1;
  } else if (fraction <= 2) {
    niceFraction = 2;
  } else if (fraction <= 5) {
    niceFraction = 5;
  } else {
    niceFraction = 10;
  }
  return Math.max(niceFraction * exponent, 1000000);
}

function renderDashboardAssetFormationChart(cashflowRows, metricKey = "endingBalance") {
  if (!dashboardAssetFormationChart) return;
  dashboardAssetFormationChart.innerHTML = "";
  const metric = DASHBOARD_ASSET_GROWTH_METRICS[metricKey] || DASHBOARD_ASSET_GROWTH_METRICS.endingBalance;
  const points = (Array.isArray(cashflowRows) ? cashflowRows : [])
    .map((row) => ({ year: row.year, age: row.age, amount: Number(row?.[metricKey]) }))
    .filter((row) => Number.isFinite(row.year) && Number.isFinite(row.age) && Number.isFinite(row.amount))
    .sort((a, b) => (a.year - b.year) || (a.age - b.age));
  const labels = points.map((item) => item.year);
  const amounts = points.map((item) => item.amount);

  if (labels.length === 0 || labels.length !== amounts.length) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = metric.emptyText;
    dashboardAssetFormationChart.appendChild(empty);
    return;
  }

  const BAR_WIDTH_PX = 24;
  const YEAR_SLOT_WIDTH_PX = 52;
  const chartHeight = 280;
  const margin = { top: 24, right: 12, bottom: 56 };
  const fixedAxisWidth = 84;
  const visibleYearCount = labels.length;
  const minScrollableWidth = visibleYearCount * YEAR_SLOT_WIDTH_PX;
  const plotWidth = minScrollableWidth;
  const scrollChartWidth = plotWidth + margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;
  const maxAmount = Math.max(...amounts);
  const minAmount = Math.min(...amounts);
  const rawDomainMin = Math.min(minAmount, 0);
  const rawDomainMax = Math.max(maxAmount, 0);
  const hasFlatDomain = rawDomainMax === rawDomainMin;
  const baseAbs = Math.max(Math.abs(rawDomainMin), Math.abs(rawDomainMax), 1);
  const paddedDomainMin = hasFlatDomain ? rawDomainMin - baseAbs * 0.1 : rawDomainMin;
  const paddedDomainMax = hasFlatDomain ? rawDomainMax + baseAbs * 0.1 : rawDomainMax;
  const yStep = calculateNiceYAxisStep(paddedDomainMax - paddedDomainMin);
  const yMin = Math.floor(paddedDomainMin / yStep) * yStep;
  const yMax = Math.ceil(paddedDomainMax / yStep) * yStep;
  const yRange = Math.max(yMax - yMin, yStep);
  const yTickCount = Math.max(2, Math.ceil(yRange / yStep));
  const slotWidth = YEAR_SLOT_WIDTH_PX;
  const barWidth = BAR_WIDTH_PX;
  let selectedBarIndex = null;
  const yPosition = (value) => {
    const ratio = (value - yMin) / yRange;
    return margin.top + plotHeight - (ratio * plotHeight);
  };

  const svgNS = "http://www.w3.org/2000/svg";
  const hidePressedValue = () => {
    selectedBarIndex = null;
    const tooltip = dashboardAssetFormationChart.querySelector(".dashboard-bar-chart-press-tooltip");
    if (!tooltip) return;
    tooltip.classList.remove("is-visible");
    tooltip.textContent = "";
  };
  const showPressedValue = (barElement, age, amount, index) => {
    if (!(barElement instanceof SVGRectElement) || !dashboardAssetFormationChart) return;
    selectedBarIndex = index;
    let tooltip = dashboardAssetFormationChart.querySelector(".dashboard-bar-chart-press-tooltip");
    if (!(tooltip instanceof HTMLElement)) {
      tooltip = document.createElement("p");
      tooltip.className = "dashboard-bar-chart-press-tooltip";
      tooltip.setAttribute("aria-live", "polite");
      dashboardAssetFormationChart.appendChild(tooltip);
    }
    tooltip.textContent = `${age}歳 ${numberWithComma.format(amount)}円`;
    tooltip.classList.add("is-visible");

    const chartRect = dashboardAssetFormationChart.getBoundingClientRect();
    const barRect = barElement.getBoundingClientRect();
    const barCenterX = barRect.left - chartRect.left + barRect.width / 2;
    const topPadding = 8;
    const edgePadding = 8;
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const maxLeft = Math.max(edgePadding, chartRect.width - tooltipWidth - edgePadding);
    const left = Math.min(Math.max(barCenterX - tooltipWidth / 2, edgePadding), maxLeft);
    const barTop = barRect.top - chartRect.top;
    const preferredTop = barTop - tooltipHeight - 8;
    const top = preferredTop >= topPadding ? preferredTop : topPadding;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };
  const togglePressedValue = (barElement, age, amount, index) => {
    if (selectedBarIndex === index) {
      hidePressedValue();
      return;
    }
    showPressedValue(barElement, age, amount, index);
  };

  const yAxisSvg = document.createElementNS(svgNS, "svg");
  yAxisSvg.setAttribute("viewBox", `0 0 ${fixedAxisWidth} ${chartHeight}`);
  yAxisSvg.setAttribute("aria-hidden", "true");
  yAxisSvg.classList.add("dashboard-asset-formation-chart-y-axis-svg");
  yAxisSvg.style.width = `${fixedAxisWidth}px`;
  yAxisSvg.style.height = `${chartHeight}px`;

  const plotSvg = document.createElementNS(svgNS, "svg");
  plotSvg.setAttribute("viewBox", `0 0 ${scrollChartWidth} ${chartHeight}`);
  plotSvg.setAttribute("role", "img");
  plotSvg.setAttribute("aria-label", metric.ariaLabel);
  plotSvg.classList.add("dashboard-asset-formation-chart-svg");
  plotSvg.style.width = `${scrollChartWidth}px`;
  plotSvg.style.minWidth = `${minScrollableWidth}px`;
  plotSvg.style.height = `${chartHeight}px`;

  for (let tick = 0; tick <= yTickCount; tick += 1) {
    const value = yMin + tick * yStep;
    const y = yPosition(value);

    const yLabel = document.createElementNS(svgNS, "text");
    yLabel.setAttribute("x", String(fixedAxisWidth - 8));
    yLabel.setAttribute("y", String(y + 4));
    yLabel.setAttribute("text-anchor", "end");
    yLabel.setAttribute("class", "dashboard-bar-chart-y-label");
    yLabel.textContent = formatYenAsManYenLabel(value);
    yAxisSvg.appendChild(yLabel);

    const grid = document.createElementNS(svgNS, "line");
    grid.setAttribute("x1", "0");
    grid.setAttribute("x2", String(plotWidth));
    grid.setAttribute("y1", String(y));
    grid.setAttribute("y2", String(y));
    grid.setAttribute("class", "dashboard-bar-chart-grid-line");
    plotSvg.appendChild(grid);
  }

  points.forEach((point, index) => {
    const amount = point.amount;
    const xCenter = slotWidth * index + slotWidth / 2;
    const zeroY = yPosition(0);
    const valueY = yPosition(amount);
    const barHeight = Math.max(1, Math.abs(zeroY - valueY));
    const y = amount >= 0 ? zeroY - barHeight : zeroY;
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", String(xCenter - barWidth / 2));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(barWidth));
    rect.setAttribute("height", String(barHeight));
    const isNegativeBar = amount < 0;
    rect.setAttribute("rx", "4");
    rect.classList.add("dashboard-bar-chart-bar");
    if (isNegativeBar) {
      rect.classList.add("is-negative");
    }
    rect.setAttribute("tabindex", "0");
    rect.setAttribute("role", "button");
    rect.setAttribute("aria-label", `${point.age}歳 ${numberWithComma.format(amount)}円`);
    rect.addEventListener("click", () => {
      togglePressedValue(rect, point.age, amount, index);
    });
    rect.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        togglePressedValue(rect, point.age, amount, index);
      } else if (event.key === "Escape") {
        hidePressedValue();
      }
    });
    plotSvg.appendChild(rect);

    const xLabel = document.createElementNS(svgNS, "text");
    xLabel.setAttribute("x", String(xCenter));
    xLabel.setAttribute("y", String(chartHeight - 24));
    xLabel.setAttribute("text-anchor", "middle");
    xLabel.setAttribute("class", "dashboard-bar-chart-x-label");
    xLabel.textContent = String(point.year);
    plotSvg.appendChild(xLabel);
  });

  const axisY = document.createElementNS(svgNS, "line");
  axisY.setAttribute("x1", String(fixedAxisWidth - 2));
  axisY.setAttribute("x2", String(fixedAxisWidth - 2));
  axisY.setAttribute("y1", String(margin.top));
  axisY.setAttribute("y2", String(margin.top + plotHeight));
  axisY.setAttribute("class", "dashboard-bar-chart-axis");
  yAxisSvg.appendChild(axisY);

  const plotAxisY = document.createElementNS(svgNS, "line");
  plotAxisY.setAttribute("x1", "0");
  plotAxisY.setAttribute("x2", "0");
  plotAxisY.setAttribute("y1", String(margin.top));
  plotAxisY.setAttribute("y2", String(margin.top + plotHeight));
  plotAxisY.setAttribute("class", "dashboard-bar-chart-axis");
  plotSvg.appendChild(plotAxisY);

  const axisX = document.createElementNS(svgNS, "line");
  axisX.setAttribute("x1", "0");
  axisX.setAttribute("x2", String(plotWidth));
  axisX.setAttribute("y1", String(yPosition(0)));
  axisX.setAttribute("y2", String(yPosition(0)));
  axisX.setAttribute("class", "dashboard-bar-chart-axis");
  plotSvg.appendChild(axisX);

  const chartLayout = document.createElement("div");
  chartLayout.className = "dashboard-asset-formation-chart-layout";
  chartLayout.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".dashboard-bar-chart-bar")) return;
    hidePressedValue();
  });
  const fixedAxisPane = document.createElement("div");
  fixedAxisPane.className = "dashboard-asset-formation-chart-fixed-axis";
  fixedAxisPane.appendChild(yAxisSvg);
  chartLayout.appendChild(fixedAxisPane);

  const scrollPane = document.createElement("div");
  scrollPane.className = "dashboard-asset-formation-chart-scroll-pane";
  scrollPane.addEventListener("scroll", hidePressedValue, { passive: true });
  scrollPane.addEventListener("touchmove", hidePressedValue, { passive: true });
  const scrollContent = document.createElement("div");
  scrollContent.className = "dashboard-asset-formation-chart-scroll-content";
  scrollContent.style.minWidth = `${minScrollableWidth}px`;
  scrollContent.appendChild(plotSvg);
  scrollPane.appendChild(scrollContent);
  chartLayout.appendChild(scrollPane);
  dashboardAssetFormationChart.appendChild(chartLayout);
}

function updateDashboardAssetGrowthMetricToggleUI() {
  if (!assetGrowthMetricToggle) return;
  const buttons = assetGrowthMetricToggle.querySelectorAll("[data-asset-growth-metric]");
  buttons.forEach((button) => {
    const isActive = button.dataset.assetGrowthMetric === dashboardAssetGrowthMetric;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function handleAssetGrowthMetricToggleClick(event) {
  const targetButton = event.target.closest("[data-asset-growth-metric]");
  if (!targetButton) return;
  const metricKey = targetButton.dataset.assetGrowthMetric;
  if (!DASHBOARD_ASSET_GROWTH_METRICS[metricKey]) return;
  if (dashboardAssetGrowthMetric === metricKey) return;
  dashboardAssetGrowthMetric = metricKey;
  updateDashboardAssetGrowthMetricToggleUI();
  render();
}

function renderDashboard({
  summary,
  settings,
  transactions,
  recurringExpenses,
  lifeEvents,
  expenseComposition,
  monthlySavingTotal,
  chipMonthlySavingTotal,
  manualTransactionCount,
  monthCount,
}) {
  const normalizedMonthlySavingTotal = Math.max(Number(chipMonthlySavingTotal) || 0, 0);
  if (assetGrowthMonthlyChip) {
    assetGrowthMonthlyChip.textContent = `毎月の積立額: ¥${numberWithComma.format(normalizedMonthlySavingTotal)}`;
  }
  const assumptions = loadCashflowAssumptions();
  const cashflowRows = buildCashflowRowsUntilAge({
    settings,
    transactions,
    recurringExpenses,
    lifeEvents,
    assumptions,
    targetAge: TARGET_AGE_SECONDARY,
  });
  dashboardIncomeTotal.textContent = yen.format(summary.income);
  dashboardExpenseTotal.textContent = yen.format(summary.expense);
  dashboardBalanceTotal.textContent = yen.format(summary.endingBalance);
  const age65AssetFormationBalance = calculateAssetFormationBalanceAtAge({
    settings,
    transactions,
    recurringExpenses,
    lifeEvents,
    assumptions,
    targetAge: TARGET_AGE_SECONDARY,
  });
  if (dashboardAge65Total) {
    dashboardAge65Total.textContent = yen.format(age65AssetFormationBalance);
  }
  dashboardDiagnosisComment.textContent = createDashboardDiagnosisComment({
    summary,
    monthlySavingTotal,
    manualTransactionCount,
    expenseComposition,
  });
  if (monthCount > 0) {
    dashboardDiagnosisComment.textContent = `平均対象 ${monthCount}か月。${dashboardDiagnosisComment.textContent}`;
  }
  renderDashboardAssetFormationChart(cashflowRows, dashboardAssetGrowthMetric);
  updateDashboardAssetGrowthMetricToggleUI();
}

function renderExpenseChart(expenseComposition, isAverageMode) {
  expenseChart.innerHTML = "";
  expenseChart.classList.toggle("has-data", false);
  const chartLayout = document.createElement("div");
  chartLayout.className = "expense-analysis-layout";
  if (expenseComposition.totalExpense === 0 || expenseComposition.entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = isAverageMode ? "平均対象期間の支出データがありません。" : "この月の支出データはありません。";
    chartLayout.appendChild(empty);
    expenseChart.appendChild(chartLayout);
    return;
  }

  expenseChart.classList.toggle("has-data", true);
  let currentDegree = 0;
  const segments = expenseComposition.entries.map((entry, index) => {
    const degree = (entry.amount / expenseComposition.totalExpense) * 360;
    const start = currentDegree;
    const end = currentDegree + degree;
    currentDegree = end;
    return `${EXPENSE_CHART_COLORS[index % EXPENSE_CHART_COLORS.length]} ${start}deg ${end}deg`;
  });

  const chartStage = document.createElement("div");
  chartStage.className = "expense-chart-stage";

  const pieWrap = document.createElement("div");
  pieWrap.className = "pie-wrap expense-chart-frame";

  const pieChart = document.createElement("div");
  pieChart.className = "pie-chart";
  pieChart.style.background = `conic-gradient(${segments.join(", ")})`;

  const pieCenter = document.createElement("div");
  pieCenter.className = "pie-center";
  pieCenter.innerHTML = `<span>${isAverageMode ? "月平均" : "合計"}</span><strong>${yen.format(expenseComposition.totalExpense)}</strong>`;

  pieChart.appendChild(pieCenter);
  pieWrap.appendChild(pieChart);
  chartStage.appendChild(pieWrap);
  chartLayout.appendChild(chartStage);

  const legend = document.createElement("ul");
  legend.className = "pie-legend expense-chart-legend";

  expenseComposition.entries.forEach(({ name, amount, ratio }, index) => {
    const item = document.createElement("li");
    item.className = "pie-legend-item";
    item.innerHTML = `
      <span class="dot" style="background:${EXPENSE_CHART_COLORS[index % EXPENSE_CHART_COLORS.length]}"></span>
      <span class="category">${name}</span>
      <span class="value">${yen.format(amount)}</span>
      <strong class="ratio">${ratio.toFixed(1)}%</strong>
    `;
    legend.appendChild(item);
  });

  chartLayout.appendChild(legend);
  expenseChart.appendChild(chartLayout);
}

function createPieChartElements(entries, total, options = {}) {
  const chartColors = options.colors || ASSET_PIE_COLORS;
  const formatCategoryLabel = typeof options.formatCategoryLabel === "function"
    ? options.formatCategoryLabel
    : (name) => name;
  let currentDegree = 0;
  const segments = entries.map(([, amount], index) => {
    const ratio = amount / total;
    const degree = ratio * 360;
    const start = currentDegree;
    const end = currentDegree + degree;
    currentDegree = end;
    return `${chartColors[index % chartColors.length]} ${start}deg ${end}deg`;
  });

  const pieWrap = document.createElement("div");
  pieWrap.className = "pie-wrap";

  const pieChart = document.createElement("div");
  pieChart.className = "pie-chart";
  pieChart.style.background = `conic-gradient(${segments.join(", ")})`;

  const pieCenter = document.createElement("div");
  pieCenter.className = "pie-center";
  pieCenter.innerHTML = `<span>${options.centerLabel || "合計"}</span><strong>${yen.format(total)}</strong>`;
  pieChart.appendChild(pieCenter);
  pieWrap.appendChild(pieChart);

  const legend = document.createElement("ul");
  legend.className = "pie-legend";
  entries.forEach(([name, amount], index) => {
    const ratio = total === 0 ? 0 : (amount / total) * 100;
    const item = document.createElement("li");
    item.className = "pie-legend-item";
    const formattedName = formatCategoryLabel(name);
    item.innerHTML = `
      <span class="dot" style="background:${chartColors[index % chartColors.length]}"></span>
      <span class="category">${formattedName}</span>
      <div class="pie-legend-item-metrics">
        <span class="value">${yen.format(amount)}</span>
        <strong class="ratio">${ratio.toFixed(1)}%</strong>
      </div>
    `;

    legend.appendChild(item);
  });

  return { pieWrap, legend };
}

function setupFormattedAmountInput(input, { allowZero = false } = {}) {
  if (!input) return;
  input.addEventListener("input", () => {
    const amount = parseAmountInput(input.value);
    if (amount > 0) {
      input.dataset.rawValue = String(amount);
      return;
    }
    if (allowZero && amount === 0 && String(input.value ?? "").trim() !== "") {
      input.dataset.rawValue = "0";
      return;
    }
    input.dataset.rawValue = "";
  });
  input.addEventListener("blur", () => {
    input.value = formatAmountInputValue(input.value, { allowZero });
  });
  input.addEventListener("focus", () => {
    const amount = parseAmountInput(input.value);
    if (amount > 0) {
      input.value = String(amount);
      return;
    }
    if (allowZero && amount === 0 && String(input.value ?? "").trim() !== "") {
      input.value = "0";
      return;
    }
    input.value = "";
  });
}

function calculateAge(birthDate) {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const hadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hadBirthday) age -= 1;
  return Math.max(age, 0);
}

function splitAssetCategoryLabel(name) {
  const rawLabel = typeof name === "string" ? name.trim() : "";
  if (!rawLabel) return { kind: "", identifier: "" };
  const matched = rawLabel.match(/^(?<kind>[^（(]+?)(?<identifier>（.+）|\(.+\))$/);
  if (!matched?.groups) {
    return { kind: rawLabel, identifier: "" };
  }

  const kind = matched.groups.kind.trim();
  const identifier = matched.groups.identifier.trim();
  if (!kind || !identifier) {
    return { kind: rawLabel, identifier: "" };
  }
  return { kind, identifier };
}

function formatAssetCompositionCategoryLabel(name) {
  const { kind, identifier } = splitAssetCategoryLabel(name);
  if (!kind) return "";
  if (!identifier) return `<span class="category-main">${kind}</span>`;
  return `<span class="category-main">${kind}</span><span class="category-note">${identifier}</span>`;
}

function formatAssetContractLabel(type, name) {
  const contractLabel = `${type}${name ? `（${name}）` : ""}`;
  return formatAssetCompositionCategoryLabel(contractLabel);
}

function calculateAverageMonthlyAmount(transactions, {
  startMonth,
  endMonth,
  type,
  categories,
  divisorMode = "enteredMonths",
}) {
  if (!parseMonth(startMonth) || !parseMonth(endMonth) || compareMonth(startMonth, endMonth) > 0) return 0;
  const filteredTransactions = (Array.isArray(transactions) ? transactions : []).filter((item) => {
    const month = monthISO(item?.date);
    if (!parseMonth(month)) return false;
    if (compareMonth(month, startMonth) < 0 || compareMonth(month, endMonth) > 0) return false;
    if (item?.type !== type) return false;
    if (Array.isArray(categories) && !categories.includes(item?.category)) return false;
    return true;
  });

  const enteredMonths = new Set(
    filteredTransactions.map((item) => monthISO(item.date)).filter((month) => parseMonth(month))
  );
  const enteredMonthCount = enteredMonths.size;
  const periodMonthCount = monthsBetweenInclusive(startMonth, endMonth);
  const divisor = divisorMode === "periodMonths" ? periodMonthCount : enteredMonthCount;
  if (!Number.isFinite(divisor) || divisor <= 0) return 0;
  if (divisorMode !== "periodMonths" && enteredMonthCount <= 0) return 0;

  const total = filteredTransactions.reduce((sum, item) => {
    const amount = Number(item?.amount);
    if (!Number.isFinite(amount)) return sum;
    return sum + amount;
  }, 0);
  if (!Number.isFinite(total)) return 0;

  return total / divisor;
}

function resolveCashflowAverageEndMonth(transactions, startMonth) {
  if (!parseMonth(startMonth)) return "";
  return subtractOneMonth(todayISO().slice(0, 7));
}

function getRecurringExpenseMonthsInYear(item, year) {
  const itemStart = parseMonth(item.startMonth);
  if (!itemStart) return 0;
  const start = formatMonth(year, 0);
  const end = formatMonth(year, 11);
  let effectiveStart = compareMonth(item.startMonth, start) > 0 ? item.startMonth : start;
  let effectiveEnd = end;
  if (parseMonth(item.endMonth) && compareMonth(item.endMonth, effectiveEnd) < 0) {
    effectiveEnd = item.endMonth;
  }
  if (compareMonth(effectiveStart, effectiveEnd) > 0) return 0;
  return monthsBetweenInclusive(effectiveStart, effectiveEnd);
}

function calculateAnnualRecurringExpenseForYear(recurringExpenses, year, yearStartMonth, yearEndMonth) {
  if (!Number.isInteger(year) || !parseMonth(yearStartMonth) || !parseMonth(yearEndMonth)) return 0;
  if (compareMonth(yearStartMonth, yearEndMonth) > 0) return 0;

  return (Array.isArray(recurringExpenses) ? recurringExpenses : []).reduce((sum, item) => {
    const monthlyAmount = Math.max(Number(item?.amount) || 0, 0);
    if (monthlyAmount <= 0) return sum;
    if (getRecurringExpenseMonthsInYear(item, year) <= 0) return sum;

    let monthsWithinYearRange = 0;
    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      const month = formatMonth(year, monthIndex);
      if (compareMonth(month, yearStartMonth) < 0 || compareMonth(month, yearEndMonth) > 0) continue;
      if (!isRecurringExpenseActiveOnMonth(item, month)) continue;
      monthsWithinYearRange += 1;
    }
    return sum + (monthlyAmount * monthsWithinYearRange);
  }, 0);
}

function isRecurringExpenseActiveOnMonth(item, month) {
  if (!parseMonth(month)) return false;
  if (!parseMonth(item?.startMonth)) return false;
  if (compareMonth(item.startMonth, month) > 0) return false;
  if (parseMonth(item.endMonth) && compareMonth(item.endMonth, month) < 0) return false;
  return true;
}

function resolveAgeAtYear(birthDate, year) {
  const birth = parseBirthDate(birthDate);
  if (!birth) return null;
  return year - birth.getFullYear();
}

function shouldApplyPlanContributionForMonth(plan, _birthDate, month) {
  const contributionEndMonth = resolvePlanContributionEndMonth(plan);
  if (!contributionEndMonth) return true;
  return compareMonth(month, contributionEndMonth) <= 0;
}

function countPlanContributionMonthsInYear(plan, birthDate, year) {
  let months = 0;
  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    const month = formatMonth(year, monthIndex);
    if (shouldApplyPlanContributionForMonth(plan, birthDate, month)) {
      months += 1;
    }
  }
  return months;
}

function calculateAnnualAssetFormationExpense(settings, year, yearStartMonth = formatMonth(year, 0), yearEndMonth = formatMonth(year, 11)) {
  if (!Array.isArray(settings?.plans) || settings.plans.length === 0) return 0;
  if (!Number.isInteger(year) || !parseMonth(yearStartMonth) || !parseMonth(yearEndMonth)) return 0;
  if (compareMonth(yearStartMonth, yearEndMonth) > 0) return 0;

  let total = 0;
  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    const month = formatMonth(year, monthIndex);
    if (compareMonth(month, yearStartMonth) < 0 || compareMonth(month, yearEndMonth) > 0) continue;

    const monthTotal = settings.plans.reduce((sum, plan) => {
      if (!shouldApplyPlanContributionForMonth(plan, settings.birthDate, month)) return sum;
      return sum + findActiveMonthlyContribution(plan, month);
    }, 0);
    total += monthTotal;
  }
  return total;
}

function buildLifeEventTotalsByMonth(lifeEvents, birthDate) {
  if (!parseBirthDate(birthDate)) return { income: {}, expense: {} };
  return (Array.isArray(lifeEvents) ? lifeEvents : []).reduce((map, event) => {
    const month = parseMonth(event?.month) ? event.month : "";
    const amount = Math.max(Number(event?.amount) || 0, 0);
    if (!month || amount <= 0) return map;
    if (event.type === 'income') {
      map.income[month] = (map.income[month] || 0) + amount;
    } else if (event.type === 'expense') {
      map.expense[month] = (map.expense[month] || 0) + amount;
    }
    return map;
  }, { income: {}, expense: {} });
}

function buildPlannedExtraTotalsByMonth(transactions, startMonth) {
  if (!parseMonth(startMonth)) return { income: {}, expense: {} };
  return (Array.isArray(transactions) ? transactions : []).reduce((map, item) => {
    if (!item?.date || item.isAutoGenerated) return map;
    const month = monthISO(item.date);
    if (!parseMonth(month) || compareMonth(month, startMonth) < 0) return map;

    const amount = Math.max(Number(item.amount) || 0, 0);
    if (amount <= 0) return map;

    const isPlannedExtraIncome = item.type === "income"
      && (item.category === "臨時収入" || item.category === "入金");
    const isPlannedExtraExpense = item.type === "expense" && item.category === "臨時支出";
    if (!isPlannedExtraIncome && !isPlannedExtraExpense) return map;

    if (isPlannedExtraIncome) {
      map.income[month] = (map.income[month] || 0) + amount;
    }
    if (isPlannedExtraExpense) {
      map.expense[month] = (map.expense[month] || 0) + amount;
    }
    return map;
  }, { income: {}, expense: {} });
}

function buildAssetWithdrawalTransfersByMonth(settings) {
  if (!Array.isArray(settings?.plans) || settings.plans.length === 0) return {};
  return settings.plans.reduce((map, plan) => {
    const withdrawTargetMonth = resolveWithdrawExecutionMonth(plan);
    if (!withdrawTargetMonth) return map;

    const projection = projectPlanAssetDetails(plan, settings.birthDate, withdrawTargetMonth);
    const amount = Math.max(Number(projection?.amount) || 0, 0);
    if (amount <= 0) return map;

    map[withdrawTargetMonth] = (map[withdrawTargetMonth] || 0) + amount;
    return map;
  }, {});
}

function buildAssetLumpInvestmentsByMonth(settings) {
  if (!Array.isArray(settings?.plans) || settings.plans.length === 0) return {};
  return settings.plans.reduce((map, plan) => {
    const lumpSums = Array.isArray(plan?.lumpSums) ? plan.lumpSums : [];
    lumpSums.forEach((history) => {
      if (!parseMonth(history.month)) return;
      const amount = Math.max(Number(history.amount) || 0, 0);
      if (amount <= 0) return;
      map[history.month] = (map[history.month] || 0) + amount;
    });
    return map;
  }, {});
}

function sumMonthlyAmountsInYear(monthlyMap, year, startMonth, endMonth) {
  if (!monthlyMap || !Number.isFinite(year)) return 0;
  let total = 0;
  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    const month = formatMonth(year, monthIndex);
    if (startMonth && compareMonth(month, startMonth) < 0) continue;
    if (endMonth && compareMonth(month, endMonth) > 0) continue;
    total += monthlyMap[month] || 0;
  }
  return total;
}

function sortCashflowIncomeScenarios(scenarios = []) {
  return [...scenarios]
    .filter((scenario) => parseMonth(scenario?.startMonth))
    .sort((a, b) => compareMonth(a.startMonth, b.startMonth));
}

function sortCashflowExpenseScenarios(scenarios = []) {
  return [...scenarios]
    .filter((scenario) => parseMonth(scenario?.startMonth))
    .sort((a, b) => compareMonth(a.startMonth, b.startMonth));
}

function calculateScenarioMonthlyIncomeAtMonth(scenario, month) {
  const target = parseMonth(month);
  const start = parseMonth(scenario?.startMonth);
  if (!target || !start || compareMonth(month, scenario.startMonth) < 0) return 0;
  const baseMonthlyTakeHome = Math.max(Number(scenario?.monthlyTakeHome) || 0, 0);
  if (baseMonthlyTakeHome <= 0) return 0;

  const elapsedMonths = (target.year - start.year) * 12 + (target.monthIndex - start.monthIndex);
  const elapsedYears = Math.floor(Math.max(elapsedMonths, 0) / 12);
  const annualMaintenanceRate = Math.max(
    parseRateInput(scenario?.annualIncomeMaintenanceRate, DEFAULT_CASHFLOW_INCOME_MAINTENANCE_RATE),
    0
  );
  return baseMonthlyTakeHome * ((annualMaintenanceRate / 100) ** elapsedYears);
}

function resolveMonthlyIncomeAmount({
  month,
  defaultMonthlyIncome = 0,
  defaultIncomeGrowthRate = 0,
  cashflowStartMonth = "",
  incomeSettings,
}) {
  const parsedMonth = parseMonth(month);
  if (!parsedMonth) return 0;

  const retirementMonth = parseMonth(incomeSettings?.retirementMonth) ? incomeSettings.retirementMonth : "";
  const isAfterCurrentWorkStyle = retirementMonth && compareMonth(month, retirementMonth) > 0;
  if (!isAfterCurrentWorkStyle) {
    const parsedStartMonth = parseMonth(cashflowStartMonth);
    if (!parsedStartMonth) return defaultMonthlyIncome;
    const elapsedMonths = (parsedMonth.year - parsedStartMonth.year) * 12 + (parsedMonth.monthIndex - parsedStartMonth.monthIndex);
    const elapsedYears = Math.floor(Math.max(elapsedMonths, 0) / 12);
    return defaultMonthlyIncome * ((1 + defaultIncomeGrowthRate) ** elapsedYears);
  }

  const sortedScenarios = sortCashflowIncomeScenarios(incomeSettings?.scenarios || []);
  const activeScenario = sortedScenarios.reduce((latest, scenario) => {
    if (compareMonth(scenario.startMonth, month) > 0) return latest;
    return scenario;
  }, null);
  if (!activeScenario) return 0;
  return calculateScenarioMonthlyIncomeAtMonth(activeScenario, month);
}

function calculateScenarioMonthlyExpenseAtMonth(scenario, month, inflationRate = 0) {
  const target = parseMonth(month);
  const start = parseMonth(scenario?.startMonth);
  if (!target || !start || compareMonth(month, scenario.startMonth) < 0) return 0;

  const baseMonthlyExpense = Math.max(Number(scenario?.monthlyExpense) || 0, 0);
  if (baseMonthlyExpense <= 0) return 0;

  const elapsedMonths = (target.year - start.year) * 12 + (target.monthIndex - start.monthIndex);
  const elapsedYears = Math.floor(Math.max(elapsedMonths, 0) / 12);
  return baseMonthlyExpense * ((1 + inflationRate) ** elapsedYears);
}

function resolveMonthlyRegularExpenseAmount({
  month,
  defaultMonthlyRegularExpense = 0,
  cashflowStartMonth = "",
  inflationRate = 0,
  sortedExpenseScenarios = [],
}) {
  if (!parseMonth(month)) return 0;

  const activeScenario = sortedExpenseScenarios.reduce((latest, scenario) => {
    if (compareMonth(scenario.startMonth, month) > 0) return latest;
    return scenario;
  }, null);
  if (activeScenario) {
    return calculateScenarioMonthlyExpenseAtMonth(activeScenario, month, inflationRate);
  }

  const parsedStartMonth = parseMonth(cashflowStartMonth);
  const parsedTargetMonth = parseMonth(month);
  if (!parsedStartMonth || !parsedTargetMonth) return 0;
  const elapsedMonths = (parsedTargetMonth.year - parsedStartMonth.year) * 12
    + (parsedTargetMonth.monthIndex - parsedStartMonth.monthIndex);
  const elapsedYears = Math.floor(Math.max(elapsedMonths, 0) / 12);
  return defaultMonthlyRegularExpense * ((1 + inflationRate) ** elapsedYears);
}

function buildCashflowRowsUntilAge({
  settings,
  transactions,
  recurringExpenses,
  lifeEvents,
  assumptions,
  targetAge = RETIREMENT_REFERENCE_AGE,
}) {
  const birth = parseBirthDate(settings.birthDate);
  if (!birth) return [];

  const referenceDate = resolveReferenceDateByAge(settings.birthDate, targetAge);
  if (!referenceDate) return [];
  const referenceYear = referenceDate.getFullYear();
  const referenceMonth = formatMonth(referenceYear, referenceDate.getMonth());

  const cashflowStartMonth = resolveEntryStartMonth(settings, transactions);
  const parsedCashflowStartMonth = parseMonth(cashflowStartMonth);
  if (!parsedCashflowStartMonth) return [];
  const startYear = parsedCashflowStartMonth.year;
  const endYear = referenceYear;
  if (startYear > endYear) return [];

  const averageStartMonth = cashflowStartMonth;
  const averageEndMonth = resolveCashflowAverageEndMonth(transactions, cashflowStartMonth);
  const cashflowStartDate = `${cashflowStartMonth}-01`;
  const currentAge = resolveAgeAtDate(settings.birthDate, cashflowStartDate) ?? calculateAge(settings.birthDate);

  const monthlyIncome = calculateAverageMonthlyAmount(transactions, {
    startMonth: averageStartMonth,
    endMonth: averageEndMonth,
    type: 'income',
    categories: ['定期収入'],
  });
  const monthlyRegularExpense = calculateAverageMonthlyAmount(transactions, {
    startMonth: averageStartMonth,
    endMonth: averageEndMonth,
    type: 'expense',
    categories: EXPENSE_CATEGORIES,
    divisorMode: "periodMonths",
  });
  const safeMonthlyIncome = Number.isFinite(monthlyIncome) ? monthlyIncome : 0;
  const safeMonthlyRegularExpense = Number.isFinite(monthlyRegularExpense) ? monthlyRegularExpense : 0;

  const inflationRate = parseRateInput(assumptions?.inflationRate) / 100;
  const incomeSettings = loadCashflowIncomeSettings();
  const expenseSettings = loadCashflowExpenseSettings();
  const sortedExpenseScenarios = sortCashflowExpenseScenarios(expenseSettings?.scenarios || []);
  const hasExpenseScenarios = sortedExpenseScenarios.length > 0;
  const lifeEventByMonth = buildLifeEventTotalsByMonth(lifeEvents, settings.birthDate);
  const plannedExtraByMonth = buildPlannedExtraTotalsByMonth(transactions, averageStartMonth);
  const assetWithdrawalTransfersByMonth = buildAssetWithdrawalTransfersByMonth(settings);
  const assetLumpInvestmentsByMonth = buildAssetLumpInvestmentsByMonth(settings);

  const initialBalance = calculateCarryover(transactions, settings, cashflowStartMonth);
  const rows = [];
  let endingBalance = initialBalance;
  const defaultIncomeGrowthRate = parseRateInput(assumptions?.salaryGrowthRateBefore60) / 100;

  for (let year = startYear; year <= endYear; year += 1) {
    const age = resolveAgeAtYear(settings.birthDate, year);
    if (!Number.isFinite(age) || age < currentAge || age > targetAge) continue;

    const isReferenceYear = year === referenceYear;
    const activeMonthsInYear = isReferenceYear ? (referenceDate.getMonth() + 1) : 12;
    const yearProgressRate = activeMonthsInYear / 12;

    const yearStartMonth = year === startYear ? cashflowStartMonth : formatMonth(year, 0);
    const yearEndMonth = isReferenceYear ? referenceMonth : formatMonth(year, 11);
    const activeMonths = getMonthRangeInclusive(yearStartMonth, yearEndMonth);
    const annualIncome = Math.round(activeMonths.reduce((sum, month) => (
      sum + resolveMonthlyIncomeAmount({
        month,
        defaultMonthlyIncome: safeMonthlyIncome,
        defaultIncomeGrowthRate,
        cashflowStartMonth,
        incomeSettings,
      })
    ), 0));
    const yearOffset = year - startYear;
    const annualRegularExpense = hasExpenseScenarios
      ? Math.round(activeMonths.reduce((sum, month) => (
        sum + resolveMonthlyRegularExpenseAmount({
          month,
          defaultMonthlyRegularExpense: safeMonthlyRegularExpense,
          cashflowStartMonth,
          inflationRate,
          sortedExpenseScenarios,
        })
      ), 0))
      : Math.round(safeMonthlyRegularExpense * activeMonthsInYear * ((1 + inflationRate) ** yearOffset));

    const annualAssetFormationExpense = calculateAnnualAssetFormationExpense(
      settings,
      year,
      yearStartMonth,
      yearEndMonth
    );
    const annualRecurringExpense = Math.round(
      calculateAnnualRecurringExpenseForYear(recurringExpenses, year, yearStartMonth, yearEndMonth)
    );
    const annualLumpInvestmentExpense = sumMonthlyAmountsInYear(assetLumpInvestmentsByMonth, year, yearStartMonth, yearEndMonth);

    const annualLifeEventIncome = sumMonthlyAmountsInYear(
      lifeEventByMonth.income,
      year,
      yearStartMonth,
      yearEndMonth
    );
    const annualLifeEventExpense = sumMonthlyAmountsInYear(
      lifeEventByMonth.expense,
      year,
      yearStartMonth,
      yearEndMonth
    );
    const annualPlannedExtraIncome = sumMonthlyAmountsInYear(
      plannedExtraByMonth.income,
      year,
      yearStartMonth,
      yearEndMonth
    );
    const annualPlannedExtraExpense = sumMonthlyAmountsInYear(
      plannedExtraByMonth.expense,
      year,
      yearStartMonth,
      yearEndMonth
    );
    const annualExtraIncome = annualLifeEventIncome + annualPlannedExtraIncome;
    const annualExtraExpense = annualLifeEventExpense + annualPlannedExtraExpense;
    const annualAssetWithdrawalTransfer = sumMonthlyAmountsInYear(
      assetWithdrawalTransfersByMonth,
      year,
      yearStartMonth,
      yearEndMonth
    );
    const annualTotalIncome = annualIncome
      + annualAssetWithdrawalTransfer
      + annualExtraIncome;
    const annualTotalExpense = annualRegularExpense
      + annualRecurringExpense
      + annualAssetFormationExpense
      + annualLumpInvestmentExpense
      + annualExtraExpense;
    const annualBalance = annualTotalIncome - annualTotalExpense;
    endingBalance += annualBalance;
    const rowTargetMonth = isReferenceYear ? referenceMonth : formatMonth(year, 11);
    const assetFormationBalance = calculateFinancialAssetTotalAtMonth(settings, rowTargetMonth);
    const financialAssetTotal = endingBalance + assetFormationBalance;

    rows.push({
      year,
      age,
      annualIncome,
      annualRegularExpense,
      annualRecurringExpense,
      annualAssetFormationExpense,
      annualLumpInvestmentExpense,
      annualExtraIncome,
      annualExtraExpense,
      annualAssetWithdrawalTransfer,
      annualBalance,
      endingBalance,
      assetFormationBalance,
      financialAssetTotal,
    });
  }

  return rows;
}

function buildCashflowRows({ settings, transactions, recurringExpenses, lifeEvents, assumptions }) {
  return buildCashflowRowsUntilAge({
    settings,
    transactions,
    recurringExpenses,
    lifeEvents,
    assumptions,
    targetAge: TARGET_AGE_SECONDARY,
  });
}

function renderCashflowTable({ settings, transactions, recurringExpenses, lifeEvents, assumptions }) {
  if (!cashflowTableWrap) return;
  cashflowTableWrap.innerHTML = '';

  if (!settings.birthDate) {
    cashflowTableWrap.innerHTML = '<p class="chart-empty">生年月日を保存するとキャッシュフロー表を表示できます。</p>';
    return;
  }

  const rows = buildCashflowRows({ settings, transactions, recurringExpenses, lifeEvents, assumptions });
  if (rows.length === 0) {
    cashflowTableWrap.innerHTML = '<p class="chart-empty">対象期間のデータが不足しているため、表を作成できません。</p>';
    return;
  }

  const fixedColumns = [
    {
      label: '年',
      render: (row) => row.year,
    },
    {
      label: '年齢',
      render: (row) => `${row.age}歳`,
    },
  ];
  const scrollColumns = [
    { label: '年収', className: 'is-amount', value: (row) => row.annualIncome, render: (row) => yen.format(row.annualIncome) },
    { label: '資産取崩金', className: 'is-amount', value: (row) => row.annualAssetWithdrawalTransfer, render: (row) => yen.format(row.annualAssetWithdrawalTransfer) },
    { label: '通常支出', className: 'is-amount', value: (row) => row.annualRegularExpense, render: (row) => yen.format(row.annualRegularExpense) },
    { label: '定期支出', className: 'is-amount', value: (row) => row.annualRecurringExpense, render: (row) => yen.format(row.annualRecurringExpense) },
    { label: '積立支出', className: 'is-amount', value: (row) => row.annualAssetFormationExpense, render: (row) => yen.format(row.annualAssetFormationExpense) },
    { label: '一括投資額', className: 'is-amount', value: (row) => row.annualLumpInvestmentExpense, render: (row) => yen.format(row.annualLumpInvestmentExpense) },
    { label: '臨時収入', className: 'is-amount', value: (row) => row.annualExtraIncome, render: (row) => yen.format(row.annualExtraIncome) },
    { label: '臨時支出', className: 'is-amount', value: (row) => row.annualExtraExpense, render: (row) => yen.format(row.annualExtraExpense) },
    {
      label: '収支',
      value: (row) => row.annualBalance,
      className: (row) => `is-amount is-annual-balance ${row.annualBalance >= 0 ? 'is-positive' : 'is-negative'}`,
      render: (row) => yen.format(row.annualBalance),
    },
    {
      label: '残高',
      value: (row) => row.endingBalance,
      className: (row) => `is-amount is-ending-balance ${row.endingBalance >= 0 ? 'is-positive' : 'is-negative'}`,
      render: (row) => yen.format(row.endingBalance),
    },
    {
      label: '資産形成額',
      className: 'is-amount is-asset-formation-balance',
      value: (row) => row.assetFormationBalance,
      render: (row) => yen.format(row.assetFormationBalance),
    },
    {
      label: '金融資産合計',
      className: 'is-amount is-financial-asset-total',
      value: (row) => row.financialAssetTotal,
      render: (row) => yen.format(row.financialAssetTotal),
    },
  ];
  const renderHeaderCells = (columns) => columns.map((column) => `<th>${column.label}</th>`).join('');
  const renderBodyRows = (columns) => rows.map((row) => `
    <tr>
      ${columns.map((column) => {
        const baseClassName = typeof column.className === 'function' ? column.className(row) : (column.className || '');
        const rawValue = typeof column.value === 'function' ? column.value(row) : null;
        const isNegativeValue = Number.isFinite(rawValue) && rawValue < 0;
        const className = isNegativeValue
          ? `${baseClassName} is-negative-value`.trim()
          : baseClassName;
        return `<td${className ? ` class="${className}"` : ''}>${column.render(row)}</td>`;
      }).join('')}
    </tr>
  `).join('');

  const shell = document.createElement('div');
  shell.className = 'cashflow-table-shell';
  const fixedPane = document.createElement('div');
  fixedPane.className = 'cashflow-table-fixed';
  fixedPane.innerHTML = `
    <table class="cashflow-table cashflow-table-fixed-grid">
      <thead>
        <tr>
          ${renderHeaderCells(fixedColumns)}
        </tr>
      </thead>
      <tbody>
        ${renderBodyRows(fixedColumns)}
      </tbody>
    </table>
  `;
  const scrollPane = document.createElement('div');
  scrollPane.className = 'cashflow-table-scroll';
  scrollPane.innerHTML = `
    <table class="cashflow-table cashflow-table-scroll-grid">
      <thead>
        <tr>
          ${renderHeaderCells(scrollColumns)}
        </tr>
      </thead>
      <tbody>
        ${renderBodyRows(scrollColumns)}
      </tbody>
    </table>
  `;
  shell.append(fixedPane, scrollPane);
  cashflowTableWrap.appendChild(shell);
}

function downloadCashflowPdf() {
  const settings = loadSettings();
  const transactions = loadTransactions();
  const recurringExpenses = loadRecurringExpenses();
  const lifeEvents = loadLifeEvents();
  const assumptions = loadCashflowAssumptions();
  const rows = buildCashflowRows({ settings, transactions, recurringExpenses, lifeEvents, assumptions });
  if (rows.length === 0) return;

  const win = window.open('', '_blank');
  if (!win) return;
  const generatedAt = new Date().toLocaleString('ja-JP');
  const bodyRows = rows.map((row) => `
    <tr>
      <td>${row.year}</td>
      <td>${row.age}歳</td>
      <td>${yen.format(row.annualIncome)}</td>
      <td>${yen.format(row.annualAssetWithdrawalTransfer)}</td>
      <td>${yen.format(row.annualRegularExpense)}</td>
      <td>${yen.format(row.annualRecurringExpense)}</td>
      <td>${yen.format(row.annualAssetFormationExpense)}</td>
      <td>${yen.format(row.annualLumpInvestmentExpense)}</td>
      <td>${yen.format(row.annualExtraIncome)}</td>
      <td>${yen.format(row.annualExtraExpense)}</td>
      <td>${yen.format(row.annualBalance)}</td>
      <td>${yen.format(row.endingBalance)}</td>
      <td>${yen.format(row.assetFormationBalance)}</td>
      <td>${yen.format(row.financialAssetTotal)}</td>
    </tr>
  `).join('');

  win.document.write(`<!doctype html><html lang="ja"><head><meta charset="UTF-8" /><title>キャッシュフロー表</title>
    <style>
      @page { size: A4 landscape; margin: 10mm; }
      body { font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif; color: #1d2a3b; font-size: 11px; }
      h1 { font-size: 18px; margin: 0 0 6px; }
      .meta { margin: 0 0 12px; color: #475569; }
      table { width: 100%; border-collapse: collapse; table-layout: fixed; }
      th, td { border: 1px solid #cbd5e1; padding: 6px 8px; white-space: nowrap; }
      th { background: #e2e8f0; }
      td { text-align: right; }
      td:first-child, td:nth-child(2) { text-align: center; }
      tr { page-break-inside: avoid; }
    </style></head><body>
    <h1>キャッシュフロー表</h1>
    <p class="meta">作成日時: ${generatedAt}</p>
    <table>
      <thead><tr><th>年</th><th>年齢</th><th>年収</th><th>資産取崩金</th><th>通常支出</th><th>定期支出</th><th>積立支出</th><th>一括投資額</th><th>臨時収入</th><th>臨時支出</th><th>収支</th><th>残高</th><th>資産形成額</th><th>金融資産合計</th></tr></thead>
      <tbody>${bodyRows}</tbody>
    </table></body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

function parseBirthDate(birthDate) {
  if (typeof birthDate !== "string") return null;
  const match = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, monthIndex, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function resolveTargetAgeDate(birthDate, targetAge) {
  const birth = parseBirthDate(birthDate);
  if (!birth) return null;

  const age = Number(targetAge);
  if (!Number.isFinite(age) || age < 0) return null;

  return new Date(
    birth.getFullYear() + age,
    birth.getMonth(),
    birth.getDate()
  );
}

function resolveReferenceDateByAge(birthDate, targetAge = RETIREMENT_REFERENCE_AGE) {
  const ageDate = resolveTargetAgeDate(birthDate, targetAge);
  if (!ageDate) return null;
  const cutoffDate = new Date(ageDate);
  cutoffDate.setDate(cutoffDate.getDate() - RETIREMENT_REFERENCE_DAY_OFFSET);
  return cutoffDate;
}

function resolveReferenceYearByAge(birthDate, targetAge = RETIREMENT_REFERENCE_AGE) {
  const cutoffDate = resolveReferenceDateByAge(birthDate, targetAge);
  return cutoffDate ? cutoffDate.getFullYear() : null;
}

function resolveReferenceMonthByAge(birthDate, targetAge = RETIREMENT_REFERENCE_AGE) {
  const cutoffDate = resolveReferenceDateByAge(birthDate, targetAge);
  return cutoffDate ? formatMonth(cutoffDate.getFullYear(), cutoffDate.getMonth()) : null;
}

function resolveRetirementReferenceDate(birthDate) {
  return resolveReferenceDateByAge(birthDate, TARGET_AGE_PRIMARY);
}

function resolveRetirementReferenceYear(birthDate) {
  return resolveReferenceYearByAge(birthDate, TARGET_AGE_PRIMARY);
}

function resolveRetirementReferenceMonth(birthDate) {
  return resolveReferenceMonthByAge(birthDate, TARGET_AGE_PRIMARY);
}

function resolveWithdrawExecutionMonth(plan) {
  return parseMonth(plan?.withdrawMonth) ? plan.withdrawMonth : null;
}

function resolvePlanContributionEndMonth(plan) {
  return parseMonth(plan?.withdrawMonth) ? plan.withdrawMonth : null;
}

function resolveProjectionStartMonth(plan, targetMonth) {
  const monthlyStart = (Array.isArray(plan.monthlyContributions) ? plan.monthlyContributions : [])
    .map((history) => history.startMonth)
    .filter((month) => parseMonth(month) && isMonthOnOrAfter(targetMonth, month))
    .sort(compareMonth)[0];

  const lumpStart = (Array.isArray(plan.lumpSums) ? plan.lumpSums : [])
    .map((history) => history.month)
    .filter((month) => parseMonth(month) && isMonthOnOrAfter(targetMonth, month))
    .sort(compareMonth)[0];

  if (!monthlyStart) return lumpStart || null;
  if (!lumpStart) return monthlyStart;
  return compareMonth(monthlyStart, lumpStart) <= 0 ? monthlyStart : lumpStart;
}

function resolvePlanSimulationTargetMonth(plan, baseTargetMonth) {
  if (!baseTargetMonth) return null;

  const withdrawTargetMonth = resolveWithdrawExecutionMonth(plan);
  if (!withdrawTargetMonth) return baseTargetMonth;
  return compareMonth(withdrawTargetMonth, baseTargetMonth) <= 0 ? withdrawTargetMonth : baseTargetMonth;
}

function resolveAsOfDate(asOfDate = null) {
  if (asOfDate instanceof Date && !Number.isNaN(asOfDate.getTime())) return new Date(asOfDate);
  if (typeof asOfDate === "string") {
    const parsed = new Date(`${asOfDate}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

function resolvePlanMonthlyExecutionDate(plan, month) {
  const parsedMonth = parseMonth(month);
  if (!parsedMonth) return null;
  const withdrawalDay = Number(plan?.withdrawalDay);
  if (!Number.isFinite(withdrawalDay)) return null;
  const day = clampDay(parsedMonth.year, parsedMonth.monthIndex + 1, withdrawalDay);
  return new Date(parsedMonth.year, parsedMonth.monthIndex, day);
}

function shouldApplyPlanMonthByAsOfDate(plan, month, asOfDate = null) {
  if (!parseMonth(month)) return false;
  const resolvedAsOfDate = resolveAsOfDate(asOfDate);
  if (!resolvedAsOfDate) return true;

  const asOfMonth = formatMonth(resolvedAsOfDate.getFullYear(), resolvedAsOfDate.getMonth());
  if (compareMonth(month, asOfMonth) < 0) return true;
  if (compareMonth(month, asOfMonth) > 0) return false;

  const executionDate = resolvePlanMonthlyExecutionDate(plan, month);
  if (!executionDate) return false;
  return resolvedAsOfDate.getTime() >= executionDate.getTime();
}

function calculatePlanBalanceAtMonth(plan, birthDate, targetMonth, options = {}) {
  if (!parseMonth(targetMonth)) return 0;

  const withdrawTargetMonth = resolveWithdrawExecutionMonth(plan);
  if (withdrawTargetMonth && compareMonth(targetMonth, withdrawTargetMonth) >= 0) {
    return 0;
  }

  const projection = projectPlanAssetDetails(plan, birthDate, targetMonth, options);
  return Math.max(Number(projection?.amount) || 0, 0);
}

function calculateFinancialAssetTotalAtMonth(settings, targetMonth, options = {}) {
  if (!parseMonth(targetMonth) || !Array.isArray(settings?.plans) || settings.plans.length === 0) return 0;

  return settings.plans.reduce(
    (sum, plan) => sum + calculatePlanBalanceAtMonth(plan, settings.birthDate, targetMonth, options),
    0
  );
}

function buildPlanBalancesAtMonth(settings, targetMonth, options = {}) {
  if (!parseMonth(targetMonth) || !Array.isArray(settings?.plans)) return [];

  return settings.plans.map((plan) => ({
    ...plan,
    projectedAmount: calculatePlanBalanceAtMonth(plan, settings.birthDate, targetMonth, options),
  }));
}

function projectPlanAssetDetails(plan, birthDate, explicitTargetMonth = null, options = {}) {
  const annualReturn = parseRateInput(plan.expectedReturn) / 100;
  const monthlyRate = Math.pow(1 + annualReturn, 1 / 12) - 1;
  const targetMonth = explicitTargetMonth || resolveWithdrawExecutionMonth(plan);
  const asOfDate = resolveAsOfDate(options?.asOfDate);
  if (!targetMonth) {
    return { amount: 0, startMonth: null, targetMonth, months: 0, appliedMonthly: [], appliedLumpSums: [] };
  }

  const startMonth = resolveProjectionStartMonth(plan, targetMonth);
  if (!startMonth || compareMonth(startMonth, targetMonth) > 0) {
    return { amount: 0, startMonth, targetMonth, months: 0, appliedMonthly: [], appliedLumpSums: [] };
  }

  let month = startMonth;
  let total = 0;
  const appliedMonthly = [];
  const appliedLumpSums = [];

  while (compareMonth(month, targetMonth) <= 0) {
    const canApplyMonth = shouldApplyPlanMonthByAsOfDate(plan, month, asOfDate);
    const monthlyAmount = canApplyMonth ? findActiveMonthlyContribution(plan, month) : 0;
    if (monthlyAmount > 0) {
      appliedMonthly.push({ month, amount: monthlyAmount });
      total += monthlyAmount;
    }

    const lumpSums = canApplyMonth ? getLumpSumsOnMonth(plan, month) : [];
    lumpSums.forEach((amount) => {
      if (amount > 0) {
        appliedLumpSums.push({ month, amount });
        total += amount;
      }
    });

    total *= 1 + monthlyRate;
    month = addOneMonth(month);
  }

  return {
    amount: Math.round(total),
    startMonth,
    targetMonth,
    months: monthsBetweenInclusive(startMonth, targetMonth),
    appliedMonthly,
    appliedLumpSums,
  };
}

function resolveCurrentAssetTargetMonth() {
  return todayISO().slice(0, 7);
}

function createAgeLabel(age) {
  return `${age}歳`;
}

function createAssetOutlookPointLabel(age) {
  return `${createAgeLabel(age)}時点`;
}

function createAssetOutlookTotalLabel(age) {
  return `${createAssetOutlookPointLabel(age)}の想定総資産額`;
}

function createAssetOutlookWithdrawTitle(age) {
  return `${createAgeLabel(age)}前に取崩す予定の資産`;
}

function buildAssetOutlookAtAge({
  settings,
  transactions,
  recurringExpenses,
  lifeEvents,
  assumptions,
  targetAge,
}) {
  const targetMonth = resolveReferenceMonthByAge(settings.birthDate, targetAge);
  const referenceYear = resolveReferenceYearByAge(settings.birthDate, targetAge);
  const balanceTargetMonth = targetMonth || (referenceYear ? formatMonth(referenceYear, 11) : null);
  const plansAtAge = settings.plans.map((plan) => {
    const planTargetMonth = resolvePlanSimulationTargetMonth(plan, targetMonth);
    const projection = projectPlanAssetDetails(plan, settings.birthDate, planTargetMonth);
    return {
      ...plan,
      projectedAmount: projection.amount,
      projection,
      isHeldUntilTargetAge: isPlanHeldUntilAge(plan, targetAge, settings.birthDate),
    };
  });
  const planBalancesAtAge = buildPlanBalancesAtMonth(settings, balanceTargetMonth)
    .filter((plan) => plan.projectedAmount > 0);
  const totalAtAge = calculateAssetFormationBalanceAtAge({
    settings,
    transactions,
    recurringExpenses,
    lifeEvents,
    assumptions,
    targetAge,
  });

  return {
    targetAge,
    targetMonth,
    plansAtAge,
    planBalancesAtAge,
    totalAtAge,
  };
}

function renderAssetForecast(settings) {
  if (!assetForecast || !dashboardCurrentAssetForecast || !dashboardAge65AssetForecast || !dashboardWithdrawAssetForecast) return;
  const dashboardCurrentAssetContainer = document.createElement("div");
  assetForecast.innerHTML = "";
  dashboardCurrentAssetForecast.innerHTML = "";
  dashboardAge65AssetForecast.innerHTML = "";
  dashboardWithdrawAssetForecast.innerHTML = "";
  if (assetWithdrawForecast) assetWithdrawForecast.innerHTML = "";
  if (!settings.birthDate || settings.plans.length === 0) {
    const emptyMessage = '<p class="chart-empty">生年月日と積立設定を保存すると、現時点と65歳時点の資産試算が表示されます。</p>';
    assetForecast.innerHTML = emptyMessage;
    dashboardCurrentAssetContainer.innerHTML = emptyMessage;
    dashboardCurrentAssetForecast.innerHTML = emptyMessage;
    dashboardAge65AssetForecast.innerHTML = emptyMessage;
    dashboardWithdrawAssetForecast.innerHTML = emptyMessage;
    if (assetWithdrawForecast) assetWithdrawForecast.innerHTML = emptyMessage;
    return;
  }

  const transactions = loadTransactions();
  const recurringExpenses = loadRecurringExpenses();
  const lifeEvents = loadLifeEvents();
  const assumptions = loadCashflowAssumptions();
  const currentAge = calculateAge(settings.birthDate);
  const currentAssetTargetMonth = resolveCurrentAssetTargetMonth();
  const currentAssetBaseDate = todayISO();
  const secondaryAssetOutlook = buildAssetOutlookAtAge({
    settings,
    transactions,
    recurringExpenses,
    lifeEvents,
    assumptions,
    targetAge: TARGET_AGE_SECONDARY,
  });

  const projectedRowsAt65 = secondaryAssetOutlook.plansAtAge;
  const earlyWithdrawPlans = projectedRowsAt65.filter((plan) => !plan.isHeldUntilTargetAge && plan.projectedAmount > 0);
  const earlyWithdrawPlansForDisplay = earlyWithdrawPlans.map((plan) => {
    const displayTargetMonth = resolveWithdrawExecutionMonth(plan);
    const displayProjection = displayTargetMonth
      ? projectPlanAssetDetails(plan, settings.birthDate, displayTargetMonth)
      : null;
    return {
      ...plan,
      displayProjectedAmount: displayProjection?.amount ?? plan.projectedAmount,
    };
  });

  const currentRows = settings.plans.map((plan) => {
    const currentProjection = projectPlanAssetDetails(plan, settings.birthDate, currentAssetTargetMonth, {
      asOfDate: currentAssetBaseDate,
    });
    return {
      ...plan,
      currentAmount: currentProjection.amount,
      currentProjection,
    };
  });

  const totalAt65 = secondaryAssetOutlook.totalAtAge;
  const planBalancesAt65 = secondaryAssetOutlook.planBalancesAtAge;
  const contractEntriesAt65 = planBalancesAt65
    .filter((plan) => plan.projectedAmount > 0)
    .map((plan) => [`${plan.type}${plan.name ? `（${plan.name}）` : ""}`, plan.projectedAmount]);
  const contractTotalAt65 = contractEntriesAt65.reduce((sum, [, amount]) => sum + amount, 0);

  const typeTotals = PLAN_TYPES.map((type) => {
    const amount = planBalancesAt65
      .filter((plan) => plan.type === type)
      .reduce((sum, plan) => sum + plan.projectedAmount, 0);
    return { type, amount };
  }).filter((item) => item.amount > 0);
  const earlyWithdrawItemsHtml = earlyWithdrawPlansForDisplay
    .map((plan) => {
      const withdrawLabel = parseMonth(plan.withdrawMonth)
        ? formatWithdrawMonthLabelWithAge(plan.withdrawMonth, settings.birthDate)
        : "未設定";
      return `
        <li>
          <div class="asset-withdraw-item-main">
            <span class="asset-withdraw-contract">${formatAssetContractLabel(plan.type, plan.name)}</span>
            <span class="asset-withdraw-age">取崩し: ${withdrawLabel}</span>
          </div>
          <strong>${yen.format(plan.displayProjectedAmount)}</strong>
        </li>
      `;
    })
    .join("");

  const typeTotalsHtml = typeTotals
    .map((item) => `<li><span>${item.type} 合計</span><strong>${yen.format(item.amount)}</strong></li>`)
    .join("");

  assetForecast.innerHTML = `
    <section class="chart asset-composition asset-outlook">
      <p class="section-description">現在年齢: <strong>${currentAge}歳</strong> / ${createAssetOutlookPointLabel(TARGET_AGE_SECONDARY)}の一覧は、キャッシュフロー表の資産形成額と同じ計算条件で表示しています。</p>
      <div class="asset-outlook-summary-grid">
        <div class="asset-total asset-total-compact">${createAssetOutlookTotalLabel(TARGET_AGE_SECONDARY)}: <strong>${yen.format(contractTotalAt65 || totalAt65)}</strong></div>
      </div>
      <h4>${createAssetOutlookPointLabel(TARGET_AGE_SECONDARY)}の想定資産額（契約別）</h4>
      <h4 class="asset-type-breakdown-heading">${createAssetOutlookPointLabel(TARGET_AGE_SECONDARY)}の想定資産額（種別別）</h4>
      ${typeTotalsHtml ? `<ul class="asset-list">${typeTotalsHtml}</ul>` : `<p class="chart-empty">${createAssetOutlookPointLabel(TARGET_AGE_SECONDARY)}の評価対象となる契約はありません。</p>`}
    </section>
  `;

  dashboardCurrentAssetContainer.innerHTML = `
    <section class="chart asset-composition">
      <h4>現状資産の構成比</h4>
      <p class="section-description">現在入力されている資産形成の契約（積立・一括入金）の実績をもとに算出しています（基準日: ${currentAssetBaseDate}）。</p>
    </section>
  `;
  const withdrawForecastHtml = `
    <section class="asset-withdraw-layout asset-outlook">
      <p class="section-description">取崩し予定を設定した契約のみ表示します。取崩年月の変更は「基本情報・資産形成設定」で行えます。</p>
      <h4 class="asset-withdraw-heading">${createAssetOutlookWithdrawTitle(TARGET_AGE_SECONDARY)}</h4>
      ${earlyWithdrawItemsHtml
    ? `<ul class="asset-list asset-withdraw-list" aria-label="${createAssetOutlookWithdrawTitle(TARGET_AGE_SECONDARY)}">${earlyWithdrawItemsHtml}</ul>`
    : `<p class="chart-empty">${createAssetOutlookWithdrawTitle(TARGET_AGE_SECONDARY)}の契約はありません。</p>`}
    </section>
  `;
  dashboardWithdrawAssetForecast.innerHTML = withdrawForecastHtml;
  if (assetWithdrawForecast) {
    assetWithdrawForecast.innerHTML = withdrawForecastHtml;
  }

  const chartSection = dashboardCurrentAssetContainer.querySelector(".asset-composition");
  if (!chartSection) {
    return;
  }
  const formationChartSection = assetForecast.querySelector(".asset-composition");

  const currentTotal = calculateFinancialAssetTotalAtMonth(settings, currentAssetTargetMonth, {
    asOfDate: currentAssetBaseDate,
  });
  if (currentRows.length === 0 || currentTotal === 0) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "データがありません";
    chartSection.appendChild(empty);
    dashboardCurrentAssetForecast.innerHTML = dashboardCurrentAssetContainer.innerHTML;
    dashboardAge65AssetForecast.innerHTML = assetForecast.innerHTML;
    assetForecast.innerHTML = "";
    return;
  }

  const contractEntries = currentRows
    .filter((plan) => plan.currentAmount > 0)
    .map((plan) => [`${plan.type}${plan.name ? `（${plan.name}）` : ""}`, plan.currentAmount]);
  const { pieWrap, legend } = createPieChartElements(contractEntries, currentTotal, {
    centerLabel: "現時点総額",
    colors: ASSET_PIE_COLORS,
    formatCategoryLabel: formatAssetCompositionCategoryLabel,
  });
  chartSection.appendChild(pieWrap);
  chartSection.appendChild(legend);

  if (!formationChartSection) {
    return;
  }

  if (contractEntriesAt65.length === 0 || contractTotalAt65 === 0) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = `${createAssetOutlookPointLabel(TARGET_AGE_SECONDARY)}の評価対象となる契約はありません。`;
    const typeHeading = formationChartSection.querySelector(".asset-type-breakdown-heading");
    typeHeading?.insertAdjacentElement("beforebegin", empty);
    dashboardCurrentAssetForecast.innerHTML = dashboardCurrentAssetContainer.innerHTML;
    dashboardAge65AssetForecast.innerHTML = assetForecast.innerHTML;
    assetForecast.innerHTML = "";
    return;
  }

  const { pieWrap: formationPieWrap, legend: formationLegend } = createPieChartElements(contractEntriesAt65, contractTotalAt65, {
    centerLabel: "65歳時点総額",
    colors: ASSET_PIE_COLORS,
    formatCategoryLabel: formatAssetCompositionCategoryLabel,
  });
  formationPieWrap.classList.add("asset-formation-pie-wrap");
  formationLegend.classList.add("asset-formation-contract-list");
  const typeHeading = formationChartSection.querySelector(".asset-type-breakdown-heading");
  if (typeHeading) {
    typeHeading.insertAdjacentElement("beforebegin", formationPieWrap);
    typeHeading.insertAdjacentElement("beforebegin", formationLegend);
  } else {
    formationChartSection.appendChild(formationPieWrap);
    formationChartSection.appendChild(formationLegend);
  }

  if (dashboardCurrentAssetForecast) {
    dashboardCurrentAssetForecast.innerHTML = dashboardCurrentAssetContainer.innerHTML;
  }
  if (dashboardAge65AssetForecast) {
    dashboardAge65AssetForecast.innerHTML = assetForecast.innerHTML;
  }
  assetForecast.innerHTML = "";
}

function setDashboardAssetGraphTab(tabName = "current-assets") {
  if (dashboardAssetGraphTabs.length === 0 || dashboardAssetGraphPanels.length === 0) return;
  const requestedTab = tabName || "current-assets";
  const hasRequestedTab = dashboardAssetGraphTabs.some((button) => button.dataset.dashboardAssetGraphTab === requestedTab);
  const nextTab = hasRequestedTab ? requestedTab : "current-assets";
  activeDashboardAssetGraphTab = nextTab;

  dashboardAssetGraphTabs.forEach((button) => {
    const isActive = button.dataset.dashboardAssetGraphTab === nextTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  dashboardAssetGraphPanels.forEach((panel) => {
    const isActive = panel.dataset.dashboardAssetGraphPanel === nextTab;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
    panel.style.display = isActive ? "" : "none";
  });
}

function setAssetMainTab(tabName = "formation") {
  if (assetMainTabs.length === 0 || assetMainPanels.length === 0) return;
  const previousTab = activeAssetMainTab;
  const requestedTab = tabName || "formation";
  const hasRequestedTab = assetMainTabs.some((button) => button.dataset.assetMainTab === requestedTab);
  const nextTab = hasRequestedTab ? requestedTab : "formation";
  activeAssetMainTab = nextTab;

  assetMainTabs.forEach((button) => {
    const isActive = button.dataset.assetMainTab === nextTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;

  });

  assetMainPanels.forEach((panel) => {
    const isActive = panel.dataset.assetMainPanel === nextTab;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  if (previousTab === "cashflow" && nextTab !== "cashflow") {
    setCashflowSubTab("income-settings");
  }
}

function setCashflowSubTab(tabName = "income-settings") {
  if (cashflowSubTabs.length === 0 || cashflowSubPanels.length === 0) return;
  const requestedTab = tabName || "income-settings";
  const hasRequestedTab = cashflowSubTabs.some((button) => button.dataset.cashflowSubTab === requestedTab);
  const nextTab = hasRequestedTab ? requestedTab : "income-settings";
  activeCashflowSubTab = nextTab;

  cashflowSubTabs.forEach((button) => {
    const isActive = button.dataset.cashflowSubTab === nextTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  cashflowSubPanels.forEach((panel) => {
    const isActive = panel.dataset.cashflowSubPanel === nextTab;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

function setIncomeMainTab(tabName = "expense-balance") {
  if (incomeMainTabs.length === 0 || incomeMainPanels.length === 0) return;
  const requestedTab = tabName || "expense-balance";
  const hasRequestedTab = incomeMainTabs.some((button) => button.dataset.incomeMainTab === requestedTab);
  const nextTab = hasRequestedTab ? requestedTab : "expense-balance";
  activeIncomeMainTab = nextTab;

  incomeMainTabs.forEach((button) => {
    const isActive = button.dataset.incomeMainTab === nextTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  incomeMainPanels.forEach((panel) => {
    const isActive = panel.dataset.incomeMainPanel === nextTab;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

function resolveIncomeMainTabBySectionId(sectionId = "") {
  if (!sectionId) return "";
  const entry = Object.entries(INCOME_MAIN_SECTION_IDS).find(([, sectionIds]) => sectionIds.includes(sectionId));
  return entry?.[0] || "";
}

function resolveInputMainTabBySectionId(sectionId = "") {
  if (!sectionId) return "";
  const entry = Object.entries(INPUT_MAIN_SECTION_IDS).find(([, sectionIds]) => sectionIds.includes(sectionId));
  if (entry?.[0]) return entry[0];
  const inputSubTab = resolveInputSubTabBySectionId(sectionId);
  return inputSubTab.group || "";
}

function resolvePrimaryMainTabBySectionId(sectionId = "") {
  if (!sectionId) return "";
  const entry = Object.entries(PRIMARY_MAIN_SECTION_IDS).find(([, sectionIds]) => sectionIds.includes(sectionId));
  if (entry?.[0]) return entry[0];
  const inputSubTab = resolveInputSubTabBySectionId(sectionId);
  return inputSubTab.group ? "input" : "";
}

function resolveInputSubTabBySectionId(sectionId = "") {
  if (!sectionId) return { group: "", tab: "" };
  const entry = Object.entries(INPUT_SUB_SECTION_IDS).find(([, tabConfig]) =>
    Object.values(tabConfig).some((sectionIds) => sectionIds.includes(sectionId))
  );
  if (!entry) return { group: "", tab: "" };
  const [groupName, tabConfig] = entry;
  const tabEntry = Object.entries(tabConfig).find(([, sectionIds]) => sectionIds.includes(sectionId));
  return { group: groupName, tab: tabEntry?.[0] || "" };
}

function setPrimaryMainTab(tabName = "dashboard") {
  if (primaryMainTabs.length === 0 || primaryMainPanels.length === 0) return;
  const previousTab = activePrimaryMainTab;
  const requestedTab = tabName || "dashboard";
  const hasRequestedTab = primaryMainTabs.some((button) => button.dataset.primaryMainTab === requestedTab);
  const nextTab = hasRequestedTab ? requestedTab : "dashboard";
  activePrimaryMainTab = nextTab;

  primaryMainTabs.forEach((button) => {
    const isActive = button.dataset.primaryMainTab === nextTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  primaryMainPanels.forEach((panel) => {
    const isActive = panel.dataset.primaryMainPanel === nextTab;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  if (nextTab === "assets") {
    queueAssetForecastRender(true);
  }

  if (previousTab === "assets" && nextTab !== "assets") {
    setCashflowSubTab("income-settings");
  }

  if (nextTab !== "dashboard") {
    setDashboardAssetGraphTab("current-assets");
  } else if (previousTab !== "dashboard") {
    setDashboardAssetGraphTab("current-assets");
  }
}

function setInputMainTab(tabName = "monthly") {
  if (inputMainTabs.length === 0 || inputMainPanels.length === 0) return;
  const requestedTab = tabName || "monthly";
  const hasRequestedTab = inputMainTabs.some((button) => button.dataset.inputMainTab === requestedTab);
  const nextTab = hasRequestedTab ? requestedTab : "monthly";
  activeInputMainTab = nextTab;

  inputMainTabs.forEach((button) => {
    const isActive = button.dataset.inputMainTab === nextTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  inputMainPanels.forEach((panel) => {
    const isActive = panel.dataset.inputMainPanel === nextTab;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

function setInputSubTab(groupName, tabName = "register", options = {}) {
  if (!groupName) return;
  const switchRoot = document.querySelector(`[data-input-sub-switch="${groupName}"]`);
  if (!switchRoot) return;
  const tabs = Array.from(switchRoot.querySelectorAll("[data-input-sub-tab]"));
  if (tabs.length === 0) return;
  const requestedTab = tabName || "register";
  const hasRequestedTab = tabs.some((button) => button.dataset.inputSubTab === requestedTab);
  const nextTab = hasRequestedTab ? requestedTab : tabs[0].dataset.inputSubTab;
  const shouldResetBasicRegisterForm = groupName === "basic" && nextTab === "register" && !options?.keepBasicEditingState;
  if (shouldResetBasicRegisterForm) {
    resetProfileRegisterForm();
  }
  activeInputSubTabs[groupName] = nextTab;
  tabs.forEach((button) => {
    const isActive = button.dataset.inputSubTab === nextTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  const panels = Array.from(document.querySelectorAll(`[data-input-sub-content="${groupName}"] [data-input-sub-panel]`));
  panels.forEach((panel) => {
    const isActive = panel.dataset.inputSubPanel === nextTab;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

function setupInputSubTabs() {
  if (inputSubSwitches.length === 0) return;
  inputSubSwitches.forEach((switchRoot) => {
    const groupName = switchRoot.dataset.inputSubSwitch;
    if (!groupName) return;
    const buttons = Array.from(switchRoot.querySelectorAll("[data-input-sub-tab]"));
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        setInputSubTab(groupName, button.dataset.inputSubTab || "register");
      });
    });
    setInputSubTab(groupName, activeInputSubTabs[groupName] || "register");
  });
}

function setupPrimaryMainTabs() {
  if (primaryMainTabs.length === 0) return;
  primaryMainTabs.forEach((button) => {
    button.addEventListener("click", () => {
      switchPrimaryMainTabAndScrollTop(button.dataset.primaryMainTab || "dashboard");
    });
  });
  setPrimaryMainTab(activePrimaryMainTab);
}

function buildPrimaryMainPanels() {
  if (primaryMainPanels.length === 0) return;
  Object.entries(PRIMARY_MAIN_SECTION_IDS).forEach(([tabName, sectionIds]) => {
    const panel = document.querySelector(`[data-primary-main-panel="${tabName}"]`);
    if (!panel) return;
    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      panel.appendChild(section);
    });
  });
}

function buildInputMainPanels() {
  if (inputMainPanels.length === 0) return;
  Object.entries(INPUT_MAIN_SECTION_IDS).forEach(([tabName, sectionIds]) => {
    const panel = document.querySelector(`[data-input-main-panel="${tabName}"]`);
    if (!panel) return;
    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      panel.appendChild(section);
    });
  });
}

function buildIncomeMainPanels() {
  if (incomeMainPanels.length === 0) return;
  Object.entries(INCOME_MAIN_SECTION_IDS).forEach(([tabName, sectionIds]) => {
    const panel = document.querySelector(`[data-income-main-panel="${tabName}"]`);
    if (!panel) return;
    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      panel.appendChild(section);
    });
  });
}

function setupAssetMainTabs() {
  if (assetMainTabs.length === 0) return;
  assetMainTabs.forEach((button) => {
    button.addEventListener("click", () => {
      setAssetMainTab(button.dataset.assetMainTab || "formation");
    });
  });
  setAssetMainTab(activeAssetMainTab);
}

function setupCashflowSubTabs() {
  if (cashflowSubTabs.length === 0) return;
  cashflowSubTabs.forEach((button) => {
    button.addEventListener("click", () => {
      setCashflowSubTab(button.dataset.cashflowSubTab || "income-settings");
    });
  });
  setCashflowSubTab(activeCashflowSubTab);
}

function setupIncomeMainTabs() {
  if (incomeMainTabs.length === 0) return;
  incomeMainTabs.forEach((button) => {
    button.addEventListener("click", () => {
      setIncomeMainTab(button.dataset.incomeMainTab || "expense-balance");
    });
  });
  setIncomeMainTab(activeIncomeMainTab);
}

function setupInputMainTabs() {
  if (inputMainTabs.length === 0) return;
  inputMainTabs.forEach((button) => {
    button.addEventListener("click", () => {
      setInputMainTab(button.dataset.inputMainTab || "monthly");
    });
  });
  setInputMainTab(activeInputMainTab);
}

function createHistoryRow({ type, month = "", amount = "", onChange = null } = {}) {
  const row = document.createElement("div");
  row.className = "history-row";
  const monthClass = type === "lump" ? "lump-month" : "monthly-start-month";
  const amountClass = type === "lump" ? "lump-amount" : "monthly-amount";
  const monthLabel = type === "lump" ? "年月" : "開始年月";
  const amountLabel = type === "lump" ? "一括入金額(円)" : "月額(円)";
  const hasAmount = amount !== "" && amount !== null && amount !== undefined;

  row.innerHTML = `
    <label>${monthLabel}<input type="month" class="${monthClass}" value="${month}" /></label>
    <label>${amountLabel}<input type="text" inputmode="numeric" class="${amountClass} js-amount-field" value="${hasAmount ? numberWithComma.format(Number(amount) || 0) : ""}" /></label>
    <button type="button" class="small danger remove-history">削除</button>
  `;
  const amountField = row.querySelector(`.${amountClass}`);
  setupFormattedAmountInput(amountField, { allowZero: type === "monthly" });
  const monthField = row.querySelector(`.${monthClass}`);
  const notifyChange = () => {
    if (typeof onChange === "function") onChange();
  };
  amountField?.addEventListener("input", notifyChange);
  monthField?.addEventListener("change", notifyChange);
  row.querySelector(".remove-history").addEventListener("click", () => {
    row.remove();
    notifyChange();
  });
  return row;
}

function createPlanBlock(plan = {}) {
  const normalizedPlan = normalizePlan(plan);
  const wrap = document.createElement("article");
  wrap.className = "plan-item";

  const typeOptions = PLAN_TYPES.map((type) => `<option value="${type}" ${normalizedPlan.type === type ? "selected" : ""}>${type}</option>`).join("");

  wrap.innerHTML = `
    <input type="hidden" class="plan-id" value="${normalizedPlan.id}" />
    <div class="plan-card-header">
      <p class="plan-card-title">${normalizedPlan.type}｜${normalizedPlan.name || "識別名未設定"}</p>
      <span class="plan-card-tag">${normalizedPlan.type}</span>
    </div>
    <div class="plan-card-panel" aria-hidden="false">
      <div class="plan-card-panel-inner">
        <div class="plan-grid">
          <label>種類<select class="plan-type">${typeOptions}</select></label>
          <label>識別名<input class="plan-name" type="text" maxlength="30" placeholder="例: つみたて枠" value="${normalizedPlan.name || ""}" /></label>
          <label>現在評価額<input class="plan-current-value js-amount-field" type="text" inputmode="numeric" value="${Number.isFinite(normalizedPlan.currentValue) ? numberWithComma.format(normalizedPlan.currentValue) : ""}" /></label>
          <label class="plan-auto-yield-field">
            現在利回り（自動）
            <output class="plan-current-auto-yield" aria-live="polite">--</output>
            <small class="plan-auto-yield-note">過去の入金履歴と現在評価額から自動計算</small>
          </label>
          <label>
            想定利回り(年%)
            <input class="plan-expected-return" type="number" inputmode="decimal" step="0.01" value="${normalizedPlan.expectedReturn ?? ""}" />
            <button type="button" class="small plan-expected-return-suggest">提案値に戻す</button>
          </label>
          <label>取崩年月<input class="plan-withdraw-month" type="month" value="${normalizedPlan.withdrawMonth || ""}" /></label>
          <p class="plan-withdraw-hint">※取崩年月が未設定の場合は、積立支出を継続します。</p>
          <label>引き落とし日<input class="plan-withdrawal-day" type="number" min="1" max="31" step="1" value="${normalizedPlan.withdrawalDay ?? 1}" /></label>
        </div>
        <div class="change-wrap">
          <div class="change-header">
            <p>一括入金履歴（登録月に1回のみ反映）</p>
            <button type="button" class="small add-lump">一括入金を追加</button>
          </div>
          <div class="lump-list"></div>
        </div>
        <div class="change-wrap">
          <div class="change-header">
            <p>月額積立履歴（開始年月以降で有効）</p>
            <button type="button" class="small add-monthly">月額履歴を追加</button>
          </div>
          <div class="monthly-list"></div>
        </div>
      </div>
    </div>
  `;

  const lumpList = wrap.querySelector(".lump-list");
  const monthlyList = wrap.querySelector(".monthly-list");
  const planTypeField = wrap.querySelector(".plan-type");
  const planNameField = wrap.querySelector(".plan-name");
  const currentValueField = wrap.querySelector(".plan-current-value");
  const autoYieldField = wrap.querySelector(".plan-current-auto-yield");
  const autoYieldNote = wrap.querySelector(".plan-auto-yield-note");
  const expectedReturnField = wrap.querySelector(".plan-expected-return");
  const suggestExpectedReturnButton = wrap.querySelector(".plan-expected-return-suggest");
  const withdrawalDayField = wrap.querySelector(".plan-withdrawal-day");
  const title = wrap.querySelector(".plan-card-title");
  const tag = wrap.querySelector(".plan-card-tag");
  setupFormattedAmountInput(currentValueField);

  const refreshAutoYield = () => {
    const draftPlan = {
      ...normalizedPlan,
      currentValue: parseAmountInput(currentValueField?.value),
      withdrawalDay: Number(withdrawalDayField?.value),
      lumpSums: Array.from(lumpList.querySelectorAll(".history-row"))
        .map((row) => ({
          month: row.querySelector(".lump-month")?.value || "",
          amount: parseAmountInput(row.querySelector(".lump-amount")?.value || ""),
        })),
      monthlyContributions: Array.from(monthlyList.querySelectorAll(".history-row"))
        .map((row) => ({
          startMonth: row.querySelector(".monthly-start-month")?.value || "",
          amount: parseAmountInput(row.querySelector(".monthly-amount")?.value || ""),
        })),
    };
    const autoYield = calculateCurrentAutoYield(draftPlan);
    const operationMonths = calculatePlanOperationMonths(draftPlan);
    autoYieldField.textContent = formatAutoYieldPercent(autoYield);
    if (autoYieldNote) {
      autoYieldNote.textContent = (Number.isFinite(autoYield) && operationMonths > 0 && operationMonths < 12)
        ? "過去の入金履歴と現在評価額から自動計算（短期のため参考値）"
        : "過去の入金履歴と現在評価額から自動計算";
    }
  };

  normalizedPlan.lumpSums.forEach((history) => {
    lumpList.appendChild(createHistoryRow({ type: "lump", month: history.month, amount: history.amount, onChange: refreshAutoYield }));
  });
  normalizedPlan.monthlyContributions.forEach((history) =>
    monthlyList.appendChild(createHistoryRow({ type: "monthly", month: history.startMonth, amount: history.amount, onChange: refreshAutoYield }))
  );

  const refreshPlanVisual = () => {
    const type = planTypeField.value;
    const name = planNameField.value.trim();
    wrap.classList.remove(...Object.values(PLAN_TYPE_CLASS));
    wrap.classList.add(PLAN_TYPE_CLASS[type] || PLAN_TYPE_CLASS.NISA);
    title.textContent = `${type}｜${name || "識別名未設定"}`;
    tag.textContent = type;
  };

  planTypeField.addEventListener("change", refreshPlanVisual);
  planNameField.addEventListener("input", refreshPlanVisual);
  currentValueField?.addEventListener("input", refreshAutoYield);
  withdrawalDayField?.addEventListener("input", refreshAutoYield);
  wrap.dataset.planExpanded = "true";
  wrap.classList.add("is-expanded");
  refreshPlanVisual();
  refreshAutoYield();

  wrap.querySelector(".add-lump").addEventListener("click", () => {
    lumpList.appendChild(createHistoryRow({ type: "lump", onChange: refreshAutoYield }));
    refreshAutoYield();
  });

  wrap.querySelector(".add-monthly").addEventListener("click", () => {
    monthlyList.appendChild(createHistoryRow({ type: "monthly", onChange: refreshAutoYield }));
    refreshAutoYield();
  });
  suggestExpectedReturnButton?.addEventListener("click", () => {
    const suggestedExpectedReturn = calculateSuggestedExpectedReturn({
      withdrawalDay: Number(withdrawalDayField?.value),
      currentValue: parseAmountInput(currentValueField?.value || ""),
      lumpSums: Array.from(lumpList.querySelectorAll(".history-row"))
        .map((row) => ({
          month: row.querySelector(".lump-month")?.value || "",
          amount: parseAmountInput(row.querySelector(".lump-amount")?.value || ""),
        })),
      monthlyContributions: Array.from(monthlyList.querySelectorAll(".history-row"))
        .map((row) => ({
          startMonth: row.querySelector(".monthly-start-month")?.value || "",
          amount: parseAmountInput(row.querySelector(".monthly-amount")?.value || ""),
        })),
    });
    if (expectedReturnField) {
      expectedReturnField.value = Number.isFinite(suggestedExpectedReturn) ? suggestedExpectedReturn.toFixed(2) : "4.00";
    }
  });

  return wrap;
}

function formatPlanAnnualReturn(value) {
  const normalized = parseRateInput(value, 0);
  return `${normalized.toFixed(2)}%`;
}

function startPlanEdit(planId) {
  if (!planId || planEditorLists.length === 0) return;
  const settings = loadSettings();
  const targetPlan = Array.isArray(settings?.plans) ? settings.plans.find((plan) => plan.id === planId) : null;
  if (!targetPlan) return;
  basicEditingPlanId = targetPlan.id;
  planEditorLists.forEach((editorList) => {
    editorList.innerHTML = "";
    editorList.appendChild(createPlanBlock(targetPlan));
  });
  setProfileFormMode(true);
  setPrimaryMainTab("assets");
  setAssetMainTab("formation");
  setInputSubTab("asset-formation", "register", { keepBasicEditingState: true });
  scrollToEditFormStart(assetBasicEditStatus || assetFormationRegisterPanel, assetPlanEditorList || planEditorList);
}

function deletePlanById(planId) {
  if (!planId) return;
  const settings = loadSettings();
  const nextSettings = {
    ...settings,
    plans: (settings.plans || []).filter((plan) => plan.id !== planId),
  };
  saveSettings(nextSettings);
  render();
}

function renderRegisteredPlans(settings) {
  if (!planList) return;
  planList.innerHTML = "";
  const plans = Array.isArray(settings?.plans) ? settings.plans : [];

  if (plans.length === 0) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "登録済みの資産形成プランはありません。";
    planList.appendChild(empty);
    return;
  }

  plans.forEach((plan) => {
    const normalizedPlan = normalizePlan(plan);
    const currentAutoYield = calculateCurrentAutoYield(normalizedPlan);
    const monthlyContribution = findActiveMonthlyContribution(normalizedPlan, todayISO().slice(0, 7));
    const lumpTotal = normalizedPlan.lumpSums.reduce((sum, history) => sum + (Number(history.amount) || 0), 0);
    const card = document.createElement("article");
    card.className = "plan-registered-card";
    card.innerHTML = `
      <div class="plan-registered-card-header">
        <h4>${normalizedPlan.type}${normalizedPlan.name ? ` / ${normalizedPlan.name}` : ""}</h4>
      </div>
      <ul class="plan-registered-meta-list">
        <li><span>種類</span><strong>${normalizedPlan.type}</strong></li>
        <li><span>識別名</span><strong>${normalizedPlan.name || "未設定"}</strong></li>
        <li><span>現在評価額</span><strong>${Number.isFinite(normalizedPlan.currentValue) ? yen.format(normalizedPlan.currentValue) : "--"}</strong></li>
        <li><span>現在利回り（自動）</span><strong>${formatAutoYieldPercent(currentAutoYield)}</strong></li>
        <li><span>想定利回り</span><strong>${formatPlanAnnualReturn(normalizedPlan.expectedReturn)}</strong></li>
        <li><span>取崩年月</span><strong>${normalizedPlan.withdrawMonth ? formatWithdrawMonthLabelWithAge(normalizedPlan.withdrawMonth, settings?.birthDate) : "未設定"}</strong></li>
        <li><span>積立額（月額）</span><strong>${monthlyContribution > 0 ? yen.format(monthlyContribution) : "未設定"}</strong></li>
        <li><span>一括入金（累計）</span><strong>${lumpTotal > 0 ? yen.format(lumpTotal) : "なし"}</strong></li>
      </ul>
    `;

    const actions = document.createElement("div");
    actions.className = "plan-registered-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "small";
    editButton.textContent = "修正";
    editButton.addEventListener("click", () => startPlanEdit(normalizedPlan.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "small danger";
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", () => {
      if (!window.confirm("この資産形成プランを削除しますか？")) return;
      deletePlanById(normalizedPlan.id);
    });

    actions.append(editButton, deleteButton);
    card.appendChild(actions);
    planList.appendChild(card);
  });
}

function collectPlansFromForm(editorList = planEditorList || assetPlanEditorList) {
  if (!editorList) return [];
  return Array.from(editorList.querySelectorAll(".plan-item"))
    .map((block) => {
      const lumpSums = Array.from(block.querySelectorAll(".lump-list .history-row"))
        .map((row) => ({
          month: row.querySelector(".lump-month").value,
          amount: parseAmountInput(row.querySelector(".lump-amount").value),
        }))
        .filter((item) => item.month && Number.isFinite(item.amount) && item.amount >= 0)
        .sort((a, b) => compareMonth(a.month, b.month));

      const monthlyContributions = Array.from(block.querySelectorAll(".monthly-list .history-row"))
        .map((row) => ({
          startMonth: row.querySelector(".monthly-start-month").value,
          amount: parseAmountInput(row.querySelector(".monthly-amount").value),
        }))
        .filter((item) => item.startMonth && Number.isFinite(item.amount) && item.amount >= 0)
        .sort((a, b) => compareMonth(a.startMonth, b.startMonth));

      return {
        id: block.querySelector(".plan-id").value,
        type: block.querySelector(".plan-type").value,
        name: block.querySelector(".plan-name").value.trim(),
        currentValue: parseAmountInput(block.querySelector(".plan-current-value").value) || null,
        currentAutoYield: calculateCurrentAutoYield({
          withdrawalDay: Number(block.querySelector(".plan-withdrawal-day").value),
          currentValue: parseAmountInput(block.querySelector(".plan-current-value").value),
          lumpSums,
          monthlyContributions,
        }),
        expectedReturn: parseRateInput(block.querySelector(".plan-expected-return").value),
        withdrawMonth: block.querySelector(".plan-withdraw-month").value,
        withdrawalDay: Number(block.querySelector(".plan-withdrawal-day").value),
        lumpSums,
        monthlyContributions,
      };
    })
    .filter((plan) => plan.lumpSums.length > 0 || plan.monthlyContributions.length > 0)
    .map((plan) => normalizePlan(plan));
}

function renderPlans(settings) {
  if (planEditorLists.length === 0) return;
  planEditorLists.forEach((editorList) => {
    if (editorList.querySelector(".plan-item")) return;
    editorList.replaceChildren(createPlanBlock());
  });
}

function renderBasicRegisteredSummary(settings) {
  if (!basicRegisteredSummary) return;
  const birthLabel = settings?.birthDate || "未設定";
  const entryStartMonthLabel = settings?.entryStartMonth || "未設定";
  basicRegisteredSummary.innerHTML = `
    <section class="registered-summary-card">
      <h3>基本情報の登録状況</h3>
      <dl>
        <div><dt>記入開始月</dt><dd>${entryStartMonthLabel}</dd></div>
        <div><dt>生年月日</dt><dd>${birthLabel}</dd></div>
      </dl>
      <p class="registered-summary-note">資産形成プランの確認・修正・保存は「資産形成」タブで行えます。</p>
    </section>
  `;
}

function handlePostSaveCompletion({
  groupName,
  nextSubTab = "register",
  shouldSwitchSubTab = false,
} = {}) {
  const destinationSubTab = shouldSwitchSubTab ? nextSubTab : "register";
  closeKeyboardAndReflowInputLayout({ restoreScroll: false, forceScrollRestore: false });
  render();
  if (shouldSwitchSubTab && groupName) {
    setInputSubTab(groupName, nextSubTab);
  }
  const scrollTarget = resolveInputSubTabTopAnchor(groupName, destinationSubTab);
  scrollTargetIntoTopOnce(scrollTarget);
}

function saveBasicProfileSettings() {
  const wasEditing = isBasicEditingMode();
  const existingSettings = loadSettings();
  const settings = {
    ...existingSettings,
    birthDate: birthDateInput.value,
    entryStartMonth: entryStartMonthInput.value,
    plans: Array.isArray(existingSettings?.plans) ? existingSettings.plans : [],
  };

  if (!settings.birthDate || !settings.entryStartMonth) {
    if (!entryStartMonthInput.value) {
      entryStartMonthInput.reportValidity();
    } else if (!birthDateInput.value) {
      birthDateInput.reportValidity();
    }
    return;
  }

  saveSettings(settings);
  handlePostSaveCompletion({
    groupName: "basic",
    nextSubTab: wasEditing ? "register" : "registered",
    shouldSwitchSubTab: !wasEditing,
  });
}

function saveAssetFormationSettings(editorList = planEditorList || assetPlanEditorList) {
  const wasEditing = isBasicEditingMode();
  const isAssetEditor = Boolean(assetPlanEditorList && editorList === assetPlanEditorList);
  const existingSettings = loadSettings();
  const existingPlans = Array.isArray(existingSettings?.plans) ? existingSettings.plans : [];
  const editedPlans = collectPlansFromForm(editorList);
  const editedPlanIds = new Set(editedPlans.map((plan) => plan.id));
  const untouchedPlans = existingPlans.filter((plan) => !editedPlanIds.has(plan.id));
  const settings = {
    ...existingSettings,
    birthDate: existingSettings?.birthDate || "",
    entryStartMonth: existingSettings?.entryStartMonth || "",
    plans: [...untouchedPlans, ...editedPlans],
  };

  saveSettings(settings);
  resetProfileRegisterForm();
  handlePostSaveCompletion({
    groupName: isAssetEditor ? "asset-formation" : "basic",
    nextSubTab: wasEditing ? "register" : "registered",
    shouldSwitchSubTab: !wasEditing,
  });
}

function render() {
  const recurringExpenses = loadRecurringExpenses();
  const rawTransactions = loadTransactions();
  const fallbackMonth = getLatestMonthFromTransactions(rawTransactions) || todayISO().slice(0, 7);
  const isAverageMode = sharedAverageViewState.averageMode === "average";
  const dashboardViewMonth = resolveViewMonthFromState(sharedYearMonthState) || fallbackMonth;
  const historyViewMonth = resolveViewMonthFromState(sharedYearMonthState) || fallbackMonth;
  const syncTargetMonth = [fallbackMonth, dashboardViewMonth, historyViewMonth].sort(compareMonth).at(-1);
  const transactions = syncRecurringAutoTransactions(rawTransactions, recurringExpenses, syncTargetMonth);
  const lifeEvents = loadLifeEvents();
  const settings = loadSettings();
  if (basicEditingPlanId) {
    const hasEditingPlan = Array.isArray(settings?.plans) && settings.plans.some((plan) => plan.id === basicEditingPlanId);
    if (!hasEditingPlan) {
      resetProfileFormFields();
    }
  }
  const assumptions = loadCashflowAssumptions();
  const cashflowIncomeSettings = loadCashflowIncomeSettings();
  const cashflowExpenseSettings = loadCashflowExpenseSettings();
  const sharedViewMonthBounds = resolveSharedViewMonthBounds(settings, transactions);
  syncViewFilterOptions(historyViewFilterControls, sharedYearMonthState, sharedViewMonthBounds);
  syncViewFilterOptions(
    dashboardViewFilterControls,
    { ...sharedYearMonthState, averageMode: sharedAverageViewState.averageMode },
    sharedViewMonthBounds,
    { includeAverageMode: true, prioritizeCurrentYear: true }
  );
  syncViewFilterOptions(
    expenseViewFilterControls,
    { ...sharedYearMonthState, averageMode: sharedAverageViewState.averageMode },
    sharedViewMonthBounds,
    { includeAverageMode: true }
  );
  sharedYearMonthState = {
    year: dashboardViewFilterControls.year?.value || sharedYearMonthState.year,
    month: dashboardViewFilterControls.month?.value || sharedYearMonthState.month,
  };
  syncViewFilterOptions(historyViewFilterControls, sharedYearMonthState, sharedViewMonthBounds);
  const currentHistoryMonth = resolveViewMonthFromState(sharedYearMonthState) || fallbackMonth;
  const currentDashboardMonth = resolveViewMonthFromState(sharedYearMonthState) || fallbackMonth;
  const currentExpenseMonth = resolveViewMonthFromState(sharedYearMonthState) || fallbackMonth;
  const isDashboardAverageMode = isAverageMode;
  const isExpenseAverageMode = isAverageMode;
  const autoTransactions = createEligibleAutoExpensesForMonth(settings, transactions, currentHistoryMonth);
  const combinedTransactions = [...transactions, ...autoTransactions];
  const averageTargetMonths = resolveAverageTargetMonths(settings, transactions);
  const dashboardSummary = calculateMonthlySummary(transactions, settings, currentDashboardMonth);
  if (transactionEditingId && !transactions.some((item) => item.id === transactionEditingId)) {
    resetTransactionFormFields();
  }
  renderRecurringExpenses(recurringExpenses);
  renderLifeEvents(lifeEvents);
  renderPlans(settings);
  renderRegisteredPlans(settings);
  renderBasicRegisteredSummary(settings);

  entryStartMonthInput.value = resolveEntryStartMonth(settings, transactions);
  birthDateInput.value = settings.birthDate || "";
  setProfileFormMode(isBasicEditingMode());
  updateCashflowAssumptionInputs(assumptions);
  updateCashflowIncomeSettingsInputs(cashflowIncomeSettings);
  updateCashflowExpenseSettingsInputs(cashflowExpenseSettings);

  const historyItems = buildTransactionHistoryItems(transactions, autoTransactions, currentHistoryMonth);
  const nowMonth = todayISO().slice(0, 7);
  const lifeEventPlannedHistoryItems = buildLifeEventHistoryItems(lifeEvents, settings);
  const futureTransactionHistoryItems = buildFutureTransactionHistoryItems(transactions, settings, nowMonth);
  const plannedHistoryItems = [...lifeEventPlannedHistoryItems, ...futureTransactionHistoryItems];

  renderTransactionHistory(historyItems);
  renderPlannedTransactionHistory(plannedHistoryItems);
  if (plannedHistoryBlock) {
    plannedHistoryBlock.hidden = false;
  }

  const dashboardMonthlyExpenseComposition = buildMonthlyExpenseComposition(combinedTransactions, currentDashboardMonth);
  const expenseMonthlyComposition = buildMonthlyExpenseComposition(combinedTransactions, currentExpenseMonth);
  const averageDataset = buildAverageModeDataset(settings, transactions, averageTargetMonths);
  const chipMonthlySavingTotal = calculateMonthlyContributionTotal(settings, currentDashboardMonth);
  renderDashboard(isDashboardAverageMode
    ? {
        summary: averageDataset.summary.summary,
        settings,
        transactions,
        recurringExpenses,
        lifeEvents,
        expenseComposition: averageDataset.expenseComposition,
        monthlySavingTotal: averageDataset.summary.monthlySavingTotal,
        chipMonthlySavingTotal,
        manualTransactionCount: averageDataset.summary.manualTransactionCount,
        monthCount: averageDataset.summary.monthCount,
      }
    : {
        summary: dashboardSummary,
        settings,
        transactions,
        recurringExpenses,
        lifeEvents,
        expenseComposition: dashboardMonthlyExpenseComposition,
        monthlySavingTotal: calculateMonthlyContributionTotal(settings, currentDashboardMonth),
        chipMonthlySavingTotal,
        manualTransactionCount: transactions.filter((item) => monthISO(item.date) === currentDashboardMonth).length,
        monthCount: 0,
      });

  renderExpenseChart(
    isExpenseAverageMode ? averageDataset.expenseComposition : expenseMonthlyComposition,
    isExpenseAverageMode
  );
  renderCashflowTable({ settings, transactions, recurringExpenses, lifeEvents, assumptions });
  markAssetForecastDirty(settings);
  queueAssetForecastRender();
}

function refreshCashflowTableOnly() {
  const settings = loadSettings();
  const transactions = loadTransactions();
  const recurringExpenses = loadRecurringExpenses();
  const lifeEvents = loadLifeEvents();
  const assumptions = loadCashflowAssumptions();
  renderCashflowTable({ settings, transactions, recurringExpenses, lifeEvents, assumptions });
}

function addTransaction(event) {
  event.preventDefault();

  const date = dateInput.value;
  const type = typeInput.value;
  const category = categoryInput.value.trim();
  const amount = parseAmountInput(amountInput.value);
  const memo = memoInput.value.trim();

  if (!date || !category || !Number.isFinite(amount) || amount <= 0) {
    return;
  }
  const allowedCategories = CATEGORY_OPTIONS[type] ?? [];
  if (!allowedCategories.includes(category)) {
    return;
  }

  const current = loadTransactions();
  if (transactionEditingId) {
    const next = current.map((item) => (item.id === transactionEditingId
      ? {
          ...item,
          date,
          type,
          category,
          amount,
          memo,
        }
      : item));
    saveTransactions(next);
    resetTransactionFormFields({ date });
  } else {
    current.push({
      id: crypto.randomUUID(),
      date,
      type,
      category,
      amount,
      memo,
    });

    saveTransactions(current);
    resetTransactionFormFields({ date });
  }

  handlePostSaveCompletion({ groupName: "monthly" });
}

function addRecurringExpense(event) {
  event.preventDefault();
  const category = recurringCategoryInput.value;
  const amount = parseAmountInput(recurringAmountInput.value);
  const day = Math.min(Math.max(Number(recurringDayInput.value) || 1, 1), 31);
  const startMonth = recurringStartMonthInput.value;
  const endMonth = recurringEndMonthInput.value;
  const memo = recurringMemoInput.value.trim();

  if (!RECURRING_EXPENSE_CATEGORIES.includes(category)) return;
  if (!parseMonth(startMonth) || amount <= 0) return;
  if (parseMonth(endMonth) && compareMonth(endMonth, startMonth) < 0) return;

  const current = loadRecurringExpenses();
  if (recurringEditingId) {
    const next = current.map((item) => (item.id === recurringEditingId
      ? normalizeRecurringExpense({
          ...item,
          category,
          amount,
          day,
          startMonth,
          endMonth,
          memo,
        })
      : item));
    saveRecurringExpenses(next);
  } else {
    current.push(normalizeRecurringExpense({
      id: crypto.randomUUID(),
      category,
      amount,
      day,
      startMonth,
      endMonth,
      memo,
      createdAt: new Date().toISOString(),
    }));
    saveRecurringExpenses(current);
  }

  resetRecurringFormFields();
  handlePostSaveCompletion({ groupName: "recurring" });
}

function cancelRecurringExpenseEdit() {
  handleCancelEditFromRegistered("recurring", {
    isEditing: recurringEditingId,
    resetForm: resetRecurringFormFields,
  });
}

function cancelTransactionEdit() {
  handleCancelEditFromRegistered("monthly", {
    isEditing: transactionEditingId,
    resetForm: () => resetTransactionFormFields(),
  });
}

function isAssetsSectionExpanded() {
  if (!assetsSection) return false;
  const parentPanel = assetsSection.closest("[data-primary-main-panel]");
  if (!parentPanel) return true;
  return !parentPanel.hidden;
}

function isDashboardSectionExpanded() {
  if (!dashboardSection) return false;
  const parentPanel = dashboardSection.closest("[data-primary-main-panel]");
  if (!parentPanel) return true;
  return !parentPanel.hidden;
}

function markAssetForecastDirty(settings) {
  latestAssetForecastSettings = settings;
  assetForecastDirty = true;
}

function clearAssetForecastDOM() {
  assetForecastRenderRafId = 0;
  if (assetForecast?.childNodes.length) {
    assetForecast.replaceChildren();
  }
  if (assetWithdrawForecast?.childNodes.length) {
    assetWithdrawForecast.replaceChildren();
  }
}

function queueAssetForecastRender(force = false) {
  if (!assetForecast || !latestAssetForecastSettings) return;
  if (!force && !assetForecastDirty) return;
  if (!isAssetsSectionExpanded() && !isDashboardSectionExpanded()) return;
  if (assetForecastRenderRafId) return;

  assetForecastRenderRafId = window.requestAnimationFrame(() => {
    assetForecastRenderRafId = 0;
    if (!isAssetsSectionExpanded() && !isDashboardSectionExpanded()) return;
    renderAssetForecast(latestAssetForecastSettings);
    assetForecastDirty = false;
  });
}

function setPlanCardExpanded(planItem, expanded) {
  const cardTrigger = planItem.querySelector(".plan-card-trigger");
  const cardToggleButton = planItem.querySelector(".plan-card-toggle-button");
  const cardPanel = planItem.querySelector(".plan-card-panel");
  const cardToggleIcon = planItem.querySelector(".plan-card-toggle-icon");
  if (!cardTrigger || !cardToggleButton || !cardPanel || !cardToggleIcon) return;

  planItem.dataset.planExpanded = String(expanded);
  cardTrigger.setAttribute("aria-expanded", String(expanded));
  cardToggleButton.setAttribute("aria-expanded", String(expanded));
  cardPanel.setAttribute("aria-hidden", String(!expanded));
  cardToggleIcon.textContent = expanded ? "-" : "+";
  planItem.classList.toggle("is-expanded", expanded);
}

function closeDescendantPlanCards(root) {
  if (!root) return;
  const planItems = root.querySelectorAll(".plan-item");
  planItems.forEach((planItem) => setPlanCardExpanded(planItem, false));
}

function resetProfileChildAndGrandchildAccordions(section) {
  if (!section) return;
  const expandedChildTriggers = section.querySelectorAll('[data-child-accordion] .child-accordion-trigger[aria-expanded="true"]');
  expandedChildTriggers.forEach((trigger) => {
    const childAccordion = trigger.closest("[data-child-accordion]");
    if (!childAccordion) return;
    setChildAccordionExpanded(childAccordion, false);
  });
  closeDescendantPlanCards(section);
}

function isExpenseBalanceSection(section, trigger) {
  return section?.id === "section-chart" || trigger?.id === "trigger-chart";
}

function clearAccordionCloseTimer(panel) {
  const timerId = accordionCloseTimers.get(panel);
  if (!timerId) return;
  window.clearTimeout(timerId);
  accordionCloseTimers.delete(panel);
}

function collapseAccordionPanel(panel) {
  clearAccordionCloseTimer(panel);
  const collapseWaiter = {};
  collapseWaiter.promise = new Promise((resolve) => {
    collapseWaiter.resolve = resolve;
  });
  accordionCollapseWaiters.set(panel, collapseWaiter);
  panel.classList.add("is-collapsing");
  const timerId = window.setTimeout(() => {
    panel.hidden = true;
    panel.classList.remove("is-collapsing");
    accordionCloseTimers.delete(panel);
    const waiter = accordionCollapseWaiters.get(panel);
    accordionCollapseWaiters.delete(panel);
    if (waiter?.resolve) {
      window.requestAnimationFrame(() => waiter.resolve());
    }
  }, 170);
  accordionCloseTimers.set(panel, timerId);
  return collapseWaiter.promise;
}

function expandAccordionPanel(panel) {
  clearAccordionCloseTimer(panel);
  const waiter = accordionCollapseWaiters.get(panel);
  if (waiter?.resolve) {
    accordionCollapseWaiters.delete(panel);
    waiter.resolve();
  }
  panel.hidden = false;
  panel.classList.remove("is-collapsing");
}

function closeExpandedChildAccordions(section) {
  if (!section) return;
  const expandedChildTriggers = section.querySelectorAll('[data-child-accordion] .child-accordion-trigger[aria-expanded="true"]');
  expandedChildTriggers.forEach((trigger) => {
    const childAccordion = trigger.closest("[data-child-accordion]");
    if (!childAccordion) return;
    setChildAccordionExpanded(childAccordion, false);
  });
}

function setAccordionExpanded(section, expanded) {
  const trigger = section.querySelector(".accordion-trigger");
  const panel = section.querySelector(".accordion-panel");
  if (!trigger || !panel) return;
  const wasExpanded = trigger.getAttribute("aria-expanded") === "true";

  if (!expanded) {
    closeExpandedChildAccordions(section);
  }

  if (!expanded && trigger.id === "trigger-profile") {
    resetProfileChildAndGrandchildAccordions(section);
  }

  if (expanded) {
    expandAccordionPanel(panel);
  }

  trigger.setAttribute("aria-expanded", String(expanded));
  panel.setAttribute("aria-hidden", String(!expanded));
  section.classList.toggle("is-expanded", expanded);

  if (!expanded) {
    if (wasExpanded) {
      return collapseAccordionPanel(panel);
    } else {
      clearAccordionCloseTimer(panel);
      panel.hidden = true;
      panel.classList.remove("is-collapsing");
    }
  }

  if (section.id === "section-assets" && wasExpanded !== expanded) {
    if (expanded) {
      queueAssetForecastRender(true);
    } else {
      clearAssetForecastDOM();
    }
  }

  return Promise.resolve();
}

function setupSectionAccordions() {
  accordionSections.forEach((section) => {
    const trigger = section.querySelector(".accordion-trigger");
    const panel = section.querySelector(".accordion-panel");
    if (!trigger || !panel) return;
    section.dataset.hasChildAccordion = section.querySelector("[data-child-accordion]") ? "true" : "false";

    const toggleSection = () => {
      if (section.dataset.toggleLocked === "true") return;
      section.dataset.toggleLocked = "true";
      window.setTimeout(() => {
        section.dataset.toggleLocked = "false";
      }, 180);
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const nextExpanded = !expanded;

      setAccordionExpanded(section, nextExpanded).then(() => alignSectionHeadingAfterToggle(section));
    };

    const initialExpanded = section.dataset.accordionInitialExpanded === "true";
    setAccordionExpanded(section, initialExpanded);

    if (isExpenseBalanceSection(section, trigger)) {
      trigger.addEventListener("pointerup", (event) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "touch" && event.pointerType !== "pen") return;
        event.preventDefault();
        toggleSection();
      });
      trigger.addEventListener("click", (event) => {
        if (event.detail !== 0) return;
        toggleSection();
      });
    } else {
      trigger.addEventListener("click", toggleSection);
    }
  });
}

function setChildAccordionExpanded(childAccordion, expanded) {
  const trigger = childAccordion.querySelector(".child-accordion-trigger");
  const panel = childAccordion.querySelector(".child-accordion-panel");
  const toggle = childAccordion.querySelector(".child-accordion-toggle");
  if (!trigger || !panel || !toggle) return;

  closeDescendantPlanCards(childAccordion);

  trigger.setAttribute("aria-expanded", String(expanded));
  panel.hidden = !expanded;
  panel.setAttribute("aria-hidden", String(!expanded));
  toggle.textContent = expanded ? "－" : "＋";
  childAccordion.dispatchEvent(
    new CustomEvent("childaccordiontoggle", {
      detail: { expanded },
    })
  );
}

function setupChildAccordion(childAccordion) {
  const trigger = childAccordion.querySelector(".child-accordion-trigger");
  if (!trigger || childAccordion.dataset.childAccordionBound === "true") return;

  setChildAccordionExpanded(childAccordion, false);

  const toggleChildAccordion = (event) => {
    event.stopPropagation();
    if (childAccordion.dataset.toggleLocked === "true") return;
    childAccordion.dataset.toggleLocked = "true";
    window.setTimeout(() => {
      childAccordion.dataset.toggleLocked = "false";
    }, 180);
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    setChildAccordionExpanded(childAccordion, !expanded);
  };

  trigger.addEventListener("click", toggleChildAccordion);
  childAccordion.dataset.childAccordionBound = "true";
}

function setupChildAccordions(root = document) {
  const scopedChildAccordions = Array.from(root.querySelectorAll("[data-child-accordion]"));
  scopedChildAccordions.forEach(setupChildAccordion);
}

function isAccordionSectionExpanded(section) {
  const trigger = section?.querySelector(".accordion-trigger");
  return trigger?.getAttribute("aria-expanded") === "true";
}

function getSectionAnchorElement(section) {
  if (!section) return null;
  return section.querySelector(".accordion-trigger") || section.querySelector(".dashboard-header") || section;
}

function getSectionHeadingTargetY(section) {
  const trigger = getSectionAnchorElement(section);
  if (!trigger) return window.scrollY;
  const topOffset = getViewportTopOffset();
  return Math.max(0, window.scrollY + trigger.getBoundingClientRect().top - topOffset);
}

function getViewportTopOffset() {
  const bodyStyle = window.getComputedStyle(document.body);
  const bodyPaddingTop = Number.parseFloat(bodyStyle.paddingTop) || 0;
  const htmlStyle = window.getComputedStyle(document.documentElement);
  const htmlScrollPaddingTop = Number.parseFloat(htmlStyle.scrollPaddingTop) || 0;
  return Math.max(bodyPaddingTop, htmlScrollPaddingTop, 0);
}

function distanceBasedScrollBehavior(distance) {
  if (distance > NAV_CLOSE_FAR_DISTANCE) return "auto";
  return "smooth";
}

function alignSectionHeadingAfterToggle(section) {
  if (!section) return Promise.resolve();
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        ensureSectionHeadingVisible(section);
        resolve();
      });
    });
  });
}

function ensureSectionHeadingVisible(section, { behavior } = {}) {
  if (!section) return;
  const trigger = getSectionAnchorElement(section);
  if (!trigger) return;
  const targetY = getSectionHeadingTargetY(section);
  const distance = Math.abs(window.scrollY - targetY);
  window.scrollTo({
    top: targetY,
    behavior: behavior || distanceBasedScrollBehavior(distance),
  });
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 640px)").matches;
}

function scrollToTopAfterMobileUpdate() {
  if (!isMobileViewport()) return;
  const token = ++mobileUpdateScrollToken;
  const scrollToPageStart = () => {
    if (token !== mobileUpdateScrollToken) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        window.requestAnimationFrame(scrollToPageStart);
      }, 80);
    });
  });
}

function scrollToPageAbsoluteTop() {
  if (isMobileViewport()) {
    scrollToTopAfterMobileUpdate();
    return;
  }
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  });
}

function resolveCurrentPrimaryPanel() {
  const activePanel = primaryMainPanels.find((panel) => !panel.hidden && panel.classList.contains("is-active"));
  return activePanel || primaryMainPanels.find((panel) => !panel.hidden) || null;
}

function resolveCurrentPrimaryTopAnchor() {
  const sectionIds = PRIMARY_MAIN_SECTION_IDS[activePrimaryMainTab] || [];
  for (const sectionId of sectionIds) {
    const section = document.getElementById(sectionId);
    if (section) return section;
  }
  return resolveCurrentPrimaryPanel();
}

function resolvePrimaryTopAnchorByTab(tabName = activePrimaryMainTab) {
  const sectionIds = PRIMARY_MAIN_SECTION_IDS[tabName] || [];
  for (const sectionId of sectionIds) {
    const section = document.getElementById(sectionId);
    if (section) return section;
  }
  return document.querySelector(`[data-primary-main-panel="${tabName}"]`) || resolveCurrentPrimaryPanel();
}

function getPrimaryTopAnchorOffset() {
  const viewportOffset = getViewportTopOffset();
  if (!primaryMainTabbar) return viewportOffset;
  const tabbarRect = primaryMainTabbar.getBoundingClientRect();
  const stickyTopThreshold = viewportOffset + 1;
  const isSticky = tabbarRect.top <= stickyTopThreshold;
  if (!isSticky) return viewportOffset;
  return Math.max(viewportOffset + tabbarRect.height + 10, 0);
}

function resolvePrimaryHeadingFrame(topAnchor) {
  if (!topAnchor) return null;
  if (topAnchor.matches?.("h1, h2, h3")) return topAnchor;
  return topAnchor.querySelector(".dashboard-header h2, .section-heading h2, .section-header h2");
}

function getPrimaryTitlePeekHeight(headingFrame, topOffset) {
  if (!headingFrame) return 0;
  const headingRect = headingFrame.getBoundingClientRect();
  const headingHeight = Math.max(headingRect.height, 0);
  if (headingHeight <= 0) return 0;

  const tabbarHeight = Math.max(primaryMainTabbar?.getBoundingClientRect().height || 0, 0);
  const headingBasedPeek = headingHeight * 0.22;
  const chromeBasedPeek = Math.max(topOffset, tabbarHeight) * 0.12;
  const minReasonablePeek = headingHeight * 0.14;
  const maxReasonablePeek = headingHeight * 0.38;

  return Math.min(maxReasonablePeek, Math.max(headingBasedPeek, chromeBasedPeek, minReasonablePeek));
}

function getPrimaryTopButtonTargetY(topAnchor) {
  if (!topAnchor) return 0;
  const topOffset = getPrimaryTopAnchorOffset();
  const headingFrame = resolvePrimaryHeadingFrame(topAnchor);
  if (!headingFrame) {
    return Math.max(0, window.scrollY + topAnchor.getBoundingClientRect().top - topOffset);
  }

  const headingRect = headingFrame.getBoundingClientRect();
  const headingHeight = Math.max(headingRect.height, 0);
  const peekHeight = getPrimaryTitlePeekHeight(headingFrame, topOffset);
  const headingTopAbsolute = window.scrollY + headingRect.top;
  const headingViewportTop = topOffset - headingHeight + peekHeight;
  return Math.max(0, headingTopAbsolute - headingViewportTop);
}

function scrollToElementWithOffset(targetElement, { behavior = "smooth" } = {}) {
  if (!targetElement) return;
  const topOffset = getPrimaryTopAnchorOffset();
  const targetY = Math.max(0, window.scrollY + targetElement.getBoundingClientRect().top - topOffset);
  const distance = Math.abs(window.scrollY - targetY);
  window.scrollTo({
    top: targetY,
    behavior: behavior || distanceBasedScrollBehavior(distance),
  });
}

function scrollCurrentPrimaryPanelToTop() {
  const distance = Math.abs(window.scrollY);
  window.scrollTo({
    top: 0,
    behavior: distanceBasedScrollBehavior(distance),
  });
}

function scrollPrimaryMainTabToTop(tabName, { behavior = "auto" } = {}) {
  const topAnchor = resolvePrimaryTopAnchorByTab(tabName);
  if (!topAnchor) return;
  scrollToElementWithOffset(topAnchor, { behavior });
}

function openDashboardSubTab(tabName, { behavior = "smooth" } = {}) {
  const dashboardSubTabMap = {
    age65Assets: "asset-formation",
  };
  const nextDashboardSubTab = dashboardSubTabMap[tabName];
  if (!nextDashboardSubTab) return;

  setPrimaryMainTab("dashboard");
  setDashboardAssetGraphTab(nextDashboardSubTab);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const scrollTarget = dashboardAssetGraphTabbar || dashboardAge65AssetsTab || dashboardAge65AssetsPanel;
      if (!scrollTarget) return;
      scrollToElementWithOffset(scrollTarget, { behavior });
    });
  });
}

function switchPrimaryMainTabAndScrollTop(tabName) {
  const nextTab = tabName || "dashboard";
  const previousTab = activePrimaryMainTab;
  if (previousTab && previousTab !== nextTab) {
    resetPrimaryMainTabState(previousTab);
  }
  setPrimaryMainTab(nextTab);
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      scrollCurrentPrimaryPanelToTop();
    });
  });
}

function resetInputTabState() {
  resetProfileFormFields();
  resetRecurringFormFields();
  resetLifeEventFormFields();
  resetTransactionFormFields({ date: todayISO() });
  setInputMainTab("monthly");
  Object.keys(activeInputSubTabs).forEach((groupName) => {
    setInputSubTab(groupName, "register");
  });
}

function resetDashboardTabState() {
  setIncomeMainTab("expense-balance");
  dashboardAssetGrowthMetric = "endingBalance";
  updateDashboardAssetGrowthMetricToggleUI();
  setDashboardAssetGraphTab("current-assets");
  render();
}

function resetAssetsTabState() {
  setAssetMainTab("formation");
  resetProfileFormFields();
  setInputSubTab("asset-formation", "register");
}

function resetPrimaryMainTabState(tabName) {
  switch (tabName) {
    case "dashboard":
      resetDashboardTabState();
      break;
    case "assets":
      resetAssetsTabState();
      break;
    case "input":
      resetInputTabState();
      break;
    default:
      break;
  }
}

function setupFloatingTopButton() {
  if (!floatingTopButton) return;

  const handleTopAction = () => {
    scrollCurrentPrimaryPanelToTop();
  };

  floatingTopButton.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
    event.preventDefault();
    const button = event.currentTarget;
    if (!(button instanceof HTMLElement)) return;
    button.dataset.suppressNextClickUntil = String(Date.now() + 500);
    handleTopAction();
  });

  floatingTopButton.addEventListener("click", (event) => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLElement)) return;
    const suppressNextClickUntil = Number.parseInt(button.dataset.suppressNextClickUntil || "0", 10);
    if (Date.now() < suppressNextClickUntil) {
      button.dataset.suppressNextClickUntil = "0";
      return;
    }
    handleTopAction();
  });
}

function scrollToSection(
  sectionId,
  {
    toggleIfExpanded = false,
    assetMainTab,
    syncInputMainTabFromSection = true,
  } = {}
) {
  const targetSection = sectionId ? document.getElementById(sectionId) : null;
  if (!targetSection) return;
  const primaryMainTab = resolvePrimaryMainTabBySectionId(sectionId);
  const incomeMainTab = resolveIncomeMainTabBySectionId(sectionId);
  const inputMainTab = syncInputMainTabFromSection ? resolveInputMainTabBySectionId(sectionId) : "";
  const inputSubTab = resolveInputSubTabBySectionId(sectionId);
  if (primaryMainTab) {
    setPrimaryMainTab(primaryMainTab);
  }
  if (incomeMainTab) {
    setIncomeMainTab(incomeMainTab);
  }
  if (inputMainTab) {
    setInputMainTab(inputMainTab);
  }
  if (inputSubTab.group && inputSubTab.tab) {
    setInputSubTab(inputSubTab.group, inputSubTab.tab);
  }

  const proceedScroll = () => {
    if (sectionId === "section-assets" && assetMainTab) {
      setAssetMainTab(assetMainTab);
    }

    if (targetSection.dataset.accordionSection === undefined) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const expanded = isAccordionSectionExpanded(targetSection);
    if (expanded) {
      if (toggleIfExpanded) {
        setAccordionExpanded(targetSection, false).then(() => {
          ensureSectionHeadingVisible(targetSection);
        });
        return;
      }
      const distance = Math.abs(window.scrollY - getSectionHeadingTargetY(targetSection));
      ensureSectionHeadingVisible(targetSection, {
        behavior: distanceBasedScrollBehavior(distance),
      });
      return;
    }

    setAccordionExpanded(targetSection, true).then(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          ensureSectionHeadingVisible(targetSection);
        });
      });
    });
  };

  if (primaryMainTab || inputMainTab) {
    window.requestAnimationFrame(proceedScroll);
  } else {
    proceedScroll();
  }
}

function setupDashboardCardNavigation() {
  const handleDashboardCardAction = (card) => {
    const sectionId = card?.dataset?.dashboardJumpSection;
    if (!sectionId) return;
    const cashflowSubTab = card?.dataset?.dashboardJumpCashflowSubTab || "";
    if (cashflowSubTab) {
      setCashflowSubTab(cashflowSubTab);
    }
    scrollToSection(sectionId, {
      toggleIfExpanded: false,
      assetMainTab: card.dataset.dashboardJumpAssetTab,
    });
  };

  dashboardJumpCards.forEach((card) => {
    card.addEventListener("pointerup", (event) => {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      event.preventDefault();
      const pressedCard = event.currentTarget;
      if (!(pressedCard instanceof HTMLElement)) return;
      handleDashboardCardAction(pressedCard);
    });
    card.addEventListener("click", (event) => {
      const pressedCard = event.currentTarget;
      if (!(pressedCard instanceof HTMLElement)) return;
      handleDashboardCardAction(pressedCard);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const pressedCard = event.currentTarget;
      if (!(pressedCard instanceof HTMLElement)) return;
      handleDashboardCardAction(pressedCard);
    });
  });

  if (!dashboardRetirementCard) return;
  const openAge65AssetsFromDashboard = () => {
    openDashboardSubTab("age65Assets", { behavior: "smooth" });
  };
  dashboardRetirementCard.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
    event.preventDefault();
    dashboardRetirementCard.dataset.suppressNextClickUntil = String(Date.now() + 500);
    openAge65AssetsFromDashboard();
  });
  dashboardRetirementCard.addEventListener("click", () => {
    const suppressNextClickUntil = Number.parseInt(dashboardRetirementCard.dataset.suppressNextClickUntil || "0", 10);
    if (Date.now() < suppressNextClickUntil) {
      dashboardRetirementCard.dataset.suppressNextClickUntil = "0";
      return;
    }
    openAge65AssetsFromDashboard();
  });
  dashboardRetirementCard.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openAge65AssetsFromDashboard();
  });
}

function setupDashboardAssetGraphTabs() {
  dashboardAssetGraphTabs.forEach((button) => {
    button.addEventListener("click", () => {
      setDashboardAssetGraphTab(button.dataset.dashboardAssetGraphTab || "current-assets");
    });
  });
}

function handleDashboardViewFilterChange() {
  const nextAverageMode = dashboardViewFilterControls.mode?.value === "average" ? "average" : "month";
  sharedAverageViewState = { averageMode: nextAverageMode };
  sharedYearMonthState = {
    year: dashboardViewFilterControls.year?.value || sharedYearMonthState.year,
    month: dashboardViewFilterControls.month?.value || sharedYearMonthState.month,
  };
  render();
}

function handleExpenseViewFilterChange() {
  const nextAverageMode = expenseViewFilterControls.mode?.value === "average" ? "average" : "month";
  sharedAverageViewState = { averageMode: nextAverageMode };
  sharedYearMonthState = {
    year: expenseViewFilterControls.year?.value || sharedYearMonthState.year,
    month: expenseViewFilterControls.month?.value || sharedYearMonthState.month,
  };
  render();
}

function handleHistoryViewFilterChange() {
  sharedYearMonthState = {
    year: historyViewFilterControls.year?.value || sharedYearMonthState.year,
    month: historyViewFilterControls.month?.value || sharedYearMonthState.month,
  };
  render();
}

function setupSharedViewFilters() {
  dashboardViewFilterControls.mode?.addEventListener("change", handleDashboardViewFilterChange);
  dashboardViewFilterControls.year?.addEventListener("change", handleDashboardViewFilterChange);
  dashboardViewFilterControls.month?.addEventListener("change", handleDashboardViewFilterChange);
  expenseViewFilterControls.mode?.addEventListener("change", handleExpenseViewFilterChange);
  expenseViewFilterControls.year?.addEventListener("change", handleExpenseViewFilterChange);
  expenseViewFilterControls.month?.addEventListener("change", handleExpenseViewFilterChange);
  historyViewFilterControls.year?.addEventListener("change", handleHistoryViewFilterChange);
  historyViewFilterControls.month?.addEventListener("change", handleHistoryViewFilterChange);
}

function init() {
  setupKeyboardLayoutStability();
  activePrimaryMainTab = "dashboard";

  const settings = loadSettings();
  const initialMonth = todayISO().slice(0, 7);
  const initialYearMonth = resolveInitialYearMonthState(initialMonth);
  sharedYearMonthState = { ...initialYearMonth };
  sharedAverageViewState = { averageMode: "month" };

  dateInput.value = todayISO();
  entryStartMonthInput.value = settings.entryStartMonth || todayISO().slice(0, 7);
  syncCategoryOptions();
  syncRecurringCategoryOptions();
  syncRecurringDayOptions();
  syncLifeEventCategoryOptions();
  setupMemoCompactInputs();
  setTransactionFormMode(false);
  resetRecurringFormFields();
  resetLifeEventFormFields();
  renderPlans(settings);

  form.addEventListener("submit", addTransaction);
  typeInput.addEventListener("change", syncCategoryOptions);
  transactionCancelButton?.addEventListener("click", cancelTransactionEdit);
  setupSharedViewFilters();
  setupFormattedAmountInput(amountInput);
  setupFormattedAmountInput(recurringAmountInput);
  setupFormattedAmountInput(lifeEventAmountInput);

  profileForm.addEventListener("submit", (event) => event.preventDefault());
  profileBasicSaveButton?.addEventListener("click", saveBasicProfileSettings);
  profileSubmitButton?.addEventListener("click", () => saveAssetFormationSettings(planEditorList || assetPlanEditorList));
  profileCancelButton?.addEventListener("click", cancelProfileEdit);
  assetProfileSubmitButton?.addEventListener("click", () => saveAssetFormationSettings(assetPlanEditorList || planEditorList));
  assetProfileCancelButton?.addEventListener("click", cancelAssetProfileEdit);
  profileBackupExportButton?.addEventListener("click", downloadBackupFile);
  profileBackupImportButton?.addEventListener("click", () => profileBackupFileInput?.click());
  profileBackupFileInput?.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    importBackupFile(input.files?.[0]);
  });
  recurringForm.addEventListener("submit", addRecurringExpense);
  recurringCancelButton?.addEventListener("click", cancelRecurringExpenseEdit);
  lifeEventForm?.addEventListener("submit", addLifeEvent);
  lifeEventTypeInput?.addEventListener("change", handleLifeEventTypeChange);
  lifeEventMonthInput?.addEventListener("change", updateLifeEventAgePreview);
  lifeEventCancelButton?.addEventListener("click", cancelLifeEventEdit);
  cashflowIncomeSettingsForm?.addEventListener("input", () => {
    const assumptions = {
      salaryGrowthRateBefore60: parseRateInput(cashflowSalaryGrowthRateBefore60Input?.value),
      inflationRate: parseRateInput(cashflowInflationRateInput?.value),
    };
    saveCashflowAssumptions(assumptions);
    refreshCashflowTableOnly();
  });
  cashflowExpenseSettingsForm?.addEventListener("input", () => {
    const assumptions = {
      salaryGrowthRateBefore60: parseRateInput(cashflowSalaryGrowthRateBefore60Input?.value),
      inflationRate: parseRateInput(cashflowInflationRateInput?.value),
    };
    saveCashflowAssumptions(assumptions);
    refreshCashflowTableOnly();
  });
  cashflowIncomeRetirementMonthInput?.addEventListener("change", () => {
    const settings = loadCashflowIncomeSettings();
    settings.retirementMonth = parseMonth(cashflowIncomeRetirementMonthInput.value) ? cashflowIncomeRetirementMonthInput.value : "";
    saveCashflowIncomeSettings(settings);
    render();
  });
  cashflowIncomeScenarioAddButton?.addEventListener("click", addCashflowIncomeScenario);
  cashflowIncomeScenarioList?.addEventListener("click", (event) => {
    const button = event.target.closest('button[data-income-scenario-action="remove"]');
    if (!button) return;
    const scenarioBlock = button.closest("[data-scenario-id]");
    removeCashflowIncomeScenarioById(scenarioBlock?.dataset.scenarioId || "");
  });
  cashflowIncomeScenarioList?.addEventListener("input", (event) => {
    const target = event.target.closest("[data-income-scenario-field]");
    if (!target) return;
    const scenarioBlock = target.closest("[data-scenario-id]");
    updateCashflowIncomeScenarioField(
      scenarioBlock?.dataset.scenarioId || "",
      target.dataset.incomeScenarioField,
      target.value
    );
    refreshCashflowTableOnly();
  });
  cashflowExpenseScenarioAddButton?.addEventListener("click", addCashflowExpenseScenario);
  cashflowExpenseScenarioList?.addEventListener("click", (event) => {
    const button = event.target.closest('button[data-expense-scenario-action="remove"]');
    if (!button) return;
    const scenarioBlock = button.closest("[data-scenario-id]");
    removeCashflowExpenseScenarioById(scenarioBlock?.dataset.scenarioId || "");
  });
  cashflowExpenseScenarioList?.addEventListener("input", (event) => {
    const target = event.target.closest("[data-expense-scenario-field]");
    if (!target) return;
    const scenarioBlock = target.closest("[data-scenario-id]");
    updateCashflowExpenseScenarioField(
      scenarioBlock?.dataset.scenarioId || "",
      target.dataset.expenseScenarioField,
      target.value
    );
    refreshCashflowTableOnly();
  });
  cashflowDownloadPdfButton?.addEventListener("click", downloadCashflowPdf);
  buildPrimaryMainPanels();
  buildInputMainPanels();
  buildIncomeMainPanels();
  setupPrimaryMainTabs();
  setupAssetMainTabs();
  setupCashflowSubTabs();
  setupIncomeMainTabs();
  setupInputMainTabs();
  setupInputSubTabs();
  setupSectionAccordions();
  setupChildAccordions();
  setupFloatingTopButton();
  setupDashboardCardNavigation();
  setupDashboardAssetGraphTabs();
  setDashboardAssetGraphTab("current-assets");
  assetGrowthMetricToggle?.addEventListener("click", handleAssetGrowthMetricToggleClick);

  render();
  scrollPrimaryMainTabToTop("dashboard", { behavior: "auto" });
}

init();
