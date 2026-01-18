import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Eye,
  FileText,
  Info,
  Menu,
  Search,
  X,
} from 'lucide-react';

const BASE_DATE = '2026-01-06';
const BASE_DATE_LABEL = '2026.01.06 (화)';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const SUPPLIER_OPTIONS = [
  { id: 'all', label: '전체 공급사' },
  { id: 'vitaminhouse', label: '비타민하우스' },
  { id: 'gc', label: '(주)녹십자' },
  { id: 'yuhan', label: '(주)유한양행' },
  { id: 'chong', label: '종근당' },
];

const INVOICE_A_ID = 'INV-2026-001';
const INVOICE_B_ID = 'INV-2026-002';
const INVOICE_C_ID = 'INV-2026-008';

const INVOICE_IMAGE_DATA = {
  [INVOICE_A_ID]: {
    src: '/invoices/invoice-a.png',
    fileName: 'invoice-a.png',
    pageLabel: 'Page 1/2',
  },
  [INVOICE_B_ID]: {
    src: '/invoices/invoice-b.jpg',
    fileName: 'invoice-b.jpg',
    pageLabel: 'Page 2/2',
  },
  [INVOICE_C_ID]: {
    src: '/invoices/invoice-a.png',
    fileName: 'invoice-a.png',
    pageLabel: 'Page 2/2',
  },
};

const EXPIRY_ITEMS = [
  {
    id: 1,
    supplierId: 'vitaminhouse',
    supplierName: '비타민하우스',
    productName: '프리미엄 오메가3',
    lot: 'V203901',
    qty: 12,
    expiry: '2025-12-20',
    invoiceId: INVOICE_A_ID,
  },
  {
    id: 2,
    supplierId: 'gc',
    supplierName: '(주)녹십자',
    productName: '탁센 연질캡슐',
    lot: 'C998877',
    qty: 50,
    expiry: '2026-02-15',
    invoiceId: INVOICE_B_ID,
  },
  {
    id: 3,
    supplierId: 'yuhan',
    supplierName: '(주)유한양행',
    productName: '삐콤씨 플러스',
    lot: 'Y554433',
    qty: 30,
    expiry: '2026-04-10',
    invoiceId: INVOICE_C_ID,
  },
  {
    id: 4,
    supplierId: 'chong',
    supplierName: '종근당',
    productName: '제놀 쿨 파스',
    lot: 'E554433',
    qty: 80,
    expiry: '2026-06-25',
    invoiceId: INVOICE_B_ID,
  },
  {
    id: 5,
    supplierId: 'vitaminhouse',
    supplierName: '비타민하우스',
    productName: '멀티비타민 미네랄',
    lot: 'V203112',
    qty: 20,
    expiry: '2026-07-20',
    invoiceId: INVOICE_A_ID,
  },
  {
    id: 6,
    supplierId: 'gc',
    supplierName: '(주)녹십자',
    productName: '비맥스 메타정',
    lot: 'D112233',
    qty: 18,
    expiry: '2026-09-15',
    invoiceId: INVOICE_B_ID,
  },
  {
    id: 7,
    supplierId: 'yuhan',
    supplierName: '(주)유한양행',
    productName: '유한락스 헬스',
    lot: 'Y667788',
    qty: 26,
    expiry: '2026-11-30',
    invoiceId: INVOICE_C_ID,
  },
  {
    id: 8,
    supplierId: 'chong',
    supplierName: '종근당',
    productName: '락토핏 골드',
    lot: 'C445566',
    qty: 40,
    expiry: '2026-12-28',
    invoiceId: INVOICE_B_ID,
  },
  {
    id: 9,
    supplierId: 'vitaminhouse',
    supplierName: '비타민하우스',
    productName: '단쇄지방산 SCFA455',
    lot: 'A203947',
    qty: 15,
    expiry: '2027-03-12',
    invoiceId: INVOICE_C_ID,
  },
  {
    id: 10,
    supplierId: 'gc',
    supplierName: '(주)녹십자',
    productName: '판콜 에이',
    lot: 'G110022',
    qty: 60,
    expiry: '2027-06-30',
    invoiceId: INVOICE_B_ID,
  },
  {
    id: 11,
    supplierId: 'yuhan',
    supplierName: '(주)유한양행',
    productName: '에어비타',
    lot: 'Y220019',
    qty: 22,
    expiry: '2027-10-05',
    invoiceId: INVOICE_C_ID,
  },
  {
    id: 12,
    supplierId: 'chong',
    supplierName: '종근당',
    productName: '락토핏 생유산균',
    lot: 'C550011',
    qty: 28,
    expiry: '2027-12-15',
    invoiceId: INVOICE_B_ID,
  },
  {
    id: 13,
    supplierId: 'vitaminhouse',
    supplierName: '비타민하우스',
    productName: '콜라겐 플러스',
    lot: 'V330099',
    qty: 24,
    expiry: '2028-01-20',
    invoiceId: INVOICE_C_ID,
  },
  {
    id: 14,
    supplierId: 'gc',
    supplierName: '(주)녹십자',
    productName: '지씨가르시니아',
    lot: 'G770031',
    qty: 14,
    expiry: '2028-06-01',
    invoiceId: INVOICE_B_ID,
  },
  {
    id: 15,
    supplierId: 'yuhan',
    supplierName: '(주)유한양행',
    productName: '웰씨 아연',
    lot: 'Y880212',
    qty: 32,
    expiry: '2029-01-15',
    invoiceId: INVOICE_C_ID,
  },
  {
    id: 16,
    supplierId: 'chong',
    supplierName: '종근당',
    productName: '프리바이오틱스',
    lot: 'C900211',
    qty: 18,
    expiry: '2030-05-10',
    invoiceId: INVOICE_B_ID,
  },
];

