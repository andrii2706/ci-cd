import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class WebsocketBotService {
	private socket$: WebSocketSubject<string>;

	constructor() {
		this.connect();
	}

	private connect(): void {
		this.socket$ = webSocket({
			url: 'wss://websocket-bot-16aa91cce35a.herokuapp.com',
			deserializer: msg => JSON.parse(msg.data),
		});
	}

	sendMessage(message: string): void {
		this.socket$.next(message);
	}
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	getMessages(): Observable<any> {
		return this.socket$;
	}

	disconnect(): void {
		this.socket$?.complete();
	}
}
