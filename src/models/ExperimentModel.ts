import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';

export default class Experiment extends Model {
  public id!: number;
  public name!: string;
  public trafficAlloc!: number;
  public isRunning!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initialize = (dbConnection: Sequelize) => {
  Experiment.init(
    {
      id: {
        type: new DataTypes.INTEGER.UNSIGNED(),
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: new DataTypes.STRING(),
        allowNull: false
      },
      trafficAlloc: {
        type: new DataTypes.INTEGER.UNSIGNED(),
        allowNull: false
      },
      isRunning: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      sequelize: dbConnection,
      tableName: 'experiments'
    }
  );
};
