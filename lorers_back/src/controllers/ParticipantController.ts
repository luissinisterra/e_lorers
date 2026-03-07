import type { Request, Response } from "express";
import { ParticipantService } from "../services/ParticipantService.js";

const participantService = new ParticipantService();

export const getParticipantsByEvent = async (req: Request, res: Response) => {
    const id_event = Number(req.params.id_event);
    if (isNaN(id_event) || id_event <= 0) {
        res.status(400).json({ message: "Invalid id_event" });
        return;
    }
    try {
        const participants = await participantService.getParticipantsByEvent(id_event);
        res.json(participants);
    } catch (error: any) {
        const status = error.message === "Event not found" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const getEventsByUser = async (req: Request, res: Response) => {
    const id_user = Number(req.params.id_user);
    if (isNaN(id_user) || id_user <= 0) {
        res.status(400).json({ message: "Invalid id_user" });
        return;
    }
    try {
        const events = await participantService.getEventsByUser(id_user);
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const joinEvent = async (req: Request, res: Response) => {
    const id_event = Number(req.params.id_event);
    if (isNaN(id_event) || id_event <= 0) {
        res.status(400).json({ message: "Invalid id_event" });
        return;
    }
    try {
        const id_user = (req as any).user.id;
        const participant = await participantService.joinEvent(id_event, id_user);
        res.status(201).json(participant);
    } catch (error: any) {
        const status =
            error.message === "Event not found" ? 404 :
            error.message === "Already joined" ? 409 :
            error.message === "Event is full" ? 409 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const leaveEvent = async (req: Request, res: Response) => {
    const id_event = Number(req.params.id_event);
    if (isNaN(id_event) || id_event <= 0) {
        res.status(400).json({ message: "Invalid id_event" });
        return;
    }
    try {
        const id_user = (req as any).user.id;
        await participantService.leaveEvent(id_event, id_user);
        res.status(204).send();
    } catch (error: any) {
        const status =
            error.message === "Event not found" ? 404 :
            error.message === "Not a participant" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};
