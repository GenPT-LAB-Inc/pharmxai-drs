'use client'
import { useState } from 'react'
import DashboardApp from '../dashboard-menu-v1'
import PharmxAIApp from '../invoice-menu-v1'
import SupplierManagementApp from '../supplier-menu-v1'
import ExpiryCheckApp from '../expiry-menu-v1'
import ReportMenuApp from '../report-menu-v1'

export default function Home() {
  const defaultDate = { date: '2026-01-14', label: '2026.01.14 (수)' }
  const [activeMenu, setActiveMenu] = useState('dashboard') // 'dashboard' | 'invoice' | 'supplier' | 'expiry' | 'report'
  const [selectedDate, setSelectedDate] = useState(defaultDate)

  const handleDateSelect = (nextDate) => {
    if (nextDate) {
      setSelectedDate(nextDate)
    }
    setActiveMenu('invoice')
  }

  return (
    <>
      {activeMenu === 'dashboard' && (
        <DashboardApp onMenuChange={setActiveMenu} onDateSelect={handleDateSelect} />
      )}
      {activeMenu === 'invoice' && (
        <PharmxAIApp onMenuChange={setActiveMenu} selectedDate={selectedDate} />
      )}
      {activeMenu === 'supplier' && (
        <SupplierManagementApp onMenuChange={setActiveMenu} />
      )}
      {activeMenu === 'expiry' && (
        <ExpiryCheckApp onMenuChange={setActiveMenu} />
      )}
      {activeMenu === 'report' && (
        <ReportMenuApp onMenuChange={setActiveMenu} />
      )}
    </>
  )
}
