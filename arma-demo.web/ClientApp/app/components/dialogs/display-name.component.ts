import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { IdentityService } from '../../services/identity.service';

@Component({
    selector: 'display-name',
    templateUrl: 'display-name.component.html'
})
export class DisplayNameComponent {
    constructor(public identity: IdentityService) {}
}
