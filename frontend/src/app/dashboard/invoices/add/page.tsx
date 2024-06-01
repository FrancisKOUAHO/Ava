'use client'

import Invoice from '@/components/molecules/modal/invoice/invoice'
import { useState } from 'react'

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModalTable = () => {
    setIsModalOpen(true)
  }

  return (
    <section className="px-6 py-6 h-[90vh] overflow-auto">
      <button onClick={openModalTable}> Create invoice</button>

      <Invoice isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </section>
  )
}

export default Page
