import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CoreApiService {
    constructor(private http: Http) { }

    extractData(res: Response) {
        try {
            return res.json() || {};
        } catch (error) {
            return res;
        }
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

    getRequestOptions(): RequestOptions {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        return new RequestOptions({ headers: headers });
    }

    getUploadOptions(): RequestOptions {
        const headers = new Headers({
            'Accept': 'application/json'
        });

        headers.delete('Content-Type');

        return new RequestOptions({ headers: headers });
    }

    get<T>(url: string): Observable<T> {
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    post<T>(url: string, body: any, options?: RequestOptions): Observable<T> {
        return this.http.post(url, body, options ? options : this.getRequestOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }
}
