import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menusor } from "../Menusor";
import { apiGet, apiPost } from "../../lib/api";
import { ToastContainer } from "../common/Toast";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../../designs/WorkForm.css";

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
       const [selectedUsers, setSelectedUsers] = useState<number[]>([0]);
       const [selectedTools, setSelectedTools] = useState<number[]>([]);
       const [selectedTasks, setSelectedTasks] = useState<string[]>([""]);
       const [toasts, setToasts] = useState<Toast[]>([]);

       const [errors, setErrors] = useState<{
              nev?: string;
              selectedUsers?: string;
              kezdetiDatum?: string;
              velemenyDatum?: string;
       }>({});

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
              
              setErrors({});
              const newErrors: typeof errors = {};
              
              if (!nev || !nev.trim()) {
                     newErrors.nev = 'A munka neve kötelező!';
              }

              const selectedUserIds = selectedUsers.filter(id => id && id !== 0);
              if (selectedUserIds.length === 0) {
                     newErrors.selectedUsers = 'Legalább egy dolgozót ki kell választani!';
              }

              if (kezdetiDatum && velemenyDatum) {
                     const kezdeDate = new Date(kezdetiDatum);
                     const vegleDate = new Date(velemenyDatum);
                     if (kezdeDate > vegleDate) {
                            newErrors.velemenyDatum = 'A kezdeti dátum nem lehet később, mint a várható befejezési dátum!';
                     }
              }

              if (velemenyDatum && !kezdetiDatum) {
                     newErrors.kezdetiDatum = 'Adjon meg kezdeti dátumot, ha megad várható befejezési dátumot!';
              }

              if (Object.keys(newErrors).length > 0) {
                     setErrors(newErrors);
                     addToast('Kérjük, javítsa ki az alábbi hibákat!', 'error');
                     return;
              }

              const selectedToolIds = selectedTools.filter(id => id && id !== 0);

              const selectedTasksList = selectedTasks.filter(t => t && t.trim() !== "");

              const payload = {
                     nev,
                     leiras,
                     dolgozok: selectedUserIds,
                     eszkozok: selectedToolIds,
                     feladatok: selectedTasksList,
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
              <Container fluid className="new-work-page">
                     <Row>
                            <Col lg={10} md={12} className="mx-auto">
                                   <Card className="new-work-card">
                                          <Card.Body>
                                                 <Card.Title className="new-work-header">Új munka hozzáadása</Card.Title>
                                                 <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
                                                 
                                                 <Form onSubmit={handleSubmit}>
                                                        <Form.Group className="mb-3">
                                                               <Form.Label>Munka neve *</Form.Label>
                                                               <Form.Text className="d-block mb-2 text-muted">
                                                                      A munkafeladat egyedi nevét adjuk meg
                                                               </Form.Text>
                                                               <Form.Control
                                                                      type="text"
                                                                      value={nev}
                                                                      onChange={(e) => SetNev(e.target.value)}
                                                                      placeholder="pl. Terasz készítés kraftmarketnak"
                                                                      isInvalid={!!errors.nev}
                                                               />
                                                               <Form.Control.Feedback type="invalid">
                                                                      {errors.nev}
                                                               </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                               <Form.Label>Leírás</Form.Label>
                                                               <Form.Text className="d-block mb-2 text-muted">
                                                                      A munka részletes leírása, hogy mit kell elvégezni
                                                               </Form.Text>
                                                               <Form.Control
                                                                      type="text"
                                                                      value={leiras}
                                                                      onChange={(e) => SetLeiras(e.target.value)}
                                                                      placeholder="pl. Teljes kivitelezés"
                                                               />
                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                               <Form.Label>Dolgozó kiválasztása *</Form.Label>
                                                               {errors.selectedUsers && (
                                                                      <div className="error-message">{errors.selectedUsers}</div>
                                                               )}
                                                               <div>
                                                                      {selectedUsers.map((userId, idx) => (
                                                                             <div key={idx} className="dynamic-row">
                                                                                    <Form.Select
                                                                                           value={userId}
                                                                                           onChange={(e) => handleUserChange(idx, parseInt(e.target.value || '0', 10) || 0)}
                                                                                    >
                                                                                           <option value={0}>-- válassz --</option>
                                                                                           {users.map((user) => (
                                                                                                  <option key={user.user_id} value={user.user_id}>
                                                                                                         {user.nev}
                                                                                                  </option>
                                                                                           ))}
                                                                                    </Form.Select>
                                                                                    <Button 
                                                                                           variant="danger" 
                                                                                           size="sm"
                                                                                           onClick={() => removeUser(idx)}
                                                                                    >
                                                                                           Törlés
                                                                                    </Button>
                                                                             </div>
                                                                      ))}
                                                                      <Button 
                                                                             variant="primary" 
                                                                             size="sm"
                                                                             onClick={PlusUser}
                                                                             className="mt-2"
                                                                      >
                                                                             + Új dolgozó hozzáadása
                                                                      </Button>
                                                               </div>
                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                               <Form.Label>Eszközök kiválasztása</Form.Label>
                                                               <div>
                                                                      {selectedTools.map((toolId, idx) => (
                                                                             <div key={idx} className="dynamic-row">
                                                                                    <Form.Select
                                                                                           value={toolId}
                                                                                           onChange={(e) => handleToolChange(idx, parseInt(e.target.value || '0', 10) || 0)}
                                                                                    >
                                                                                           <option value={0}>-- válassz --</option>
                                                                                           {tools.map((tool) => (
                                                                                                  <option key={tool.eszkoz_id} value={tool.eszkoz_id}>
                                                                                                         {tool.nev}
                                                                                                  </option>
                                                                                           ))}
                                                                                    </Form.Select>
                                                                                    <Button 
                                                                                           variant="danger" 
                                                                                           size="sm"
                                                                                           onClick={() => removeTool(idx)}
                                                                                    >
                                                                                           Törlés
                                                                                    </Button>
                                                                             </div>
                                                                      ))}
                                                                      <Button 
                                                                             variant="primary" 
                                                                             size="sm"
                                                                             onClick={PlusEszkoz}
                                                                             className="mt-2"
                                                                      >
                                                                             + Új eszköz hozzáadása
                                                                      </Button>
                                                               </div>
                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                               <Form.Label>Munka kezdeti dátuma</Form.Label>
                                                               <Form.Control 
                                                                      type="date" 
                                                                      value={kezdetiDatum} 
                                                                      onChange={(e) => SetKezdetiDatum(e.target.value)}
                                                                      isInvalid={!!errors.kezdetiDatum}
                                                               />
                                                               <Form.Control.Feedback type="invalid">
                                                                      {errors.kezdetiDatum}
                                                               </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                               <Form.Label>Munka várható befejezési dátuma</Form.Label>
                                                               <Form.Control 
                                                                      type="date" 
                                                                      value={velemenyDatum} 
                                                                      onChange={(e) => SetVelemenyDatum(e.target.value)}
                                                                      isInvalid={!!errors.velemenyDatum}
                                                               />
                                                               <Form.Control.Feedback type="invalid">
                                                                      {errors.velemenyDatum}
                                                               </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                               <Form.Label>Feladatok megadása</Form.Label>
                                                               <Form.Text className="d-block mb-2 text-muted">
                                                                      Részfeladatok megadása, amelyek elvégzendők a munka során
                                                               </Form.Text>
                                                               <div>
                                                                      {selectedTasks.map((task, idx) => (
                                                                             <div key={idx} className="dynamic-row">
                                                                                    <Form.Control
                                                                                           type="text"
                                                                                           value={task}
                                                                                           onChange={(e) => handleTaskChange(idx, e.target.value)}
                                                                                           placeholder="pl. Felmérés"
                                                                                    />
                                                                                    <Button 
                                                                                           variant="danger" 
                                                                                           size="sm"
                                                                                           onClick={() => removeTask(idx)}
                                                                                    >
                                                                                           Törlés
                                                                                    </Button>
                                                                             </div>
                                                                      ))}
                                                                      <Button 
                                                                             variant="primary" 
                                                                             size="sm"
                                                                             onClick={PlusFeladat}
                                                                             className="mt-2"
                                                                      >
                                                                             + Új feladat hozzáadása
                                                                      </Button>
                                                               </div>
                                                        </Form.Group>

                                                        <Form.Group className="mt-4">
                                                               <Button 
                                                                      type="submit" 
                                                                      variant="primary"
                                                                      className="me-2"
                                                               >
                                                                      Munka mentése
                                                               </Button>
                                                               <Button 
                                                                      type="button" 
                                                                      variant="outline-primary"
                                                                      onClick={() => navigate("/fooldal")}
                                                               >
                                                                      ← Vissza
                                                               </Button>
                                                        </Form.Group>
                                                 </Form>
                                          </Card.Body>
                                   </Card>
                            </Col>
                     </Row>
              </Container>
              </>
       );
}


