import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app-material/app-material.module';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ClearObservableDirective } from '../../shared/classes';

@Component({
	selector: 'app-bot',
	standalone: true,
	imports: [AppMaterialModule],
	templateUrl: './bot.component.html',
	styleUrl: './bot.component.scss',
})
export class BotComponent extends ClearObservableDirective implements OnInit {
	botForm: FormGroup;
	botAnswer = 'hello';
	userMessage = 'Hello bot';

	constructor(private dialogWindow: MatDialog) {
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

	get conversationFormField(): AbstractControl<string> | null {
		return this.botForm.get('conversation');
	}

	sendMessageToBot() {
		console.log(this.conversationFormField?.value);
		this.conversationFormField?.setValue('');
	}

	closeBot() {
		this.dialogWindow.closeAll();
	}
}
