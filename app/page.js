'use client'
import { useState } from 'react'
import PharmxAIApp from '../invoice-menu-v1'
import SupplierManagementApp from '../supplier-menu-v1'
import ExpiryCheckApp from '../expiry-menu-v1'

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('invoice') // 'invoice' | 'supplier'

  return (
    <>
      {activeMenu === 'invoice' && (
        <PharmxAIApp onMenuChange={setActiveMenu} />
      )}
      {activeMenu === 'supplier' && (
        <SupplierManagementApp onMenuChange={setActiveMenu} />
      )}
      {activeMenu === 'expiry' && (
        <ExpiryCheckApp onMenuChange={setActiveMenu} />
      )}
    </>
  )
}
