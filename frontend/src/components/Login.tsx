import { useState } from 'react';

export default function Login() {
  const [felhasznalonev, setFelhasznalonev] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ felhasznalonev, jelszo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Bejelentkezési hiba');
      }

      const data = await response.json();
      console.log('Sikeres bejelentkezés:', data);
      
      // Itt tárolhatod a user adatokat (pl. localStorage, context, stb.)
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Átirányítás vagy state update
      // navigate('/dashboard');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Bejelentkezés</h2>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <label>Felhasználónév:</label>
        <input
          type="text"
          value={felhasznalonev}
          onChange={(e) => setFelhasznalonev(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label>Jelszó:</label>
        <input
          type="password"
          value={jelszo}
          onChange={(e) => setJelszo(e.target.value)}
          required
        />
      </div>
      
      <button type="submit">Bejelentkezés</button>
    </form>
  );
}