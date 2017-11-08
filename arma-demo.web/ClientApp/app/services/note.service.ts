import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CoreApiService } from './core-api.service';
import { SnackerService } from './snacker.service';
import { IdentityService } from './identity.service';
import { Note } from '../models/note';
import { NoteStat } from '../models/note-stat';
import { IContainerService } from '../interfaces/icontainerservice';
import { ContainerDataSource } from '../datasources/container.datasource';

@Injectable()
export class NoteService implements IContainerService<Note> {
    noteStats = new BehaviorSubject<Array<NoteStat>>([]);
    hasDataSource = new BehaviorSubject<boolean>(false);
    dataSource = new BehaviorSubject<ContainerDataSource<Note>>(new ContainerDataSource<Note>());
    notes = new BehaviorSubject<Array<Note>>([]);
    userNotes = new BehaviorSubject<Array<Note>>([]);
    deletedNotes = new BehaviorSubject<Array<Note>>([]);
    userDeletedNotes = new BehaviorSubject<Array<Note>>([]);
    active = new Note();
    loading = false;

    get data(): BehaviorSubject<Array<Note>> { return this.notes }

    constructor(public identity: IdentityService,
        public snacker: SnackerService,
        public coreApi: CoreApiService,
        public http: Http) {
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

    setContainerSource(dataSource: ContainerDataSource<Note>) {
        this.dataSource.next(dataSource);
        this.hasDataSource.next(true);
    }

    resetNote() {
        this.active = new Note();
    }

    getNotes() {
        this.loading = true;
        this.http.get('/api/note/getNotes')
            .map(res => {
                return res.json().map((n: Note) => Object.assign(new Note(), n));
            })
            .catch(this.coreApi.handleError)
            .subscribe(
                notes => {
                    this.notes.next(notes);
                    this.loading = false;
                },
                err => {
                    this.snacker.sendErrorMessage(err);
                    this.loading = false;
                }
            );
    }

    getNoteStats() {
        this.coreApi.get<Array<NoteStat>>('/api/note/getNoteStats')
            .subscribe(
                stats => this.noteStats.next(stats),
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
                note => this.active = note,
                err => this.snacker.sendErrorMessage(err)
            );
    }

    createNote() {
        this.coreApi.post<number>('/api/note/createNote', JSON.stringify(this.active))
            .subscribe(
                id => {
                    this.snacker.sendSuccessMessage(`${this.active.title} successfully saved`);
                    this.getNotes();
                    this.getNote(id);
                    this.getNoteStats();
                    if (this.identity.authenticated) {
                        this.getUserNotes();
                    }
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }

    updateNote() {
        this.coreApi.post('/api/note/updateNote', JSON.stringify(this.active))
            .subscribe(
                () => {
                    this.snacker.sendSuccessMessage(`${this.active.title} successfully saved`);
                    this.getNotes();
                    this.getNoteStats();
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
                    this.getNoteStats();
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
