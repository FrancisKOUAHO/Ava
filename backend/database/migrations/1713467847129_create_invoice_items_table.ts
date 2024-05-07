import { BaseSchema } from '@adonisjs/lucid/schema'

export default class InvoiceItemsSchema extends BaseSchema {
  protected tableName = 'invoice_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.uuid('invoice_id').unsigned().references('id').inTable('invoices').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('unity').nullable()
      table.decimal('quantity').nullable()
      table.decimal('price', 12, 2).notNullable()
      table.decimal('tva').notNullable()

      table.decimal('line_total', 12, 2).notNullable()
      table.decimal('line_total_tva', 12, 2).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
