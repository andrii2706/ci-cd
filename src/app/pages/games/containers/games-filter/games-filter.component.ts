import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
	DevelopersFilters,
	FilterParams,
	GenresFilters,
	Metacritics,
	OrderByInfos,
	PlatformsFilters,
} from '../../../../shared/models/filter.interface';
import {
	developersFilter,
	genresFilter,
	metacriticNumbers,
	orderByInfos,
	platformsFilter,
} from '../../constants/filter.contants';

@Component({
	selector: 'app-games-filter',
	templateUrl: './games-filter.component.html',
	styleUrls: [
		'./games-filter.component.scss',
		'../../../../shared/styles/shared.scss',
	],
})
export class GamesFilterComponent implements OnInit {
	filterForm: FormGroup;
	searchFiledForm: FormGroup;
	dates = '';
	genres: GenresFilters[] = genresFilter;
	developers: DevelopersFilters[] = developersFilter;
	platforms: PlatformsFilters[] = platformsFilter;
	orderByInfos: OrderByInfos[] = orderByInfos;
	metacritics: Metacritics[] = metacriticNumbers;

	@Output()
	filter = new EventEmitter<FilterParams>();

	ngOnInit(): void {
		this.iniFilterForm();
		this.initSearchFilter();
	}

	private iniFilterForm() {
		this.filterForm = new FormGroup({
			genres: new FormControl(''),
			platforms: new FormControl(''),
			developers: new FormControl(''),
			ordering: new FormControl(''),
			metacritic: new FormControl(''),
			dates: new FormControl(''),
		});
	}
	private initSearchFilter(): void {
		this.searchFiledForm = new FormGroup({
			search: new FormControl(''),
		});
	}

	submitFilter() {
		this.filterForm.value.dates = this.dates;
		this.filter.emit(this.filterForm.value);
	}

	clearFilterForm() {
		this.dates = '';
		const clearForm = {
			genres: '',
			platforms: '',
			developers: '',
			ordering: '',
			metacritic: '',
			dates: '',
		};
		this.filterForm.patchValue(clearForm);
		this.filter.emit(this.filterForm.value);
	}

	clearSearchForm(): void {
		this.searchFiledForm.patchValue({ search: '' });
		this.filter.emit(this.searchFiledForm.value);
	}

	searchGames() {
		if (this.searchFiledForm.value.search.length > 3) {
			setTimeout(() => {
				this.filter.emit({ search: this.searchFiledForm.value.search });
			}, 800);
		}
	}
}
