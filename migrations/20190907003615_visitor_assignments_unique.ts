import * as Knex from 'knex';
import { DB_TABLE } from '../src/constants';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.table(DB_TABLE.VISITOR_ASSIGNMENTS, table => {
    table.dropUnique(['experiment_id', 'variation_id', 'action']);
    table.unique(['visitor_id', 'experiment_id', 'variation_id', 'action']);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.table(DB_TABLE.VISITOR_ASSIGNMENTS, table => {
    table.dropUnique(['visitor_id', 'experiment_id', 'variation_id', 'action']);
    table.unique(['experiment_id', 'variation_id', 'action']);
  });
}
