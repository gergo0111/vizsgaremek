import { useState } from "react";
import { useNavigate } from "react-router";
import { apiPost } from "../../lib/api";
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
       const [toasts, setToasts] = useState<Toast[]>([]);
       const navigate = useNavigate();

       const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
              const id = Date.now().toString();
              setToasts(prev => [...prev, { id, message, type }]);
       };

       const removeToast = (id: string) => {
              setToasts(prev => prev.filter(t => t.id !== id));
       };

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
                     const newTool = await apiPost<Eszkoz>('/eszkozok', formState);
                     setTools([...tools, newTool]);
                     addToast('Eszköz sikeresen hozzáadva!', 'success');
                     setFormState({
                            nev: '',
                            tipus: '',
                            darabszam: 0,
                            hasznalatban: false,
                     });
                     setTimeout(() => navigate('/eszkozok'), 1500);
              } catch (error) {
                     const errorMsg = error instanceof Error ? error.message : String(error);
                     addToast(`Hiba történt az eszköz hozzáadásakor: ${errorMsg}`, 'error');
                     console.error('Hiba történt az eszköz hozzáadásakor:', error);
              }
       };

       return <>
              <main>
                     <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
                     <h1>Új eszköz hozzáadása</h1>
                     <form onSubmit={handleSubmit}>
                            <FormField
                                   label="Eszköz neve"
                                   required
                            >
                                   <input
                                          type="text"
                                          value={formState.nev}
                                          onChange={e => setFormState({...formState, nev: e.target.value})}
                                          placeholder="pl. Marógép 5201"
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
                                   <button type="submit">Hozzáadás</button>
                                   <button type="button" onClick={() => navigate('/eszkozok')}>Vissza</button>
                            </div>
                     </form>
              </main>
       </>
}

