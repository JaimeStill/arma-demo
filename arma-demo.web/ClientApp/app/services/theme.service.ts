import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Theme } from '../models/theme.model';

const THEMES: Array<Theme> = [
    { name: 'light-green', display: 'Green - Light' },
    { name: 'dark-green', display: 'Green - Dark' },
    { name: 'light-red', display: 'Red - Light' },
    { name: 'dark-red', display: 'Red - Dark' },
    { name: 'light-blue', display: 'Blue - Light' },
    { name: 'dark-blue', display: 'Blue - Dark' }
];

@Injectable()
export class ThemeService {
    activeTheme = new BehaviorSubject<Theme>(new Theme());
    themes: Array<Theme> = THEMES;

    constructor(private overlayContainer: OverlayContainer) {
        this.setOverlayContainerTheme(this.themes[1].name);
        this.activeTheme.next(this.themes[1]);
    }

    setTheme(theme: Theme) {
        this.setOverlayContainerTheme(theme.name, this.activeTheme.value.name);
        this.activeTheme.next(theme);
    }

    setOverlayContainerTheme(newTheme: string, oldTheme?: string) {
        if (oldTheme) {
            this.overlayContainer.getContainerElement().classList.remove(oldTheme);
        }

        this.overlayContainer.getContainerElement().classList.add(newTheme);
    }
}
