import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesFilterComponent } from './games-filter.component';
import moment from 'moment';

describe('GamesFilterComponent', () => {
	let component: GamesFilterComponent;
	let fixture: ComponentFixture<GamesFilterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GamesFilterComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GamesFilterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize the filter form on ngOnInit', () => {
		expect(component.filterForm).toBeDefined();
		expect(component.filterForm.controls['search']).toBeDefined();
		expect(component.filterForm.controls['genres']).toBeDefined();
		expect(component.filterForm.controls['platforms']).toBeDefined();
		expect(component.filterForm.controls['developers']).toBeDefined(); // No error here now
		expect(component.filterForm.controls['ordering']).toBeDefined();
		expect(component.filterForm.controls['metacritic']).toBeDefined();
		expect(component.filterForm.controls['dates']).toBeDefined();
	});

	it('should emit filter event with form values when submitFilter is called', () => {
		jest.spyOn(component.filter, 'emit');
		component.filterForm.patchValue({
			search: 'test',
			genres: 'action',
			platforms: 'pc',
			developers: 'dev1',
			ordering: 'rating',
			metacritic: '90',
			dates: '2024-01-01,2024-12-31',
		});

		component.submitFilter();
		expect(component.filter.emit).toHaveBeenCalledWith(
			component.filterForm.value
		);
	});

	it('should set the correct dates when lastGames is called', () => {
		const firstDate = moment().startOf('year').format('YYYY-MM-DD');
		const lastDate = moment().add(1, 'year').endOf('year').format('YYYY-MM-DD');

		component.lastGames();
		expect(component.dates).toBe(`${firstDate},${lastDate}`);
	});

	it('should clear the filter form when clearFilterForm is called', () => {
		component.filterForm.patchValue({
			search: 'test',
			genres: 'action',
			platforms: 'pc',
			developers: 'dev1',
			ordering: 'rating',
			metacritic: '90',
			dates: '2024-01-01,2024-12-31',
		});
		component.dates = '2024-01-01,2024-12-31';

		component.clearFilterForm();

		expect(component.filterForm.value).toEqual({
			search: '',
			genres: '',
			platforms: '',
			developers: '',
			ordering: '',
			metacritic: '',
			dates: '',
		});
		expect(component.dates).toBe('');
	});
});