const EXPIRY_GROUPS = [
  { id: 'risk', title: '유효기간 위험', range: '6개월 미만' },
  { id: 'caution', title: '유효기간 주의', range: '6개월 이상 ~ 12개월 미만' },
  { id: 'normal', title: '유효기간 보통', range: '12개월 이상 ~ 24개월 미만' },
  { id: 'safe', title: '유효기간 안전', range: '24개월 이상' },
];

const STATUS_FILTERS = [
  { id: 'active', label: '미조치' },
  { id: 'checked', label: '완료' },
  { id: 'expired', label: '만료' },
];

const GROUP_TONE = {
  risk: {
    card: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 border border-red-200',
    accent: 'border-red-500',
  },
  caution: {
    card: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    accent: 'border-amber-500',
  },
  normal: {
    card: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    accent: 'border-blue-500',
  },
  safe: {
    card: 'bg-green-50 border-green-200',
    text: 'text-green-700',
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-700 border border-green-200',
    accent: 'border-green-500',
  },
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'review',
    title: '검수 필요',
    description: '유효기간 위험 3건 발생',
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
    title: '점검 완료',
    description: '유효기간 보통 · 6건 확인',
    time: '1시간 전',
    unread: false,
  },
];

const NOTIFICATION_META = {
  review: {
    icon: AlertCircle,
    badgeClass: 'bg-amber-50 border border-amber-200',
    iconClass: 'text-amber-600',
  },
  ocr: {
    icon: FileText,
    badgeClass: 'bg-blue-50 border border-blue-200',
    iconClass: 'text-blue-600',
  },
  completed: {
    icon: CheckCircle2,
    badgeClass: 'bg-green-50 border border-green-200',
    iconClass: 'text-green-600',
  },
};

const SEARCH_SCOPES = [
  { id: 'all', label: '전체' },
  { id: 'supplier', label: '공급사' },
  { id: 'product', label: '상품명' },
  { id: 'lot', label: '제조번호' },
];

