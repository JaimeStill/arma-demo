import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IService<T> {
    data: BehaviorSubject<Array<T>>;
}
