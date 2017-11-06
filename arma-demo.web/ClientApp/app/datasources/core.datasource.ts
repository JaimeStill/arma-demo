import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { IService } from '../interfaces/iservice';
import { IFilter } from '../interfaces/ifilter';

export class CoreDataSource<TItem extends IFilter> extends DataSource<any> {
    filterChange = new BehaviorSubject('');
    filteredData: TItem[];
    get filter(): string { return this.filterChange.value; }
    set filter(filter: string) { this.filterChange.next(filter); }

    constructor(public service: IService<TItem>, public paginator: MatPaginator, public sort: MatSort, public getSortedData: Function) {
        super();
        this.filteredData = service.data.value.slice();
    }

    connect(): Observable<TItem[]> {
        const displayDataChanges = [
            this.service.data,
            this.filterChange,
            this.paginator.page,
            this.sort.sortChange
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            this.filteredData = this.service.data.value.slice().filter((item: TItem) => {
                const searchStr = item.filter.toLowerCase();
                return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            });

            const sortedData = this.getSortedData(this.filteredData);

            let startIndex = this.paginator.pageIndex * this.paginator.pageSize;

            if (startIndex > this.filteredData.length) {
                startIndex = 0;
                this.paginator.pageIndex = 0;
            }

            return sortedData.slice().splice(startIndex, this.paginator.pageSize);
        });
    }

    disconnect() { }
}
