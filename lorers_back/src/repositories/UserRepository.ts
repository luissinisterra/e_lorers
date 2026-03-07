import { User } from "../entities/User.js";

export class UserRepository {
    async findByUsername(username: string) {
        return await User.findOne({ where: { username } });
    }

    async create(name: string, username: string, password: string) {
        return await User.create({ name, username, password });
    }
}
