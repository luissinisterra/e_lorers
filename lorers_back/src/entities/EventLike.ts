import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class EventLike extends Model {
    public id_event!: number;
    public id_user!: number;
}

EventLike.init(
    {
        id_event: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: "events", key: "id_event" },
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: "users", key: "id" },
        },
    },
    {
        sequelize,
        tableName: "event_likes",
        timestamps: false,
    },
);
