import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class LoaderService {
	loaderStatus = new BehaviorSubject<boolean>(true);
	private loaderStatus$: Observable<boolean> = this.loaderStatus.asObservable();

	proceedLoaderStatus(status: boolean) {
		this.loaderStatus.next(status);
	}
}
