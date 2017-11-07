import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CategoryService } from '../../services/category.service';
import { CategoryBinComponent } from './category-bin.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog.component';
import { Category } from '../../models/category';

@Component({
    selector: 'categories',
    templateUrl: 'categories.component.html',
    styleUrls: ['categories.component.css']
})
export class CategoriesComponent implements OnInit {
    constructor (public category: CategoryService, public dialog: MatDialog) { }

    ngOnInit() {
        this.category.getCategories();
        this.category.getDeletedCategories();
    }

    showRecycleBin() {
        this.dialog.open(CategoryBinComponent);
    }

    promptDelete(c: Category) {
        this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe(result => {
            if (result === '1') {
                this.category.toggleCategoryDeleted(c);
            }
        });
    }
}
