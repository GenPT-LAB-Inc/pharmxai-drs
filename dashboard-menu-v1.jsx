import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Camera,
  ChevronDown,
  Menu,
  Search,
} from 'lucide-react';

const WEEKLY_UPLOAD_SUMMARY = [
  {
    date: '2026-01-06',
    total: 3,
    counts: { analyzing: 1, completed: 1, failed: 1 },
  },
  {
    date: '2026-01-05',
    total: 4,
    counts: { analyzing: 2, completed: 2, failed: 0 },
  },
  {
    date: '2026-01-04',
    total: 2,
    counts: { analyzing: 0, completed: 2, failed: 0 },
  },
  {
    date: '2026-01-03',
    total: 5,
    counts: { analyzing: 1, completed: 3, failed: 1 },
  },
  {
    date: '2026-01-02',
    total: 1,
    counts: { analyzing: 0, completed: 1, failed: 0 },
  },
  {
    date: '2026-01-01',
    total: 0,
    counts: { analyzing: 0, completed: 0, failed: 0 },
  },
  {
    date: '2025-12-31',
    total: 2,
    counts: { analyzing: 1, completed: 1, failed: 0 },
  },
];

const EXPIRY_BASE_DATE = '2026-01-06';
const EXPIRY_MS_PER_DAY = 1000 * 60 * 60 * 24;

const DASHBOARD_EXPIRY_ITEMS = [
  {
    id: 1,
    supplierName: '비타민하우스',
    productName: '프리미엄 오메가3',
    lot: 'V203901',
    qty: 12,
    expiry: '2025-12-20',
  },
  {
    id: 2,
    supplierName: '(주)녹십자',
    productName: '탁센 연질캡슐',
    lot: 'C998877',
    qty: 50,
    expiry: '2026-02-15',
  },
  {
    id: 3,
    supplierName: '(주)유한양행',
    productName: '삐콤씨 플러스',
    lot: 'Y554433',
    qty: 30,
    expiry: '2026-04-10',
  },
  {
    id: 4,
    supplierName: '종근당',
    productName: '제놀 쿨 파스',
    lot: 'E554433',
    qty: 80,
    expiry: '2026-06-25',
  },
  {
    id: 5,
    supplierName: '비타민하우스',
    productName: '멀티비타민 미네랄',
    lot: 'V203112',
    qty: 20,
    expiry: '2026-07-20',
  },
  {
    id: 6,
    supplierName: '(주)녹십자',
    productName: '비맥스 메타정',
    lot: 'D112233',
    qty: 18,
    expiry: '2026-09-15',
  },
  {
    id: 7,
    supplierName: '(주)유한양행',
    productName: '메가트루포커스정',
    lot: 'Y667788',
    qty: 26,
    expiry: '2027-01-02',
  },
  {
    id: 8,
    supplierName: '종근당',
    productName: '고운자임맘정',
    lot: 'C445566',
    qty: 40,
    expiry: '2027-01-04',
  },
  {
    id: 9,
    supplierName: '비타민하우스',
    productName: '단쇄지방산 SCFA455',
    lot: 'A203947',
    qty: 15,
    expiry: '2027-03-12',
  },
  {
    id: 10,
    supplierName: '(주)녹십자',
    productName: '판콜 에이',
    lot: 'G110022',
    qty: 60,
    expiry: '2027-06-30',
  },
  {
    id: 11,
    supplierName: '(주)유한양행',
    productName: '에어비타',
    lot: 'Y220019',
    qty: 22,
    expiry: '2027-10-05',
  },
  {
    id: 12,
    supplierName: '종근당',
    productName: '락토핏 생유산균',
    lot: 'C550011',
    qty: 28,
    expiry: '2027-12-15',
  },
  {
    id: 13,
    supplierName: '비타민하우스',
    productName: '콜라겐 플러스',
    lot: 'V330099',
    qty: 24,
    expiry: '2028-01-20',
  },
  {
    id: 14,
    supplierName: '(주)녹십자',
    productName: '지씨가르시니아',
    lot: 'G770031',
    qty: 14,
    expiry: '2028-06-01',
  },
  {
    id: 15,
    supplierName: '(주)유한양행',
    productName: '웰씨 아연',
    lot: 'Y880212',
    qty: 32,
    expiry: '2029-01-15',
  },
  {
    id: 16,
    supplierName: '종근당',
    productName: '프리바이오틱스',
    lot: 'C900211',
    qty: 18,
    expiry: '2030-05-10',
  },
];

const EXPIRY_GROUPS = [
  { id: 'risk', title: '위험', range: '6개월 미만' },
  { id: 'caution', title: '주의', range: '6개월 이상 ~ 12개월 미만' },
  { id: 'normal', title: '보통', range: '12개월 이상 ~ 24개월 미만' },
  { id: 'safe', title: '안전', range: '24개월 이상' },
];

