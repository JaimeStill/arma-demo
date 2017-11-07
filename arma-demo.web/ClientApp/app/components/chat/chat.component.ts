import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { ChatService } from '../../services/chat.service';

@Component({
    selector: 'chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css'],
    providers: [ ChatService ]
})
export class ChatComponent implements OnInit {
    @ViewChild('messager') messager: ElementRef;

    constructor(public chat: ChatService) { }

    ngOnInit() {
        this.chat.getChats();
        Observable.fromEvent(this.messager.nativeElement, 'keydown')
            .subscribe(() => {
                this.chat.setTyping(true);
            });

        Observable.fromEvent(this.messager.nativeElement, 'keyup')
            .debounceTime(500)
            .subscribe(() => {
                this.chat.setTyping(false);
            });
    }
}
