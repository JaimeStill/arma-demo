import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NoteService } from '../../services/note.service';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog.component';
import { NoteComponent } from './note.component';
import { NoteBinComponent } from './note-bin.component';
import { Note } from '../../models/note';

@Component({
    selector: 'notes',
    templateUrl: 'notes.component.html',
    styleUrls: ['notes.component.css']
})
export class NotesComponent implements OnInit {
    notes = new BehaviorSubject<Array<Note>>([]);

    constructor(public note: NoteService, public dialog: MatDialog) {
        note.getNotes();
        note.getDeletedNotes();
    }

    ngOnInit() {
        this.note.hasDataSource.subscribe(bool => {
            if (bool) {
                this.note.dataSource.subscribe(source => {
                    source.connect().subscribe(data => {
                        this.notes.next(data);
                    });
                });
            }
        });
    }

    editNote(n: Note) {
        this.note.getNote(n.id);
        this.dialog.open(NoteComponent, { data: { editing: true }}).afterClosed().subscribe(() => {
            this.note.resetNote();
        });
    }

    promptDelete(n: Note) {
        this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe(result => {
            if (result === '1') {
                this.note.toggleNoteDeleted(n);
            }
        });
    }

    openRecycleBin() {
        this.dialog.open(NoteBinComponent);
    }
}
