import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SpinnerService {
	spinnerStatus = new BehaviorSubject<boolean>(true);
	spinnerStatus$: Observable<boolean> =
		this.spinnerStatus.asObservable();

	proceedSpinnerStatus(status: boolean) {
		this.spinnerStatus.next(status);
	}
}
