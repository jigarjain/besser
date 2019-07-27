import { Sequelize, Model, DataTypes } from 'sequelize';

export default class Variation extends Model {
  public id!: number;
  public name!: string;
  public experimentId!: number;
  public isControl!: boolean;
  public isEnabled!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initialize = (dbConnection: Sequelize) => {
  Variation.init(
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
      experimentId: {
        type: new DataTypes.INTEGER.UNSIGNED(),
        allowNull: false
      },
      isControl: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      sequelize: dbConnection,
      tableName: 'variations'
    }
  );
};
