import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { IContainerService } from '../../interfaces/icontainerservice';
import { ContainerDataSource } from '../../datasources/container.datasource';

@Component({
    selector: 'search-container',
    templateUrl: 'search-container.component.html',
    styleUrls: ['search-container.component.css']
})
export class SearchContainerComponent implements OnInit {
    @Input() service: IContainerService<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    dataSource: ContainerDataSource<any> | null;

    ngOnInit() {
        this.dataSource = new ContainerDataSource<any>();
        this.dataSource.initializeDataSource(this.service, this.paginator);
        this.service.setContainerSource(this.dataSource);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
                if (!this.dataSource) { return; }
                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }
}
