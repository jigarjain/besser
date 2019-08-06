import * as Knex from 'knex';

/**
 * Creates a table for `experiments`
 */
async function createExperimentsTable(knex: Knex) {
  await knex.schema.createTable('experiments', table => {
    table.increments('id').unsigned();
    table.string('name').notNullable();
    table.integer('traffic_alloc').defaultTo(100);
    table.boolean('is_running').defaultTo(true);
    table.boolean('is_deleted').defaultTo(false);
    table.timestamps(false, true);
  });
  // eslint-disable-next-line no-console
  console.log('Created `experiments` table');
}

async function dropExperimentsTable(knex: Knex) {
  await knex.schema.dropTable('experiments');
  // eslint-disable-next-line no-console
  console.log('Dropped `experiments` table');
}

/**
 * Creates a table for `variations`
 */
async function createVariationsTable(knex: Knex) {
  await knex.schema.createTable('variations', table => {
    table.increments('id').unsigned();
    table.string('name').notNullable();
    table.boolean('is_control').notNullable();
    table.boolean('is_active').defaultTo(true);
    table
      .integer('experiment_id')
      .references('id')
      .inTable('experiments')
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table.timestamps(false, true);
  });
  // eslint-disable-next-line no-console
  console.log('Created `variations` table');
}

async function dropVariationsTable(knex: Knex) {
  await knex.schema.dropTable('variations');
  // eslint-disable-next-line no-console
  console.log('Dropped `variations` table');
}

/**
 * Creates a table for `goals`
 */
async function createGoalsTable(knex: Knex) {
  await knex.schema.createTable('goals', table => {
    table.increments('id').unsigned();
    table.string('name').notNullable();
    table.string('type').notNullable();
    table.boolean('is_deleted').defaultTo(false);
    table.timestamps(false, true);
  });
  // eslint-disable-next-line no-console
  console.log('Created `goals` table');
}

async function dropGoalsTable(knex: Knex) {
  await knex.schema.dropTable('goals');
  // eslint-disable-next-line no-console
  console.log('Dropped `goals` table');
}

export async function up(knex: Knex): Promise<any> {
  await createExperimentsTable(knex);
  await createVariationsTable(knex);
  await createGoalsTable(knex);
  // eslint-disable-next-line no-console
  console.log('All done !');
}

export async function down(knex: Knex): Promise<any> {
  await dropGoalsTable(knex);
  await dropVariationsTable(knex);
  await dropExperimentsTable(knex);
  // eslint-disable-next-line no-console
  console.log('All done !');
}
