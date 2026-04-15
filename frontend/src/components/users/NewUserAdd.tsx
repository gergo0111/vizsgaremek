import { useState } from "react";
import "../../designs/NewUserAdd.css";
import { useNavigate } from "react-router";
import { ToastContainer } from "../common/Toast";
import { FormField } from "../common/FormField";

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}


export function NewUserAdd() {
       const [felhasznalonev, setFelhasznalonev] = useState('');
       const [email, setEmail] = useState('');
       const [jelszo, setJelszo] = useState('');
       const [nev, setNev] = useState('');
       const [munkakor, setMunkakor] = useState('');
       const [munkaora, setMunkaora] = useState(0);
       const [isAdmin, setIsAdmin] = useState(false);

       const [toasts, setToasts] = useState<Toast[]>([]);
       const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
       const navigate = useNavigate();

       const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
              const id = Date.now().toString();
              setToasts(prev => [...prev, { id, message, type }]);
       };

       const removeToast = (id: string) => {
              setToasts(prev => prev.filter(t => t.id !== id));
       };

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();

              setFieldErrors({});

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
                     addToast('Kérlek javítsd a jelzett mezőket.', 'error');
                     return;
              }

              try {
                     const { apiPost } = await import('../../lib/api');
                     const data = await apiPost('/users', newUser);
                     console.log('Felhasználó sikeresen hozzáadva:', data);
                     addToast('Felhasználó sikeresen hozzáadva!', 'success');
                     setFieldErrors({});
                     
                     setFelhasznalonev('');
                     setEmail('');
                     setJelszo('');
                     setNev('');
                     setMunkakor('');
                     setMunkaora(0);
                     setIsAdmin(false);

                     setTimeout(() => navigate("/felhasznalok-kezelese"), 2000);
              } catch (error) {
                     const errorData = error instanceof Error ? error.message : String(error);
                     addToast(`Hiba a felhasználó hozzáadásakor: ${errorData}`, 'error');
                     console.error('Hiba:', error);
              }
       };


       return (
              <div className="new-user-page">
                     <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
                     <div className="new-user-card">
                            <h2 className="new-user-header">Új felhasználó hozzáadása</h2>
                            <form onSubmit={handleSubmit} noValidate>
                                   <FormField
                                          label="Felhasználónév"
                                          error={fieldErrors.felhasznalonev}
                                          required
                                   >
                                          <input
                                                 className="form-control"
                                                 type="text"
                                                 id="username"
                                                 name="username"
                                                 value={felhasznalonev}
                                                 onChange={e => setFelhasznalonev(e.target.value)}
                                                 placeholder="pl. kovacs.janos"
                                          />
                                   </FormField>

                                   <FormField
                                          label="Email"
                                          error={fieldErrors.email}
                                          required
                                   >
                                          <input
                                                 className="form-control"
                                                 type="email"
                                                 id="email"
                                                 name="email"
                                                 value={email}
                                                 onChange={e => setEmail(e.target.value)}
                                                 placeholder="email@pelda.hu"
                                          />
                                   </FormField>

                                   <FormField
                                          label="Jelszó"
                                          error={fieldErrors.jelszo}
                                          helpText="Minimum 8 karakter hosszú jelszó, amely tartalmaz nagybetűt, kisbetűt, számot vagy speciális karaktert"
                                          required
                                   >
                                          <input
                                                 className="form-control"
                                                 type="password"
                                                 id="password"
                                                 name="password"
                                                 value={jelszo}
                                                 onChange={e => setJelszo(e.target.value)}
                                          />
                                   </FormField>

                                   <FormField
                                          label="Teljes név"
                                          error={fieldErrors.nev}
                                          required
                                   >
                                          <input
                                                 className="form-control"
                                                 type="text"
                                                 id="name"
                                                 name="name"
                                                 value={nev}
                                                 onChange={e => setNev(e.target.value)}
                                                 placeholder="Kovács János"
                                          />
                                   </FormField>

                                   <FormField
                                          label="Munkakör"
                                          error={fieldErrors.munkakor}
                                          required
                                   >
                                          <input
                                                 className="form-control"
                                                 type="text"
                                                 id="munkakor"
                                                 name="munkakor"
                                                 value={munkakor}
                                                 onChange={e => setMunkakor(e.target.value)}
                                                 placeholder="pl. hegesztő"
                                          />
                                   </FormField>

                                   <FormField
                                          label={`Munkaóra: ${munkaora} óra`}
                                          error={fieldErrors.munkaora}
                                          required
                                   >
                                          <div className="range-row">
                                                 <input
                                                        className="range-input"
                                                        type="range"
                                                        min={0}
                                                        max={12}
                                                        value={munkaora}
                                                        onChange={e => setMunkaora(Number(e.target.value))}
                                                 />
                                                 <input
                                                        className="number-input"
                                                        type="number"
                                                        min={0}
                                                        max={12}
                                                        value={munkaora}
                                                        onChange={e => setMunkaora(Number(e.target.value))}
                                                 />
                                          </div>
                                   </FormField>

                                   <FormField
                                          label="Jogosultság"
                                          required
                                   >
                                          <select
                                                 className="form-control"
                                                 id="permission"
                                                 name="permission"
                                                 value={String(isAdmin)}
                                                 onChange={e => setIsAdmin(e.target.value === 'true')}
                                          >
                                                 <option value="false">Felhasználó</option>
                                                 <option value="true">Admin</option>
                                          </select>
                                   </FormField>

                                   <div className="form-group">
                                          <button className="btn btn-primary" type="submit">Felhasználó hozzáadása</button>
                                   </div>
                                   <div className="form-group">
                                          <button type="button" onClick={() => navigate("/felhasznalok-kezelese")}>Vissza</button>
                                   </div>
                            </form>
                     </div>
              </div>
       )
}