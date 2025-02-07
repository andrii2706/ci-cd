import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app-material/app-material.module';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClearObservableDirective, WebSocketChat } from '../../shared/classes';
import { WebsocketBotService } from '../../shared/services/websocket-bot.service';
import { NgClass } from '@angular/common';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
	selector: 'app-bot',
	standalone: true,
	imports: [AppMaterialModule, ReactiveFormsModule, NgClass],
	templateUrl: './bot.component.html',
	styleUrls: ['./bot.component.scss', '../../shared/styles/shared.scss'],
})
export class BotComponent extends ClearObservableDirective implements OnInit {
	botForm: FormGroup;
	userMessage = '';
	messages: WebSocketChat[] = [];

	constructor(
		private dialogWindow: MatDialog,
		private botService: WebsocketBotService,
		private snackbarService: SnackbarService
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
			},
			error: err => {
				if (err) {
					this.dialogWindow.closeAll();
					this.snackbarService.message(
						{ text: 'Bot it not responding', status: 'error' },
						'top',
						'end',
						5000
					);
				}
			},
		});
		setTimeout(() => {
			this.botService.disconnect();
		}, 500);
	}

	closeBot() {
		this.dialogWindow.closeAll();
	}
}
