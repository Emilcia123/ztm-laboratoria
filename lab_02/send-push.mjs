import { readFileSync } from 'node:fs';
import webpush from 'web-push';

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const keys = readJson('vapid-keys.json');
const subscription = readJson('subscription.json');

webpush.setVapidDetails('mailto:twoj_email@example.com', keys.publicKey, keys.privateKey);

const [title = 'Web Push', body = 'Wiadomość wysłana z serwera'] = process.argv.slice(2);

try {
    const result = await webpush.sendNotification(subscription, JSON.stringify({ title, body }));
    console.log('Wysłano, status:', result.statusCode);
} catch (err) {
    console.error('Błąd wysyłania:', err.statusCode, err.body || err.message);
}