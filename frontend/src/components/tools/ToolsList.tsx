import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menusor } from "../Menusor";
import { apiGet, apiDelete } from "../../lib/api";

interface Eszkoz{
       eszkoz_id: string;
       nev: string;
       tipus: string;
       darabszam: number;
       hasznalatban: boolean;
}

export function ToolsList() {
       const [tools, setTools] = useState<Eszkoz[]>([]);
       const [allTools, setAllTools] = useState<Eszkoz[]>([]);
       const [searchTerm, setSearchTerm] = useState<string>('');
        const navigate = useNavigate();
 
        const fetchTools = async () => {
               try {
                      const data = await apiGet<Eszkoz[]>('/eszkozok');
                     setTools(data);
                     setAllTools(data);
               } catch (error) {
                      console.error('Hiba:', error);
               }
        }

       useEffect(() => {
              fetchTools();
       }, []);

       const handleDelete = async (eszkoz_id: string) => {
              try {
                     await apiDelete(`/eszkozok/${eszkoz_id}`);
                     setTools(prev => prev.filter(tool => tool.eszkoz_id !== eszkoz_id));
                     setAllTools(prev => prev.filter(tool => tool.eszkoz_id !== eszkoz_id));
              } catch (error) {
                     console.error('Hiba:', error);
              }
       };
       
       const sortByToolNameUp = () => {
              const sortedTools = [...tools].sort((a, b) => a.nev.localeCompare(b.nev));
              setTools(sortedTools);
       };

       useEffect(() => {
              fetchTools();
       }, []);

       const sortByToolNameDown = () => {
              const sortedTools = [...tools].sort((a, b) => b.nev.localeCompare(a.nev));
              setTools(sortedTools);
       };

      useEffect(() => {
              fetchTools();
       }, []);

       const sortByTypeUp = () => {
              const sortedTools = [...tools].sort((a, b) => a.tipus.localeCompare(b.tipus));
              setTools(sortedTools);
       };

       useEffect(() => {
              fetchTools();
       }, []);

       const sortByTypeDown = () => {
              const sortedTools = [...tools].sort((a, b) => b.tipus.localeCompare(a.tipus));
              setTools(sortedTools);
       };
       
       useEffect(() => {
              fetchTools();
       }, []);

       const sortByQuantityUp = () => {
              const sortedTools = [...tools].sort((a, b) => a.darabszam - b.darabszam);
              setTools(sortedTools);
       };

       useEffect(() => {
              fetchTools();
       }, []);
       
       const sortByQuantityDown = () => {
              const sortedTools = [...tools].sort((a, b) => b.darabszam - a.darabszam);
              setTools(sortedTools);
       };
       //valamis
              useEffect(() => {
              fetchTools();
       }, []);

       const sortByInUseUp = () => {
              const sortedTools = [...tools].sort((a, b) => Number(a.hasznalatban) - Number(b.hasznalatban));
              setTools(sortedTools);
       };

       useEffect(() => {
              fetchTools();
       }, []);

       const sortByInUseDown = () => {
              const sortedTools = [...tools].sort((a, b) => Number(b.hasznalatban) - Number(a.hasznalatban));
              setTools(sortedTools);
       };

       useEffect(() => {
              fetchTools();
       }, []);

       const handleSearch = () => {
              const term = searchTerm.trim().toLowerCase();
              if (!term) {
                     setTools(allTools);
                     return;
              }
              const filteredTools = allTools.filter((tool) =>
                     tool.nev.toLowerCase().includes(term) ||
                     tool.tipus.toLowerCase().includes(term)
              );
              setTools(filteredTools);
       };

       const handleFilterByType = (e: React.ChangeEvent<HTMLSelectElement>) => {
              const selectedType = e.target.value;
              if (!selectedType) {
                     setTools(allTools);
                     return;
              }
              const filteredTools = allTools.filter((tool) => tool.tipus === selectedType);
              setTools(filteredTools);
       };

       return (
              <>
                     <Menusor />
                     <main className="tools-main">
                     <div className="tools-left">
                        <h1 className="tools-title">Összes eszköz</h1>
                        <div className="tools-card">
                           <table className="tools-table">
                            <thead>
                                   <tr>
                                          <th>Eszköz neve <button onClick={sortByToolNameUp}>⬆️</button> <button onClick={sortByToolNameDown}>⬇️</button></th>
                                          <th>Típus <button onClick={sortByTypeUp}>⬆️</button> <button onClick={sortByTypeDown}>⬇️</button></th>
                                          <th>Darabszám <button onClick={sortByQuantityUp}>⬆️</button> <button onClick={sortByQuantityDown}>⬇️</button></th>
                                          <th>Használatban <button onClick={sortByInUseUp}>⬆️</button> <button onClick={sortByInUseDown}>⬇️</button></th>
                                   </tr>
                            </thead>
                            <tbody>
                                   {tools.map((tool) => (
                                          <tr key={tool.eszkoz_id}>
                                                 <td>{tool.nev} </td>
                                                 <td>{tool.tipus}</td>
                                                 <td>{tool.darabszam}</td>
                                                 <td>{tool.hasznalatban ? 'Igen' : 'Nem'}</td>
                                                 <td>
                                                    <button
                                                       type="button"
                                                       onClick={() => navigate(`/eszkoz-modositas/${tool.eszkoz_id}`)}
                                                    >
                                                       ✏️
                                                    </button>
                                                 </td>
                                                 <td><button onClick={() => {if (window.confirm(`Biztosan törlöd ${tool.nev} eszközt?`)) {
                                                                      handleDelete(tool.eszkoz_id);
                                                               }}}>🗑️</button></td>
                                          </tr>
                                   ))}
                            </tbody>
                         </table>
                        </div>
                     </div>

                     <aside className="tools-right">
                        <div className="search-box">
                            <input
                                   type="text"
                                   placeholder="Kereséshez írj be egy nevet vagy típust"
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                         e.preventDefault();
                                         handleSearch();
                                      }
                                   }}
                            />
                            <button className="search-btn" onClick={handleSearch}>🔍</button>
                        </div>

                        <div className="filter-box">
                            <label htmlFor="typeFilter">Szűrés típus szerint:</label>
                            <select id="typeFilter" onChange={handleFilterByType}>
                                   <option value="">Összes</option>
                                   {Array.from(new Set(allTools.map((tool) => tool.tipus))).map((type) => (
                                          <option key={type} value={type}>{type}</option>
                                   ))}
                            </select>
                        </div>
                        <button className="aside-back" onClick={() => navigate('/fooldal')}>Vissza</button>
                        <button className="add-btn" onClick={() => navigate('/uj-eszkoz')}>Új eszköz hozzáadása</button>
                     </aside>
                     </main>
              </>
       );
}

export default ToolsList;

