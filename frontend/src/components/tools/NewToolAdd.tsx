import { useState } from "react";
import { useNavigate } from "react-router";


interface Eszkoz{
       eszkoz_id: string;
       nev: string;
       tipus: string;
       darabszam: number;
       hasznalatban: boolean;
}


export function newToolAdd() {
       const [tools, setTools] = useState<Eszkoz[]>([]);
       const [formState, setFormState] = useState({
              nev: '',
              tipus: '',
              darabszam: 0,
              hasznalatban: false,
       });
       const navigate = useNavigate();

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              const response = await fetch('http://localhost:3000/eszkozok', {
                     method: 'POST',
                     headers: {
                            'Content-Type': 'application/json',
                     },
                     body: JSON.stringify(formState),
              });
              if (response.ok) {
                     const newTool = await response.json();
                     setTools([...tools, newTool]);
                     setFormState({
                            nev: '',
                            tipus: '',
                            darabszam: 0,
                            hasznalatban: false,
                     });
              } else {
                     console.error('Hiba történt az eszköz hozzáadásakor');
              }
       };

       return<>
              <main>
                     <h1>Új eszköz hozzáadása</h1>
                     <form>
                            <div>
                                   <label>Eszköz neve:</label>
                                   <input type="text" value={formState.nev} onChange={e => setFormState({...formState, nev: e.target.value})} />
                            </div>
                            <div>
                                   <label>Típus:</label>
                                   <input type="text" value={formState.tipus} onChange={e => setFormState({...formState, tipus: e.target.value})} />
                            </div>
                            <div>
                                   <label>Darabszám:</label>
                                   <input type="number" value={formState.darabszam} onChange={e => setFormState({...formState, darabszam: Number(e.target.value)})} />
                            </div>
                            <div>
                                   <label>Használatban:</label>
                                   <input type="checkbox" checked={formState.hasznalatban} onChange={e => setFormState({...formState, hasznalatban: e.target.checked})} />
                            </div>
                            <button type="submit" onClick={handleSubmit}>Hozzáadás</button>
                            <button onClick={() => navigate('/eszkozok')}>Vissza</button>
                     </form>
              </main>
       </>
}

