import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

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
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState<boolean>(true);

        useEffect(() => {
            const id = Number(user_id);

            const fetchUser = async () => {
                try {
                    const res = await fetch(`http://localhost:3000/users/${id}`);
                    if (!res.ok) throw new Error('Hiba a felhasználó lekérésekor');
                    const data = await res.json();
                    setUser(data);
                } catch (err) {
                    console.error('Hiba:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchUser();
        }, [user_id]);

        const handleChange = (field: keyof User, value: any) => {
            setUser(prev => {
                const base = prev ?? { user_id: Number(user_id) || 0, felhasznalonev: '', email: '', nev: '', munkakor: '', munkaora: 0, isActice: false, isAdmin: false };
                return { ...base, [field]: value } as User;
            });
        };

        const saveUser = async (e?: React.FormEvent) => {
            if (e) e.preventDefault();
            if (!user) return;
            try {
                const res = await fetch(`http://localhost:3000/users/${user.user_id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user),
                });
                if (!res.ok) throw new Error('Hiba a mentéskor');
                navigate('/felhasznalok-kezelese');
            } catch (err) {
                console.error('Hiba:', err);
                alert('Mentés sikertelen.');
            }
        };
        if (!user) return <div>Felhasználó nem található</div>;

            return <>
                     <h2>Felhasználó módosítása</h2>

                     <form onSubmit={saveUser}>
                        <div>
                              <label>Felhasználónév: </label> <br />
                              <input type="text" value={user.felhasznalonev} name="felhasznalonev" onChange={(e) => handleChange('felhasznalonev', e.target.value)} />
                        </div>
                        <div>
                              <label>Email: </label> <br />
                              <input type="text" value={user.email} name="email" onChange={(e) => handleChange('email', e.target.value)} /> 
                        </div>
                        <div>
                              <label>Név: </label> <br />
                              <input type="text" value={user.nev} name="nev" onChange={(e) => handleChange('nev', e.target.value)} /> 
                        </div>
                        <div>
                              <label>Munkakör: </label> <br />
                              <input type="text" value={user.munkakor} name="munkakor" onChange={(e) => handleChange('munkakor', e.target.value)} /> 
                        </div>
                        <div>
                              <label>Munkaóra: </label> <br />
                              <input type="number" value={user.munkaora} name="munkaora" onChange={(e) => handleChange('munkaora', e.target.value === '' ? 0 : parseInt(e.target.value, 10))} /> 
                        </div>

                        <br />

                        <div>
                              <button type="submit">Módosítás</button>
                              <button onClick={() => navigate("/felhasznalok-kezelese")}>Vissza</button>
                        </div>

                     </form>
                     
            </>
}
