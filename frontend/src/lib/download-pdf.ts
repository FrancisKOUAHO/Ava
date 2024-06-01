import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const downloadPDF = async (isDownloading = false) => {
  let pdfBlob

  try {
    const input = document.getElementById('pdf-content')
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
    if (isDownloading) {
      pdf.save('download.pdf')
    }
    pdfBlob = pdf.output('blob')
  } catch (error) {
    console.error('Error generating PDF: ', error)
  }
  return pdfBlob
}
