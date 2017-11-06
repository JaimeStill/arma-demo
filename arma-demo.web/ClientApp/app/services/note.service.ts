import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CoreApiService } from './core-api.service';
import { SnackerService } from './snacker.service';
import { IdentityService } from './identity.service';
import { Note } from '../models/note';

@Injectable()
export class NoteService {
    notes = new BehaviorSubject<Array<Note>>([]);
    userNotes = new BehaviorSubject<Array<Note>>([]);
    deletedNotes = new BehaviorSubject<Array<Note>>([]);
    userDeletedNotes = new BehaviorSubject<Array<Note>>([]);
    create = new Note();
    update = new Note();

    constructor(public identity: IdentityService,
        public snacker: SnackerService,
        public coreApi: CoreApiService) {
            identity.user.subscribe(user => {
                if (user.id > 0) {
                    this.getUserNotes();
                    this.getUserDeletedNotes();
                } else {
                    this.userNotes.next(new Array<Note>());
                    this.userDeletedNotes.next(new Array<Note>());
                }
            });
        }

    getNotes() {
        this.coreApi.get<Array<Note>>('/api/note/getNotes')
            .subscribe(
                notes => this.notes.next(notes),
                err => this.snacker.sendErrorMessage(err)
            );
    }

    getUserNotes() {
        if (this.identity.authenticated) {
            this.coreApi.post<Array<Note>>('/api/note/getUserNotes', JSON.stringify(this.identity.user.value.id))
                .subscribe(
                    notes => this.userNotes.next(notes),
                    err => this.snacker.sendErrorMessage(err)
                );
        } else {
            this.snacker.sendErrorMessage('Must be logged in to retrieve user specific data');
        }
    }

    getDeletedNotes() {
        this.coreApi.get<Array<Note>>('/api/note/getDeletedNotes')
            .subscribe(
                notes => this.deletedNotes.next(notes),
                err => this.snacker.sendErrorMessage(err)
            );
    }

    getUserDeletedNotes() {
        if (this.identity.authenticated) {
        this.coreApi.post<Array<Note>>('/api/note/getUserDeletedNotes', JSON.stringify(this.identity.user.value.id))
            .subscribe(
                notes => this.userNotes.next(notes),
                err => this.snacker.sendErrorMessage(err)
            );
        } else {
            this.snacker.sendErrorMessage('Must be logged in to retrieve user specific data');
        }
    }

    getNote(id: number) {
        this.coreApi.get<Note>('/api/note/getNote/' + id)
            .subscribe(
                note => this.update = note,
                err => this.snacker.sendErrorMessage(err)
            );
    }

    createNote() {
        this.coreApi.post('/api/note/createNote', JSON.stringify(this.create))
            .subscribe(
                () => {
                    this.snacker.sendSuccessMessage(`${this.create.title} successfully created`);
                    this.create = new Note();
                    this.getNotes();
                    if (this.identity.authenticated) {
                        this.getUserNotes();
                    }
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }

    updateNote() {
        this.coreApi.post('/api/note/updateNote', JSON.stringify(this.update))
            .subscribe(
                () => {
                    this.snacker.sendSuccessMessage(`${this.update.title} successfully updated`);
                    this.getNotes();
                    if (this.identity.authenticated) {
                        this.getUserNotes();
                    }
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }

    toggleNoteDeleted(note: Note) {
        this.coreApi.post('/api/note/toggleNoteDeleted', JSON.stringify(note.id))
            .subscribe(
                () => {
                    this.getNotes();
                    this.getDeletedNotes();

                    if (this.identity.authenticated) {
                        this.getUserNotes();
                        this.getUserDeletedNotes();
                    }

                    if (note.isDeleted) {
                        this.snacker.sendSuccessMessage(`${note.title} successfully restored`);
                    } else {
                        this.snacker.sendSuccessMessage(`${note.title} sent to the recycle bin`);
                    }
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }

    deleteNote(note: Note) {
        this.coreApi.post('/api/note/deleteNote', JSON.stringify(note.id))
            .subscribe(
                () => {
                    this.getDeletedNotes();

                    if (this.identity.authenticated) {
                        this.getUserDeletedNotes();
                    }

                    this.snacker.sendSuccessMessage(`${note.title} permanently deleted`);
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }
}
