import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable()
export class SnackerService {
    config: MatSnackBarConfig = new MatSnackBarConfig();
    message = 'Hello from Snacker Service';

    constructor(private snackbar: MatSnackBar) {
        this.config.duration = 5000;
        this.config.extraClasses = new Array<string>();
    }

    sendMessage() {
        this.snackbar.open(this.message, 'Close', this.config);
    }

    setMessage(message: string) {
        this.message = message;
    }

    setDuration(duration: number) {
        this.config.duration = duration;
    }

    setClasses(classes: string[]) {
        classes.push('snacker');
        this.config.extraClasses = classes;
    }

    sendColorMessage(message: string, colors: string[]) {
        this.message = message;
        this.config.extraClasses = colors;
        this.sendMessage();
    }

    sendErrorMessage(message: string) {
        this.message = message;
        this.setClasses(['snacker-red']);
        this.sendMessage();
    }

    sendWarningMessage(message: string) {
        this.message = message;
        this.setClasses(['snacker-orange']);
        this.sendMessage();
    }

    sendSuccessMessage(message: string) {
        this.message = message;
        this.setClasses(['snacker-green']);
        this.sendMessage();
    }
}
