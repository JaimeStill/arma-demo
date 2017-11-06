import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CoreApiService } from './core-api.service';
import { SnackerService } from './snacker.service';
import { User } from '../models/user';

@Injectable()
export class IdentityService {
    authenticated: boolean;
    user = new BehaviorSubject<User>(new User());
    users = new BehaviorSubject<Array<User>>([]);
    newDisplayName = '';

    constructor(public http: Http, public coreApi: CoreApiService, public snacker: SnackerService) {
        this.authenticated = false;
    }

    resetNewDisplayName() {
        this.newDisplayName = this.user.value.displayName;
    }

    checkAuthentication() {
        this.http.get('/api/identity/checkAuthentication')
            .map(res => res.json())
            .catch(this.coreApi.handleError)
            .subscribe(bool => {
                this.authenticated = bool;

                if (bool) {
                    this.getCurrentUser();
                }
            },
            err => {
                this.snacker.sendErrorMessage(err);
            });
    }

    getUsers() {
        this.coreApi.get<Array<User>>('/api/identity/getUsers')
            .subscribe(
                users => this.users.next(users),
                err => this.snacker.sendErrorMessage(err)
            );
    }

    awaitCurrentUser(): Observable<User> {
        return this.coreApi.get<User>('/api/identity/getCurrentUser');
    }

    getCurrentUser() {
        this.coreApi.get<User>('/api/identity/getCurrentUser')
            .subscribe(
                user => {
                    this.user.next(user);
                    this.newDisplayName = user.displayName;
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }

    setThemePreference(theme: string) {
        this.user.value.theme = theme;

        this.coreApi.post('/api/identity/setThemePreference', JSON.stringify(this.user.value))
            .subscribe(
                res => {
                    this.snacker.sendSuccessMessage(`Preferred theme set to ${theme}`)
                    this.user.next(this.user.value);
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }

    setSidepanelPreference(state: string) {
        this.user.value.sidepanel = state;

        this.coreApi.post('/api/identity/setSidepanelPreference', JSON.stringify(this.user.value))
            .subscribe(
                res => {
                    this.snacker.sendSuccessMessage(`Preferred sidepanel state set to ${state}`);
                    this.user.next(this.user.value);
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }

    updateDisplayName() {
        this.user.value.displayName = this.newDisplayName;

        this.coreApi.post('/api/identity/updateDisplayName', JSON.stringify(this.user.value))
            .subscribe(
                res => {
                    this.snacker.sendSuccessMessage(`Display Name updated to ${this.newDisplayName}`);
                    this.user.next(this.user.value);
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }
}
