import { DateTime } from 'luxon'
import { BaseModel, belongsTo,hasMany, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type {BelongsTo, HasMany} from '@adonisjs/lucid/types/relations'
import Client from '#models/client'
import InvoiceItem from "#models/invoice_item";

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare invoice_number: string

  @column()
  declare due_date: string

  @column()
  declare total: string

  @column()
  declare status: string

  @column()
  declare notes: string

  @column()
  declare terms: string

  @column()
  declare user_id: string

  @column()
  declare total_amount: number

  @column()
  declare discount: number

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => InvoiceItem, {
    foreignKey: 'invoice_id',  // The name of the FK in the InvoiceItem model
  })
  declare items: HasMany<typeof InvoiceItem>


  @column()
  declare client_id: string

  @belongsTo(() => Client, {
    foreignKey: 'client_id',
  })
  declare client: BelongsTo<typeof Client>

  @column.dateTime()
  declare date: DateTime

  @column.dateTime()
  declare invoice_date: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
