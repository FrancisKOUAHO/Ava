import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import api from "@/config/api";

export const downloadPDF = async (isDownloading = false,invoiceId:string) => {
  // if (!isDownloading || !path) return;
  //const response = await fetch(`/api/v1/billing/download-pdf/${invoiceId}`);

  try {
    const response = await api.get(`/billing/download-pdf/${invoiceId}`, {
      responseType: 'blob'  // S'assurer que la réponse est traitée en tant que blob
    });

    if (response.status === 200) {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "invoice.pdf"; // Nom du fichier à télécharger
      document.body.appendChild(a); // Ajouter l'élément <a> au document
      a.click(); // Simuler un clic pour démarrer le téléchargement
      a.remove(); // Retirer l'élément <a> après le téléchargement
      window.URL.revokeObjectURL(url); // Libérer l'URL de l'objet
    } else {
      throw new Error('Failed to download file');
    }
  } catch (error) {
    console.error('Error downloading the file: ', error);
  }
  // try {
    // Assuming 'path' is the URL to the PDF file
// Trigger download on click
//       window.location.href = `/api/v1/billing/download-pdf/${invoiceId}`;


  //   if (response.ok) {
  //     const blob = await response.blob(); // Convert the data to a blob
  //     const downloadUrl = window.URL.createObjectURL(blob); // Create a link to download
  //     const a = document.createElement('a');
  //     a.href = downloadUrl;
  //     a.download = 'invoice.pdf'; // Default filename for download
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove(); // Remove the element after download
  //     window.URL.revokeObjectURL(downloadUrl); // Clean up the URL object
  //   } else {
  //     throw new Error('Failed to download file.');
  //   }
  // } catch (error) {
  //   console.error('Error downloading the PDF:', error.message);
  //   alert('Failed to download the file.');
  // }


  // let pdfBlob
  //
  // try {
  //   const input = document.getElementById('pdf-content')
  //   if (!input) return
  //   const pdf = new jsPDF('p', 'mm', 'a4')
  //   const pageWidth = pdf.internal.pageSize.getWidth()
  //   const pageHeight = pdf.internal.pageSize.getHeight()
  //
  //   const canvas = await html2canvas(input, {
  //     scale: 2,
  //     useCORS: true,
  //     width: input.scrollWidth,
  //     height: input.scrollHeight,
  //   })
  //
  //   const imgData = canvas.toDataURL('image/png')
  //   const imgProps = pdf.getImageProperties(imgData)
  //   const imgWidth = pageWidth
  //   const imgHeight = (imgProps.height * imgWidth) / imgProps.width
  //
  //   let heightLeft = imgHeight
  //   let position = 0
  //
  //   pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  //   heightLeft -= pageHeight
  //
  //   while (heightLeft >= 0) {
  //     position = heightLeft - imgHeight
  //     pdf.addPage()
  //     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  //     heightLeft -= pageHeight
  //   }
  //   if (isDownloading) {
  //     pdf.save('download.pdf')
  //   }
  //   pdfBlob = pdf.output('blob')
  // } catch (error) {
  //   console.error('Error generating PDF: ', error)
  // }
  // return pdfBlob
}
