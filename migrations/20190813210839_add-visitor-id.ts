import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable('visitor_assignments', table => {
    table.string('visitor_id').notNullable();
  });
}

export async function down(): Promise<any> {}
