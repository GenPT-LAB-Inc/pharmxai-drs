import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Bell, 
  Menu, 
  Calendar, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Edit3, 
  Save, 
  X, 
  RefreshCw,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Minimize2,
  FileText
} from 'lucide-react';

// --- Mock Data ---
const INVOICE_A_ID = 'INV-2026-001';
const INVOICE_B_ID = 'INV-2026-002';

const INITIAL_DATA = [
  {
    id: 1,
    invoiceId: INVOICE_A_ID,
    invoiceName: '(주)디알에스 | 2026-001',
    status: 'completed',
    name: '낙산균(Naksan)(수출용)',
    standard: '60C',
    qty: 2,
    price: 36364,
    lot: '',
    expiry: '2027-03-12',
    note: '',
    isLotMissing: true
  },
  {
    id: 2,
    invoiceId: INVOICE_A_ID,
    invoiceName: '(주)디알에스 | 2026-001',
    status: 'completed',
    name: '[DRS] 초임계 rTG오메가3 POLAR',
    standard: '30C x 2',
    qty: 10,
    price: 36364,
    lot: 'A203948',
    expiry: '2028-05-06',
    note: '행사상품',
    isLotMissing: false
  },
  {
    id: 3,
    invoiceId: INVOICE_A_ID,
    invoiceName: '(주)디알에스 | 2026-001',
    status: 'completed',
    name: '루테인 지아잔틴 164',
    standard: '30C',
    qty: 5,
    price: 12500,
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
    price: 2500,
    lot: 'C998877',
    expiry: '2026-12-31',
    note: '매대진열',
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
    price: 45000,
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
    price: 800,
    lot: 'E554433',
    expiry: '2027-06-01',
    note: '반품불가',
    isLotMissing: false
  }
];

// --- Helper Functions ---
const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val);

