const WebSocket = require('ws');
const { log } = require ('node:util');


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (socket) => {
  console.log('Користувач підключився.');

  socket.on('message', (message) => {
    if (Buffer.isBuffer(message)) {
      message = message.toString('utf8');
    }

    try {
      let response = '';

      if (message.toLowerCase().includes('привіт')) {
        response = 'Привіт! Як я можу допомогти?';
      } else if (message.toLowerCase().includes('як справи')) {
        response = 'У мене все добре, дякую за запитання!';
      } else {
        response = `Ви сказали: ${message}. Це дуже цікаво!`;
      }

      socket.send(JSON.stringify({ response }));
    } catch (e) {
      console.error('Помилка при парсингу повідомлення:', e);
    }
  });

  socket.on('close', () => {
    console.log('Користувач відключився.');
  });
});

console.log('WebSocket сервер запущено на порту 8080');
