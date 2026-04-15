import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menusor } from "../Menusor";
import { apiGet, apiPost } from "../../lib/api";
import { ToastContainer } from "../common/Toast";
import { FormField } from "../common/FormField";

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface User {
       user_id: number;
       felhasznalonev: string;
       nev: string;
}

interface Tool {
       eszkoz_id: number;
       nev: string;
}

export function NewWorkAdd() {
       const navigate = useNavigate();
       
       const [users, SetUsers] = useState<User[]>([]);
       const [tools, SetTools] = useState<Tool[]>([]);
       const [nev, SetNev] = useState('');
       const [leiras, SetLeiras] = useState('');
       const [kezdetiDatum, SetKezdetiDatum] = useState('');
       const [velemenyDatum, SetVelemenyDatum] = useState('');
       const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
       const [selectedTools, setSelectedTools] = useState<number[]>([]);
       const [selectedTasks, setSelectedTasks] = useState<string[]>([""]);
       const [toasts, setToasts] = useState<Toast[]>([]);

       const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
              const id = Date.now().toString();
              setToasts(prev => [...prev, { id, message, type }]);
       };

       const removeToast = (id: string) => {
              setToasts(prev => prev.filter(t => t.id !== id));
       };
       useEffect(() => {
              const fetchUsers = async () => {
                     try {
                            const data = await apiGet<User[]>('/users');
                            const filteredUsers = data.filter(user => user.felhasznalonev !== 'admin');
                            SetUsers(filteredUsers);
                     } catch (error) {
                            console.error('Hiba:', error);
                     }   
              };

              const fetchTools = async () => {
                     try {
                            const data = await apiGet<Tool[]>('/eszkozok');
                            SetTools(data);
                     } catch (error) {
                            console.error('Hiba:', error);
                     }
              };
              
              fetchUsers();
              fetchTools();
       }, []);

       const PlusUser = () => {
              setSelectedUsers(prev => [...prev, 0]);
       }

       const removeUser = (index: number) => {
              setSelectedUsers(prev => prev.filter((_, i) => i !== index));
       }

       const handleUserChange = (index: number, value: number) => {
              setSelectedUsers(prev => {
                     const copy = [...prev];
                     copy[index] = value;
                     return copy;
              });
       }

       const PlusEszkoz = () => {
              setSelectedTools(prev => [...prev, 0]);
       }

       const removeTool = (index: number) => {
              setSelectedTools(prev => prev.filter((_, i) => i !== index));
       }

       const handleToolChange = (index: number, value: number) => {
              setSelectedTools(prev => {
                     const copy = [...prev];
                     copy[index] = value;
                     return copy;
              });
       }

       const PlusFeladat = () => {
              setSelectedTasks(prev => [...prev, ""]);
       }

       const removeTask = (index: number) => {
              setSelectedTasks(prev => prev.filter((_, i) => i !== index));
       }

       const handleTaskChange = (index: number, value: string) => {
              setSelectedTasks(prev => {
                     const copy = [...prev];
                     copy[index] = value;
                     return copy;
              });
       }

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              
              if (!nev.trim()) {
                     addToast('A munka neve kötelező!', 'error');
                     return;
              }

              if (selectedUsers.filter(id => id && id !== 0).length === 0) {
                     addToast('Legalább egy dolgozót ki kell választani!', 'error');
                     return;
              }

              const payload = {
                     nev,
                     leiras,
                     dolgozok: selectedUsers.filter(id => id && id !== 0),
                     eszkozok: selectedTools.filter(id => id && id !== 0),
                     feladatok: selectedTasks.filter(t => t && t.trim() !== ""),
                     kezdetiDatum: kezdetiDatum || undefined,
                     velemenyDatum: velemenyDatum || undefined,
              };

              try {
                     await apiPost('/munka', payload);
                     addToast('Munka sikeresen hozzáadva!', 'success');
                     setTimeout(() => navigate('/fooldal'), 1500);
              } catch (err) {
                     const errorMsg = err instanceof Error ? err.message : String(err);
                     addToast(`Hiba a munka hozzáadásakor: ${errorMsg}`, 'error');
                     console.error('Hiba:', err);
              }
       }

       return(
              <>
              <Menusor />
              <div className="new-work-page">
                     <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
                     <div className="new-work-card">
                            <h2 className="new-work-header">Új munka hozzáadása</h2>
                            <form onSubmit={handleSubmit}>
                                   <FormField
                                          label="Munka neve"
                                          helpText="A munkafeladat egyedi nevét adjuk meg"
                                          required
                                   >
                                          <input
                                                 className="form-control"
                                                 type="text"
                                                 value={nev}
                                                 onChange={(e) => SetNev(e.target.value)}
                                                 placeholder="pl. Terasz készítés kraftmarketnak"
                                          />
                                   </FormField>

                                   <FormField
                                          label="Leírás"
                                          helpText="A munka részletes leírása, hogy mit kell elvégezni"
                                   >
                                          <input
                                                 className="form-control"
                                                 type="text"
                                                 value={leiras}
                                                 onChange={(e) => SetLeiras(e.target.value)}
                                                 placeholder="pl. Teljes kivitelezés"
                                          />
                                   </FormField>

                                   <FormField
                                          label="Dolgozó kiválasztása"
                                          required
                                   >
                                          <div>
                                                 {selectedUsers.map((userId, idx) => (
                                                        <div key={idx} className="dynamic-row">
                                                               <select
                                                                      value={userId}
                                                                      onChange={(e) => handleUserChange(idx, parseInt(e.target.value || '0', 10) || 0)}
                                                               >
                                                                      <option value={0}>-- válassz --</option>
                                                                      {users.map((user) => (
                                                                             <option key={user.user_id} value={user.user_id}>
                                                                                    {user.nev}
                                                                             </option>
                                                                      ))}
                                                               </select>
                                                               <button type="button" onClick={() => removeUser(idx)}>
                                                                      Törlés
                                                               </button>
                                                        </div>
                                                 ))}
                                                 <button type="button" onClick={PlusUser}>
                                                        + Új dolgozó hozzáadása
                                                 </button>
                                          </div>
                                   </FormField>

                                   <FormField
                                          label="Eszközök kiválasztása"
                                   >
                                          <div>
                                                 {selectedTools.map((toolId, idx) => (
                                                        <div key={idx} className="dynamic-row">
                                                               <select
                                                                      value={toolId}
                                                                      onChange={(e) => handleToolChange(idx, parseInt(e.target.value || '0', 10) || 0)}
                                                               >
                                                                      <option value={0}>-- válassz --</option>
                                                                      {tools.map((tool) => (
                                                                             <option key={tool.eszkoz_id} value={tool.eszkoz_id}>
                                                                                    {tool.nev}
                                                                             </option>
                                                                      ))}
                                                               </select>
                                                               <button type="button" onClick={() => removeTool(idx)}>
                                                                      Törlés
                                                               </button>
                                                        </div>
                                                 ))}
                                                 <button type="button" onClick={PlusEszkoz}>
                                                        + Új eszköz hozzáadása
                                                 </button>
                                          </div>
                                   </FormField>

                                   <FormField
                                          label="Munka kezdeti dátuma"
                                   >
                                          <input type="date" onChange={(e) => SetKezdetiDatum(e.target.value)} />
                                   </FormField>

                                   <FormField
                                          label="Munka várható befejezési dátuma"
                                   >
                                          <input type="date" onChange={(e) => SetVelemenyDatum(e.target.value)} />
                                   </FormField>

                                   <FormField
                                          label="Feladatok megadása"
                                          helpText="Részfeladatok megadása, amelyek elvégzendők a munka során"
                                   >
                                          <div>
                                                 {selectedTasks.map((task, idx) => (
                                                        <div key={idx} className="dynamic-row">
                                                               <input
                                                                      className="form-control"
                                                                      type="text"
                                                                      value={task}
                                                                      onChange={(e) => handleTaskChange(idx, e.target.value)}
                                                                      placeholder="pl. Felmérés"
                                                               />
                                                               <button type="button" onClick={() => removeTask(idx)}>
                                                                      Törlés
                                                               </button>
                                                        </div>
                                                 ))}
                                                 <button type="button" onClick={PlusFeladat}>
                                                        + Új feladat hozzáadása
                                                 </button>
                                          </div>
                                   </FormField>

                                   <div className="form-group">
                                          <button type="submit" className="btn btn-primary">Munka mentése</button>
                                   </div>
                                   <div className="form-group">
                                          <button type="button" onClick={() => navigate("/fooldal")}>Vissza</button>
                                   </div>
                            </form>
                     </div>
              </div>
       </>
       );
}


