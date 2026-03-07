import { EventLikeRepository } from "../repositories/EventLikeRepository.js";
import { EventRepository } from "../repositories/EventRepository.js";

export class EventLikeService {
    private eventLikeRepository: EventLikeRepository;
    private eventRepository: EventRepository;

    constructor() {
        this.eventLikeRepository = new EventLikeRepository();
        this.eventRepository = new EventRepository();
    }

    async likeEvent(id_event: number, id_user: number) {
        const [event, already] = await Promise.all([
            this.eventRepository.findById(id_event),
            this.eventLikeRepository.findOne(id_event, id_user),
        ]);

        if (!event) throw new Error("Event not found");
        if (already) throw new Error("Already liked");

        await Promise.all([
            this.eventLikeRepository.create(id_event, id_user),
            this.eventRepository.incrementLikes(id_event),
        ]);

        return await this.eventRepository.findById(id_event);
    }

    async unlikeEvent(id_event: number, id_user: number) {
        const [event, like] = await Promise.all([
            this.eventRepository.findById(id_event),
            this.eventLikeRepository.findOne(id_event, id_user),
        ]);

        if (!event) throw new Error("Event not found");
        if (!like) throw new Error("Not liked");

        await Promise.all([
            this.eventLikeRepository.delete(id_event, id_user),
            this.eventRepository.decrementLikes(id_event),
        ]);

        return await this.eventRepository.findById(id_event);
    }

    async getLikesByEvent(id_event: number) {
        const event = await this.eventRepository.findById(id_event);
        if (!event) throw new Error("Event not found");
        return await this.eventLikeRepository.findByEvent(id_event);
    }

    async hasLiked(id_event: number, id_user: number) {
        const like = await this.eventLikeRepository.findOne(id_event, id_user);
        return like !== null;
    }
}
