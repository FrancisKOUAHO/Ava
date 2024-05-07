import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'first_name' })
  declare first_name: string

  @column({ columnName: 'last_name' })
  declare last_name: string

  @column()
  declare email: string

  @column()
  declare phone: string

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare state: string

  @column()
  declare zip: string

  @column()
  declare country: string

  @column()
  declare siren_number: string

  @column()
  declare company: string

  @column({ columnName: 'vat_number' })
  declare vat_number: string

  @column()
  declare currency: string

  @column()
  declare language: string

  @column({ columnName: 'user_id' })
  declare user_id: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
