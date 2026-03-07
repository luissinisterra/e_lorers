import type { Request, Response } from "express";
import { EventLikeService } from "../services/EventLikeService.js";

const eventLikeService = new EventLikeService();

export const likeEvent = async (req: Request, res: Response) => {
    try {
        const id_event = Number(req.params.id_event);
        const id_user = (req as any).user.id;
        const event = await eventLikeService.likeEvent(id_event, id_user);
        res.json(event);
    } catch (error: any) {
        const status =
            error.message === "Event not found" ? 404 :
            error.message === "Already liked" ? 409 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const unlikeEvent = async (req: Request, res: Response) => {
    try {
        const id_event = Number(req.params.id_event);
        const id_user = (req as any).user.id;
        const event = await eventLikeService.unlikeEvent(id_event, id_user);
        res.json(event);
    } catch (error: any) {
        const status =
            error.message === "Event not found" ? 404 :
            error.message === "Not liked" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const getLikesByEvent = async (req: Request, res: Response) => {
    try {
        const id_event = Number(req.params.id_event);
        const likes = await eventLikeService.getLikesByEvent(id_event);
        res.json(likes);
    } catch (error: any) {
        const status = error.message === "Event not found" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const hasLiked = async (req: Request, res: Response) => {
    try {
        const id_event = Number(req.params.id_event);
        const id_user = (req as any).user.id;
        const liked = await eventLikeService.hasLiked(id_event, id_user);
        res.json({ liked });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
