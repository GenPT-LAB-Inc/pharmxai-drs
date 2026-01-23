import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Bell, 
  Menu, 
  Camera,
  Calendar, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Edit3, 
  Save, 
  X, 
  RefreshCw,
  RotateCcw,
  Eye,
  EyeOff,
  FileText,
  Filter,
  ArrowUpDown,
  BarChart3,
  Building2,
  XCircle
} from 'lucide-react';

// --- Constants ---
const MAX_ZOOM_SCALE = 4;

// --- Mock Data: Suppliers ---
const SUPPLIERS = [
  { id: 'all', name: '전체 공급사' },
  { id: 'vitaminhouse', name: '비타민하우스' },
  { id: 'gc', name: '(주)녹십자' },
  { id: 'yuhan', name: '(주)유한양행' },
  { id: 'chong', name: '종근당' }
];

// --- Mock Data: Invoice Summaries (For List View) ---
const INVOICE_SUMMARIES = [
  {
    id: 'INV-2026-001',
    supplierId: 'vitaminhouse',
    supplierName: '비타민하우스',
    date: '2026-01-06',
    itemCount: 3,        // 품목 종류 수
    totalQty: 15,        // 총 수량
    totalAmount: 297500,
    status: 'completed',
    taxType: 'separate'
  },
  {
    id: 'INV-2026-008',
    supplierId: 'vitaminhouse',
    supplierName: '비타민하우스',
    date: '2026-01-06',
    itemCount: 2,
    totalQty: 8,
    totalAmount: 164000,
    status: 'completed',
    taxType: 'separate'
  },
  {
    id: 'INV-2026-002',
    supplierId: 'gc',
    supplierName: '(주)녹십자',
    date: '2026-01-06',
    itemCount: 3,
    totalQty: 170,
    totalAmount: 313500,
    status: 'analyzing',
    taxType: 'none'
  },
  {
    id: 'INV-2026-003',
    supplierId: 'yuhan',
    supplierName: '(주)유한양행',
    date: '2026-01-05',
    itemCount: 6,
    totalQty: 50,
    totalAmount: 320000,
    status: 'completed',
    taxType: 'included'
  },
  {
    id: 'INV-2026-004',
    supplierId: 'vitaminhouse',
    supplierName: '비타민하우스',
    date: '2026-01-04',
    itemCount: 2,
    totalQty: 10,
    totalAmount: 45000,
    status: 'completed',
    taxType: 'separate'
  },
  {
    id: 'INV-2026-005',
    supplierId: 'chong',
    supplierName: '종근당',
    date: '2025-12-28',
    itemCount: 4,
    totalQty: 40,
    totalAmount: 560000,
    status: 'completed',
    taxType: 'separate'
  },
  {
    id: 'INV-2026-006',
    supplierId: 'gc',
    supplierName: '(주)녹십자',
    date: '2026-01-03',
    itemCount: 5,
    totalQty: 85,
    totalAmount: 425000,
    status: 'completed',
    taxType: 'separate'
  },
  {
    id: 'INV-2026-007',
    supplierId: 'yuhan',
    supplierName: '(주)유한양행',
    date: '2026-01-02',
    itemCount: 3,
    totalQty: 30,
    totalAmount: 180000,
    status: 'completed',
    taxType: 'separate'
  }
];

// --- Mock Data: Invoice Details ---
const INVOICE_A_ID = 'INV-2026-001';
const INVOICE_B_ID = 'INV-2026-002';
const INVOICE_C_ID = 'INV-2026-008';

const INVOICE_META = {
  [INVOICE_A_ID]: { 
    hasSeparateTax: true, 
    taxAmount: 27045,
    status: 'completed',
    failureReason: ''
  },
  [INVOICE_B_ID]: { 
    hasSeparateTax: false, 
    taxAmount: 0,
    status: 'analyzing',
    failureReason: ''
  },
  'default': { 
    hasSeparateTax: true, 
    taxAmount: 10000,
    status: 'completed',
    failureReason: ''
  }
};

const INVOICE_IMAGE_DATA = {
  [INVOICE_A_ID]: {
    src: '/invoices/invoice-a.png',
    fileName: 'invoice-a.svg',
    pageLabel: 'Page 1/2'
  },
  [INVOICE_B_ID]: {
    src: '/invoices/invoice-b.jpg',
    fileName: 'invoice-b.svg',
    pageLabel: 'Page 2/2'
  }
};

const INITIAL_DETAIL_ITEMS = [
  {
    id: 1, 
    invoiceId: INVOICE_A_ID, 
    invoiceName: '비타민하우스 | 2026-001', 
    status: 'completed',
    name: '단쇄지방산 SCFA455', 
    standard: '1,200mgX90정', 
    qty: 5, 
    price: 28000, 
    lot: 'A203947', 
    expiry: '2027-03-12', 
    note: '', 
    isLotMissing: true
  },
  {
    id: 2, 
    invoiceId: INVOICE_A_ID, 
    invoiceName: '비타민하우스 | 2026-001', 
    status: 'completed',
    name: '미라클 프로젝트 NMN250', 
    standard: '1,000mgX30정', 
    qty: 5, 
    price: 21000, 
    lot: 'A203948', 
    expiry: '2028-05-06', 
    note: '', 
    isLotMissing: false
  },
  {
    id: 3, 
    invoiceId: INVOICE_A_ID, 
    invoiceName: '비타민하우스 | 2026-001', 
    status: 'completed',
    name: '위UP로 가는 SOD효소', 
    standard: '2gX30포(60g)', 
    qty: 5, 
    price: 10500, 
    lot: 'B102938', 
    expiry: '2027-11-20', 
    note: '', 
    isLotMissing: false
  },
  {
    id: 4, 
    invoiceId: INVOICE_B_ID, 
    invoiceName: '(주)녹십자 | 2026-002', 
    status: 'analyzing',
    name: '탁센 연질캡슐', 
    standard: '10C', 
    qty: 50, 
    price: 2750, 
    lot: 'C998877', 
    expiry: '2026-12-31', 
    note: '매대진열', 
    isLotMissing: false
  },
  {
    id: 7,
    invoiceId: INVOICE_C_ID,
    invoiceName: '비타민하우스 | 2026-008',
    status: 'completed',
    name: '오메가3 프리미엄',
    standard: '1,000mgX60캡슐',
    qty: 3,
    price: 32000,
    lot: 'V203111',
    expiry: '2027-09-30',
    note: '',
    isLotMissing: false
  },
  {
    id: 8,
    invoiceId: INVOICE_C_ID,
    invoiceName: '비타민하우스 | 2026-008',
    status: 'completed',
    name: '멀티비타민 미네랄',
    standard: '500mgX90정',
    qty: 5,
    price: 13600,
    lot: 'V203112',
    expiry: '2028-02-15',
    note: '',
    isLotMissing: false
  },
  {
    id: 5, 
    invoiceId: INVOICE_B_ID, 
    invoiceName: '(주)녹십자 | 2026-002', 
    status: 'analyzing',
    name: '비맥스 메타정', 
    standard: '100T', 
    qty: 20, 
    price: 49500, 
    lot: 'D112233', 
    expiry: '2028-01-15', 
    note: '', 
    isLotMissing: false
  },
  {
    id: 6, 
    invoiceId: INVOICE_B_ID, 
    invoiceName: '(주)녹십자 | 2026-002', 
    status: 'analyzing',
    name: '제놀 쿨 파스', 
    standard: '5매입', 
    qty: 100, 
    price: 880, 
    lot: 'E554433', 
    expiry: '2027-06-01', 
    note: '반품불가', 
    isLotMissing: false
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'review',
    title: '검수 필요',
    description: '비타민하우스 | 2026-001 · 1건',
    time: '방금',
    unread: true
  },
  {
    id: 2,
    type: 'ocr',
    title: 'OCR 완료',
    description: '(주)녹십자 | 2026-002 · 3건',
    time: '5분 전',
    unread: true
  },
  {
    id: 3,
    type: 'completed',
    title: '검수 완료',
    description: '비타민하우스 | 2026-001',
    time: '1시간 전',
    unread: false
  }
];

