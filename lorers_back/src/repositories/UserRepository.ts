import { User } from "../entities/User.js";

export class UserRepository {
    async findByUsername(username: string) {
        return await User.findOne({ where: { username } });
    }

    async create(user: any) {
        return await User.create(user);
    }
}
