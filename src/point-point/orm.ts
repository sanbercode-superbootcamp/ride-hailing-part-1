import { Sequelize, Model, DataTypes } from "sequelize";

const db = new Sequelize({
  database: "ridehailing",
  username: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false
});

export class TrackEvent extends Model {}
TrackEvent.init(
  {
    rider_id: DataTypes.INTEGER,
    north: DataTypes.FLOAT,
    west: DataTypes.FLOAT,
    east: DataTypes.FLOAT,
    south: DataTypes.FLOAT
  },
  { modelName: "track_event", sequelize: db }
);

export class DriverPosition extends Model {};
DriverPosition.init(
  {
    rider_id: DataTypes.INTEGER,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
  },
  { modelName: 'driver_position', sequelize: db }
);

export class DriverPoint extends Model {};
DriverPoint.init(
  {
    rider_id: DataTypes.INTEGER,
    jarak_tempuh: DataTypes.INTEGER,
    points: DataTypes.INTEGER,
  },
  { modelName: "driver_point", sequelize: db }
);

export function syncDB(): Promise<Sequelize> {
  return db.sync();
}
