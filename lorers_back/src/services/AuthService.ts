import jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/UserRepository.js";

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

        // Simple comparison for educational purposes (Challenge: Implement hash check)
        // if (!bcrypt.compareSync(password, user.password)) {
        if (password !== user.password) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
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

        const newUser = await this.userRepository.create(name, username, password);

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        return token;
    }
}
