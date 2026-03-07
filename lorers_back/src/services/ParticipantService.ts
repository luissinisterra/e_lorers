import { ParticipantRepository } from "../repositories/ParticipantRepository.js";
import { EventRepository } from "../repositories/EventRepository.js";

export class ParticipantService {
    private participantRepository: ParticipantRepository;
    private eventRepository: EventRepository;

    constructor() {
        this.participantRepository = new ParticipantRepository();
        this.eventRepository = new EventRepository();
    }

    async getParticipantsByEvent(id_event: number) {
        const event = await this.eventRepository.findById(id_event);
        if (!event) throw new Error("Event not found");
        return await this.participantRepository.findByEvent(id_event);
    }

    async getEventsByUser(id_user: number) {
        return await this.participantRepository.findByUser(id_user);
    }

    async joinEvent(id_event: number, id_user: number) {
        const event = await this.eventRepository.findById(id_event);
        if (!event) throw new Error("Event not found");

        const already = await this.participantRepository.findOne(id_event, id_user);
        if (already) throw new Error("Already joined");

        const max = event.getDataValue('max_participants') as number | null;
        if (max !== null) {
            const count = await this.participantRepository.countByEvent(id_event);
            if (count >= max) throw new Error("Event is full");
        }

        return await this.participantRepository.create(id_event, id_user);
    }

    async leaveEvent(id_event: number, id_user: number) {
        const event = await this.eventRepository.findById(id_event);
        if (!event) throw new Error("Event not found");

        const participant = await this.participantRepository.findOne(id_event, id_user);
        if (!participant) throw new Error("Not a participant");

        return await this.participantRepository.delete(id_event, id_user);
    }
}
