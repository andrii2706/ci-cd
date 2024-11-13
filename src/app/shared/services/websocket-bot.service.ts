import { Injectable } from '@angular/core';
import { WebSocketChat } from '../classes';


@Injectable({
	providedIn: 'root',
})
export class WebsocketBotService {
    websocket: WebSocket;
    websocketMessage: WebSocketChat[] = [];



}
