import { useState } from "react";


export function NewUserAdd() {
       const [felhasznalonev, setFelhasznalonev] = useState('');
       const [email, setEmail] = useState('');
       const [jelszo, setJelszo] = useState('');
       const [nev, setNev] = useState('');
       const [munkakor, setMunkakor] = useState('');
       const [munkaora, setMunkaora] = useState(0);
       const [isAdmin, setIsAdmin] = useState(false); // boolean

       const [errorMsg, setErrorMsg] = useState<string | null>(null);
       const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

              try {
                     const response = await fetch('http://localhost:3000/users', {
                            method: 'POST',
                            headers: {
                                   'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(newUser),
                     });    

                     if (!response.ok) {
                            // parse szerverről érkező részletes hibaüzenetet
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
                     
                     // opcionálisan űrlap tisztítása
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


       return <>
              <form onSubmit={handleSubmit}>
                     <label htmlFor="username">Felhasználónév:</label>
                     <input type="text" id="username" name="username" value={felhasznalonev} onChange={e => setFelhasznalonev(e.target.value)} required/>
                     <br />
                     <label htmlFor="email">Email:</label>
                     <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                     <br />
                     <label htmlFor="password">Jelszó:</label>
                     <input type="password" id="password" name="password" value={jelszo} onChange={e => setJelszo(e.target.value)} required/>
                     <br />
                     <label htmlFor="name">Név:</label>
                     <input type="text" id="name" name="name" value={nev} onChange={e => setNev(e.target.value)} required/>
                     <br />
                     <label htmlFor="munkakor">Munkakör:</label>
                     <input type="text" id="munkakor" name="munkakor" value={munkakor} onChange={e => setMunkakor(e.target.value)} required/>
                     <br />
                     <label htmlFor="munkaora">Munkaóra:</label>
                     <input type="number" id="munkaora" name="munkaora" value={munkaora} onChange={e => setMunkaora(Number(e.target.value))} required/>
                     <br />
                     <label htmlFor="permission">Jogosultság:</label>
                     <select id="permission" name="permission" value={String(isAdmin)} onChange={e => setIsAdmin(e.target.value === 'true')} required>
                            <option value="true">Admin</option>
                            <option value="false">Felhasználó</option>
                     </select>
                     <br />
                     <button type="submit">Felhasználó hozzáadása</button>

                     {errorMsg && <div style={{ color: 'red', marginTop: 8 }}>{errorMsg}</div>}
                     {successMsg && <div style={{ color: 'green', marginTop: 8 }}>{successMsg}</div>}
              </form>
       </>
}