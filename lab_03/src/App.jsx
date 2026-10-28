import { useState, useEffect } from 'react';
import { fetchWeather } from './api/fetchWeather.js';
import './App.css';

const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((deg % 360) / 45);
    return directions[index % 8];
};

function App() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);


    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const search = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');

        try {
            const data = await fetchWeather(query);
            setWeather(data);
            setQuery('');
        } catch (err) {
            setWeather(null);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <form onSubmit={search}>
                <input
                    type="text"
                    className="search"
                    placeholder="Wpisz miasto..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </form>

    
            {!isOnline && (
                <p className="message error">Brak po  czenia   pokazuj  ostatnio pobrane dane.</p>
            )}

            {loading && <p className="message">Pobieranie danych...</p>}
            {error && <p className="message error">{error}</p>}

            {weather && (
                <div className="city">
                    <h2 className="city-name">
                        <span>{weather.name}</span>
                        <sup>{weather.sys.country}</sup>
                    </h2>

                    <div className="city-temp">
                        {Math.round(weather.main.temp)}
                        <sup>&deg;C</sup>
                    </div>

                    <div className="info">
                        <img
                            className="city-icon"
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                        />
                        <p>{weather.weather[0].description}</p>
                    </div>

                 
                    <div className="additional-info" style={{ marginTop: '12px', fontSize: '0.9rem', textAlign: 'left', width: '100%', paddingLeft: '20px' }}>
                        <p>Cisnienie: <strong>{weather.main.pressure} hPa</strong></p>
                        <p>Wilgotnosc : <strong>{weather.main.humidity}%</strong></p>
                        <p>
                            Wiatr: <strong>{weather.wind.speed} m/s</strong>, {weather.wind.deg}&deg; ({getWindDirection(weather.wind.deg)})
                        </p>

                        {weather.wind.gust && (
                            <p>Porywy wiatru: <strong>{weather.wind.gust} m/s</strong></p>
                        )}
                    </div>

                 
                    <p className="time" style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                        Pomiar z: {new Date(weather.dt * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            )}
        </div>
    );
}

export default App;
