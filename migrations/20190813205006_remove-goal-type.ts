import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.table('goals', t => {
    t.dropColumn('type');
  });
}

export async function down(): Promise<any> {}
