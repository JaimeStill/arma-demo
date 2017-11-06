import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CodeService } from '../../services/code.service';

declare var Prism: any;

@Component({
    selector: 'hosted-code',
    templateUrl: 'hosted-code.component.html',
    providers: [
        CodeService
    ]
})
export class HostedCodeComponent implements AfterViewInit {
    @Input() url = '';
    @Input() language = '';
    source: string;

    constructor(public cdr: ChangeDetectorRef, public code: CodeService) {}

    ngAfterViewInit() {
        this.code.getSource(this.url);

        this.code.source.subscribe(source => {
            this.source = Prism.highlight(source.trim(), Prism.languages[this.language]);
            this.cdr.detectChanges();
        });
    }
}
