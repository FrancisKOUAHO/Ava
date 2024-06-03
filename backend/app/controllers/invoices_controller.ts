import { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'
import { createInvoiceValidator, updateInvoiceValidator } from '#validators/invoice'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'
export default class InvoicesController {
  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    const is_invoice = request.input('is_invoice', false) // Defaults to fetching invoices
    const documents = await Invoice.query().where('is_invoice', is_invoice)
    return response.ok(documents)
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.all()
    console.log(data)
    const validation = await createInvoiceValidator.validate(data)

    if (!validation) {
      return response.badRequest(validation)
    }

    const invoice: Invoice = await Invoice.create(data)
    return response.created(invoice)
  }

  async updatePdfPath({ request, params, response }: HttpContextContract) {
    const invoiceId = request.input('invoice');
    const pdfFile = request.file('file', {
      size: '20mb',
      extnames: ['pdf'],
    });
    console.log('invoiceId', request);
    console.log('invoiceId', invoiceId);


    if (!pdfFile) {
      return response.status(400).json({ message: 'PDF file not provided' });
    }

    try {
      // Trouver la facture existante par ID
      const invoice = await Invoice.findOrFail(invoiceId);

      // Chemin pour stocker le fichier
      const fileName = `invoice-${invoiceId}-${Date.now()}.pdf`;
      const filePath = `uploads/${fileName}`;

      // Déplacer le fichier PDF au chemin de stockage final
      await pdfFile.move(app.tmpPath('uploads'), {
        name: fileName,
        overwrite: true // Écraser le fichier existant du même nom si nécessaire
      });

      // Mettre à jour le chemin dans la base de données
      invoice.path = app.tmpPath(filePath);
      await invoice.save();

      return response.status(200).json({
        message: 'PDF path updated successfully',
        path: invoice.pdfPath
      });
    } catch (error) {
      return response.status(500).json({ message: 'Error updating invoice', error: error.message });
    }
  }

  public async downloadPdf({ params, response }: HttpContextContract) {
    try {
      // Assuming 'id' maps to a database record with the file path
      const invoice = await Invoice.findOrFail(params.id);

      //const path = app.tmpPath('uploads', invoice.path);
      console.log('path', invoice.path);
      response.header('Content-Type', 'application/pdf');

      response.download(invoice.path);
      // This will handle setting the appropriate headers and stream the file

    } catch (err) {
      console.log("huuuù")
      console.error(err);
      return response.status(401).send('File not found');
    }
  }

  // async sendPdfEmail({ request, response }: HttpContext) {
  //
  //   const pdfFile = request.file('file', {
  //     size: '20mb',
  //     extnames: ['pdf'],
  //   })
  //
  //   if (!pdfFile) {
  //     return response.status(400).send('File not provided')
  //   }
  //
  //   const filePath = pdfFile.tmpPath
  //
  //   return response.status(200).json({ message: 'Email sent successfully' })
  //
  //   // const responseInvoiceJson = request.input('responseInvoice')
  //   // let data
  //   // try {
  //   //   data = JSON.parse(responseInvoiceJson)
  //   // } catch (error) {
  //   //   console.error('Erreur de parsing JSON:', error)
  //   //   return response.status(400).send('Invalid JSON data')
  //   // }
  //   //
  //   // const pdfFile = request.file('file', {
  //   //   size: '20mb',
  //   //   extnames: ['pdf'],
  //   // })
  //   //
  //   // if (!pdfFile) {
  //   //   return response.status(400).send('File not provided')
  //   // }
  //   //
  //   // const filePath = pdfFile.tmpPath
  //   //
  //   // if (!filePath) {
  //   //   return response.status(400).send('File path not found')
  //   // }
  //   //
  //   // const fileBuffer = await fs.readFile(filePath)
  //   //
  //   // const subject = data.isInvoice == 1 ? 'Facture' : 'Devis'
  //   // await mail.use('resend').send((message) => {
  //   //   message
  //   //     .from('contact@plumera.fr')
  //   //     .to(data.client.email)
  //   //     .subject(subject)
  //   //     .html(
  //   //       `
  //   //     <!DOCTYPE html>
  //   //     <html lang="fr">
  //   //       <head>
  //   //         <meta charset="UTF-8">
  //   //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   //         <title>${subject}</title>
  //   //         <style>
  //   //           body { font-family: 'Arial', sans-serif; line-height: 1.6; }
  //   //           p { color: #333; }
  //   //         </style>
  //   //       </head>
  //   //       <body>
  //   //         <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
  //   //           <h1>Bonjour,</h1>
  //   //           <p>
  //   //             Ci-joint votre ${subject} en pièce jointe.
  //   //           </p>
  //   //         </div>
  //   //       </body>
  //   //     </html>
  //   //   `
  //   //     )
  //   //     .attachData(fileBuffer, {
  //   //       encoding: 'base64',
  //   //       filename: pdfFile.clientName,
  //   //       contentType: 'application/pdf',
  //   //     })
  //   // })
  //   //
  //   // return response.status(200).json({ message: 'Email sent successfully' })
  // }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const invoice = await Invoice.find(params.id)

    if (!invoice) {
      return response.notFound()
    }

    return response.ok(invoice)
  }

  /**
   * Edit individual record
   */
  async edit({ params, response }: HttpContext) {
    const invoice = await Invoice.find(params.id)

    if (!invoice) {
      return response.notFound()
    }

    return response.ok(invoice)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const data = request.all()

    const validation = await updateInvoiceValidator.validate(data)

    if (!validation) {
      return response.badRequest(validation)
    }

    const invoice: Invoice | null = await Invoice.find(params.id)

    if (!invoice) {
      return response.notFound()
    }

    invoice.merge(data)

    await invoice.save()

    return response.ok(invoice)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const invoice: Invoice | null = await Invoice.find(params.id)

    if (!invoice) {
      return response.notFound()
    }

    await invoice.delete()

    return response.noContent()
  }

  public async getAllInvoiceData({ response }: HttpContext) {
    try {
      const invoices = await Invoice.query()
        .where('is_invoice', 1) // Dynamically filter based on the input
        .preload('client', (query) => {
          query.select('id', 'first_name', 'last_name')
        })
        .select(
          'invoices.*',
          db.rawQuery(
            `(SELECT SUM(price * quantity) FROM invoice_items WHERE invoice_items.invoice_id = invoices.id) as total`
          )
        )
        .orderBy('invoices.created_at', 'desc')

      return response.ok(invoices)
    } catch (error) {
      console.error('Failed to fetch documents', error)
      return response.status(500).send('Failed to fetch documents')
    }
  }

  public async getAllDevisData({ response }: HttpContext) {
    try {
      const invoices = await Invoice.query()
        .where('is_invoice', 0)
        .preload('client', (query) => {
          query.select('id', 'first_name', 'last_name')
        })
        .select(
          'invoices.*',
          db.rawQuery(
            `(SELECT SUM(price * quantity) FROM invoice_items WHERE invoice_items.invoice_id = invoices.id) as total`
          )
        )
        .orderBy('invoices.created_at', 'desc')

      return response.ok(invoices)
    } catch (error) {
      console.error('Failed to fetch documents', error)
      return response.status(500).send('Failed to fetch documents')
    }
  }

  // Dans un contrôleur AdonisJS
  async generatePdf({ request, response }: HttpContext) {

    // const body = request.body();
    // const html = body.html;
    // if (!html) {
    //   return response.status(400).json({ message: 'HTML content is missing' });
    // }
    //
    // // Utilisation de Puppeteer pour créer le PDF
    // try {
    //   const browser = await puppeteer.launch({ignoreDefaultArgs: ['--disable-extensions']})
    //   const page = await browser.newPage();
    //   await page.setContent(html); // Définir le contenu HTML de la page
    //   const pdfBuffer = await page.pdf({ format: 'A4' }); // Générer le PDF
    //   await browser.close();
    //
    //   // Vous pouvez maintenant sauvegarder le buffer pdfBuffer où vous voulez
    //   // const pdfPath = `public/invoices/invoice-${Date.now()}.pdf`;
    //   // await fs.writeFile(pdfPath, pdfBuffer);
    //
    //   // Envoie du chemin du fichier PDF en réponse
    //   return response.json({ path: "pdfPath" });
    // } catch (error) {
    //   console.error('Error generating PDF:', error);
    //   return response.status(500).json({ message: 'Error generating PDF', error: error.message });
    // }
    // const pdf = await html.pdf({ format: 'A4' });
    //
    // const fileName = 'hello.pdf'
    // response.header('Content-disposition', 'attachment')
    // response.header('content-type', 'pdf')
    // response.attachment(fileName)
    // response.send(pdf)
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.setContent(html); // Définition du contenu HTML de la page
    // const pdfBuffer = await page.pdf({ format: 'A4' });
    //
    // await browser.close();

    // Générer un chemin de fichier unique pour le PDF
    // const fileName = `invoice-${Date.now()}.pdf`;
    // const filePath = app.tmpPath('invoices', fileName); // Utilisation de Application.tmpPath pour déterminer le chemin

    // Sauvegarder le PDF dans un fichier de manière asynchrone
    //await fs.writeFile(filePath, pdfBuffer);

    // Sauvegarder le chemin dans la base de données (optionnel)
    // Exemple : await Invoice.create({ pdfPath: filePath });

    //return response.json({ path: filePath });
  }

}
