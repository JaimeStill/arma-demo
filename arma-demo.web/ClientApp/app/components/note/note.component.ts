import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NoteService } from '../../services/note.service';
import { CategoryService } from '../../services/category.service';
import { SnackerService } from '../../services/snacker.service';
import { Note } from '../../models/note';

@Component({
    selector: 'note',
    templateUrl: 'note.component.html',
    styleUrls: ['note.component.css']
})
export class NoteComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public note: NoteService,
        public category: CategoryService,
        public snacker: SnackerService) {
            category.getCategories();
        }

    saveNote() {
        if (this.data.editing) {
            this.note.updateNote();
        } else {
            this.note.createNote();
            this.data.editing = true;
        }
    }
}
