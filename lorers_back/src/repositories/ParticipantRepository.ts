import { Participant } from "../entities/Participant.js";

export class ParticipantRepository {
    async findByEvent(id_event: number) {
        return await Participant.findAll({ where: { id_event } });
    }

    async findByUser(id_user: number) {
        return await Participant.findAll({ where: { id_user } });
    }

    async findOne(id_event: number, id_user: number) {
        return await Participant.findOne({ where: { id_event, id_user } });
    }

    async create(id_event: number, id_user: number) {
        return await Participant.create({ id_event, id_user });
    }

    async delete(id_event: number, id_user: number) {
        const participant = await Participant.findOne({ where: { id_event, id_user } });
        if (!participant) return false;
        await participant.destroy();
        return true;
    }

    async countByEvent(id_event: number) {
        return await Participant.count({ where: { id_event } });
    }
}
