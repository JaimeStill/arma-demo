import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppMaterialModule } from './app.module.material';

import { NoCacheRequestOptions } from './services/no-cache-request-options';
import { CoreApiService } from './services/core-api.service';
import { SidepanelService } from './services/sidepanel.service';
import { ThemeService } from './services/theme.service';
import { SnackerService } from './services/snacker.service';
import { IdentityService } from './services/identity.service';

import { DisplayNameComponent } from './components/dialogs/display-name.component';

import { PrismComponent } from './components/prism/prism.component';
import { HostedCodeComponent } from './components/hosted-code/hosted-code.component';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { SidepanelComponent } from './components/sidepanel/sidepanel.component';

@NgModule({
    declarations: [
        DisplayNameComponent,
        PrismComponent,
        HostedCodeComponent,
        AppComponent,
        HomeComponent,
        SidepanelComponent
    ],
    entryComponents: [
        DisplayNameComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        AppMaterialModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        CoreApiService,
        SidepanelService,
        ThemeService,
        SnackerService,
        IdentityService,
        { provide: RequestOptions, useClass: NoCacheRequestOptions }
    ]
})
export class AppModuleShared {}
