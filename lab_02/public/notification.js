const permissionInfo = document.querySelector('#permission');
const VAPID_PUBLIC_KEY = 'BDMyiisA3nc0enChJBU_cJ5FnKKQhTEFt8wWc4y0lFeu4CQ4P6WziHA_9_t75ATL0Www7m8-joxg_NJL5ZDg_r4';

function updatePermissionInfo() {
    permissionInfo.textContent = 'Notification' in window ? Notification.permission : 'brak obsługi w tej przeglądarce';
}
updatePermissionInfo();

document.querySelector('#enable').addEventListener('click', async () => {
    const permission = await Notification.requestPermission();
    console.log('Uprawnienie:', permission);
    updatePermissionInfo();
});

function showLocalNotification() {
    if (Notification.permission !== 'granted') {
        alert('Najpierw włącz powiadomienia.');
        return;
    }
    try {
        const notification = new Notification('Title', {
            body: 'Message body',
            icon: 'android.png',
        });
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    } catch (err) {
        alert('Ta przeglądarka nie obsługuje new Notification(): ' + err.message);
    }
}
document.querySelector('#local').addEventListener('click', showLocalNotification);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .catch((err) => console.error('Błąd rejestracji service workera:', err));
}

async function showSwNotification(titleText, bodyText, iconFile) {
    if (Notification.permission !== 'granted') {
        alert('Najpierw włącz powiadomienia.');
        return;
    }
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(titleText, {
        body: bodyText,
        icon: iconFile,
        data: { url: './' },
    });
}

document.querySelector('#sw').addEventListener('click', () => {
    showSwNotification('Powiadomienie z service workera', 'Kliknij, aby otworzyć stronę.', 'android.png');
});

document.querySelector('#notification-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#notif-title').value.trim();
    if (!title) {
        alert('Tytuł nie może być pusty!');
        return;
    }
    const body = document.querySelector('#notif-body').value;
    const icon = document.querySelector('#notif-icon').value;
    showSwNotification(title, body, icon);
});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

const subscriptionField = document.querySelector('#subscription');

async function subscribePush() {
    if (!('PushManager' in window)) {
        alert('Ta przeglądarka nie obsługuje Web Push.');
        return;
    }
    try {
        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
        }
        subscriptionField.value = JSON.stringify(subscription, null, 2);
    } catch (err) {
        alert('Nie udało się zasubskrybować: ' + err.message);
    } finally {
        updatePermissionInfo();
    }
}

async function unsubscribePush() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
        await subscription.unsubscribe();
        subscriptionField.value = '';
        alert('Anulowano subskrypcję.');
    }
}

document.querySelector('#subscribe').addEventListener('click', subscribePush);
document.querySelector('#unsubscribe').addEventListener('click', unsubscribePush);
document.querySelector('#copy').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(subscriptionField.value);
        alert('Skopiowano subskrypcję do schowka.');
    } catch (err) {
        subscriptionField.select();
        alert('Zaznaczono tekst – skopiuj go ręcznie (Ctrl+C).');
    }
});