import { EventLike } from "../entities/EventLike.js";

export class EventLikeRepository {
    async findByEvent(id_event: number) {
        return await EventLike.findAll({ where: { id_event } });
    }

    async findByUser(id_user: number) {
        return await EventLike.findAll({ where: { id_user } });
    }

    async findOne(id_event: number, id_user: number) {
        return await EventLike.findOne({ where: { id_event, id_user } });
    }

    async create(id_event: number, id_user: number) {
        return await EventLike.create({ id_event, id_user });
    }

    async delete(id_event: number, id_user: number) {
        const like = await EventLike.findOne({ where: { id_event, id_user } });
        if (!like) return false;
        await like.destroy();
        return true;
    }

    async countByEvent(id_event: number) {
        return await EventLike.count({ where: { id_event } });
    }
}
