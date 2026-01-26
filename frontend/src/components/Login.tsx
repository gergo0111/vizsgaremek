import { useState } from 'react';
import { useNavigate } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../designs/Login.css';
import ptlogo from '../assets/ptlogo.svg';

export default function Login() {
  const [felhasznalonev, setFelhasznalonev] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/fooldal');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container mb-4">
          <img src={ptlogo} alt="P&T Pasztik logo" className="logo" />
        </div>
        
        <h2 className="login-title mb-3">Bejelentkezés</h2>
        <p className="login-subtitle mb-4">
          Kérlek jelentkezz be a felhasználóneved és a jelszavad segítségével.
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="felhasznalonev" className="form-label">
              Felhasználónév:
            </label>
            <input
              type="text"
              className="form-control login-input"
              id="felhasznalonev"
              value={felhasznalonev}
              onChange={(e) => setFelhasznalonev(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="jelszo" className="form-label">
              Jelszó:
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control login-input"
                id="jelszo"
                value={jelszo}
                onChange={(e) => setJelszo(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="text-end mb-4">
            <a href="#" className="forgot-password-link">
              Elfelejtett jelszó?
            </a>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn w-100">
            Belépés
          </button>
        </form>
      </div>
    </div>
  );
}