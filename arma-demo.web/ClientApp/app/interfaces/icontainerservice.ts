import { IFilter } from './ifilter';
import { ContainerDataSource } from '../datasources/container.datasource';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IContainerService<T extends IFilter> {
    data: BehaviorSubject<Array<T>>;
    loading: boolean;
    setContainerSource(dataSource: ContainerDataSource<T>): void;
}
