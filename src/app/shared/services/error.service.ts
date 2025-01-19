import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ErrorService {

	requestError = new BehaviorSubject<boolean>(false);
	private requestError$: Observable<boolean> = this.requestError.asObservable();

	fullErrorObject(status: boolean) {
		this.requestError.next(status);
	}
}
