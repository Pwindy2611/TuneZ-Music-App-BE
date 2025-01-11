import { Request, Response, Router } from 'express';
import { createUserService, getAllUsersService } from '../services/user_services';

const router = Router();

export const getAllUsers = async (req: Request, res: Response) => {
    try{
        const users = await getAllUsersService();
        res.status(200).json(users);
    } catch (error){
        res.status(500).send('Error fetching users')
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { id, name, email, password } = req.body;
    try {
        await createUserService(id, name, email, password);
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send('Error creating user');
    }
};

export default router;
