const WebSocket = require('ws');
const { log } = require('node:util');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', socket => {
	console.log('Session started');

	socket.on('message', message => {
		if (Buffer.isBuffer(message)) {
			message = message.toString('utf8');
		}

		try {
			let response = '';

			if (
				message.toLowerCase().includes('hello') ||
				message.toLowerCase().includes('hi')
			) {
				response = 'Hello, How can I help you?';
			} else if (message.toLowerCase().includes('how are you?')) {
				response = 'I am doing alright, thanks for asking';
			} else {
				response = `You sad: ${message}. It is very interesting`;
			}

			socket.send(JSON.stringify({ response }));
		} catch (error) {
			console.error(error);
		}
	});

	socket.on('close', () => {
		console.log('Session stop');
	});
});

console.log('WebSocket сервер запущено на порту 8080');
