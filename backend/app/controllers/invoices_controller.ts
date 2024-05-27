import { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'
import { createInvoiceValidator, updateInvoiceValidator } from '#validators/invoice'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import fs from 'fs/promises'

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

  async sendPdfEmail({ request, response }: HttpContext) {
    const responseInvoiceJson = request.input('responseInvoice')
    let data
    try {
      data = JSON.parse(responseInvoiceJson)
    } catch (error) {
      console.error('Erreur de parsing JSON:', error)
      return response.status(400).send('Invalid JSON data')
    }

    const pdfFile = request.file('file', {
      size: '20mb',
      extnames: ['pdf'],
    })

    if (!pdfFile) {
      return response.status(400).send('File not provided')
    }

    const filePath = pdfFile.tmpPath

    if (!filePath) {
      return response.status(400).send('File path not found')
    }

    const fileBuffer = await fs.readFile(filePath)

    const subject = data.isInvoice == 1 ? 'Facture' : 'Devis'
    await mail.use('resend').send((message) => {
      message
        .from('contact@plumera.fr')
        .to(data.client.email)
        .subject(subject)
        .html(
          `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; }
              p { color: #333; }
            </style>
          </head>
          <body>
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
              <h1>Bonjour,</h1>
              <p>
                Ci-joint votre ${subject} en pièce jointe.
              </p>
            </div>
          </body>
        </html>
      `
        )
        .attachData(fileBuffer, {
          encoding: 'base64',
          filename: pdfFile.clientName,
          contentType: 'application/pdf',
        })
    })

    return response.status(200).json({ message: 'Email sent successfully' })
  }

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
}
