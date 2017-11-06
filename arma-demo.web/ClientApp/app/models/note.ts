import { User } from './user';

export class Note {
    id: number;
    title: string;
    value: string;
    isDeleted: boolean;
    user: User;
}
