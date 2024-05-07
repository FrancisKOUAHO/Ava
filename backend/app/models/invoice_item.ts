import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Invoice from '#models/invoice'
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

import User from "#models/user";

export default class InvoiceItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare invoice_id: string

  @column()
  declare quantity: number

  @column()
  declare price: number

  @column()
  declare unity: string

  @column()
  declare name: string

  @column()
  declare line_total: number

  @column()
  declare line_total_tva: number

  @column()
  declare tva: number

  @belongsTo(() => Invoice, {
      foreignKey: 'invoice_id',
  })
  declare invoice: BelongsTo<typeof Invoice>


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
