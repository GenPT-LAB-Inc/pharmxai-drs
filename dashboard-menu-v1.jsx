import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Bell,
  Camera,
  ChevronDown,
  Info,
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

const formatDateLabel = (value) => {
  const date = new Date(`${value}T00:00:00`);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayLabel = DAY_LABELS[date.getDay()];
  return `${year}.${month}.${day} (${dayLabel})`;
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
    : WEEKLY_UPLOAD_SUMMARY.slice(0, 2);

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
        {/* 최근 7일 업로드 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">최근 7일 업로드</p>
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
              <button
                type="button"
                onClick={() => onMenuChange?.('invoice')}
                className="text-[10px] font-semibold text-gray-500 hover:text-gray-700"
              >
                거래명세서로 이동
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
          {!isWeeklyExpanded && (
            <div className="border-t border-gray-100 px-4 py-2 text-[10px] text-gray-400">
              {WEEKLY_UPLOAD_SUMMARY.length - weeklyVisibleItems.length}일치 더 보기
            </div>
          )}
        </div>

        {/* 통계 카드 영역 (Placeholder) */}
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gray-900">통계</p>
              <p className="text-[10px] text-gray-400">통계 카드 준비 중</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="h-16 rounded-xl bg-gray-100"></div>
            <div className="h-16 rounded-xl bg-gray-100"></div>
            <div className="h-16 rounded-xl bg-gray-100"></div>
            <div className="h-16 rounded-xl bg-gray-100"></div>
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
