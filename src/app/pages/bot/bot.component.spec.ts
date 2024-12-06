import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BotComponent } from './bot.component';
import { MatDialog } from '@angular/material/dialog';
import { WebsocketBotService } from '../../shared/services/websocket-bot.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import {
	BrowserAnimationsModule,
	NoopAnimationsModule,
} from '@angular/platform-browser/animations';

describe('BotComponent', () => {
	let component: BotComponent;
	let fixture: ComponentFixture<BotComponent>;
	let botServiceMock: jest.Mocked<WebsocketBotService>;
	let dialogMock: jest.Mocked<MatDialog>;
	let snackBarMock: jest.Mocked<MatSnackBar>;

	beforeEach(async () => {
		botServiceMock = {
			sendMessage: jest.fn(),
			getMessages: jest.fn(),
			disconnect: jest.fn(),
		} as unknown as jest.Mocked<WebsocketBotService>;

		dialogMock = {
			closeAll: jest.fn(),
		} as unknown as jest.Mocked<MatDialog>;

		snackBarMock = {
			openFromComponent: jest.fn(),
		} as unknown as jest.Mocked<MatSnackBar>;

		await TestBed.configureTestingModule({
			imports: [
				BotComponent,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				NoopAnimationsModule,
			], // Standalone компонент додається в imports
			providers: [
				{ provide: WebsocketBotService, useValue: botServiceMock },
				{ provide: MatDialog, useValue: dialogMock },
				{ provide: MatSnackBar, useValue: snackBarMock },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(BotComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize botForm on ngOnInit', () => {
		component.ngOnInit();
		expect(component.botForm).toBeDefined();
		expect(component.botForm.get('conversation')).toBeTruthy();
	});

	it('should send a message and clear the input', () => {
		const userMessage = 'Hello, Bot!';
		botServiceMock.getMessages.mockReturnValue(of({ response: 'Hi there!' }));
		component.botForm.setValue({ conversation: userMessage });

		component.sendMessageToBot();

		expect(botServiceMock.sendMessage).toHaveBeenCalledWith(userMessage);
		expect(component.messages).toEqual([
			{ message: 'Hello, Bot!', user: 'user' },
			{ message: 'Hi there!', user: 'bot' },
		]);
		expect(component.botForm.get('conversation')?.value).toBe('');
	});

	it('should handle bot response correctly', () => {
		const botMessage = 'Hello, User!';
		botServiceMock.getMessages.mockReturnValue(of({ response: botMessage }));

		component.getBotAnswer();

		expect(botServiceMock.getMessages).toHaveBeenCalled();
		expect(component.messages).toEqual([
			{ message: 'Hello, User!', user: 'bot' },
		]);
	});

	it('should disconnect the bot after a delay', () => {
		jest.useFakeTimers(); // Використання фейкових таймерів
		botServiceMock.getMessages.mockReturnValue(
			of({ response: 'Disconnected!' })
		);

		component.getBotAnswer();

		jest.advanceTimersByTime(500); // Просування часу на 500 мс

		expect(botServiceMock.disconnect).toHaveBeenCalled();
		jest.useRealTimers(); // Повернення до реальних таймерів
	});
});
