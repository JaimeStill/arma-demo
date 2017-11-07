import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'category-bin',
    templateUrl: 'category-bin.component.html',
    styleUrls: ['category-bin.component.css']
})
export class CategoryBinComponent {
    constructor(public dialogRef: MatDialogRef<CategoryBinComponent>,
    public category: CategoryService) {
        this.category.deletedCategories.subscribe(categories => {
            if (categories.length < 1) {
                this.dialogRef.close();
            }
        });
    }
}
