import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

interface Eszkoz{
       eszkoz_id: string;
       nev: string;
       tipus: string;
       darabszam: number;
       hasznalatban: boolean;
}

export function PatchTools() {

       const [tools, setTools] = useState<Eszkoz[]>([]);
       const [formState, setFormState] = useState({
              nev: '',
              tipus: '',
              darabszam: 0,
              hasznalatban: false,
       });
       const navigate = useNavigate();

       const { eszkoz_id } = useParams<{ eszkoz_id: string }>();

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              const response = await fetch(`http://localhost:3000/eszkozok/${eszkoz_id}`, {
                     method: 'PATCH',
                     headers: {
                            'Content-Type': 'application/json',
                     },
                     body: JSON.stringify(formState),
              });
              if (response.ok) {
                     const updatedTool = await response.json();
                     setTools(tools.map(tool => tool.eszkoz_id === updatedTool.eszkoz_id ? updatedTool : tool));
                     setFormState({
                            nev: '',
                            tipus: '',
                            darabszam: 0,
                            hasznalatban: false,
                     });
                     navigate('/eszkozok');
              } else {
                     console.error('Hiba történt az eszköz módosításakor');
              }
       };

       return <>
              <main>
                     <form>
                            <div>
                                   <label>Eszköz neve:</label>
                                   <input type="text" />
                            </div>
                            <div>
                                   <label>Típus:</label>
                                   <input type="text" />
                            </div>
                            <div>
                                   <label>Darabszám:</label>
                                   <input type="number" />
                            </div>
                            <div>
                                   <label>Használatban:</label>
                                   <input type="checkbox" />
                            </div>
                            <button type="submit" onClick={() => handleSubmit}>Mentés</button>
                            <button onClick={() => navigate('/eszkozok')}>Vissza</button>
                     </form>
              </main>
       </>
}


