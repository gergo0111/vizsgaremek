import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiPatch, apiGet } from "../../lib/api";
import { ToastContainer } from "../common/Toast";
import { FormField } from "../common/FormField";

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface Eszkoz{
       eszkoz_id: string;
       nev: string;
       tipus: string;
       darabszam: number;
}

export function PatchTools() {

       const [tools, setTools] = useState<Eszkoz[]>([]);
       const [formState, setFormState] = useState({
              nev: '',
              tipus: '',
              darabszam: 0,
       });
       const [toasts, setToasts] = useState<Toast[]>([]);
       const [loading, setLoading] = useState(true);
       const navigate = useNavigate();

       const { eszkoz_id } = useParams<{ eszkoz_id: string }>();

       const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
              const id = Date.now().toString();
              setToasts(prev => [...prev, { id, message, type }]);
       };

       const removeToast = (id: string) => {
              setToasts(prev => prev.filter(t => t.id !== id));
       };

       useEffect(() => {
              const fetchTool = async () => {
                     try {
                            const data = await apiGet<Eszkoz>(`/eszkozok/${eszkoz_id}`);
                            setFormState({
                                   nev: data.nev,
                                   tipus: data.tipus,
                                   darabszam: data.darabszam,
                            });
                     } catch (error) {
                            const errorMsg = error instanceof Error ? error.message : String(error);
                            addToast(`Eszköz adatainak betöltése sikertelen: ${errorMsg}`, 'error');
                            console.error('Hiba az adatok betöltésekor:', error);
                     } finally {
                            setLoading(false);
                     }
              };

              if (eszkoz_id) {
                     fetchTool();
              }
       }, [eszkoz_id]);

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              if (!formState.nev.trim()) {
                     addToast('Az eszköz neve kötelező!', 'error');
                     return;
              }

              if (!formState.tipus.trim()) {
                     addToast('Az eszköz típusa kötelező!', 'error');
                     return;
              }

              if (formState.darabszam <= 0) {
                     addToast('A darabszám nagyobb kell, hogy legyen, mint 0!', 'error');
                     return;
              }

              try {
                     const updatedTool = await apiPatch<Eszkoz>(`/eszkozok/${eszkoz_id}`, formState);
                     setTools(tools.map(tool => tool.eszkoz_id === updatedTool.eszkoz_id ? updatedTool : tool));
                     addToast('Eszköz sikeresen módosítva!', 'success');
                     setTimeout(() => navigate('/eszkozok'), 1500);
              } catch (error) {
                     const errorMsg = error instanceof Error ? error.message : String(error);
                     addToast(`Hiba a módosítás közben: ${errorMsg}`, 'error');
                     console.error('Hiba történt az eszköz módosításakor:', error);
              }
       };

       if (loading) {
              return <main><p>Betöltés...</p></main>;
       }

       return <>
              <main>
                     <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
                     <h1>Eszköz módosítása</h1>
                     <form onSubmit={handleSubmit}>
                            <FormField
                                   label="Eszköz neve"
                                   required
                            >
                                   <input
                                          type="text"
                                          value={formState.nev}
                                          onChange={e => setFormState({...formState, nev: e.target.value})}
                                          placeholder="pl. marógép 5201"
                                   />
                            </FormField>

                            <FormField
                                   label="Típus"
                                   required
                            >
                                   <input
                                          type="text"
                                          value={formState.tipus}
                                          onChange={e => setFormState({...formState, tipus: e.target.value})}
                                          placeholder="pl. Marógép"
                                   />
                            </FormField>

                            <FormField
                                   label="Darabszám"
                                   required
                            >
                                   <input
                                          type="number"
                                          min="1"
                                          value={formState.darabszam}
                                          onChange={e => setFormState({...formState, darabszam: Number(e.target.value)})}
                                   />
                            </FormField>

                            <div className="form-group">
                                   <button type="submit">Mentés</button>
                                   <button type="button" onClick={() => navigate('/eszkozok')}>Vissza</button>
                            </div>
                     </form>
              </main>
       </>
}