const EXPIRY_GROUP_TONE = {
  risk: {
    card: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700 border border-red-200',
  },
  caution: {
    card: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  normal: {
    card: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  safe: {
    card: 'bg-green-50 border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700 border border-green-200',
  },
};

const REPORT_MONTH_KEYS = [
  '2025-08',
  '2025-09',
  '2025-10',
  '2025-11',
  '2025-12',
  '2026-01',
];
const YOY_MONTH_KEYS = [
  '2024-08',
  '2024-09',
  '2024-10',
  '2024-11',
  '2024-12',
  '2025-01',
];

const MOCK_MONTHLY_PURCHASE_METRICS = {
  amount: {
    current: [17200000, 19800000, 18100000, 23300000, 21400000, 26100000],
    previous: [15800000, 17300000, 16900000, 20100000, 18900000, 21200000],
  },
  itemCount: {
    current: [205, 236, 220, 248, 231, 270],
    previous: [192, 210, 204, 223, 215, 235],
  },
  quantity: {
    current: [3100, 3520, 3340, 3710, 3450, 4050],
    previous: [2950, 3180, 3090, 3330, 3210, 3580],
  },
};

const MOCK_SUPPLIER_SHARE_AMOUNT_6M = [
  { id: 'vitaminhouse', label: '비타민하우스', amount: 38200000 },
  { id: 'gc', label: '(주)녹십자', amount: 29800000 },
  { id: 'yuhan', label: '(주)유한양행', amount: 22600000 },
  { id: 'chong', label: '종근당', amount: 17100000 },
  { id: 'others', label: '기타', amount: 16300000 },
];

const MOCK_PRODUCT_SHARE_AMOUNT_TOP5_6M = [
  { id: 'taxen', label: '탁센 연질캡슐', amount: 18400000 },
  { id: 'bmax', label: '비맥스 메타정', amount: 16200000 },
  { id: 'scfa', label: '단쇄지방산 SCFA455', amount: 14100000 },
  { id: 'omega', label: '프리미엄 오메가3', amount: 12700000 },
  { id: 'nmn', label: '미라클 프로젝트 NMN250', amount: 11300000 },
  { id: 'others', label: '기타', amount: 57100000 },
];

const SEARCH_ITEMS = [
  {
    id: 'INV-2026-003',
    supplierName: '비타민하우스',
    status: 'failed',
    timeLabel: '방금',
    itemCount: 1,
    note: '중복 업로드로 미처리',
  },
  {
    id: 'INV-2026-002',
    supplierName: '(주)녹십자',
    status: 'analyzing',
    timeLabel: '5분 전',
    itemCount: 3,
    note: 'AI 분석 중',
  },
  {
    id: 'INV-2026-001',
    supplierName: '비타민하우스',
    status: 'completed',
    timeLabel: '1시간 전',
    itemCount: 3,
    note: '검수 완료',
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'review',
    title: '검수 필요',
    description: '비타민하우스 | 2026-001 · 1건',
    time: '방금',
    unread: true,
  },
  {
    id: 2,
    type: 'ocr',
    title: 'OCR 완료',
    description: '(주)녹십자 | 2026-002 · 3건',
    time: '5분 전',
    unread: true,
  },
  {
    id: 3,
    type: 'completed',
    title: '검수 완료',
    description: '비타민하우스 | 2026-001',
    time: '1시간 전',
    unread: false,
  },
];

const NOTIFICATION_TONE = {
  review: {
    badgeClass: 'bg-amber-50 border border-amber-200',
    dotClass: 'bg-amber-500',
  },
  ocr: {
    badgeClass: 'bg-blue-50 border border-blue-200',
    dotClass: 'bg-blue-500',
  },
  completed: {
    badgeClass: 'bg-green-50 border border-green-200',
    dotClass: 'bg-green-500',
  },
};

const SEARCH_SCOPES = [
  { id: 'all', label: '전체' },
  { id: 'invoice', label: '거래명세서' },
  { id: 'supplier', label: '공급사' },
];

const RECENT_SEARCHES = ['비타민하우스', 'INV-2026-002', '유효기간'];

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const STATUS_ORDER = ['analyzing', 'completed', 'failed'];
const STATUS_LABELS = {
  analyzing: 'AI분석중',
  completed: '완료',
  failed: '미처리',
};
const STATUS_TONE = {
  analyzing: 'bg-blue-50 text-blue-600 border-blue-200',
  completed: 'bg-green-50 text-green-600 border-green-200',
  failed: 'bg-red-50 text-red-600 border-red-200',
};

const DONUT_COLORS = [
  { stroke: '#3b82f6', dot: '#3b82f6' },
  { stroke: '#10b981', dot: '#10b981' },
  { stroke: '#f59e0b', dot: '#f59e0b' },
  { stroke: '#8b5cf6', dot: '#8b5cf6' },
  { stroke: '#64748b', dot: '#64748b' },
  { stroke: '#9ca3af', dot: '#9ca3af' },
];

const CHART_THEME_STYLES = {
  blue: {
    currentGradient: 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 55%, #2563eb 100%)',
    previousGradient: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%)',
    lineColor: '#1d4ed8',
    barShadow: '0 6px 10px rgba(37, 99, 235, 0.2)',
  },
  indigo: {
    currentGradient: 'linear-gradient(180deg, #818cf8 0%, #6366f1 55%, #4f46e5 100%)',
    previousGradient: 'linear-gradient(180deg, #e0e7ff 0%, #c7d2fe 100%)',
    lineColor: '#4338ca',
    barShadow: '0 6px 10px rgba(79, 70, 229, 0.22)',
  },
  emerald: {
    currentGradient: 'linear-gradient(180deg, #34d399 0%, #10b981 55%, #059669 100%)',
    previousGradient: 'linear-gradient(180deg, #d1fae5 0%, #a7f3d0 100%)',
    lineColor: '#047857',
    barShadow: '0 6px 10px rgba(5, 150, 105, 0.2)',
  },
};

const formatDateLabel = (value) => {
  const date = new Date(`${value}T00:00:00`);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayLabel = DAY_LABELS[date.getDay()];
  return `${year}.${month}.${day} (${dayLabel})`;
};

const formatShortDate = (value) => {
  if (!value) return '-';
  return value.replace(/-/g, '.');
};

const parseDate = (value) => new Date(`${value}T00:00:00`);

const addDays = (value, amount) => {
  const date = parseDate(value);
  date.setDate(date.getDate() + amount);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EXPIRY_PREVIOUS_BASE_DATE = addDays(EXPIRY_BASE_DATE, -7);

const getRemainingDays = (expiryDate, baseDate = EXPIRY_BASE_DATE) => {
  const expiry = parseDate(expiryDate);
  const base = parseDate(baseDate);
  return Math.ceil((expiry - base) / EXPIRY_MS_PER_DAY);
};

const getExpiryGroupId = (days) => {
  if (days < 180) return 'risk';
  if (days < 365) return 'caution';
  if (days < 730) return 'normal';
  return 'safe';
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700 border border-green-200';
    case 'analyzing':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'failed':
      return 'bg-red-100 text-red-700 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-600 border border-gray-200';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'completed':
      return '완료';
    case 'analyzing':
      return 'AI 분석중';
    case 'failed':
      return '미처리';
    default:
      return '대기';
  }
};

const formatNumber = (value) => new Intl.NumberFormat('ko-KR').format(Math.round(value));

const formatKrw = (value) => `₩${formatNumber(value)}`;

const formatKrwCompact = (value) => {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);

  if (abs >= 100000000) {
    return `${sign}₩${(abs / 100000000).toFixed(1)}억`;
  }

  if (abs >= 10000) {
    return `${sign}₩${formatNumber(Math.round(abs / 10000))}만`;
  }

  return `${sign}₩${formatNumber(abs)}`;
};

