import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import React from 'react'

const downloadPDF = async (
  pdfRef: React.RefObject<HTMLDivElement>,
  SendInvoiceMutation?: any,
) => {
  try {
    const input = pdfRef.current
    if (!input) return

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      width: input.scrollWidth,
      height: input.scrollHeight,
    })

    const imgData = canvas.toDataURL('image/png')
    const imgProps = pdf.getImageProperties(imgData)
    const imgWidth = pageWidth
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    if (SendInvoiceMutation === 'SendInvoiceMutation') {
      const blob = pdf.output('blob')
    }

    pdf.save('download.pdf')
  } catch (error) {
    console.error('Error generating PDF: ', error)
  }
}

const generatePDF = async (
  pdfRef: React.RefObject<HTMLDivElement>,
): Promise<Blob | null> => {
  try {
    const input = pdfRef.current
    if (!input) return null

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      width: input.scrollWidth,
      height: input.scrollHeight,
    })

    const imgData = canvas.toDataURL('image/png')
    const imgProps = pdf.getImageProperties(imgData)
    const imgWidth = pageWidth
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    return pdf.output('blob')
  } catch (error) {
    console.error('Error generating PDF: ', error)
    return null
  }
}

export { downloadPDF, generatePDF }
