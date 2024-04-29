import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ClientsSchema extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery);
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('first_name').nullable();
      table.string('last_name').nullable();
      table.string('email', 254).nullable();
      table.string('phone').nullable();
      table.string('address').nullable();
      table.string('city').nullable();
      table.string('state').nullable();
      table.string('zip').nullable();
      table.string('country').nullable();
      table.string('company').nullable();
      table.string('vat_number').nullable();
      table.string('currency').nullable();
      table.string('language').nullable();
      table.string('siren_number').unique();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).nullable();
    });
  }


  async down() {
    this.schema.dropTable(this.tableName)
  }
}
