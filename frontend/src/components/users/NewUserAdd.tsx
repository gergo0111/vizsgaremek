import { useState } from "react";
import "../../designs/NewUserAdd.css";
import { useNavigate } from "react-router";


export function NewUserAdd() {
       const [felhasznalonev, setFelhasznalonev] = useState('');
       const [email, setEmail] = useState('');
       const [jelszo, setJelszo] = useState('');
       const [nev, setNev] = useState('');
       const [munkakor, setMunkakor] = useState('');
       const [munkaora, setMunkaora] = useState(0);
       const [isAdmin, setIsAdmin] = useState(false);

       const [errorMsg, setErrorMsg] = useState<string | null>(null);
       const [successMsg, setSuccessMsg] = useState<string | null>(null);
       const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
       const navigate = useNavigate();

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();

              setErrorMsg(null);
              setSuccessMsg(null);

              const newUser = {
                     felhasznalonev,
                     email,
                     jelszo,
                     nev,
                     munkakor,
                     munkaora,
                     isAdmin,
              };

              const errors: Record<string,string> = {};
              if (!felhasznalonev.trim()) errors.felhasznalonev = 'A felhasználónév megadása kötelező.';
              if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Érvényes email cím szükséges.';
              if (!jelszo || jelszo.length < 6) errors.jelszo = 'A jelszónak legalább 6 karakter hosszúnak kell lennie.';
              if (!nev.trim()) errors.nev = 'A név megadása kötelező.';
              if (!munkakor.trim()) errors.munkakor = 'A munkakör megadása kötelező.';
              if (!Number.isFinite(munkaora) || munkaora < 0 || munkaora > 12) errors.munkaora = 'A munkaóra 0 és 12 között legyen.';

              if (Object.keys(errors).length) {
                     setFieldErrors(errors);
                     setErrorMsg('Kérlek javítsd a jelzett mezőket.');
                     return;
              }

              try {
                     const response = await fetch('http://localhost:3000/users', {
                            method: 'POST',
                            headers: {
                                   'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(newUser),
                     });    

                     if (!response.ok) {
                            const errorData = await response.json();
                            const msg = Array.isArray(errorData.message)
                                   ? errorData.message.join(', ')
                                   : (errorData.message ?? JSON.stringify(errorData));
                            setErrorMsg(String(msg));
                            throw new Error('Hiba történt a felhasználó hozzáadásakor');
                     }

                     const data = await response.json();
                     console.log('Felhasználó sikeresen hozzáadva:', data);
                     setSuccessMsg('Felhasználó sikeresen hozzáadva.');
                     setFieldErrors({});
                     
                     setFelhasznalonev('');
                     setEmail('');
                     setJelszo('');
                     setNev('');
                     setMunkakor('');
                     setMunkaora(0);
                     setIsAdmin(false);

              } catch (error) {
                     console.error('Hiba:', error);
              }
       };


       return (
              <div className="new-user-page">
                     <div className="new-user-card">
                            <h2 className="new-user-header">Új felhasználó hozzáadása</h2>
                            <form onSubmit={handleSubmit} noValidate>
                                   <div className="form-group">
                                          <label htmlFor="username">Felhasználónév:</label>
                                          <input className="form-control" type="text" id="username" name="username" value={felhasznalonev} onChange={e => setFelhasznalonev(e.target.value)} placeholder="pl. kovacs.janos" />
                                          {fieldErrors.felhasznalonev && <div className="field-error">{fieldErrors.felhasznalonev}</div>}
                                   </div>

                                   <div className="form-group">
                                          <label htmlFor="email">Email:</label>
                                          <input className="form-control" type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@pelda.hu" />
                                          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
                                   </div>

                                   <div className="form-group">
                                          <label htmlFor="password">Jelszó:</label>
                                          <input className="form-control" type="password" id="password" name="password" value={jelszo} onChange={e => setJelszo(e.target.value)} placeholder="Legalább 8 karakter" />
                                          {fieldErrors.jelszo && <div className="field-error">{fieldErrors.jelszo}</div>}
                                   </div>

                                   <div className="form-group">
                                          <label htmlFor="name">Teljes név:</label>
                                          <input className="form-control" type="text" id="name" name="name" value={nev} onChange={e => setNev(e.target.value)} placeholder="Kovács János" />
                                          {fieldErrors.nev && <div className="field-error">{fieldErrors.nev}</div>}
                                   </div>

                                   <div className="form-group">
                                          <label htmlFor="munkakor">Munkakör:</label>
                                          <input className="form-control" type="text" id="munkakor" name="munkakor" value={munkakor} onChange={e => setMunkakor(e.target.value)} placeholder="pl. hegesztő" />
                                          {fieldErrors.munkakor && <div className="field-error">{fieldErrors.munkakor}</div>}
                                   </div>

                                   <div className="form-group">
                                          <label htmlFor="munkaora">Munkaóra: <span className="muted">({munkaora} óra)</span></label>
                                          <div className="range-row">
                                                 <input className="range-input" type="range" min={0} max={12} value={munkaora} onChange={e => setMunkaora(Number(e.target.value))} />
                                                 <input className="number-input" type="number" min={0} max={12} value={munkaora} onChange={e => setMunkaora(Number(e.target.value))} />
                                          </div>
                                          {fieldErrors.munkaora && <div className="field-error">{fieldErrors.munkaora}</div>}
                                   </div>

                                   <div className="form-group">
                                          <label htmlFor="permission">Jogosultság:</label>
                                          <select className="form-control" id="permission" name="permission" value={String(isAdmin)} onChange={e => setIsAdmin(e.target.value === 'true')} required>
                                                 <option value="true">Admin</option>
                                                 <option value="false">Felhasználó</option>
                                          </select>
                                   </div>

                                   <div className="form-group">
                                          <button className="btn btn-primary" type="submit">Felhasználó hozzáadása</button>
                                   </div>
                                   <div className="form-group">
                                          <button onClick={() => navigate("/felhasznalok-kezelese")}>Vissza</button>
                                   </div>

                                   {errorMsg && <div className="error-msg">{errorMsg}</div>}
                                   {successMsg && <div className="success-msg">{successMsg}</div>}
                            </form>
                     </div>
              </div>
       )
}