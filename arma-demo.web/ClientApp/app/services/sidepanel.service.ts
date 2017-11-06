import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const STATES = [
    'collapse',
    'thin',
    'full'
];

@Injectable()
export class SidepanelService {
    states: Array<string> = STATES;
    state = new BehaviorSubject<string>('thin');

    toggleState() {
        const index = this.states.indexOf(this.state.value);

        if (index === (this.states.length - 1)) {
            this.state.next(this.states[0]);
        } else {
            this.state.next(this.states[index + 1]);
        }
    }
}
