import * as Knex from 'knex';
import { DB_TABLE } from '../src/constants';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable(DB_TABLE.VISITOR_ASSIGNMENTS, table => {
    table.string('visitor_id').notNullable();
  });
}

export async function down(): Promise<any> {}
