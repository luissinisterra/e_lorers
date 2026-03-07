import { Event } from "../entities/Event.js";

export class EventRepository {
    async findById(id: number) {
        return await Event.findByPk(id);
    }

    async findAll() {
        return await Event.findAll();
    }

    async findByCreatorId(creator_id: number) {
        return await Event.findAll({ where: { creator_id } });
    }

    async create(
        name: string,
        description: string | null,
        creator_id: number,
        max_participants: number | null,
        start_time: Date,
        end_time: Date,
        address: string,
        latitude: number | null,
        longitude: number | null
    ) {
        return await Event.create({
            name,
            description,
            creator_id,
            max_participants,
            start_time,
            end_time,
            address,
            latitude,
            longitude,
        });
    }

    async update(id: number, updateData: {
        name: string;
        description: string | null;
        max_participants: number | null;
        start_time: Date;
        end_time: Date;
        address: string;
        latitude: number | null;
        longitude: number | null;
    }) {
        const event = await Event.findByPk(id);
        if (!event) return null;
        return await event.update(updateData);
    }

    async delete(id: number) {
        const event = await Event.findByPk(id);
        if (!event) return false;
        await event.destroy();
        return true;
    }

    async incrementLikes(id: number) {
        const event = await Event.findByPk(id);
        if (!event) return null;
        await event.increment('likes');
        return event.reload();
    }

    async decrementLikes(id: number) {
        const event = await Event.findByPk(id);
        if (!event) return null;
        if ((event.getDataValue('likes') ?? 0) > 0) {
            await event.decrement('likes');
            return event.reload();
        }
        return event;
    }
}