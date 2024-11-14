import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app-material/app-material.module';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClearObservableDirective, WebSocketChat } from '../../shared/classes';
import { WebsocketBotService } from '../../shared/services/websocket-bot.service';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-bot',
	standalone: true,
	imports: [AppMaterialModule, ReactiveFormsModule, NgClass],
	templateUrl: './bot.component.html',
	styleUrl: './bot.component.scss',
})
export class BotComponent extends ClearObservableDirective implements OnInit {
	botForm: FormGroup;
	userMessage = '';
	messages: WebSocketChat[] = [];

	constructor(
		private dialogWindow: MatDialog,
		private botService: WebsocketBotService
	) {
		super();
	}

	ngOnInit(): void {
		this.buildConversationWithBot();
	}

	buildConversationWithBot() {
		this.botForm = new FormGroup({
			conversation: new FormControl(''),
		});
	}

	sendMessageToBot() {
		this.messages.push({
			user: 'user',
			message: this.botForm.get('conversation')?.value,
		});
		this.botService.sendMessage(this.botForm.get('conversation')?.value);
		this.botForm.setValue({ conversation: '' });
		this.getBotAnswer();
	}

	getBotAnswer() {
		this.botService.getMessages().subscribe({
			next: message => {
				this.messages.push({ user: 'bot', message: message.response });
				console.log('Отримано повідомлення від бота:', message);
				console.log(this.messages);
			},
			error: err => console.error('Помилка WebSocket:', err),
		});
		setTimeout(() => {
			this.botService.disconnect();
		}, 500);
	}

	closeBot() {
		this.dialogWindow.closeAll();
	}
}
