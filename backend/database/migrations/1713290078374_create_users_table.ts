import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    await this.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp" schema public version "1.1";')

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('email', 254).notNullable().unique()
      table.string('password', 180).nullable()
      table.string('full_name', 180).nullable()
      table.string('avatar', 255).nullable()
      table.string('magic_link_token', 255).nullable()
      table.string('last_reset_date', 255).nullable()
      table.string('access_token').nullable()
      table.string('refresh_token').nullable()
      table.string('google_id').nullable()
      table.string('country')
      table.string('business_form')
      table.string('siren_number').unique()

      table.string('magic_link_token_expires_at', 255).nullable()
      table.string('subscription_active', 255).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.boolean('active')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