const NOTIFICATION_META = {
  review: {
    icon: AlertCircle,
    badgeClass: 'bg-amber-50 border border-amber-200',
    iconClass: 'text-amber-600'
  },
  ocr: {
    icon: FileText,
    badgeClass: 'bg-blue-50 border border-blue-200',
    iconClass: 'text-blue-600'
  },
  completed: {
    icon: CheckCircle2,
    badgeClass: 'bg-green-50 border border-green-200',
    iconClass: 'text-green-600'
  }
};

const SEARCH_SCOPES = [
  { id: 'all', label: '전체' },
  { id: 'supplier', label: '공급사' },
  { id: 'product', label: '상품명' },
];

const RECENT_SEARCHES = ['비타민하우스', '2026-001', '탁센'];

// --- Helper Functions ---
const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(Math.round(val));

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')} (${days[date.getDay()]})`;
};

const getInvoiceImageData = (invoiceId) =>
  INVOICE_IMAGE_DATA[invoiceId] || INVOICE_IMAGE_DATA[INVOICE_A_ID];

// =================================================================================================
// CUSTOM HOOK: usePinchZoom
// =================================================================================================
function usePinchZoom({ maxScale = MAX_ZOOM_SCALE } = {}) {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });
  const stateRef = useRef(transform);
  const pointersRef = useRef(new Map());
  const lastDistanceRef = useRef(null);
  const lastMidRef = useRef(null);
  const lastTapRef = useRef(0);
  const movedRef = useRef(false);

  const clampTransform = useCallback((next) => {
    const scale = Math.min(maxScale, Math.max(1, next.scale));
    let translateX = next.translateX;
    let translateY = next.translateY;

    if (scale <= 1) {
      return { scale: 1, translateX: 0, translateY: 0 };
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const maxX = (rect.width * (scale - 1)) / 2;
      const maxY = (rect.height * (scale - 1)) / 2;
      translateX = Math.max(-maxX, Math.min(maxX, translateX));
      translateY = Math.max(-maxY, Math.min(maxY, translateY));
    }

    return { scale, translateX, translateY };
  }, [maxScale]);

  const applyTransform = useCallback((next) => {
    const clamped = clampTransform(next);
    stateRef.current = clamped;
    setTransform(clamped);
  }, [clampTransform]);

  const reset = useCallback(() => {
    const base = { scale: 1, translateX: 0, translateY: 0 };
    stateRef.current = base;
    setTransform(base);
  }, []);

  const updatePointer = useCallback((pointerId, x, y) => {
    pointersRef.current.set(pointerId, { x, y });
  }, []);

  const onPointerDown = useCallback((e) => {
    if (e.pointerType === 'touch') {
      e.preventDefault();
    }
    if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
    }
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updatePointer(e.pointerId, e.clientX, e.clientY);
    movedRef.current = false;
  }, [updatePointer]);

  const onPointerMove = useCallback((e) => {
    if (!pointersRef.current.has(e.pointerId)) {
      return;
    }
    if (e.pointerType === 'touch') {
      e.preventDefault();
    }

    const prevPoint = pointersRef.current.get(e.pointerId);
    const dx = e.clientX - prevPoint.x;
    const dy = e.clientY - prevPoint.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      movedRef.current = true;
    }
    updatePointer(e.pointerId, e.clientX, e.clientY);

    const pointers = Array.from(pointersRef.current.values());
    if (pointers.length === 1) {
      const current = stateRef.current;
      if (current.scale <= 1) {
        return;
      }
      applyTransform({
        scale: current.scale,
        translateX: current.translateX + dx,
        translateY: current.translateY + dy
      });
      return;
    }

    if (pointers.length >= 2) {
      const [p1, p2] = pointers;
      const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      if (!lastDistanceRef.current) {
        lastDistanceRef.current = distance;
        lastMidRef.current = mid;
        return;
      }

      const prev = stateRef.current;
      const scaleRatio = distance / lastDistanceRef.current;
      let scale = prev.scale * scaleRatio;
      let translateX = prev.translateX;
      let translateY = prev.translateY;
      const rect = containerRef.current?.getBoundingClientRect();

      if (rect) {
        const originX = mid.x - rect.left - rect.width / 2;
        const originY = mid.y - rect.top - rect.height / 2;
        const relativeScale = scale / prev.scale;
        translateX += originX * (1 - relativeScale);
        translateY += originY * (1 - relativeScale);
      }

      if (lastMidRef.current) {
        translateX += mid.x - lastMidRef.current.x;
        translateY += mid.y - lastMidRef.current.y;
      }

      applyTransform({ scale, translateX, translateY });
      lastDistanceRef.current = distance;
      lastMidRef.current = mid;
    }
  }, [applyTransform, updatePointer]);

  const onPointerUp = useCallback((e) => {
    if (pointersRef.current.has(e.pointerId)) {
      pointersRef.current.delete(e.pointerId);
    }

    if (pointersRef.current.size < 2) {
      lastDistanceRef.current = null;
      lastMidRef.current = null;
    }

    if (e.pointerType === 'touch' && !movedRef.current && pointersRef.current.size === 0) {
      const now = Date.now();
      if (now - lastTapRef.current < 250) {
        reset();
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    }
  }, [reset]);

  const onPointerCancel = useCallback((e) => {
    if (pointersRef.current.has(e.pointerId)) {
      pointersRef.current.delete(e.pointerId);
    }
    lastDistanceRef.current = null;
    lastMidRef.current = null;
  }, []);

  const onDoubleClick = useCallback((e) => {
    e.preventDefault();
    reset();
  }, [reset]);

  useEffect(() => {
    stateRef.current = transform;
  }, [transform]);

  return {
    containerRef,
    transform,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onDoubleClick,
    reset,
    isZoomed: transform.scale > 1
  };
}

