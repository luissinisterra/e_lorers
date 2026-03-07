import jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/UserRepository.js";
import bcrypt from 'bcryptjs';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async login(username: string, password: string) { // In real apps, verify hash!
        const user = await this.userRepository.findByUsername(username);

        if (!user) {
            throw new Error('User not found');
        }

        const data = user?.dataValues;

        if (!bcrypt.compareSync(password, data.password)) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: data.id, username: data.username },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        return token;
    }

    async register(name: string, username: string, password: string) {
        const user = await this.userRepository.findByUsername(username);

        if (user) {
            throw new Error('User already exists');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await this.userRepository.create(name, username, hashedPassword);

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        return token;
    }
}
