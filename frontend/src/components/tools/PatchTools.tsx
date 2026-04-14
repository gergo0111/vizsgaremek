import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apiPatch } from "../../lib/api";

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
              try {
                     const updatedTool = await apiPatch<Eszkoz>(`/eszkozok/${eszkoz_id}`, formState);
                     setTools(tools.map(tool => tool.eszkoz_id === updatedTool.eszkoz_id ? updatedTool : tool));
                     setFormState({
                            nev: '',
                            tipus: '',
                            darabszam: 0,
                            hasznalatban: false,
                     });
                     navigate('/eszkozok');
              } catch (error) {
                     console.error('Hiba történt az eszköz módosításakor:', error);
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


