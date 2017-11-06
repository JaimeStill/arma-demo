import {
    Component,
    AfterViewInit,
    Input,
    ElementRef,
    ViewChild,
    ChangeDetectorRef
} from '@angular/core';

declare var Prism: any;

@Component({
    selector: 'prism',
    template: `
    <div hidden="true" #rawContent>
        <ng-content></ng-content>
    </div>
    <section class="code-container">
        <pre><code [innerHTML]="content" class="block language-{{language}}"></code></pre>
    </section>
    `
})
export class PrismComponent implements AfterViewInit {
    @Input() language: string;
    @ViewChild('rawContent') rawContent: ElementRef;
    content: string;

    constructor(public elementRef: ElementRef, public cdr: ChangeDetectorRef) {}

    ngAfterViewInit() {
        this.content = Prism.highlight(this.rawContent.nativeElement.textContent.trim(), Prism.languages[this.language]);
        this.cdr.detectChanges();
    }
}
