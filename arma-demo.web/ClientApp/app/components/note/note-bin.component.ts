import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NoteService } from '../../services/note.service';

@Component({
    selector: 'note-bin',
    templateUrl: 'note-bin.component.html',
    styleUrls: ['note-bin.component.css']
})
export class NoteBinComponent {
    constructor(public dialogRef: MatDialogRef<NoteBinComponent>,
        public note: NoteService) {
            this.note.deletedNotes.subscribe(notes => {
                if (notes.length < 1) {
                    this.dialogRef.close();
                }
            });
        }
}
