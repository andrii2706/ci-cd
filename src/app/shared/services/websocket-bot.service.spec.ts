import { TestBed } from '@angular/core/testing';
import { WebsocketBotService } from './websocket-bot.service';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { of } from 'rxjs';
import { webSocket } from 'rxjs/webSocket'; // Import webSocket to mock

jest.mock('rxjs/webSocket'); // Mock the webSocket function

describe('WebsocketBotService', () => {
  let service: WebsocketBotService;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  let mockSocketSubject: jest.Mocked<WebSocketSubject<any>>;

  beforeEach(() => {
    // Create a mock WebSocketSubject
    mockSocketSubject = {
      next: jest.fn(),
      complete: jest.fn(),
      subscribe: jest.fn().mockReturnValue(of('message')),
      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } as unknown as jest.Mocked<WebSocketSubject<any>>;


    (webSocket as jest.Mock).mockReturnValue(mockSocketSubject);

    TestBed.configureTestingModule({
      providers: [WebsocketBotService],
    });

    service = TestBed.inject(WebsocketBotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a message through the WebSocket', () => {
    const message = 'Hello WebSocket!';
    service.sendMessage(message);
    expect(mockSocketSubject.next).toHaveBeenCalledWith(message);
  });

  it('should return messages as an observable', () => {
    service.getMessages().subscribe((message) => {
      expect(message).toBe('message');
    });
    expect(mockSocketSubject.subscribe).toHaveBeenCalled();
  });

  it('should disconnect from WebSocket', () => {
    service.disconnect();
    expect(mockSocketSubject.complete).toHaveBeenCalled();
  });
});
