import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Eszkoz{
       eszkoz_id: string;
       nev: string;
       tipus: string;
       darabszam: number;
       hasznalatban: boolean;
}

export function Tools() {
       const [tools, setTools] = useState<Eszkoz[]>([]);
       const navigate = useNavigate();

       const fetchTools = async () => {
              try {
                     const response = await fetch('http://localhost:3000/eszkozok');
                     if (!response.ok) {
                            throw new Error('Hiba történt az eszközök lekérésekor');
                     }
                     const data = await response.json();
                     setTools(data);
              } catch (error) {
                     console.error('Hiba:', error);
              }
       }

       useEffect(() => {
              fetchTools();
       }, []);

       const handleDelete = async (eszkoz_id: string) => {
              try {
                     const response = await fetch(`http://localhost:3000/eszkozok/${eszkoz_id}`, {
                            method: 'DELETE',
                     });
                     if (!response.ok) {
                            throw new Error('Hiba történt az eszköz törlésekor');
                     }
                     setTools(tools.filter(tool => tool.eszkoz_id !== eszkoz_id));
                     await fetchTools();
              } catch (error) {
                     console.error('Hiba:', error);
              }
       };
       
       const sortByToolNameUp = () => {
              const sortedTools = [...tools].sort((a, b) => a.nev.localeCompare(b.nev));
              setTools(sortedTools);
       };

       const sortByToolNameDown = () => {
              const sortedTools = [...tools].sort((a, b) => b.nev.localeCompare(a.nev));
              setTools(sortedTools);
       };

      

       const sortByToolType = () => {
              const sortedTools = [...tools].sort((a, b) => a.tipus.localeCompare(b.tipus));
              setTools(sortedTools);
       };
       
       useEffect(() => {
              sortByToolType();
       }, []);

       const sortByQuantity = () => {
              const sortedTools = [...tools].sort((a, b) => a.darabszam - b.darabszam);
              setTools(sortedTools);
       };

       useEffect(() => {
              sortByQuantity();
       }, []);

       const sortByInUse = () => {
              const sortedTools = [...tools].sort((a, b) => Number(a.hasznalatban) - Number(b.hasznalatban));
              setTools(sortedTools);
       };

       useEffect(() => {
              sortByInUse();
       }, []);


       return (
              <main>
                     <h1>Összes eszköz</h1>
                     <table>
                            <thead>
                                   <tr>
                                          <th>Eszköz neve</th>
                                          <th>Típus</th>
                                          <th>Darabszám</th>
                                          <th>Használatban</th>
                                   </tr>
                            </thead>
                            <tbody>
                                   {tools.map((tool) => (
                                          <tr key={tool.eszkoz_id}>
                                                 <td>{tool.nev}</td>
                                                 <td>{tool.tipus}</td>
                                                 <td>{tool.darabszam}</td>
                                                 <td>{tool.hasznalatban ? 'Igen' : 'Nem'}</td>
                                                 <td><button onClick={() => navigate(`eszkoz-modositas/${tool.eszkoz_id}`)}>✏️</button></td>
                                                 <td><button onClick={() => handleDelete(tool.eszkoz_id)}>🗑️</button></td>
                                          </tr>
                                   ))}
                                   <button onClick={() => navigate('/fooldal')}>Vissza</button>
                            </tbody>
                     </table>
                     <button onClick={() => navigate('/uj-eszkoz')}>Új eszköz hozzáadása</button>
              </main>
       );
}



