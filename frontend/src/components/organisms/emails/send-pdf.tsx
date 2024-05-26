'use client'

import { FunctionComponent } from 'react'

interface EmailTemplateProps {
  firstName: string | null
}

const SendPdf: FunctionComponent<EmailTemplateProps> = ({ firstName }) => {
  return (
    <div>
      <h1>{firstName}</h1>
    </div>
  )
}

export default SendPdf