// =================================================================================================
// COMPONENT: ZoomableImage
// =================================================================================================
function ZoomableImage({ src, alt, maxScale = MAX_ZOOM_SCALE, compact = false, className = '' }) {
  const {
    containerRef,
    transform,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onDoubleClick,
    reset,
    isZoomed
  } = usePinchZoom({ maxScale });

  useEffect(() => {
    reset();
  }, [src, reset]);

  const resetClassName = compact
    ? 'px-2 py-1 text-[10px] gap-1'
    : 'px-3 py-1.5 text-xs gap-1.5';

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className} ${isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onDoubleClick={onDoubleClick}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain"
        style={{
          transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
          transformOrigin: 'center'
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
      {isZoomed && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            reset();
          }}
          className={`absolute left-2 top-2 inline-flex items-center rounded-full border border-white/40 bg-black/30 text-white shadow-sm backdrop-blur ${resetClassName}`}
        >
          <RotateCcw className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          리셋
        </button>
      )}
    </div>
  );
}

// =================================================================================================
// MAIN APP CONTAINER
// =================================================================================================
export default function SupplierManagementApp({ onMenuChange }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'detail'
  const [selectedSupplierContext, setSelectedSupplierContext] = useState(null);
  const [isCameraFlowOpen, setIsCameraFlowOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [notiTab, setNotiTab] = useState('all');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchScope, setSearchScope] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Navigation Handlers ---
  const handleSelectInvoice = (context) => {
    setSelectedSupplierContext(context);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedSupplierContext(null);
  };

  const openCameraFlow = () => {
    setIsCameraFlowOpen(true);
    setIsNotiOpen(false);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };
  const closeCameraFlow = () => setIsCameraFlowOpen(false);

  const toggleNotiPanel = () => {
    setIsNotiOpen(prev => !prev);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsCameraFlowOpen(false);
  };
  const closeNotiPanel = () => setIsNotiOpen(false);
  const markAllNotificationsRead = () =>
    setNotifications(prev => prev.map(item => ({ ...item, unread: false })));
  const markNotificationRead = (id) =>
    setNotifications(prev => prev.map(item => item.id === id ? { ...item, unread: false } : item));

  const toggleMenuPanel = () => {
    setIsMenuOpen(prev => !prev);
    setIsNotiOpen(false);
    setIsSearchOpen(false);
    setIsCameraFlowOpen(false);
  };
  const closeMenuPanel = () => setIsMenuOpen(false);

  const toggleSearchPanel = () => {
    setIsSearchOpen(prev => !prev);
    setIsNotiOpen(false);
    setIsMenuOpen(false);
    setIsCameraFlowOpen(false);
  };
  const closeSearchPanel = () => setIsSearchOpen(false);

  const unreadCount = notifications.filter(item => item.unread).length;
  const visibleNotifications = notifications.filter(item => 
    notiTab === 'unread' ? item.unread : true
  );
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const normalizeValue = (value) => `${value ?? ''}`.toLowerCase();
  const searchResults = normalizedQuery
    ? INITIAL_DETAIL_ITEMS.filter((item) => {
        if (searchScope === 'supplier') {
          return normalizeValue(item.invoiceName).includes(normalizedQuery);
        }
        if (searchScope === 'product') {
          return normalizeValue(item.name).includes(normalizedQuery);
        }
        return (
          normalizeValue(item.name).includes(normalizedQuery) ||
          normalizeValue(item.invoiceName).includes(normalizedQuery) ||
          normalizeValue(item.invoiceId).includes(normalizedQuery) ||
          normalizeValue(item.standard).includes(normalizedQuery) ||
          normalizeValue(item.lot).includes(normalizedQuery) ||
          normalizeValue(item.note).includes(normalizedQuery)
        );
      })
    : [];

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200">
      
      {/* 1. Global App Header (Mode Aware) */}
      <header className="bg-white px-4 py-3 border-b border-gray-200 z-50 shadow-sm shrink-0 min-h-[56px] flex items-center transition-all duration-300">
        {viewMode === 'list' ? (
          /* List Mode Header */
          <div className="flex items-center justify-between w-full animate-fade-in">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onMenuChange?.('dashboard')}
                aria-label="대시보드로 이동"
                className="rounded-lg p-1 -ml-1 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-lg font-bold text-blue-900 tracking-tight">PharmxAI</span>
              </button>
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">공급사 관리</span>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={openCameraFlow} aria-label="촬영" className="text-gray-500 hover:text-gray-700">
                <Camera className="w-5 h-5" />
              </button>
              <button type="button" onClick={toggleSearchPanel} aria-label="검색" className="text-gray-500 hover:text-gray-700">
                <Search className="w-5 h-5" />
              </button>
              <button type="button" onClick={toggleNotiPanel} aria-label="알림" className="relative text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              <button type="button" onClick={toggleMenuPanel} aria-label="메뉴" className="text-gray-500 hover:text-gray-700">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Detail Mode Header (Native App Style) */
          <div className="flex items-center justify-between w-full animate-fade-in">
            <button 
              onClick={handleBackToList} 
              className="flex items-center gap-1 text-gray-600 active:text-blue-600 p-1 -ml-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <ArrowLeft className="w-6 h-6 group-active:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">목록</span>
            </button>
            <h1 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">
              거래명세서 상세
            </h1>
            <div className="w-8"></div>
          </div>
        )}
      </header>

      {/* 2. Content Area (Switch between List & Detail) */}
      <div className="flex-1 overflow-hidden relative bg-gray-50">
        {viewMode === 'list' ? (
          <SupplierListView onSelectInvoice={handleSelectInvoice} />
        ) : (
          <InvoiceDetailView supplierContext={selectedSupplierContext} onBack={handleBackToList} />
        )}
      </div>

      {/* 3. Search Panel */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-[56] bg-black/30"
          onClick={closeSearchPanel}
        >
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
                    placeholder="키워드를 입력하세요"
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
                        {searchResults.slice(0, 5).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="w-full rounded-xl border border-gray-100 bg-white p-3 text-left shadow-sm hover:bg-gray-50"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                <p className="text-[11px] text-gray-500">
                                  {item.invoiceName} · {item.invoiceId}
                                </p>
                              </div>
                              <span className="text-[10px] text-gray-400">
                                ₩{formatCurrency(item.qty * item.price)}
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

      {/* 4. Menu Panel */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black/20"
          onClick={closeMenuPanel}
        >
          <div className="mx-auto flex h-full max-w-md items-start justify-end px-4 pt-16">
            <div 
              className="w-48 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {['대시보드', '거래명세서 관리', '공급사 관리', '유효기간 점검', 'AI분석 보고서', '설정', '로그아웃'].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === '대시보드' && onMenuChange) {
                      onMenuChange('dashboard');
                    } else if (label === '거래명세서 관리' && onMenuChange) {
                      onMenuChange('invoice');
                    } else if (label === '유효기간 점검' && onMenuChange) {
                      onMenuChange('expiry');
                    } else if (label === 'AI분석 보고서' && onMenuChange) {
                      onMenuChange('report');
                    } else if (label === '공급사 관리') {
                      closeMenuPanel();
                    } else {
                      closeMenuPanel();
                    }
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                    label === '공급사 관리' 
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

      {/* 5. Notification Panel */}
      {isNotiOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black/30"
          onClick={closeNotiPanel}
        >
          <div className="mx-auto flex h-full max-w-md items-start px-4 pt-16">
            <div 
              className="w-full rounded-2xl border border-gray-200 bg-white shadow-xl animate-fade-in"
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
                    const meta = NOTIFICATION_META[item.type] || {
                      icon: Bell,
                      badgeClass: 'bg-gray-100 border border-gray-200',
                      iconClass: 'text-gray-500'
                    };
                    const Icon = meta.icon;

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
                          <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${meta.badgeClass}`}>
                            <Icon className={`h-4 w-4 ${meta.iconClass}`} />
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

      {/* 6. Camera Flow Modal */}
      {isCameraFlowOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 animate-fade-in">
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

// =================================================================================================
// 1. SUPPLIER MANAGEMENT LIST VIEW
// =================================================================================================
function SupplierListView({ onSelectInvoice }) {
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [dateRangeType, setDateRangeType] = useState('month'); // 'month' | 'custom'
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-01-31');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('count'); // 'count' | 'amount'
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    let data = INVOICE_SUMMARIES;

    // 1. Supplier Filter
    if (selectedSupplier !== 'all') {
      data = data.filter(item => item.supplierId === selectedSupplier);
    }

    // 2. Date Filter
    if (dateRangeType === 'month') {
      data = data.filter(item => item.date.startsWith(selectedMonth));
    } else {
      data = data.filter(item => item.date >= startDate && item.date <= endDate);
    }

    // 3. Search Filter (공급사명으로만 검색)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.supplierName.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
      );
    }

    return data;
  }, [selectedSupplier, dateRangeType, selectedMonth, startDate, endDate, searchTerm]);

  // --- 공급사별 통계 집계 ---
  const supplierStats = useMemo(() => {
    const grouped = {};
    
    filteredData.forEach(invoice => {
      if (!grouped[invoice.supplierId]) {
        grouped[invoice.supplierId] = {
          supplierId: invoice.supplierId,
          supplierName: invoice.supplierName,
          invoiceCount: 0,      // 거래명세서 건수
          itemCount: 0,         // 총 품목 수
          totalQty: 0,          // 총 수량
          totalAmount: 0        // 총 금액
        };
      }
      grouped[invoice.supplierId].invoiceCount += 1;
      grouped[invoice.supplierId].itemCount += invoice.itemCount || 0;
      grouped[invoice.supplierId].totalQty += invoice.totalQty;
      grouped[invoice.supplierId].totalAmount += invoice.totalAmount;
    });
    
    // 정렬: 금액순 또는 거래명세서 건수순
    let result = Object.values(grouped);
    if (sortBy === 'amount') {
      result.sort((a, b) => b.totalAmount - a.totalAmount);
    } else {
      result.sort((a, b) => b.invoiceCount - a.invoiceCount);
    }
    
    return result;
  }, [filteredData, sortBy]);

  // --- 전체 통계 ---
  const stats = useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      invoiceCount: acc.invoiceCount + 1,
      itemCount: acc.itemCount + (curr.itemCount || 0),
      totalQty: acc.totalQty + curr.totalQty,
      totalAmount: acc.totalAmount + curr.totalAmount
    }), { invoiceCount: 0, itemCount: 0, totalQty: 0, totalAmount: 0 });
  }, [filteredData]);

  // Display text for the filter bar
  const currentSupplierName = SUPPLIERS.find(s => s.id === selectedSupplier)?.name || '공급사 선택';
  const currentDateText = dateRangeType === 'month' 
    ? selectedMonth.replace('-', '.') 
    : `${startDate.slice(5).replace('-', '.')}~${endDate.slice(5).replace('-', '.')}`;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* A. Compact Sticky Filter Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm z-40 relative">
        
        {/* Compact Bar (Always Visible) */}
        <div className="flex items-center justify-between px-4 py-3 bg-white z-50 relative">
           <div className="flex gap-2 w-full">
             {/* Supplier Trigger */}
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className="flex-1 flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm active:bg-gray-100 transition-colors"
             >
                <div className="flex items-center gap-2 overflow-hidden">
                   <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                   <span className="font-bold text-gray-800 truncate">{currentSupplierName}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
             </button>

             {/* Date Trigger */}
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className="flex-1 flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm active:bg-gray-100 transition-colors"
             >
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                   <span className="font-bold text-gray-800">{currentDateText}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
             </button>
           </div>
        </div>

        {/* Expandable Panel (Accordion) */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${isFilterOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-4 space-y-4 bg-gray-50/50">
             {/* Full Supplier Select */}
             <div>
               <label className="text-xs font-bold text-gray-500 mb-1.5 block">공급사 상세 선택</label>
               <select 
                 value={selectedSupplier}
                 onChange={(e) => setSelectedSupplier(e.target.value)}
                 className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
               >
                 {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
               </select>
             </div>

             {/* Full Date Select */}
             <div>
               <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-gray-500">기간 상세 설정</label>
                  <div className="flex bg-gray-200 rounded p-0.5">
                    <button onClick={() => setDateRangeType('month')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${dateRangeType === 'month' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>월별</button>
                    <button onClick={() => setDateRangeType('custom')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${dateRangeType === 'custom' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>직접입력</button>
                  </div>
               </div>
               
               {dateRangeType === 'month' ? (
                 <input 
                   type="month" 
                   value={selectedMonth}
                   onChange={(e) => setSelectedMonth(e.target.value)}
                   className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm"
                 />
               ) : (
                 <div className="flex items-center gap-2">
                   <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg p-2.5 text-xs" />
                   <span className="text-gray-400">~</span>
                   <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg p-2.5 text-xs" />
                 </div>
               )}
             </div>
             
             {/* Close Button */}
             <button 
               onClick={() => setIsFilterOpen(false)}
               className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm"
             >
               설정 적용 및 닫기
             </button>
          </div>
        </div>
      </div>

      {/* B. Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Statistics Dashboard */}
        <div className="p-4 bg-gray-50">
          {/* 전체 통계 대시보드 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
            <h3 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> 기간 내 전체 통계
            </h3>
            <div className="grid grid-cols-4 divide-x divide-gray-100">
              <div className="text-center px-1">
                <p className="text-[10px] text-gray-500 mb-1">거래명세서</p>
                <p className="text-lg font-bold text-gray-800">{stats.invoiceCount}<span className="text-xs font-normal text-gray-400 ml-0.5">건</span></p>
              </div>
              <div className="text-center px-1">
                <p className="text-[10px] text-gray-500 mb-1">품목 수</p>
                <p className="text-lg font-bold text-gray-800">{stats.itemCount}<span className="text-xs font-normal text-gray-400 ml-0.5">개</span></p>
              </div>
              <div className="text-center px-1">
                <p className="text-[10px] text-gray-500 mb-1">총 수량</p>
                <p className="text-lg font-bold text-gray-800">{stats.totalQty}<span className="text-xs font-normal text-gray-400 ml-0.5">개</span></p>
              </div>
              <div className="text-center px-1">
                <p className="text-[10px] text-gray-500 mb-1">총 매입액</p>
                <p className="text-base font-bold text-blue-600">₩{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Search & Sort Toolbar */}
          <div className="flex items-center justify-between mb-3">
             <div className="relative flex-1 mr-3">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="공급사명 검색" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
               />
               {searchTerm && (
                 <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                   <XCircle className="w-4 h-4" />
                 </button>
               )}
             </div>
             <button 
                onClick={() => setSortBy(prev => prev === 'count' ? 'amount' : 'count')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-full shadow-sm"
             >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortBy === 'count' ? '건수순' : '금액순'}
             </button>
          </div>

          {/* 공급사별 카드 목록 */}
          <div className="space-y-3 pb-10">
            {supplierStats.length > 0 ? (
              supplierStats.map(supplier => (
                <div 
                  key={supplier.supplierId} 
                  onClick={() => onSelectInvoice({
                    supplierId: supplier.supplierId,
                    supplierName: supplier.supplierName,
                    dateRangeType,
                    selectedMonth,
                    startDate,
                    endDate
                  })}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors cursor-pointer"
                >
                  {/* 공급사명 헤더 */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-gray-800">{supplier.supplierName}</h4>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                  </div>
                  
                  {/* 통계 그리드 (2x2) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-gray-500 mb-0.5">거래명세서</p>
                      <p className="text-sm font-bold text-gray-800">{supplier.invoiceCount}<span className="text-xs font-normal text-gray-400 ml-0.5">건</span></p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-gray-500 mb-0.5">품목 수</p>
                      <p className="text-sm font-bold text-gray-800">{supplier.itemCount}<span className="text-xs font-normal text-gray-400 ml-0.5">개</span></p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-gray-500 mb-0.5">총 수량</p>
                      <p className="text-sm font-bold text-gray-800">{supplier.totalQty}<span className="text-xs font-normal text-gray-400 ml-0.5">개</span></p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2.5 text-center border border-blue-100">
                      <p className="text-[10px] text-blue-600 mb-0.5">총 금액</p>
                      <p className="text-sm font-bold text-blue-600">₩{formatCurrency(supplier.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs">조회된 공급사가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =================================================================================================
// 2. INVOICE DETAIL VIEW
// =================================================================================================
function InvoiceDetailView({ supplierContext, onBack }) {
  const supplierId = supplierContext?.supplierId ?? 'all';
  const supplierName = supplierContext?.supplierName ?? '공급사 상세';
  const dateRangeType = supplierContext?.dateRangeType ?? 'month';
  const selectedMonth = supplierContext?.selectedMonth ?? '2026-01';
  const startDate = supplierContext?.startDate ?? '2026-01-01';
  const endDate = supplierContext?.endDate ?? '2026-01-31';

  const [items, setItems] = useState(INITIAL_DETAIL_ITEMS);
  const [editingId, setEditingId] = useState(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editViewMode, setEditViewMode] = useState('A');
  const [isEditImageVisible, setIsEditImageVisible] = useState(true);
  const [isEditImageCollapsed, setIsEditImageCollapsed] = useState(false);
  const [expandedInvoiceIds, setExpandedInvoiceIds] = useState({});
  const [imageVisibilityById, setImageVisibilityById] = useState({});

  useEffect(() => {
    setExpandedInvoiceIds({});
    setImageVisibilityById({});
  }, [supplierId, dateRangeType, selectedMonth, startDate, endDate]);

  const filteredSummaries = useMemo(() => {
    let data = INVOICE_SUMMARIES;

    if (supplierId && supplierId !== 'all') {
      data = data.filter(item => item.supplierId === supplierId);
    }

    if (dateRangeType === 'month') {
      data = data.filter(item => item.date.startsWith(selectedMonth));
    } else {
      data = data.filter(item => item.date >= startDate && item.date <= endDate);
    }

    return data;
  }, [supplierId, dateRangeType, selectedMonth, startDate, endDate]);

  const groupedInvoices = useMemo(() => {
    const grouped = filteredSummaries.reduce((acc, invoice) => {
      if (!acc[invoice.date]) {
        acc[invoice.date] = [];
      }
      acc[invoice.date].push(invoice);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .map(date => ({
        date,
        invoices: grouped[date].sort((a, b) => a.id.localeCompare(b.id))
      }));
  }, [filteredSummaries]);

  const itemsByInvoiceId = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.invoiceId]) {
        acc[item.invoiceId] = [];
      }
      acc[item.invoiceId].push(item);
      return acc;
    }, {});
  }, [items]);

  const isEditing = editingId !== null;
  const dateLabel = dateRangeType === 'month'
    ? selectedMonth.replace('-', '.')
    : `${startDate.slice(5).replace('-', '.')}~${endDate.slice(5).replace('-', '.')}`;

  const handleToggleExpand = (invoiceId) => {
    setExpandedInvoiceIds(prev => ({ ...prev, [invoiceId]: !prev[invoiceId] }));
  };

  const handleToggleImage = (invoiceId) => {
    setImageVisibilityById(prev => {
      const nextValue = !prev[invoiceId];
      if (nextValue) {
        setExpandedInvoiceIds(prevExpanded => ({ ...prevExpanded, [invoiceId]: true }));
      }
      return { ...prev, [invoiceId]: nextValue };
    });
  };

  const handleEditStart = (item) => { 
    setEditingId(item.id); 
    setEditingInvoiceId(item.invoiceId);
    setEditForm({...item}); 
    setIsEditImageVisible(true);
    setIsEditImageCollapsed(false);
  };
  const handleEditCancel = () => { 
    setEditingId(null);
    setEditingInvoiceId(null);
    setEditForm({});
  };
  const handleEditSave = () => {
    setItems(prev => prev.map(i => i.id === editingId ? editForm : i));
    setEditingId(null);
    setEditingInvoiceId(null);
    setEditForm({});
  };
  const handleInputChange = (f, v) => setEditForm(prev => ({...prev, [f]: v}));

  return (
    <div className="flex flex-col h-full bg-gray-100 animate-fade-in">
      
      {/* Detail Toolbar (Sub Header) */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>{supplierName}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Calendar className="w-4 h-4" />
          <span>{dateLabel}</span>
        </div>
      </div>

      {/* Detail List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {groupedInvoices.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">
            선택한 조건에 해당하는 거래명세서가 없습니다.
          </div>
        ) : (
          groupedInvoices.map(group => (
            <div key={group.date} className="px-4 pt-4">
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span>{formatDate(group.date)}</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="mt-3 space-y-4 pb-4">
                {group.invoices.map(invoice => {
                  const invoiceMeta = INVOICE_META[invoice.id];
                  const invoiceNumber = invoice.id.replace('INV-', '');
                  const title = `${invoice.supplierName} | ${invoiceNumber}`;
                  const hasSeparateTax = invoiceMeta?.hasSeparateTax ?? invoice.taxType === 'separate';
                  const taxAmount = invoiceMeta?.taxAmount ?? (hasSeparateTax ? Math.round(invoice.totalAmount * 0.1) : 0);
                  const status = invoice.status || invoiceMeta?.status || 'completed';
                  const failureReason = invoiceMeta?.failureReason || '';
                  const invoiceItems = itemsByInvoiceId[invoice.id] || [];
                  const isExpanded = !!expandedInvoiceIds[invoice.id];
                  const isImageVisible = !!imageVisibilityById[invoice.id];

                  return (
                    <InvoiceSection 
                      key={invoice.id}
                      invoiceId={invoice.id}
                      title={title}
                      status={status}
                      totalAmount={invoice.totalAmount}
                      taxAmount={taxAmount}
                      hasSeparateTax={hasSeparateTax}
                      items={invoiceItems}
                      failureReason={failureReason}
                      isEditing={isEditing}
                      isExpanded={isExpanded}
                      isImageVisible={isImageVisible}
                      onToggleExpand={() => handleToggleExpand(invoice.id)}
                      onToggleImage={() => handleToggleImage(invoice.id)}
                      onStartEdit={handleEditStart}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div className={`transition-all duration-300 ${isEditing ? 'h-[350px]' : 'h-20'}`}></div>
      </div>

      {/* Edit Overlay */}
      {isEditing && (
        <EditOverlay 
          data={editForm}
          invoiceId={editingInvoiceId}
          viewMode={editViewMode}
          onViewModeChange={setEditViewMode}
          isImageVisible={isEditImageVisible}
          onToggleImage={() => setIsEditImageVisible(prev => !prev)}
          isImageCollapsed={isEditImageCollapsed}
          onToggleImageCollapse={() => setIsEditImageCollapsed(prev => !prev)}
          onChange={handleInputChange}
          onCancel={handleEditCancel}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

// =================================================================================================
// INVOICE SECTION COMPONENT
// =================================================================================================
function InvoiceSection({ 
  invoiceId,
  title, 
  status, 
  totalAmount,
  taxAmount,
  hasSeparateTax,
  items, 
  failureReason,
  isEditing,
  isExpanded,
  isImageVisible, 
  onToggleImage,
  onToggleExpand,
  onStartEdit
}) {
  const supplyValue = hasSeparateTax ? totalAmount - taxAmount : totalAmount;
  const imageData = getInvoiceImageData(invoiceId);
  const isFailed = status === 'failed';
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': 
        return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">완료</span>;
      case 'analyzing':
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/>AI 분석중</span>;
      case 'failed':
        return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">미처리</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">대기</span>;
    }
  };

  const getStatusAccent = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500';
      case 'analyzing':
        return 'border-blue-500';
      case 'failed':
        return 'border-red-500';
      default:
        return 'border-gray-300';
    }
  };

  const getHeaderTone = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50/70';
      case 'analyzing':
        return 'bg-blue-50/70';
      case 'failed':
        return 'bg-red-50/70';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className={`border-l-4 ${getStatusAccent(status)} pl-3`}>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className={`px-4 py-1.5 border-b border-gray-200 flex flex-col gap-1.5 ${getHeaderTone(status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusBadge(status)}
              <span className="text-xs text-gray-400 font-medium">No. {title.split('|')[1]}</span>
            </div>
            <button 
              onClick={onToggleImage}
              disabled={isEditing}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                isImageVisible ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'
              } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isImageVisible ? <><Eye className="w-3 h-3" /> 거래명세서 보기</> : <><EyeOff className="w-3 h-3" /> 거래명세서 보기</>}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-bold text-gray-900 truncate">{title.split('|')[0]}</h2>
            </div>
            {isFailed ? (
              <p className="max-w-[45%] text-xs font-semibold text-red-600 truncate text-right">
                {failureReason || '사유 확인 중'}
              </p>
            ) : (
              <div className="text-right">
                <p className="text-[10px] font-semibold text-gray-500">총 합계</p>
                <p className="text-base font-bold text-gray-900">₩{formatCurrency(totalAmount)}</p>
              </div>
            )}
          </div>

          <div className="text-xs font-semibold text-gray-600">
            {isFailed ? (
              <span>품목 {items.length}개 | 미처리</span>
            ) : (
              <span>
                품목 {items.length}개 | 공급가액 {formatCurrency(supplyValue)} | 세액 {formatCurrency(taxAmount)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleExpand}
          disabled={isEditing}
          className={`w-full flex items-center justify-center gap-2 border-t border-gray-200 px-4 py-1.5 text-xs font-semibold transition-colors ${
            isExpanded ? 'text-blue-600 bg-blue-50/40' : 'text-gray-600 bg-white'
          } ${isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
        >
          {isExpanded ? '제품 접기' : '제품 펼치기'}
          <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="bg-white border-l border-gray-200">
            {isImageVisible && (
              <div className="h-52 border-b border-gray-200 bg-slate-800">
                <ZoomableImage
                  key={imageData.src}
                  src={imageData.src}
                  alt="거래명세서 이미지"
                  maxScale={MAX_ZOOM_SCALE}
                  className="bg-slate-800"
                />
              </div>
            )}
            {items.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-gray-400">
                표시할 품목이 없습니다.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <ViewItem 
                    key={item.id} 
                    data={item} 
                    onEdit={() => onStartEdit(item)} 
                    disabled={isEditing}
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

// =================================================================================================
// EDIT OVERLAY COMPONENT (A/B/C View Modes)
// =================================================================================================
function EditOverlay({ 
  data, 
  invoiceId,
  viewMode,
  onViewModeChange,
  isImageVisible,
  onToggleImage,
  isImageCollapsed,
  onToggleImageCollapse,
  onChange, 
  onCancel, 
  onSave 
}) {
  const safeInvoiceId = invoiceId === INVOICE_B_ID ? INVOICE_B_ID : INVOICE_A_ID;
  const [isPipExpanded, setIsPipExpanded] = useState(false);
  
  const modeButtonClass = (mode) =>
    `px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
      viewMode === mode ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
    }`;
  const pipSizeClass = isPipExpanded ? 'h-72 w-56' : 'h-56 w-44';
  const pipPaddingClass = isPipExpanded ? 'pr-60' : 'pr-48';

  useEffect(() => {
    if (viewMode !== 'C') {
      setIsPipExpanded(false);
    }
  }, [viewMode]);

  return (
    <div className="absolute inset-0 z-50 bg-white">
      <div className="flex h-full flex-col">
        <div className="shrink-0 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">편집 보기</span>
              <div className="flex rounded-full border border-gray-200 bg-gray-50 p-0.5">
                <button className={modeButtonClass('A')} onClick={() => onViewModeChange('A')}>A안</button>
                <button className={modeButtonClass('B')} onClick={() => onViewModeChange('B')}>B안</button>
                <button className={modeButtonClass('C')} onClick={() => onViewModeChange('C')}>C안</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onToggleImage}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  isImageVisible ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                {isImageVisible ? <><Eye className="w-3 h-3" /> 거래명세서 보기 ON</> : <><EyeOff className="w-3 h-3" /> 거래명세서 보기 OFF</>}
              </button>
              {viewMode === 'B' && isImageVisible && (
                <button 
                  onClick={onToggleImageCollapse}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-white text-gray-600"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform ${isImageCollapsed ? '' : 'rotate-180'}`} />
                  {isImageCollapsed ? '이미지 펼치기' : '이미지 접기'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50">
          {viewMode === 'A' && (
            <div className="flex h-full flex-col">
              {isImageVisible && (
                <div className="shrink-0 h-[30%] border-b border-gray-300">
                  <EditImagePreview invoiceId={safeInvoiceId} />
                </div>
              )}
              <div className="flex-1 overflow-y-auto">
                <EditItem data={data} onChange={onChange} onCancel={onCancel} onSave={onSave} />
              </div>
            </div>
          )}

          {viewMode === 'B' && (
            <div className="flex h-full flex-col">
              {isImageVisible && (
                <div className={`shrink-0 border-b border-gray-300 transition-all duration-300 ${isImageCollapsed ? 'h-12' : 'h-[30%]'}`}>
                  {isImageCollapsed ? (
                    <div className="flex h-full items-center justify-between px-4">
                      <span className="text-xs font-semibold text-gray-600">거래명세서 이미지</span>
                      <button onClick={onToggleImageCollapse} className="text-xs font-semibold text-blue-600">펼치기</button>
                    </div>
                  ) : (
                    <EditImagePreview invoiceId={safeInvoiceId} />
                  )}
                </div>
              )}
              <div className="flex-1 overflow-y-auto">
                <EditItem data={data} onChange={onChange} onCancel={onCancel} onSave={onSave} />
              </div>
            </div>
          )}

          {viewMode === 'C' && (
            <div className="relative h-full">
              <div className={`h-full overflow-y-auto pb-32 ${pipPaddingClass}`}>
                <EditItem data={data} onChange={onChange} onCancel={onCancel} onSave={onSave} />
              </div>
              {isImageVisible && (
                <div className={`absolute top-4 right-4 overflow-hidden rounded-2xl border border-gray-300 bg-slate-800 shadow-lg ${pipSizeClass}`}>
                  <EditImagePreview invoiceId={safeInvoiceId} compact />
                  <button
                    type="button"
                    onClick={() => setIsPipExpanded(prev => !prev)}
                    className="absolute right-2 top-2 rounded-full border border-white/40 bg-black/40 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur"
                  >
                    {isPipExpanded ? '축소' : '확대'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditImagePreview({ invoiceId, compact = false }) {
  const safeInvoiceId = invoiceId === INVOICE_B_ID ? INVOICE_B_ID : INVOICE_A_ID;
  const imageData = getInvoiceImageData(safeInvoiceId);

  return (
    <ZoomableImage
      src={imageData.src}
      alt="거래명세서 이미지"
      maxScale={MAX_ZOOM_SCALE}
      compact={compact}
      className="bg-slate-800"
    />
  );
}

// =================================================================================================
// VIEW ITEM COMPONENT (Read Mode)
// =================================================================================================
function ViewItem({ data, onEdit, disabled }) {
  const getValueStyle = (value) => value ? 'text-gray-900' : 'text-gray-300 font-normal';
  const getDisplayValue = (value) => value || '-';
  const total = data.qty * data.price;

  return (
    <div className={`p-4 transition-colors ${disabled ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-50'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold text-gray-800 leading-snug w-3/4 break-keep">{data.name}</h3>
        <button onClick={onEdit} className="text-gray-400 hover:text-blue-600 p-1 -mr-2"><Edit3 className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2 bg-gray-50 p-2 rounded border border-gray-100 text-center">
        <div className="flex flex-col justify-center">
          <div className="text-[10px] text-gray-400 mb-0.5">규격</div>
          <div className={`text-xs font-semibold truncate ${getValueStyle(data.standard)}`}>{getDisplayValue(data.standard)}</div>
        </div>
        <div className="flex flex-col justify-center border-l border-gray-200 pl-2">
          <div className="text-[10px] text-gray-400 mb-0.5">수량</div>
          <div className="text-xs font-bold text-gray-900">{data.qty}</div>
        </div>
        <div className="flex flex-col justify-center border-l border-gray-200 pl-2">
          <div className="text-[10px] text-gray-400 mb-0.5">단가</div>
          <div className="text-xs font-semibold text-gray-900">{formatCurrency(data.price)}</div>
        </div>
        <div className="flex flex-col justify-center border-l border-gray-200 pl-2">
          <div className="text-[10px] text-gray-400 mb-0.5">금액</div>
          <div className="text-xs font-bold text-blue-700">{formatCurrency(total)}</div>
        </div>
      </div>
      <div className="flex gap-2 text-xs">
        <div className="flex-1 px-2 py-1.5 rounded border bg-white border-gray-200 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5 text-left">유효기간</span>
          <span className={getValueStyle(data.expiry)}>{getDisplayValue(data.expiry)}</span>
        </div>
        <div className="flex-1 px-2 py-1.5 rounded border bg-white border-gray-200 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5 text-left">제조번호</span>
          <span className={getValueStyle(data.lot)}>{getDisplayValue(data.lot)}</span>
        </div>
        <div className="flex-1 px-2 py-1.5 rounded border bg-gray-50 border-gray-200 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5 text-left">비고</span>
          <span className={`truncate block ${getValueStyle(data.note)}`} title={data.note}>{getDisplayValue(data.note)}</span>
        </div>
      </div>
    </div>
  );
}

// =================================================================================================
// EDIT ITEM COMPONENT (Edit Mode)
// =================================================================================================
function EditItem({ data, onChange, onCancel, onSave }) {
  const total = data.qty * data.price;

  const handleFocus = (e) => {
    setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
  };

  return (
    <div className="p-4 bg-blue-50/50 border-l-4 border-blue-600 animate-fade-in scroll-mt-32">
      <div className="flex justify-between items-center mb-3 sticky top-0 z-10 bg-blue-50/95 py-2">
        <h3 className="text-sm font-bold text-gray-800 truncate pr-2">{data.name}</h3>
        <div className="flex gap-2 shrink-0">
          <button onClick={onCancel} className="whitespace-nowrap px-3 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm">
            <X className="w-3 h-3 inline-block -mt-0.5 mr-1" />취소
          </button>
          <button onClick={onSave} className="whitespace-nowrap px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full shadow-sm">
            <Save className="w-3 h-3 inline-block -mt-0.5 mr-1" />저장 완료
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">규격</label>
          <input type="text" value={data.standard} placeholder="-" onChange={(e) => onChange('standard', e.target.value)} onFocus={handleFocus} className="w-full text-center font-bold text-gray-700 text-sm border-b-2 border-gray-300 bg-white p-1 focus:outline-none focus:border-blue-500 placeholder-gray-300" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">수량</label>
          <input type="number" value={data.qty} onChange={(e) => onChange('qty', parseInt(e.target.value) || 0)} onFocus={handleFocus} className="w-full text-right font-bold text-gray-900 text-sm border-b-2 border-blue-500 bg-white p-1 focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">단가</label>
          <input type="number" value={data.price} onChange={(e) => onChange('price', parseInt(e.target.value) || 0)} onFocus={handleFocus} className="w-full text-right font-bold text-gray-900 text-sm border-b-2 border-blue-500 bg-white p-1 focus:outline-none" />
        </div>
      </div>
      <div className="flex justify-end items-center mb-4 px-3 py-2 bg-gray-100 rounded text-xs">
        <span className="text-[10px] text-gray-400 mr-2">=</span><span className="text-[10px] text-gray-500 mr-2">금액 합계</span><span className="font-bold text-blue-700 text-sm">₩{formatCurrency(total)}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">제조번호</label>
          <input type="text" value={data.lot} placeholder="-" onChange={(e) => onChange('lot', e.target.value)} onFocus={handleFocus} className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 placeholder-gray-300" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">유효기간</label>
          <input type="date" value={data.expiry} onChange={(e) => onChange('expiry', e.target.value)} onFocus={handleFocus} className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 text-gray-900" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">비고</label>
          <input type="text" value={data.note} placeholder="-" onChange={(e) => onChange('note', e.target.value)} onFocus={handleFocus} className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 placeholder-gray-300" />
        </div>
      </div>
    </div>
  );
}
