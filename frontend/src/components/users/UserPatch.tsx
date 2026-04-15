import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiGet, apiPatch } from "../../lib/api";
import "../../designs/NewUserAdd.css";
import { ToastContainer } from "../common/Toast";
import { FormField } from "../common/FormField";

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface User {
       user_id: number;
       felhasznalonev: string;
       email: string;
       nev: string;
       munkakor: string;
       munkaora: number;
       isActice: boolean;
       isAdmin: boolean;
}

export function UserPatch() {
        const navigate = useNavigate();
        const { user_id } = useParams();
        const [felhasznalonev, setFelhasznalonev] = useState('');
        const [email, setEmail] = useState('');
        const [nev, setNev] = useState('');
        const [munkakor, setMunkakor] = useState('');
        const [munkaora, setMunkaora] = useState(0);
        const [isAdmin, setIsAdmin] = useState(false);
        
        const [loading, setLoading] = useState<boolean>(true);
        const [toasts, setToasts] = useState<Toast[]>([]);
        const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

        const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
              const id = Date.now().toString();
              setToasts(prev => [...prev, { id, message, type }]);
        };

        const removeToast = (id: string) => {
              setToasts(prev => prev.filter(t => t.id !== id));
        };

        useEffect(() => {
            const id = Number(user_id);

            const fetchUser = async () => {
                try {
                    const data = await apiGet<User>(`/users/${id}`);
                    setFelhasznalonev(data.felhasznalonev);
                    setEmail(data.email);
                    setNev(data.nev);
                    setMunkakor(data.munkakor);
                    setMunkaora(data.munkaora);
                    setIsAdmin(data.isAdmin);
                } catch (err) {
                    console.error('Hiba:', err);
                    addToast('Felhasználó adatainak betöltése sikertelen.', 'error');
                } finally {
                    setLoading(false);
                }
            };

            fetchUser();
        }, [user_id]);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            setFieldErrors({});

            const errors: Record<string,string> = {};
            if (!felhasznalonev.trim()) errors.felhasznalonev = 'A felhasználónév megadása kötelező.';
            if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Érvényes email cím szükséges.';
            if (!nev.trim()) errors.nev = 'A név megadása kötelező.';
            if (!munkakor.trim()) errors.munkakor = 'A munkakör megadása kötelező.';
            if (!Number.isFinite(munkaora) || munkaora < 0 || munkaora > 12) errors.munkaora = 'A munkaóra 0 és 12 között legyen.';

            if (Object.keys(errors).length) {
                setFieldErrors(errors);
                addToast('Kérlek javítsd a jelzett mezőket.', 'error');
                return;
            }

            const updatedUser = {
                felhasznalonev,
                email,
                nev,
                munkakor,
                munkaora,
                isAdmin,
            };

            try {
                await apiPatch(`/users/${user_id}`, updatedUser);
                addToast('Felhasználó sikeresen módosítva!', 'success');
                setTimeout(() => navigate('/felhasznalok-kezelese'), 1500);
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                addToast(`Hiba a módosítás közben: ${errorMsg}`, 'error');
                console.error('Hiba:', err);
            }
        };

        if (loading) return <div className="new-user-page"><div className="new-user-card">Betöltés...</div></div>;

        return (
            <div className="new-user-page">
                <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
                <div className="new-user-card">
                    <h2 className="new-user-header">Felhasználó módosítása</h2>
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
                            <button className="btn btn-primary" type="submit">Módosítás</button>
                        </div>
                        <div className="form-group">
                            <button type="button" onClick={() => navigate("/felhasznalok-kezelese")}>Vissza</button>
                        </div>
                    </form>
                </div>
            </div>
        );
}
