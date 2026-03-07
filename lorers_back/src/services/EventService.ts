import { EventRepository } from "../repositories/EventRepository.js";
import { ParticipantRepository } from "../repositories/ParticipantRepository.js";

export class EventService {
    private eventRepository: EventRepository;
    private participantRepository: ParticipantRepository;

    constructor() {
        this.eventRepository = new EventRepository();
        this.participantRepository = new ParticipantRepository();
    }

    async getAllEvents() {
        return await this.eventRepository.findAll();
    }

    async getEventById(id: number) {
        const [event, participant_count] = await Promise.all([
            this.eventRepository.findById(id),
            this.participantRepository.countByEvent(id),
        ]);
        if (!event) throw new Error("Event not found");
        return { ...event.toJSON(), participant_count };
    }

    async getEventsByCreator(creator_id: number) {
        return await this.eventRepository.findByCreatorId(creator_id);
    }

    async createEvent(
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
        if (!name || !start_time || !end_time || !address) {
            throw new Error("name, start_time, end_time and address are required");
        }
        if (new Date(start_time) >= new Date(end_time)) {
            throw new Error("start_time must be before end_time");
        }
        return await this.eventRepository.create(
            name, description, creator_id,
            max_participants, start_time, end_time,
            address, latitude, longitude
        );
    }

    async updateEvent(
        id: number,
        requesterId: number,
        updateData: {
            name: string;
            description: string | null;
            max_participants: number | null;
            start_time: Date;
            end_time: Date;
            address: string;
            latitude: number | null;
            longitude: number | null;
        }
    ) {
        const event = await this.eventRepository.findById(id);
        if (!event) throw new Error("Event not found");
        if (Number(event.getDataValue('creator_id')) !== Number(requesterId))
            throw new Error("Unauthorized");

        if (new Date(updateData.start_time) >= new Date(updateData.end_time)) {
            throw new Error("start_time must be before end_time");
        }

        return await this.eventRepository.update(id, updateData);
    }

    async deleteEvent(id: number, requesterId: number) {
        const event = await this.eventRepository.findById(id);
        if (!event) throw new Error("Event not found");
        if (Number(event.getDataValue('creator_id')) !== Number(requesterId))
            throw new Error("Unauthorized");
        return await this.eventRepository.delete(id);
    }

    async likeEvent(id: number) {
        const event = await this.eventRepository.findById(id);
        if (!event) throw new Error("Event not found");
        return await this.eventRepository.incrementLikes(id);
    }

    async unlikeEvent(id: number) {
        const event = await this.eventRepository.findById(id);
        if (!event) throw new Error("Event not found");
        return await this.eventRepository.decrementLikes(id);
    }
}
