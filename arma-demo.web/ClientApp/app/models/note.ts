import { User } from './user';
import { Category } from './category';
import { IFilter } from '../interfaces/ifilter';

export class Note implements IFilter {
    id: number;
    title: string;
    value: string;
    isDeleted: boolean;
    user: User;
    category: Category;

    get filter(): string { return this.title }

    constructor() {
        this.user = new User();
        this.category = new Category();
    }
}
