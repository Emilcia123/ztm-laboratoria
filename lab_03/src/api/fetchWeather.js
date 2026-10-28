const URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'db0077f5afb93c54356b8865463ca818';

export async function fetchWeather(query) {
    const params = new URLSearchParams({
        q: query.trim().toLowerCase(),
        units: 'metric',
        lang: 'pl',
        appid: API_KEY,
    });

    let response;
    try {
        response = await fetch(`${URL}?${params}`);
    } catch {
        throw new Error('Brak połączenia z internetem.');
    }

    if (response.ok) {
        return response.json();
    }

    if (response.status === 404) throw new Error('Nie znaleziono miasta.');
    if (response.status === 401) throw new Error('Nieprawidłowy lub nieaktywny klucz API.');
    throw new Error(`Błąd serwera pogody (${response.status}).`);
}