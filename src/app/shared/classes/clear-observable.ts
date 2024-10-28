import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({ selector: '[appObservableClear]', standalone: true })
export class ClearObservableDirective implements OnDestroy {
	destroy$ = new Subject<boolean>();

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
