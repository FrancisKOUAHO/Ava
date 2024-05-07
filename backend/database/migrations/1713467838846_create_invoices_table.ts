import { BaseSchema } from '@adonisjs/lucid/schema'

export default class InvoicesSchema extends BaseSchema {
  protected tableName = 'invoices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('invoice_number').nullable()
      table.dateTime('date').nullable()
      table.uuid('client_id').unsigned().references('id').inTable('clients').onDelete('CASCADE')
      table.dateTime('invoice_date').nullable()
      table.dateTime('due_date').nullable()
      table.text('notes').nullable()
      table.text('terms').nullable()
      table.decimal('discount', 12, 2).notNullable()
      table.decimal('total_amount', 12, 2).nullable()
      table.string('status').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
