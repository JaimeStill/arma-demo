import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SidepanelService } from '../../services/sidepanel.service';
import { ThemeService } from '../../services/theme.service';
import { IdentityService } from '../../services/identity.service';
import { Theme } from '../../models/theme';
import { DisplayNameComponent } from '../dialogs/display-name.component';


@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(public sidepanel: SidepanelService,
        public theme: ThemeService,
        public identity: IdentityService,
        public dialog: MatDialog) {}

    ngOnInit() {
        this.identity.checkAuthentication();
    }

    updateDisplayName() {
        this.dialog.open(DisplayNameComponent);
    }
}
