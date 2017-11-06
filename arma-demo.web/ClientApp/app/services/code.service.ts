import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class CodeService {
    source = new BehaviorSubject<string>('');

    constructor(public http: Http) {}

    getSource(url: string) {
        const headers = new Headers({
            'Content-Type': 'text/plain'
        });
        headers.delete('Pragma');
        this.http.get(url, new RequestOptions({ headers: headers }))
            .map((res: Response) => {
                return res.text();
            })
            .catch(this.handleError)
            .subscribe((source: string) => {
                this.source.next(source);
            },
            error => {
                console.log(error);
            });
    }

    handleError(error: Response | any) {
        let errMsg: string;

        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || body.Message || JSON.stringify(body);
            errMsg = `${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