export default function PharmxAIApp() {
  const [items, setItems] = useState(INITIAL_DATA);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeInvoiceId, setActiveInvoiceId] = useState(INVOICE_A_ID);
  const [isImageViewVisible, setIsImageViewVisible] = useState(true); 
  
  // Refs for Scroll Spy
  const listContainerRef = useRef(null);
  const invoiceBRef = useRef(null);

  // Computed Values
  const isEditing = editingId !== null;
  
  // Determine height class based on state
  const imageContainerHeightClass = useMemo(() => {
    if (!isImageViewVisible) return 'h-0 border-b-0'; // Completely hidden
    if (isEditing) return 'h-[20%] border-b border-gray-400'; // Collapsed for editing
    return 'h-[45%] border-b border-gray-400'; // Default split view
  }, [isImageViewVisible, isEditing]);

  // Scroll Handler to switch images
  const handleScroll = () => {
    if (listContainerRef.current && invoiceBRef.current) {
      const containerTop = listContainerRef.current.getBoundingClientRect().top;
      const invoiceBTop = invoiceBRef.current.getBoundingClientRect().top;
      
      // If Invoice B header is close to the top (e.g. within 200px), switch image
      if (invoiceBTop - containerTop < 200) {
        setActiveInvoiceId(INVOICE_B_ID);
      } else {
        setActiveInvoiceId(INVOICE_A_ID);
      }
    }
  };

  // --- Edit Handlers ---
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    setItems(prev => prev.map(item => item.id === editingId ? editForm : item));
    setEditingId(null);
    setEditForm({});
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Group items by invoice for rendering
  const invoiceAGroup = items.filter(i => i.invoiceId === INVOICE_A_ID);
  const invoiceBGroup = items.filter(i => i.invoiceId === INVOICE_B_ID);

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200">
      
      {/* 1. Global Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 z-50 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <h1 className="text-lg font-bold text-blue-900 tracking-tight">PharmxAI</h1>
        </div>
        <div className="flex gap-4">
          <Search className="w-5 h-5 text-gray-500" />
          <Bell className="w-5 h-5 text-gray-500" />
          <Menu className="w-5 h-5 text-gray-500" />
        </div>
      </header>

      {/* 2. Filter Bar (Toggle Removed) */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1 text-gray-700 font-medium text-sm bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>2026.01.06 (화)</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>
        <button className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
          당일 업로드 조회
        </button>
      </div>

      {/* 3. Split View Container */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        
        {/* A. Sticky Image Viewer */}
        <div 
          className={`bg-slate-800 w-full relative transition-all duration-500 ease-in-out shrink-0 overflow-hidden flex items-center justify-center
            ${imageContainerHeightClass}`}
        >
          {/* Simulated Image Content */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
          
          <div className="relative z-10 text-center text-white/90">
             <div className="mb-2 flex justify-center">
                <ImageIcon className="w-8 h-8 opacity-50" />
             </div>
             <p className="text-sm font-medium">원본 거래명세서 이미지</p>
             <p className="text-xs text-white/60 mt-1">
               {activeInvoiceId === INVOICE_A_ID ? '파일명: 20260106_DRS_001.jpg' : '파일명: 20260106_GC_002.jpg'}
             </p>
             <div className="mt-4 px-3 py-1 bg-black/30 rounded-full text-xs inline-flex items-center gap-2 backdrop-blur-sm">
                <span>🔍 핀치 줌 가능</span>
                <span className="w-px h-3 bg-white/20"></span>
                <span>{activeInvoiceId === INVOICE_A_ID ? 'Page 1/2' : 'Page 2/2'}</span>
             </div>
          </div>
          
          {/* Toggle Hint (Only visible when image is open and not editing) */}
          {!isEditing && isImageViewVisible && (
            <button 
              onClick={() => setIsImageViewVisible(false)}
              className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/40 text-white/70 rounded-full transition-colors"
              title="이미지 접기"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}

          {/* Image Overlay for Active Invoice Indicator */}
          <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded shadow-lg">
            현재 보고있는 명세서: {activeInvoiceId === INVOICE_A_ID ? 'A' : 'B'}
          </div>
        </div>

        {/* B. Scrollable List Area */}
        <div 
          ref={listContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-gray-50 pb-20 scroll-smooth"
        >
          {/* Invoice A Section */}
          <InvoiceSection 
            title="(주)디알에스 | 2026-001" 
            status="completed" 
            totalAmount={160000}
            items={invoiceAGroup}
            isEditing={isEditing}
            editingId={editingId}
            editForm={editForm}
            isImageVisible={isImageViewVisible}
            onToggleImage={() => setIsImageViewVisible(!isImageViewVisible)}
            onStartEdit={startEditing}
            onCancelEdit={cancelEditing}
            onSaveEdit={saveEditing}
            onChange={handleInputChange}
          />

          {/* Invoice B Section (Connected naturally) */}
          <div ref={invoiceBRef}>
            <InvoiceSection 
              title="(주)녹십자 | 2026-002" 
              status="analyzing" 
              totalAmount={245000}
              items={invoiceBGroup}
              isEditing={isEditing}
              editingId={editingId}
              editForm={editForm}
              isImageVisible={isImageViewVisible}
              onToggleImage={() => setIsImageViewVisible(!isImageViewVisible)}
              onStartEdit={startEditing}
              onCancelEdit={cancelEditing}
              onSaveEdit={saveEditing}
              onChange={handleInputChange}
            />
          </div>

          <div className="h-10"></div> {/* Bottom Spacer */}
        </div>

        {/* 4. Bottom Sticky Action Bar (Conditional) */}
        {isEditing ? (
          /* Edit Mode Action Bar */
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-50 flex gap-2 animate-slide-up">
            <button 
              onClick={cancelEditing}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> 취소
            </button>
            <button 
              onClick={saveEditing}
              className="flex-[2] py-3 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-blue-200 shadow-md"
            >
              <Save className="w-4 h-4" /> 저장 완료
            </button>
          </div>
        ) : (
          /* Normal Mode Action Bar */
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-40">
             <button className="bg-white text-gray-700 border border-gray-300 px-6 py-2.5 rounded-full shadow-lg font-bold text-sm hover:bg-gray-50 flex items-center gap-2">
               <Save className="w-4 h-4" /> 임시저장
             </button>
             <button className="bg-green-600 text-white px-8 py-2.5 rounded-full shadow-lg font-bold text-sm hover:bg-green-700 shadow-green-200 flex items-center gap-2">
               <CheckCircle2 className="w-4 h-4" /> 검수 완료
             </button>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Sub Component: Invoice Section Header & List ---
function InvoiceSection({ 
  title, 
  status, 
  totalAmount, 
  items, 
  isEditing, 
  editingId, 
  editForm, 
  isImageVisible, 
  onToggleImage,
  onStartEdit, 
  onCancelEdit, 
  onSaveEdit, 
  onChange 
}) {
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': 
        return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">처리 완료</span>;
      case 'analyzing':
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/>AI 분석중</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">대기</span>;
    }
  };

  return (
    <div className="mb-2">
      {/* Section Header */}
      <div className="bg-white sticky top-0 z-30 px-4 py-3 border-b border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getStatusBadge(status)}
            <span className="text-xs text-gray-400 font-medium">No. {title.split('|')[1]}</span>
          </div>
          <h2 className="text-sm font-bold text-gray-800">{title.split('|')[0]}</h2>
        </div>
        
        {/* Right side: Amount + Toggle */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-gray-500">합계금액</p>
            <p className="text-sm font-bold text-gray-900">₩{formatCurrency(totalAmount)}</p>
          </div>
          
          <div className="h-6 w-px bg-gray-200"></div>

          {/* Individual Toggle Button in Section Header */}
          <button 
            onClick={onToggleImage}
            className={`p-2 rounded-full transition-colors border ${isImageVisible ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
            title={isImageVisible ? "이미지 닫기" : "이미지 보기"}
          >
            {isImageVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white divide-y divide-gray-100">
        {items.map((item) => {
          const isItemEditing = editingId === item.id;
          
          if (isItemEditing) {
            return (
              <EditItem 
                key={item.id} 
                data={editForm} 
                onChange={onChange}
              />
            );
          }
          
          return (
            <ViewItem 
              key={item.id} 
              data={item} 
              onEdit={() => onStartEdit(item)} 
              disabled={isEditing && !isItemEditing} // Disable other items when editing one
            />
          );
        })}
      </div>
    </div>
  );
}

// --- Sub Component: Read Mode Item ---
function ViewItem({ data, onEdit, disabled }) {
  // Styles for missing data: Neutral Gray instead of Red Alert
  const getValueStyle = (value) => value ? 'text-gray-900' : 'text-gray-300 font-normal';
  const getDisplayValue = (value) => value || '-';

  return (
    <div className={`p-4 transition-colors ${disabled ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-50'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold text-gray-800 leading-snug w-3/4 break-keep">
          {data.name}
        </h3>
        <button 
          onClick={onEdit}
          className="text-gray-400 hover:text-blue-600 p-1 -mr-2"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Mandatory Row 1: Standard, Qty, Price, Amount */}
      <div className="grid grid-cols-4 gap-2 mb-2 bg-gray-50 p-2 rounded border border-gray-100 text-center">
        {/* 4. 규격 */}
        <div className="flex flex-col justify-center">
          <div className="text-[10px] text-gray-400 mb-0.5">규격</div>
          <div className={`text-xs font-semibold truncate ${getValueStyle(data.standard)}`}>
            {getDisplayValue(data.standard)}
          </div>
        </div>
        {/* 1. 수량 */}
        <div className="flex flex-col justify-center border-l border-gray-200 pl-2">
          <div className="text-[10px] text-gray-400 mb-0.5">수량</div>
          <div className="text-xs font-bold text-gray-900">{data.qty}</div>
        </div>
        {/* 2. 단가 */}
        <div className="flex flex-col justify-center border-l border-gray-200 pl-2">
          <div className="text-[10px] text-gray-400 mb-0.5">단가</div>
          <div className="text-xs font-semibold text-gray-900">{formatCurrency(data.price)}</div>
        </div>
        {/* 3. 금액 */}
        <div className="flex flex-col justify-center border-l border-gray-200 pl-2">
          <div className="text-[10px] text-gray-400 mb-0.5">금액</div>
          <div className="text-xs font-bold text-blue-700">{formatCurrency(data.qty * data.price)}</div>
        </div>
      </div>

      {/* Mandatory Row 2: Expiry, Note, Lot */}
      <div className="flex gap-2 text-xs">
        {/* 5. 유효기간 */}
        <div className="flex-1 px-2 py-1.5 rounded border bg-white border-gray-200 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5 text-left">유효기간</span>
          <span className={getValueStyle(data.expiry)}>{getDisplayValue(data.expiry)}</span>
        </div>
        {/* 제조번호 (Lot) - Neutralized */}
        <div className="flex-1 px-2 py-1.5 rounded border bg-white border-gray-200 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5 text-left">제조번호</span>
          <span className={getValueStyle(data.lot)}>{getDisplayValue(data.lot)}</span>
        </div>
        {/* 6. 비고 */}
        <div className="flex-1 px-2 py-1.5 rounded border bg-gray-50 border-gray-200 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5 text-left">비고</span>
          <span className={`truncate block ${getValueStyle(data.note)}`} title={data.note}>
            {getDisplayValue(data.note)}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Sub Component: Edit Mode Item ---
function EditItem({ data, onChange }) {
  const amount = data.qty * data.price;
  const tax = Math.floor(amount * 0.1);

  return (
    <div className="p-4 bg-blue-50/50 border-l-4 border-blue-600 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-gray-800 truncate pr-2">{data.name}</h3>
        <button className="text-[10px] flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded text-gray-600 shadow-sm">
          <RefreshCw className="w-3 h-3" /> OCR 재인식
        </button>
      </div>

      {/* Edit Row 1: Standard, Qty, Price */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">규격</label>
          <input 
            type="text" 
            value={data.standard}
            placeholder="-"
            onChange={(e) => onChange('standard', e.target.value)}
            className="w-full text-center font-bold text-gray-700 text-sm border-b-2 border-gray-300 bg-white p-1 focus:outline-none focus:border-blue-500 placeholder-gray-300"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">수량</label>
          <input 
            type="number" 
            value={data.qty}
            onChange={(e) => onChange('qty', parseInt(e.target.value) || 0)}
            className="w-full text-right font-bold text-gray-900 text-sm border-b-2 border-blue-500 bg-white p-1 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">단가</label>
          <input 
            type="number" 
            value={data.price}
            onChange={(e) => onChange('price', parseInt(e.target.value) || 0)}
            className="w-full text-right font-bold text-gray-900 text-sm border-b-2 border-blue-500 bg-white p-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Auto Calculated Row */}
      <div className="flex justify-between items-center mb-4 px-2 py-1 bg-gray-100 rounded">
        <span className="text-xs text-gray-500">공급가액 <span className="font-bold text-gray-800">₩{formatCurrency(amount)}</span></span>
        <span className="text-xs text-gray-300">|</span>
        <span className="text-xs text-gray-500">세액 <span className="font-bold text-gray-800">₩{formatCurrency(tax)}</span></span>
      </div>

      {/* Edit Row 2: Lot, Expiry, Note */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">제조번호</label>
          <input 
            type="text" 
            value={data.lot}
            placeholder="-"
            onChange={(e) => onChange('lot', e.target.value)}
            className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 placeholder-gray-300"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">유효기간</label>
          <input 
            type="date" 
            value={data.expiry}
            onChange={(e) => onChange('expiry', e.target.value)}
            className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">비고</label>
          <input 
            type="text" 
            value={data.note}
            placeholder="-"
            onChange={(e) => onChange('note', e.target.value)}
            className="w-full text-xs p-1.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-blue-500 placeholder-gray-300"
          />
        </div>
      </div>
    </div>
  );
}