const RECENT_SEARCHES = ['오메가3', '비타민하우스', 'C998877'];

const parseDate = (value) => new Date(`${value}T00:00:00`);

const formatDate = (value) => {
  const date = parseDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const getInvoiceImageData = (invoiceId) =>
  INVOICE_IMAGE_DATA[invoiceId] || INVOICE_IMAGE_DATA[INVOICE_A_ID];

const getRemainingDays = (expiryDate, baseDate = BASE_DATE) => {
  const expiry = parseDate(expiryDate);
  const base = parseDate(baseDate);
  return Math.ceil((expiry - base) / MS_PER_DAY);
};

const getRemainingLabel = (days) => {
  if (days < 0) return '만료됨';
  if (days <= 30) return `D-${days}`;
  const months = days / 30;
  if (months < 12) return `${Math.round(months * 10) / 10}개월`;
  return `${Math.round(months)}개월`;
};

const getGroupId = (days) => {
  if (days < 180) return 'risk';
  if (days < 365) return 'caution';
  if (days < 730) return 'normal';
  return 'safe';
};

const getGroupStats = (items) => {
  const totalQty = items.reduce((acc, item) => acc + item.qty, 0);
  const soonCount = items.filter(
    (item) => item.remainingDays >= 0 && item.remainingDays <= 30
  ).length;
  return { count: items.length, totalQty, soonCount };
};

export default function ExpiryCheckApp({ onMenuChange }) {
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState('active');
  const [checkedItems, setCheckedItems] = useState(() => new Set());
  const [expandedGroups, setExpandedGroups] = useState({
    risk: true,
    caution: true,
    normal: false,
    safe: false,
  });
  const [activeGroupId, setActiveGroupId] = useState('risk');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [notiTab, setNotiTab] = useState('all');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchScope, setSearchScope] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInvoiceItem, setActiveInvoiceItem] = useState(null);

  const baseItems = useMemo(
    () =>
      EXPIRY_ITEMS.map((item) => {
        const remainingDays = getRemainingDays(item.expiry);
        return {
          ...item,
          remainingDays,
          remainingLabel: getRemainingLabel(remainingDays),
          groupId: getGroupId(remainingDays),
          invoiceImage: getInvoiceImageData(item.invoiceId),
        };
      }),
    []
  );

  const itemsWithStatus = useMemo(
    () =>
      baseItems.map((item) => {
        const isExpired = item.remainingDays < 0;
        const isChecked = checkedItems.has(item.id);
        const status = isExpired ? 'expired' : isChecked ? 'checked' : 'active';
        return { ...item, isExpired, isChecked, status };
      }),
    [baseItems, checkedItems]
  );

  const itemsBySupplier = useMemo(
    () =>
      itemsWithStatus.filter((item) =>
        selectedSupplier === 'all' ? true : item.supplierId === selectedSupplier
      ),
    [itemsWithStatus, selectedSupplier]
  );

  const statusCounts = useMemo(
    () =>
      itemsBySupplier.reduce(
        (acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        },
        { active: 0, checked: 0, expired: 0 }
      ),
    [itemsBySupplier]
  );

  const visibleItems = useMemo(
    () => itemsBySupplier.filter((item) => item.status === statusFilter),
    [itemsBySupplier, statusFilter]
  );

  const groupedItems = useMemo(() => {
    const result = EXPIRY_GROUPS.reduce((acc, group) => {
      acc[group.id] = [];
      return acc;
    }, {});
    visibleItems.forEach((item) => {
      result[item.groupId].push(item);
    });
    return result;
  }, [visibleItems]);

  const groupStats = useMemo(() => {
    return EXPIRY_GROUPS.reduce((acc, group) => {
      acc[group.id] = getGroupStats(groupedItems[group.id] || []);
      return acc;
    }, {});
  }, [groupedItems]);

  const totalCount = visibleItems.length;
  const totalQty = visibleItems.reduce((acc, item) => acc + item.qty, 0);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const visibleNotifications = notifications.filter((item) =>
    notiTab === 'unread' ? item.unread : true
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const normalizeValue = (value) => `${value ?? ''}`.toLowerCase();
  const searchResults = normalizedQuery
    ? itemsBySupplier.filter((item) => {
        if (searchScope === 'supplier') {
          return normalizeValue(item.supplierName).includes(normalizedQuery);
        }
        if (searchScope === 'product') {
          return normalizeValue(item.productName).includes(normalizedQuery);
        }
        if (searchScope === 'lot') {
          return normalizeValue(item.lot).includes(normalizedQuery);
        }
        return (
          normalizeValue(item.productName).includes(normalizedQuery) ||
          normalizeValue(item.supplierName).includes(normalizedQuery) ||
          normalizeValue(item.lot).includes(normalizedQuery)
        );
      })
    : [];

  const handleSupplierBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsSupplierOpen(false);
    }
  };

  const openMenuPanel = () => {
    setIsMenuOpen(true);
    setIsNotiOpen(false);
    setIsSearchOpen(false);
  };

  const closeMenuPanel = () => setIsMenuOpen(false);

  const toggleNotiPanel = () => {
    setIsNotiOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const closeNotiPanel = () => setIsNotiOpen(false);

  const toggleSearchPanel = () => {
    setIsSearchOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsNotiOpen(false);
  };

  const closeSearchPanel = () => setIsSearchOpen(false);

  const markAllNotificationsRead = () =>
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  const markNotificationRead = (id) =>
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );

  const toggleCheckedItem = (itemId) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const openInvoiceViewer = (item) => {
    setActiveInvoiceItem(item);
  };

  const closeInvoiceViewer = () => setActiveInvoiceItem(null);

  const handleGroupToggle = (groupId) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const scrollToGroup = (groupId) => {
    setActiveGroupId(groupId);
    setExpandedGroups((prev) => ({ ...prev, [groupId]: true }));
    const target = document.getElementById(`expiry-group-${groupId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 z-50 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-blue-900 tracking-tight">PharmxAI</h1>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            유효기간 점검
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
            onClick={openMenuPanel}
            aria-label="메뉴"
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
        <div className="flex items-start gap-2 text-[11px] text-blue-800">
          <Info className="mt-0.5 h-4 w-4 text-blue-500" />
          <p className="leading-snug">
            본 화면은 매입 거래명세서 기준입니다. 실제 재고와 차이가 있을 수 있으니 약국
            재고 상황을 함께 고려해 주세요.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                <div
                  className="relative inline-flex"
                  tabIndex={0}
                  onBlur={handleSupplierBlur}
                >
                  <button
                    type="button"
                    onClick={() => setIsSupplierOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-gray-700 font-semibold text-sm bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm"
                  >
                    <span>
                      {SUPPLIER_OPTIONS.find((option) => option.id === selectedSupplier)
                        ?.label || '전체 공급사'}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-gray-400 transition-transform ${
                        isSupplierOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isSupplierOpen && (
                    <div className="absolute left-0 top-full mt-2 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-10">
                      {SUPPLIER_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setSelectedSupplier(option.id);
                            setIsSupplierOpen(false);
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                            option.id === selectedSupplier
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">기준일</p>
                  <p className="text-xs font-semibold text-gray-700">{BASE_DATE_LABEL}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400">총 품목 · 수량</p>
                <p className="text-sm font-bold text-gray-900">
                  {totalCount}건 · {totalQty}개
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUS_FILTERS.map((filter) => {
                const isActive = statusFilter === filter.id;
                const count = statusCounts[filter.id] || 0;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setStatusFilter(filter.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {filter.label}
                    <span className="ml-1 text-[10px] font-bold">{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[10px] text-gray-400">그룹 요약</p>
              <button
                type="button"
                onClick={() => setIsSummaryExpanded((prev) => !prev)}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600"
              >
                {isSummaryExpanded ? '요약 접기' : '요약 펼치기'}
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${
                    isSummaryExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {EXPIRY_GROUPS.map((group) => {
                const tone = GROUP_TONE[group.id];
                const stats = groupStats[group.id];
                const isActive = activeGroupId === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => scrollToGroup(group.id)}
                    className={`rounded-xl border text-left transition-shadow ${
                      isSummaryExpanded ? 'p-3' : 'p-2'
                    } ${tone.card} ${
                      isActive ? 'ring-2 ring-blue-200 shadow-md' : 'hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <span className={`mt-1 h-2 w-2 rounded-full ${tone.dot}`}></span>
                        <div>
                          <p className={`text-xs font-semibold ${tone.text}`}>
                            {group.title}
                          </p>
                          <p className="text-[10px] text-gray-500 leading-tight">
                            {group.range}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{stats.count}건</p>
                    </div>
                    {isSummaryExpanded && (
                      <div className="mt-2 text-right text-[10px] text-gray-400">
                        <span className={`font-semibold ${tone.text}`}>
                          30일 내 만료 {stats.soonCount}건
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {EXPIRY_GROUPS.map((group) => {
              const items = groupedItems[group.id] || [];
              const stats = groupStats[group.id];
              const isExpanded = expandedGroups[group.id];
              return (
                <ExpiryGroupSection
                  key={group.id}
                  group={group}
                  tone={GROUP_TONE[group.id]}
                  items={items}
                  stats={stats}
                  isExpanded={isExpanded}
                  onToggle={() => handleGroupToggle(group.id)}
                  onViewInvoice={openInvoiceViewer}
                  onToggleCheck={toggleCheckedItem}
                />
              );
            })}
            <div className="h-24"></div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-black/20" onClick={closeMenuPanel}>
          <div className="mx-auto flex h-full max-w-md items-start justify-end px-4 pt-16">
            <div
              className="w-48 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {[
                '대시보드',
                '거래명세서 관리',
                '공급사 관리',
                '유효기간 점검',
                '설정',
                '로그아웃',
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === '거래명세서 관리' && onMenuChange) {
                      onMenuChange('invoice');
                    } else if (label === '공급사 관리' && onMenuChange) {
                      onMenuChange('supplier');
                    } else {
                      closeMenuPanel();
                    }
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                    label === '유효기간 점검'
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

      {isSearchOpen && (
        <div className="fixed inset-0 z-[56] bg-black/30" onClick={closeSearchPanel}>
          <div className="mx-auto flex h-full max-w-md items-start px-4 pt-16">
            <div
              className="w-full rounded-2xl border border-gray-200 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">검색</p>
                  <button
                    type="button"
                    onClick={closeSearchPanel}
                    className="rounded-full border border-gray-200 px-3 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    닫기
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
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
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="상품명, 공급사, 제조번호를 입력하세요"
                    className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
                {normalizedQuery ? (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-500">검색 결과</p>
                      <span className="text-[10px] text-gray-400">
                        {searchResults.length}건
                      </span>
                    </div>
                    {searchResults.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-xs text-gray-400">
                        일치하는 결과가 없습니다.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {searchResults.slice(0, 6).map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-gray-100 bg-white p-3 text-left shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-800">
                                  {item.productName}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  {item.supplierName} · {item.lot}
                                </p>
                              </div>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  GROUP_TONE[item.groupId].badge
                                }`}
                              >
                                {item.remainingLabel}
                              </span>
                            </div>
                          </div>
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
              <div className="border-b border-gray-100 px-4 py-2">
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: '전체' },
                    { id: 'unread', label: '미확인' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setNotiTab(tab.id)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        notiTab === tab.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
                {visibleNotifications.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-xs text-gray-400">
                    표시할 알림이 없습니다.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {visibleNotifications.map((item) => {
                      const meta = NOTIFICATION_META[item.type];
                      const Icon = meta.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => markNotificationRead(item.id)}
                          className={`w-full rounded-xl border px-3 py-2 text-left shadow-sm transition ${meta.badgeClass} ${
                            item.unread ? 'border-opacity-100' : 'opacity-70'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`mt-0.5 rounded-full bg-white p-1 ${meta.iconClass}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-gray-900">
                                  {item.title}
                                </p>
                                <span className="text-[10px] text-gray-400">
                                  {item.time}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500">{item.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeInvoiceItem && (
        <InvoiceImageModal item={activeInvoiceItem} onClose={closeInvoiceViewer} />
      )}
    </div>
  );
}

function ExpiryGroupSection({
  group,
  tone,
  items,
  stats,
  isExpanded,
  onToggle,
  onViewInvoice,
  onToggleCheck,
}) {
  return (
    <div id={`expiry-group-${group.id}`} className={`border-l-4 ${tone.accent} pl-3`}>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${tone.dot}`}></span>
                <h2 className="text-sm font-bold text-gray-900">{group.title}</h2>
              </div>
              <p className="text-[10px] text-gray-400">{group.range}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400">품목 · 수량</p>
              <p className="text-sm font-bold text-gray-900">
                {stats.count}건 · {stats.totalQty}개
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <span>30일 내 만료 {stats.soonCount}건</span>
            <button
              type="button"
              onClick={onToggle}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600"
            >
              {isExpanded ? '접기' : '펼치기'}
              <ChevronDown
                className={`h-3 w-3 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>
        {isExpanded && (
          <div className="px-4 py-3 bg-white">
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-xs text-gray-400">
                표시할 품목이 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <ExpiryItemCard
                    key={item.id}
                    item={item}
                    tone={tone}
                    onViewInvoice={onViewInvoice}
                    onToggleCheck={onToggleCheck}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpiryItemCard({ item, tone, onViewInvoice, onToggleCheck }) {
  const isExpired = item.status === 'expired';
  const isChecked = item.isChecked;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
          <p className="text-[11px] text-gray-500 truncate">{item.supplierName}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tone.badge}`}>
            {item.remainingLabel}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onViewInvoice?.(item)}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 hover:bg-blue-100"
            >
              <Eye className="h-3 w-3" />
              이미지
            </button>
            {!isExpired && (
              <button
                type="button"
                onClick={() => onToggleCheck?.(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold shadow-sm transition ${
                  isChecked
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`inline-flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                    isChecked
                      ? 'border-emerald-600 bg-emerald-500 text-white'
                      : 'border-gray-300 bg-white text-transparent'
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
                {isChecked ? '완료됨' : '확인 완료'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
        <span>유효기간 {formatDate(item.expiry)}</span>
        <span>수량 {item.qty}</span>
        <span>제조번호 {item.lot}</span>
      </div>
    </div>
  );
}

function InvoiceImageModal({ item, onClose }) {
  const imageData = getInvoiceImageData(item.invoiceId);

  return (
    <div className="fixed inset-0 z-[60] bg-black/40" onClick={onClose}>
      <div className="mx-auto flex h-full max-w-md items-start px-4 pt-16">
        <div
          className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-gray-900">거래명세서 이미지</p>
              <p className="text-[10px] text-gray-400">
                {item.productName} · {item.supplierName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-3 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
            >
              닫기
            </button>
          </div>
          <div className="bg-slate-800">
            <div className="relative h-72">
              <img
                src={imageData.src}
                alt="거래명세서 이미지"
                className="h-full w-full object-contain"
              />
              <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white">
                선택 품목: {item.productName}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2 text-[10px] text-gray-500">
            <span>{imageData.pageLabel}</span>
            <span className="text-gray-400">선택 품목 확인용 이미지입니다.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
