import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CoreApiService } from './core-api.service';
import { SnackerService } from './snacker.service';
import { Category } from '../models/category';

@Injectable()
export class CategoryService {
    categories = new BehaviorSubject<Array<Category>>([]);
    deletedCategories = new BehaviorSubject<Array<Category>>([]);
    create = new Category();

    constructor(public http: Http,
        public coreApi: CoreApiService,
        public snacker: SnackerService) {}

    getCategories() {
        this.coreApi.get<Array<Category>>('/api/category/getCategories')
            .subscribe(
                categories => this.categories.next(categories),
                err => this.snacker.sendErrorMessage(err)
            );
    }

    getDeletedCategories() {
        this.coreApi.get<Array<Category>>('/api/category/getDeletedCategories')
            .subscribe(
                categories => this.deletedCategories.next(categories),
                err => this.snacker.sendErrorMessage(err)
            );
    }

    createCategory() {
        this.coreApi.post('/api/category/createCategory', JSON.stringify(this.create))
            .subscribe(
                () => {
                    this.snacker.sendSuccessMessage(`Category ${this.create.name} successfully created`);
                    this.create = new Category();
                    this.getCategories();
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }

    updateCategory(category: Category) {
        this.coreApi.post('/api/category/updateCategory', JSON.stringify(category))
            .subscribe(
                () => {
                    this.snacker.sendSuccessMessage(`Category ${category.name} successfully updated`);
                    this.getCategories();
                }
            )
    }

    toggleCategoryDeleted(category: Category) {
        this.coreApi.post('/api/category/toggleCategoryDeleted', JSON.stringify(category.id))
            .subscribe(
                () => {
                    this.getCategories();
                    this.getDeletedCategories();

                    if (category.isDeleted) {
                        this.snacker.sendSuccessMessage(`Category ${category.name} successfully restored`);
                    } else {
                        this.snacker.sendSuccessMessage(`Category ${category.name} successfully deleted`);
                    }
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }
}
