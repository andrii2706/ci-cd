import { Component, OnInit } from '@angular/core';
import { GamesVideosService } from '../../shared/services/games-videos.service';

@Component({
	selector: 'app-games-videos',
	standalone: true,
	imports: [],
	templateUrl: './games-videos.component.html',
	styleUrl: './games-videos.component.scss',
})
export class GamesVideosComponent implements OnInit {
	constructor(private gamesVideoService: GamesVideosService) {}

	ngOnInit() {
		this.gamesVideoService.getLastVideo().subscribe(info => {
			console.log(info);
		});
	}
}
