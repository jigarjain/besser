import { Sequelize, Model, DataTypes } from 'sequelize';

export default class Goal extends Model {
  public id!: number;
  public name!: string;
  public isDeleted!: boolean;
  public type!: GoalType;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initialize = (dbConnection: Sequelize) => {
  Goal.init(
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
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize: dbConnection,
      tableName: 'goals'
    }
  );
};