const formatMonthLabel = (monthKey) => {
  const [, mm] = monthKey.split('-');
  return `${Number(mm)}월`;
};

const formatMonthRangeLabel = (monthKeys) => {
  if (!monthKeys?.length) return '';
  const start = monthKeys[0].replace('-', '.');
  const end = monthKeys[monthKeys.length - 1].replace('-', '.');
  return `${start}~${end}`;
};

const sumValues = (values) => values.reduce((acc, value) => acc + value, 0);

const cumulativeValues = (values) => {
  let running = 0;
  return values.map((value) => {
    running += value;
    return running;
  });
};

const formatYoYChange = (current, previous) => {
  if (!previous) return '—';
  const delta = (current - previous) / previous;
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${(delta * 100).toFixed(1)}%`;
};

function StatToggle({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? 'border-blue-200 bg-blue-50 text-blue-600'
          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}

function BarCumulativeChart({
  months,
  currentValues,
  previousValues,
  showPrevious,
  showCumulative,
  theme = 'blue',
  heightClass = 'h-28',
  showXAxisLabels = true,
  showYAxisLabels = false,
  yAxisLabelFormatter,
}) {
  const themeStyles = CHART_THEME_STYLES[theme] || CHART_THEME_STYLES.blue;
  const isCumulativeView = showCumulative;
  const currentCumulative = cumulativeValues(currentValues);
  const previousCumulative = showPrevious ? cumulativeValues(previousValues) : [];
  const valuesForMax = isCumulativeView
    ? [...currentCumulative, ...(showPrevious ? previousCumulative : [])]
    : [...currentValues, ...(showPrevious ? previousValues : [])];
  const maxValue = Math.max(...valuesForMax, 1);
  const labelFormatter = yAxisLabelFormatter || formatNumber;
  const yAxisLabels = showYAxisLabels
    ? [
        Math.round(maxValue),
        Math.round(maxValue * 0.66),
        Math.round(maxValue * 0.33),
        0,
      ]
    : [];

  const barHeightPct = (value) => {
    if (value <= 0) return 0;
    const pct = (value / maxValue) * 100;
    return Math.max(pct, 2);
  };

  const buildLinePoints = (values) =>
    values.map((value, index) => {
      const x = ((index + 0.5) / months.length) * 100;
      const y = 100 - (value / maxValue) * 100;
      return { x, y };
    });
  const buildLinePath = (points) =>
    points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const currentLinePoints = isCumulativeView ? buildLinePoints(currentCumulative) : [];
  const currentLinePath = buildLinePath(currentLinePoints);
  const previousLinePoints =
    isCumulativeView && showPrevious ? buildLinePoints(previousCumulative) : [];
  const previousLinePath = buildLinePath(previousLinePoints);

  return (
    <div>
      <div
        className={`relative ${heightClass} rounded-xl border border-gray-100 bg-gradient-to-b from-gray-50 via-white to-white`}
      >
        {showYAxisLabels && (
          <div className="absolute left-2 top-2 bottom-2 z-30 flex flex-col justify-between text-[9px] text-gray-400">
            {yAxisLabels.map((value, idx) => (
              <span key={`${value}-${idx}`}>{labelFormatter(value)}</span>
            ))}
          </div>
        )}
        <div
          className={`absolute inset-0 ${showYAxisLabels ? 'pl-10 pr-3' : 'px-3'} py-2`}
        >
          <div className="relative h-full">
            <div className="absolute inset-0 z-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="h-px bg-gradient-to-r from-gray-200/70 via-gray-100/70 to-transparent"
                ></div>
              ))}
            </div>

            {!isCumulativeView && (
              <div className="absolute inset-0 z-10 flex items-end">
                {months.map((monthKey, index) => (
                  <div
                    key={monthKey}
                    className="flex flex-1 h-full items-end justify-center gap-1 px-1"
                    aria-label={`${monthKey} 데이터`}
                  >
                    {showPrevious && (
                      <div
                        className="rounded-md transition-all duration-300"
                        style={{
                          height: `${barHeightPct(previousValues[index] || 0)}%`,
                          width: '9px',
                          backgroundImage: themeStyles.previousGradient,
                        }}
                      ></div>
                    )}
                    <div
                      className="rounded-md transition-all duration-300"
                      style={{
                        height: `${barHeightPct(currentValues[index] || 0)}%`,
                        width: showPrevious ? '11px' : '15px',
                        backgroundImage: themeStyles.currentGradient,
                        boxShadow: themeStyles.barShadow,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            )}

            {isCumulativeView && currentLinePath && (
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 z-20 h-full w-full pointer-events-none"
              >
                {showPrevious && previousLinePath && (
                  <path
                    d={previousLinePath}
                    className="opacity-35"
                    strokeWidth="2"
                    fill="none"
                    stroke={themeStyles.lineColor}
                    strokeDasharray="4 4"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                <path
                  d={currentLinePath}
                  className="opacity-30"
                  strokeWidth="5"
                  fill="none"
                  stroke={themeStyles.lineColor}
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={currentLinePath}
                  strokeWidth="2.4"
                  fill="none"
                  stroke={themeStyles.lineColor}
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(15, 23, 42, 0.18))' }}
                />
              </svg>
            )}
            {isCumulativeView && currentLinePoints.length > 0 && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                {currentLinePoints.map((point) => (
                  <span
                    key={`${point.x}-${point.y}`}
                    className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-2"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      borderColor: themeStyles.lineColor,
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.18)',
                    }}
                  ></span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showXAxisLabels && (
        <div className="mt-2 flex text-[10px] text-gray-400">
          {months.map((monthKey) => (
            <div key={`${monthKey}-label`} className="flex-1 text-center">
              {formatMonthLabel(monthKey)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DonutChart({ segments, centerTopLabel, centerValueLabel }) {
  const total = segments.reduce((acc, item) => acc + item.value, 0) || 1;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const arcOverlap = segments.length > 1 ? 0.8 : 0;

  const arcs = [];
  let offset = 0;
  segments.forEach((segment, index) => {
    const fraction = segment.value / total;
    const rawDash =
      index === segments.length - 1 ? circumference - offset : fraction * circumference;
    const dash = Math.min(rawDash + arcOverlap, circumference);
    arcs.push({
      ...segment,
      dashArray: `${dash} ${Math.max(circumference - dash, 0)}`,
      dashOffset: -(offset + arcOverlap / 2),
    });
    offset += rawDash;
  });

  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
        <circle
          cx="21"
          cy="21"
          r={radius}
          fill="transparent"
          strokeWidth="6"
          className="stroke-gray-200"
        />
        {arcs.map((arc) => (
          <circle
            key={arc.id}
            cx="21"
            cy="21"
            r={radius}
            fill="transparent"
            strokeWidth="6"
            strokeDasharray={arc.dashArray}
            strokeDashoffset={arc.dashOffset}
            stroke={arc.strokeColor}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[10px] text-gray-400">{centerTopLabel}</p>
        <p className="text-sm font-bold text-gray-900">{centerValueLabel}</p>
      </div>
    </div>
  );
}

export default function DashboardApp({ onMenuChange, onDateSelect }) {
  const [isCameraFlowOpen, setIsCameraFlowOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [notiTab, setNotiTab] = useState('all');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchScope, setSearchScope] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWeeklyExpanded, setIsWeeklyExpanded] = useState(false);
  const [isAmountYoYEnabled, setIsAmountYoYEnabled] = useState(true);
  const [isAmountCumulativeEnabled, setIsAmountCumulativeEnabled] = useState(false);
  const [isVolumeYoYEnabled, setIsVolumeYoYEnabled] = useState(true);
  const [isVolumeCumulativeEnabled, setIsVolumeCumulativeEnabled] = useState(false);
  const [isRiskNewOpen, setIsRiskNewOpen] = useState(false);
  const [isCautionNewOpen, setIsCautionNewOpen] = useState(false);

  const openCameraFlow = () => {
    setIsCameraFlowOpen(true);
    setIsNotiOpen(false);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };
  const closeCameraFlow = () => setIsCameraFlowOpen(false);

  const toggleNotiPanel = () => {
    setIsNotiOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsCameraFlowOpen(false);
  };
  const closeNotiPanel = () => setIsNotiOpen(false);
  const markAllNotificationsRead = () =>
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  const markNotificationRead = (id) =>
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );

  const toggleMenuPanel = () => {
    setIsMenuOpen((prev) => !prev);
    setIsNotiOpen(false);
    setIsSearchOpen(false);
    setIsCameraFlowOpen(false);
  };
  const closeMenuPanel = () => setIsMenuOpen(false);

  const toggleSearchPanel = () => {
    setIsSearchOpen((prev) => !prev);
    setIsNotiOpen(false);
    setIsMenuOpen(false);
    setIsCameraFlowOpen(false);
  };
  const closeSearchPanel = () => setIsSearchOpen(false);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications]
  );
  const visibleNotifications = useMemo(
    () => notifications.filter((item) => (notiTab === 'unread' ? item.unread : true)),
    [notifications, notiTab]
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const normalizeValue = (value) => `${value ?? ''}`.toLowerCase();
  const searchResults = normalizedQuery
    ? SEARCH_ITEMS.filter((item) => {
        if (searchScope === 'invoice') {
          return normalizeValue(item.id).includes(normalizedQuery);
        }
        if (searchScope === 'supplier') {
          return normalizeValue(item.supplierName).includes(normalizedQuery);
        }
        return (
          normalizeValue(item.id).includes(normalizedQuery) ||
          normalizeValue(item.supplierName).includes(normalizedQuery) ||
          normalizeValue(item.note).includes(normalizedQuery)
        );
      })
    : [];

  const weeklyTotal = useMemo(
    () => WEEKLY_UPLOAD_SUMMARY.reduce((acc, item) => acc + item.total, 0),
    []
  );
  const weeklyStatusTotals = useMemo(
    () =>
      WEEKLY_UPLOAD_SUMMARY.reduce(
        (acc, item) => {
          STATUS_ORDER.forEach((status) => {
            acc[status] += item.counts?.[status] || 0;
          });
          return acc;
        },
        { analyzing: 0, completed: 0, failed: 0 }
      ),
    []
  );
  const weeklyVisibleItems = isWeeklyExpanded
    ? WEEKLY_UPLOAD_SUMMARY
    : WEEKLY_UPLOAD_SUMMARY.slice(0, 1);

  const expiryItems = useMemo(
    () =>
      DASHBOARD_EXPIRY_ITEMS.map((item) => {
        const remainingDays = getRemainingDays(item.expiry, EXPIRY_BASE_DATE);
        const previousRemainingDays = getRemainingDays(
          item.expiry,
          EXPIRY_PREVIOUS_BASE_DATE
        );
        return {
          ...item,
          remainingDays,
          groupId: getExpiryGroupId(remainingDays),
          previousGroupId: getExpiryGroupId(previousRemainingDays),
        };
      }),
    []
  );

  const expirySnapshot = useMemo(() => {
    const grouped = EXPIRY_GROUPS.reduce((acc, group) => {
      acc[group.id] = [];
      return acc;
    }, {});

    expiryItems.forEach((item) => {
      if (grouped[item.groupId]) {
        grouped[item.groupId].push(item);
      }
    });

    const groupStats = EXPIRY_GROUPS.reduce((acc, group) => {
      const items = grouped[group.id] || [];
      acc[group.id] = {
        count: items.length,
        totalQty: sumValues(items.map((entry) => entry.qty)),
      };
      return acc;
    }, {});

    const newRiskEntries = expiryItems
      .filter((item) => item.groupId === 'risk' && item.previousGroupId !== 'risk')
      .sort((a, b) => a.remainingDays - b.remainingDays);
    const newCautionEntries = expiryItems
      .filter((item) => item.groupId === 'caution' && item.previousGroupId !== 'caution')
      .sort((a, b) => a.remainingDays - b.remainingDays);

    return {
      groupStats,
      newRiskEntries,
      newCautionEntries,
    };
  }, [expiryItems]);

  useEffect(() => {
    if (expirySnapshot.newRiskEntries.length > 0) {
      setIsRiskNewOpen(true);
    }
    if (expirySnapshot.newCautionEntries.length > 0) {
      setIsCautionNewOpen(true);
    }
  }, [expirySnapshot.newRiskEntries.length, expirySnapshot.newCautionEntries.length]);

  const currentMonthRangeLabel = formatMonthRangeLabel(REPORT_MONTH_KEYS);
  const previousMonthRangeLabel = formatMonthRangeLabel(YOY_MONTH_KEYS);

  const amountCurrent = MOCK_MONTHLY_PURCHASE_METRICS.amount.current;
  const amountPrevious = MOCK_MONTHLY_PURCHASE_METRICS.amount.previous;
  const amountTotal = sumValues(amountCurrent);
  const amountPreviousTotal = sumValues(amountPrevious);
  const amountYoYDelta = amountPreviousTotal
    ? (amountTotal - amountPreviousTotal) / amountPreviousTotal
    : 0;

  const itemCountCurrent = MOCK_MONTHLY_PURCHASE_METRICS.itemCount.current;
  const itemCountPrevious = MOCK_MONTHLY_PURCHASE_METRICS.itemCount.previous;
  const itemCountTotal = sumValues(itemCountCurrent);
  const itemCountPreviousTotal = sumValues(itemCountPrevious);
  const itemCountYoYDelta = itemCountPreviousTotal
    ? (itemCountTotal - itemCountPreviousTotal) / itemCountPreviousTotal
    : 0;
  const itemCountMonthlyAvg = Math.round(itemCountTotal / itemCountCurrent.length);
  const itemCountPreviousMonthlyAvg = Math.round(itemCountPreviousTotal / itemCountPrevious.length);

  const quantityCurrent = MOCK_MONTHLY_PURCHASE_METRICS.quantity.current;
  const quantityPrevious = MOCK_MONTHLY_PURCHASE_METRICS.quantity.previous;
  const quantityTotal = sumValues(quantityCurrent);
  const quantityPreviousTotal = sumValues(quantityPrevious);
  const quantityYoYDelta = quantityPreviousTotal
    ? (quantityTotal - quantityPreviousTotal) / quantityPreviousTotal
    : 0;
  const quantityMonthlyAvg = Math.round(quantityTotal / quantityCurrent.length);
  const quantityPreviousMonthlyAvg = Math.round(quantityPreviousTotal / quantityPrevious.length);

  const supplierShareTotal = sumValues(
    MOCK_SUPPLIER_SHARE_AMOUNT_6M.map((item) => item.amount)
  );
  const supplierShareSegments = MOCK_SUPPLIER_SHARE_AMOUNT_6M.map((item, index) => {
    const color = DONUT_COLORS[index] || DONUT_COLORS[DONUT_COLORS.length - 1];
    return {
      ...item,
      value: item.amount,
      strokeColor: color.stroke,
      dotColor: color.dot,
    };
  });

  const productShareTotal = sumValues(
    MOCK_PRODUCT_SHARE_AMOUNT_TOP5_6M.map((item) => item.amount)
  );
  const productShareSegments = MOCK_PRODUCT_SHARE_AMOUNT_TOP5_6M.map((item, index) => {
    const color = DONUT_COLORS[index] || DONUT_COLORS[DONUT_COLORS.length - 1];
    return {
      ...item,
      value: item.amount,
      strokeColor: color.stroke,
      dotColor: color.dot,
    };
  });

  const handleDateSelect = (item) => {
    const dateLabel = formatDateLabel(item.date);
    if (onDateSelect) {
      onDateSelect({ date: item.date, label: dateLabel });
      return;
    }
    onMenuChange?.('invoice');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 z-50 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMenuChange?.('dashboard')}
            aria-label="대시보드로 이동"
            className="rounded-lg p-1 -ml-1 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            <span className="text-lg font-bold text-blue-900 tracking-tight">PharmxAI</span>
          </button>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            대시보드
          </span>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={toggleSearchPanel}
            aria-label="검색"
            className="text-gray-500 hover:text-gray-700"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={toggleNotiPanel}
            aria-label="알림"
            className="relative text-gray-500 hover:text-gray-700"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
          <button
            type="button"
            onClick={toggleMenuPanel}
            aria-label="메뉴"
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 space-y-4">
        {/* 최근 업로드 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">최근 업로드</p>
              <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-gray-500">
                <span className="font-semibold text-gray-700">총 {weeklyTotal}건</span>
                {STATUS_ORDER.map((status) => (
                  <span
                    key={status}
                    className={`rounded-full border px-2 py-0.5 font-semibold ${STATUS_TONE[status]}`}
                  >
                    {STATUS_LABELS[status]} {weeklyStatusTotals[status]}건
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={() => setIsWeeklyExpanded((prev) => !prev)}
                aria-expanded={isWeeklyExpanded}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                {isWeeklyExpanded ? '접기' : '펼치기'}
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${
                    isWeeklyExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100 transition-all duration-300">
            {weeklyVisibleItems.map((item) => {
              const dateLabel = formatDateLabel(item.date);
              const counts = item.counts || {};
              return (
                <button
                  key={item.date}
                  type="button"
                  onClick={() => handleDateSelect(item)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{dateLabel}</p>
                      <p className="text-[11px] text-gray-400">총 {item.total}건 업로드</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-300 -rotate-90" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {STATUS_ORDER.map((status) => (
                      <span
                        key={status}
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_TONE[status]}`}
                      >
                        {STATUS_LABELS[status]} {counts[status] || 0}건
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 유효기간 스냅샷 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gray-900">유효기간 점검</p>
              <p className="text-[10px] text-gray-400">
                기준 {formatDateLabel(EXPIRY_BASE_DATE)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onMenuChange?.('expiry')}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
            >
              점검 보기
              <ChevronDown className="h-3 w-3 -rotate-90" />
            </button>
          </div>
          <div className="px-4 py-2.5 space-y-2">
            <p className="text-[9px] text-gray-400 leading-tight">
              위험 &lt;6개월 · 주의 6~12개월 · 보통 12~24개월 · 안전 24개월 이상
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {EXPIRY_GROUPS.map((group) => {
                const tone = EXPIRY_GROUP_TONE[group.id];
                const stats = expirySnapshot.groupStats[group.id];
                return (
                  <div
                    key={group.id}
                    className={`rounded-lg border px-2 py-1.5 ${tone.card}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`text-[10px] font-semibold ${tone.text}`}>
                        {group.title}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatNumber(stats.count)}건
                      </p>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between text-[9px] text-gray-400">
                      <span>{group.range}</span>
                      <span>{formatNumber(stats.totalQty)}개</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-1.5 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-700">위험/주의 신규 진입</p>
                <span className="text-[10px] text-gray-400">
                  지난 7일 기준
                </span>
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsRiskNewOpen((prev) => !prev)}
                  className="flex items-center justify-between gap-2 rounded-lg border border-red-100 bg-red-50 px-2 py-1.5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-red-700">
                      위험 신규 진입
                    </span>
                    <span className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                      {formatNumber(expirySnapshot.newRiskEntries.length)}건
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3 w-3 text-red-600 transition-transform ${
                      isRiskNewOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCautionNewOpen((prev) => !prev)}
                  className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-amber-700">
                      주의 신규 진입
                    </span>
                    <span className="rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      {formatNumber(expirySnapshot.newCautionEntries.length)}건
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3 w-3 text-amber-600 transition-transform ${
                      isCautionNewOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="mt-1.5 space-y-1.5">
                {isRiskNewOpen && (
                  <div className="rounded-lg border border-red-100 bg-red-50/40 p-1.5">
                    {expirySnapshot.newRiskEntries.length === 0 && (
                      <p className="text-[10px] text-red-600">
                        금주 신규 진입 없음
                      </p>
                    )}
                    <div className="space-y-1.5">
                      {expirySnapshot.newRiskEntries.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-md border border-red-100 bg-white/70 px-2.5 py-1.5"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {item.productName}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              유효기간 {formatShortDate(item.expiry)}
                            </p>
                          </div>
                          <span className="text-[10px] font-semibold text-gray-600">
                            {formatNumber(item.qty)}개
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {isCautionNewOpen && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-1.5">
                    {expirySnapshot.newCautionEntries.length === 0 && (
                      <p className="text-[10px] text-amber-600">
                        금주 신규 진입 없음
                      </p>
                    )}
                    <div className="space-y-1.5">
                      {expirySnapshot.newCautionEntries.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-md border border-amber-100 bg-white/70 px-2.5 py-1.5"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {item.productName}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              유효기간 {formatShortDate(item.expiry)}
                            </p>
                          </div>
                          <span className="text-[10px] font-semibold text-gray-600">
                            {formatNumber(item.qty)}개
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 월간 매입현황: 매입액 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gray-900">월간 매입현황 · 매입액</p>
              <p className="text-[10px] text-gray-400">{currentMonthRangeLabel}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <StatToggle
                active={isAmountYoYEnabled}
                label="전년동기"
                onClick={() => setIsAmountYoYEnabled((prev) => !prev)}
              />
              <StatToggle
                active={isAmountCumulativeEnabled}
                label="누적"
                onClick={() => setIsAmountCumulativeEnabled((prev) => !prev)}
              />
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
                <p className="text-[10px] font-semibold text-gray-500">기간 누적</p>
                <p className="text-sm font-bold text-gray-900">{formatKrwCompact(amountTotal)}</p>
                <p className="text-[10px] text-gray-400">
                  월 평균 {formatKrwCompact(Math.round(amountTotal / amountCurrent.length))}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
                <p className="text-[10px] font-semibold text-gray-500">전년 동기 대비</p>
                <p
                  className={`text-sm font-bold ${
                    amountYoYDelta >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {formatYoYChange(amountTotal, amountPreviousTotal)}
                </p>
                <p className="text-[10px] text-gray-400">
                  {formatKrwCompact(amountPreviousTotal)} → {formatKrwCompact(amountTotal)}
                </p>
              </div>
            </div>

            <BarCumulativeChart
              months={REPORT_MONTH_KEYS}
              currentValues={amountCurrent}
              previousValues={amountPrevious}
              showPrevious={isAmountYoYEnabled}
              showCumulative={isAmountCumulativeEnabled}
              theme="blue"
              showYAxisLabels
              yAxisLabelFormatter={formatKrwCompact}
            />

            <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400">
              <div className="flex items-center gap-3">
                {!isAmountCumulativeEnabled && (
                  <>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded bg-blue-600"></span>
                      <span>해당기간</span>
                    </span>
                    {isAmountYoYEnabled && (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded bg-blue-200 border border-blue-200"></span>
                        <span>전년동기</span>
                      </span>
                    )}
                  </>
                )}
                {isAmountCumulativeEnabled && (
                  <>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-px w-6 bg-blue-700"></span>
                      <span>누적</span>
                    </span>
                    {isAmountYoYEnabled && (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-0 w-6 border-t border-dashed border-blue-300"></span>
                        <span>전년동기</span>
                      </span>
                    )}
                  </>
                )}
              </div>
              <span>단위: 원</span>
            </div>
          </div>
        </div>

        {/* 월간 매입현황: 품목 건수 & 수량 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gray-900">월간 매입현황 · 품목/수량</p>
              <p className="text-[10px] text-gray-400">{currentMonthRangeLabel}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <StatToggle
                active={isVolumeYoYEnabled}
                label="전년동기"
                onClick={() => setIsVolumeYoYEnabled((prev) => !prev)}
              />
              <StatToggle
                active={isVolumeCumulativeEnabled}
                label="누적"
                onClick={() => setIsVolumeCumulativeEnabled((prev) => !prev)}
              />
            </div>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
                <p className="text-[10px] font-semibold text-gray-500">월평균 품목 건수</p>
                <p className="text-sm font-bold text-gray-900">{formatNumber(itemCountMonthlyAvg)}개</p>
                <p className="text-[10px] text-gray-400">
                  전년 {formatNumber(itemCountPreviousMonthlyAvg)}개
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
                <p className="text-[10px] font-semibold text-gray-500">기간 누적 수량</p>
                <p className="text-sm font-bold text-gray-900">{formatNumber(quantityTotal)}개</p>
                <p
                  className={`text-[10px] font-semibold ${
                    quantityYoYDelta >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  전년동기 {formatYoYChange(quantityTotal, quantityPreviousTotal)}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-700">
                  {isVolumeCumulativeEnabled ? '누적 품목 건수' : '월별 품목 건수'}
                </p>
                <span
                  className={`text-[10px] font-semibold ${
                    itemCountYoYDelta >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  6개월 합계 {formatYoYChange(itemCountTotal, itemCountPreviousTotal)}
                </span>
              </div>
              <BarCumulativeChart
                months={REPORT_MONTH_KEYS}
                currentValues={itemCountCurrent}
                previousValues={itemCountPrevious}
                showPrevious={isVolumeYoYEnabled}
                showCumulative={isVolumeCumulativeEnabled}
                theme="indigo"
                heightClass="h-20"
                showXAxisLabels={false}
              />
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-700">
                  {isVolumeCumulativeEnabled ? '누적 수량' : '월별 수량'}
                </p>
                <span className="text-[10px] text-gray-400">
                  월평균 {formatNumber(quantityMonthlyAvg)}개 (전년 {formatNumber(quantityPreviousMonthlyAvg)}개)
                </span>
              </div>
              <BarCumulativeChart
                months={REPORT_MONTH_KEYS}
                currentValues={quantityCurrent}
                previousValues={quantityPrevious}
                showPrevious={isVolumeYoYEnabled}
                showCumulative={isVolumeCumulativeEnabled}
                theme="emerald"
                heightClass="h-20"
              />

              <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400">
                <div className="flex items-center gap-3">
                  {!isVolumeCumulativeEnabled && (
                    <>
                      <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded bg-indigo-600"></span>
                        <span>품목 건수</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded bg-emerald-600"></span>
                        <span>수량</span>
                      </span>
                    </>
                  )}
                  {isVolumeCumulativeEnabled && (
                    <>
                      <span className="inline-flex items-center gap-1">
                        <span className="h-px w-6 bg-indigo-600"></span>
                        <span>품목 건수</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="h-px w-6 bg-emerald-600"></span>
                        <span>수량</span>
                      </span>
                    </>
                  )}
                </div>
                <span>단위: 개</span>
              </div>
            </div>
          </div>
        </div>

        {/* 공급사 기준 비중 원그래프 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900">공급사 비중</p>
            <p className="text-[10px] text-gray-400">기준: {currentMonthRangeLabel} 매입액</p>
          </div>
          <div className="px-4 py-3 flex items-start gap-4">
            <DonutChart
              segments={supplierShareSegments}
              centerTopLabel="기간 합계"
              centerValueLabel={formatKrwCompact(supplierShareTotal)}
            />
            <div className="flex-1 space-y-2">
              {supplierShareSegments.map((segment) => {
                const percent = (segment.value / supplierShareTotal) * 100;
                return (
                  <div key={segment.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="mt-1 h-2 w-2 rounded-full"
                        style={{ backgroundColor: segment.dotColor }}
                      ></span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{segment.label}</p>
                        <p className="text-[10px] text-gray-400">{formatKrwCompact(segment.value)}</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-900">{percent.toFixed(1)}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 품목 기준 비중 Top5 원그래프 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900">품목 비중 Top5</p>
            <p className="text-[10px] text-gray-400">기준: {currentMonthRangeLabel} 매입액</p>
          </div>
          <div className="px-4 py-3 flex items-start gap-4">
            <DonutChart
              segments={productShareSegments}
              centerTopLabel="기간 합계"
              centerValueLabel={formatKrwCompact(productShareTotal)}
            />
            <div className="flex-1 space-y-2">
              {productShareSegments.map((segment) => {
                const percent = (segment.value / productShareTotal) * 100;
                return (
                  <div key={segment.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="mt-1 h-2 w-2 rounded-full"
                        style={{ backgroundColor: segment.dotColor }}
                      ></span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{segment.label}</p>
                        <p className="text-[10px] text-gray-400">{formatKrwCompact(segment.value)}</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-900">{percent.toFixed(1)}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="h-24"></div>
      </div>

      <button
        type="button"
        onClick={openCameraFlow}
        aria-label="거래명세서 촬영"
        className="fixed bottom-6 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700"
      >
        <Camera className="h-5 w-5" />
      </button>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[56] bg-black/30" onClick={closeSearchPanel}>
          <div className="mx-auto flex h-full max-w-md items-start px-4 pt-16">
            <div
              className="w-full rounded-2xl border border-gray-200 bg-white shadow-xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="거래명세서/공급사를 검색하세요"
                    autoFocus
                    className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600"
                    >
                      초기화
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeSearchPanel}
                  className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  닫기
                </button>
              </div>

              <div className="border-b border-gray-100 px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  {SEARCH_SCOPES.map((scope) => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setSearchScope(scope.id)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                        searchScope === scope.id
                          ? 'border-blue-200 bg-blue-50 text-blue-600'
                          : 'border-gray-200 bg-white text-gray-500'
                      }`}
                    >
                      {scope.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
                {normalizedQuery ? (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-500">검색 결과</p>
                      <span className="text-[10px] text-gray-400">{searchResults.length}건</span>
                    </div>
                    {searchResults.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-xs text-gray-400">
                        일치하는 결과가 없습니다.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {searchResults.slice(0, 6).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              closeSearchPanel();
                              onMenuChange?.('invoice');
                            }}
                            className="w-full rounded-xl border border-gray-100 bg-white p-3 text-left shadow-sm hover:bg-gray-50"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{item.supplierName}</p>
                                <p className="text-[11px] text-gray-500">
                                  {item.id} · {item.note}
                                </p>
                              </div>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                                  item.status
                                )}`}
                              >
                                {getStatusLabel(item.status)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold text-gray-500">최근 검색</p>
                      <div className="flex flex-wrap gap-2">
                        {RECENT_SEARCHES.map((keyword) => (
                          <button
                            key={keyword}
                            type="button"
                            onClick={() => setSearchQuery(keyword)}
                            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                          >
                            {keyword}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-black/20" onClick={closeMenuPanel}>
          <div className="mx-auto flex h-full max-w-md items-start justify-end px-4 pt-16">
            <div
              className="w-48 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {[
                '대시보드',
                '거래명세서 관리',
                '공급사 관리',
                '유효기간 점검',
                'AI분석 보고서',
                '설정',
                '로그아웃',
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === '거래명세서 관리' && onMenuChange) {
                      onMenuChange('invoice');
                    } else if (label === 'AI분석 보고서' && onMenuChange) {
                      onMenuChange('report');
                    } else if (label === '공급사 관리' && onMenuChange) {
                      onMenuChange('supplier');
                    } else if (label === '유효기간 점검' && onMenuChange) {
                      onMenuChange('expiry');
                    } else {
                      closeMenuPanel();
                    }
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                    label === '대시보드'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isNotiOpen && (
        <div className="fixed inset-0 z-[55] bg-black/30" onClick={closeNotiPanel}>
          <div className="mx-auto flex h-full max-w-md items-start px-4 pt-16">
            <div
              className="w-full rounded-2xl border border-gray-200 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">알림</p>
                  <p className="text-[10px] text-gray-400">미확인 {unreadCount}건</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    disabled={unreadCount === 0}
                    className="rounded-full border border-gray-200 px-3 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-default disabled:opacity-40"
                  >
                    모두 읽음
                  </button>
                  <button
                    type="button"
                    onClick={closeNotiPanel}
                    className="rounded-full border border-gray-200 px-3 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    닫기
                  </button>
                </div>
              </div>

              <div className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNotiTab('all')}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      notiTab === 'all'
                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-white text-gray-500'
                    }`}
                  >
                    전체
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotiTab('unread')}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      notiTab === 'unread'
                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-white text-gray-500'
                    }`}
                  >
                    미확인
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] divide-y divide-gray-100 overflow-y-auto">
                {visibleNotifications.length === 0 ? (
                  <div className="px-4 py-10 text-center text-xs text-gray-400">
                    새 알림이 없습니다.
                  </div>
                ) : (
                  visibleNotifications.map((item) => {
                    const tone = NOTIFICATION_TONE[item.type] || NOTIFICATION_TONE.review;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => markNotificationRead(item.id)}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          item.unread ? 'bg-blue-50/40' : 'bg-white'
                        } hover:bg-gray-50`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${tone.badgeClass}`}
                          >
                            <span className={`h-2 w-2 rounded-full ${tone.dotClass}`}></span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-800">{item.title}</span>
                              {item.unread && (
                                <span className="text-[10px] font-semibold text-blue-600">NEW</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500">{item.description}</p>
                          </div>
                          <span className="text-[10px] text-gray-400">{item.time}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isCameraFlowOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">거래명세서 촬영</p>
                <p className="text-xs text-gray-500">촬영 플로우는 준비 중입니다.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={closeCameraFlow}
                className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
