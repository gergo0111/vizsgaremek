import { useEffect, useState } from "react";

interface Eszkoz{
       eszkoz_id: string;
       nev: string;
       tipus: string;
       darabszam: number;
       hasznalatban: boolean;
}

export function Tools() {
       const [tools, setTools] = useState<Eszkoz[]>([]);

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
                                          </tr>
                                   ))}
                            </tbody>
                     </table>
              </main>
       );
}



