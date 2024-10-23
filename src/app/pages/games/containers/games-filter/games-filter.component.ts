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
import moment from 'moment';
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
	styleUrl: './games-filter.component.scss',
})
export class GamesFilterComponent implements OnInit {
	filterForm: FormGroup;
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
	}

	private iniFilterForm() {
		this.filterForm = new FormGroup({
			search: new FormControl(''),
			genres: new FormControl(''),
			platforms: new FormControl(''),
			developers: new FormControl(''),
			ordering: new FormControl(''),
			metacritic: new FormControl(''),
			dates: new FormControl(''),
		});
	}

	submitFilter() {
		this.filterForm.value.dates = this.dates;
		this.filter.emit(this.filterForm.value);
	}

	lastGames() {
		const firstDate = moment().startOf('year').format('YYYY-MM-DD');
		const lastDate = moment().add(1, 'year').endOf('year').format('YYYY-MM-DD');
		this.dates = `${firstDate},${lastDate}`;
	}

	clearFilterForm() {
		this.dates = '';
		const clearForm = {
			search: '',
			genres: '',
			platforms: '',
			developers: '',
			ordering: '',
			metacritic: '',
			dates: '',
		};
		this.filterForm.patchValue(clearForm);
	}
}
