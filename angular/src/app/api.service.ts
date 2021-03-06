import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Devotee } from './devotee';

@Injectable()
export class ApiService {

	constructor(private http: Http) { }

	login(password: string) {
		let params: URLSearchParams = new URLSearchParams();
		params.set("password", password);
		let body = params.toString()

		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post('/dologin', body, {
            headers: headers
          }).map(this.extractBody);
	}
	logout() {
		this.http.post('/dologout', {});
	}

	list(searchQuery?: string, pageNumber?: any, maximumResults?: any, sortBy?: any, order?: any) {
		let params: URLSearchParams = new URLSearchParams();
		if (searchQuery) {
			params.set("searchQuery", searchQuery);
		}
		if (pageNumber) {
			params.set('pageNumber', pageNumber);
		}
		if (maximumResults) {
			params.set('maximumResults', maximumResults);
		}
		if (sortBy) {
			params.set('sortBy', sortBy);
		}
		if (order) {
			params.set('order', order);
		}
		return this.http.get('/apis/devotees', { search: params });
	}

	get(id: any): Observable<Devotee> {
		return this.http.get('/apis/devotee/' + id)
			.map(this.extractData);
		//	.catch(this.handleError);
	}

	save(devotee: Devotee) {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http.post('/apis/save', devotee, options)
			.map((res: Response) => res.text);
	}

	delete(id: any) {
		let headers = new Headers({ 'Content-Type': 'text/html' });
		let options = new RequestOptions({ headers: headers });
		return this.http.delete('/apis/devotee/' + id, options)
			.map((res: Response) => res.text);
	}

	download(searchQuery: string, sortBy: any, order: any, selectedColumns: Array<string>) {
		let params: URLSearchParams = new URLSearchParams();
		if (searchQuery) {
			params.set("searchQuery", searchQuery);
		}
		if (sortBy) {
			params.set('sortBy', sortBy);
		}
		if (order) {
			params.set('order', order);
		}
		if (selectedColumns) {
			params.set("selectedColumns", JSON.stringify(selectedColumns));
		}
		return this.http.get('/apis/devotees/download', { search: params });
	}

	upload(file: File) {
		return Observable.create((observer:Observer<any>) => {
			let formData: FormData = new FormData();
			formData.append('file', file);
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						observer.complete();
					} else {
						observer.error(xhr.response);
					}
				}
			}
			xhr.open('POST', '/apis/upload', true);
			xhr.send(formData);
		});
	}

	private extractData(res: Response) {
		let body = res.json();
		return body.data || null;
	}

	private extractBody(res: any) {
		return res._body;
	}

	private handleError(error: Response | any) {
		// In a real world app, we might use a remote logging infrastructure
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}
}
