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
import { CategoryService } from './services/category.service';
import { NoteService } from './services/note.service';

import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog.component';
import { DisplayNameComponent } from './components/dialogs/display-name.component';
import { CategoryBinComponent } from './components/category/category-bin.component';
import { NoteComponent } from './components/note/note.component';
import { NoteBinComponent } from './components/note/note-bin.component';

import { PrismComponent } from './components/prism/prism.component';
import { HostedCodeComponent } from './components/hosted-code/hosted-code.component';
import { SearchContainerComponent } from './components/search-container/search-container.component';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { SidepanelComponent } from './components/sidepanel/sidepanel.component';
import { CategoriesComponent } from './components/category/categories.component';
import { NotesComponent } from './components/note/notes.component';

@NgModule({
    declarations: [
        ConfirmDialogComponent,
        DisplayNameComponent,
        CategoryBinComponent,
        NoteComponent,
        NoteBinComponent,
        PrismComponent,
        HostedCodeComponent,
        SearchContainerComponent,
        AppComponent,
        HomeComponent,
        SidepanelComponent,
        CategoriesComponent,
        NotesComponent
    ],
    entryComponents: [
        ConfirmDialogComponent,
        DisplayNameComponent,
        CategoryBinComponent,
        NoteComponent,
        NoteBinComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        AppMaterialModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'categories', component: CategoriesComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        CoreApiService,
        SidepanelService,
        ThemeService,
        SnackerService,
        IdentityService,
        CategoryService,
        NoteService,
        { provide: RequestOptions, useClass: NoCacheRequestOptions }
    ]
})
export class AppModuleShared {}
