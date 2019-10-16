import { Sequelize, Model, DataTypes } from 'sequelize';

const db = new Sequelize({
    database: 'ridehailing',
    username: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

export class TrackEvent extends Model {}
TrackEvent.init({
    rider_id: DataTypes.INTEGER,
    north: DataTypes.FLOAT,
    west: DataTypes.FLOAT,
    east: DataTypes.FLOAT,
    south: DataTypes.FLOAT
},
    {modelName: "track_event", sequelize: db}
);

export class DriverPosition extends Model {};
DriverPosition.init({
    rider_id: DataTypes.INTEGER,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT
},
    {modelName: "driver_position", sequelize: db}
);

export function syncDB(): Promise<Sequelize> {
    return db.sync();
}