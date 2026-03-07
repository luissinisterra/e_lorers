import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class Event extends Model {
    public id_event!: number;
    public name!: string;
    public description!: string | null;
    public creator_id!: number;
    public likes!: number;
    public max_participants!: number | null;
    public start_time!: Date;
    public end_time!: Date;
    public address!: string;
    public latitude!: number | null;
    public longitude!: number | null;
}

Event.init(
    {
        id_event: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        creator_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        max_participants: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "events",
    },
);