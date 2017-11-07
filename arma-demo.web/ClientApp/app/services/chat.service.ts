import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CoreApiService } from './core-api.service';
import { SnackerService } from './snacker.service';
import * as signalR from '@aspnet/signalr-client';
import { Chat } from '../models/chat';

@Injectable()
export class ChatService {
    connection = new signalR.HubConnection('/host');
    messageQueue = new BehaviorSubject<Array<Chat>>([]);
    create = new Chat();
    typing = false;
    connected = false;

    constructor(public http: Http, public coreApi: CoreApiService, public snacker: SnackerService) {
        this.connection.start().then(() => {
            this.connected = true;
        }).catch((reason: any) => this.snacker.sendErrorMessage(reason));

        this.connection.onclose(() => {
            this.connected = false;
        });

        this.connection.on('send', () => this.getChats());

        this.connection.on('typing', (typing: boolean) => this.typing = typing);
    }

    getChats() {
        this.coreApi.get<Array<Chat>>('/api/chat/getChats')
            .subscribe(
                chats => this.messageQueue.next(chats),
                err => this.snacker.sendErrorMessage(err)
            );
    }

    sendMessage() {
        this.coreApi.post('/api/chat/addChat', JSON.stringify(this.create))
            .subscribe(
                () => {
                    this.connection.invoke('send').then(() => {
                        this.create = new Chat();
                    }).catch((reason: any) => {
                        this.snacker.sendErrorMessage(reason);
                    });
                },
                err => this.snacker.sendErrorMessage(err)
            );
    }

    setTyping(typing: boolean) {
        this.connection.invoke('typing', typing)
            .catch((reason: any) => this.snacker.sendErrorMessage(reason));
    }
}
