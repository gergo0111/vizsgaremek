import { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer } from "../common/Toast";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../../designs/UserForm.css";

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export function NewUserAdd() {
       const [felhasznalonev, setFelhasznalonev] = useState('');
       const [email, setEmail] = useState('');
       const [jelszo, setJelszo] = useState('');
       const [nev, setNev] = useState('');
       const [munkakor, setMunkakor] = useState('');
       const [munkaora, setMunkaora] = useState(8);
       const [isAdmin, setIsAdmin] = useState(false);

       const [toasts, setToasts] = useState<Toast[]>([]);
       const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
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

              setFieldErrors({});

              const newUser = {
                     felhasznalonev,
                     email,
                     jelszo,
                     nev,
                     munkakor,
                     munkaora,
                     isAdmin,
              };

              const errors: Record<string,string> = {};
              if (!felhasznalonev.trim()) errors.felhasznalonev = 'A felhasználónév megadása kötelező.';
              if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Érvényes email cím szükséges.';
              if (!jelszo || jelszo.length < 6) errors.jelszo = 'A jelszónak legalább 6 karakter hosszúnak kell lennie.';
              if (!nev.trim()) errors.nev = 'A név megadása kötelező.';
              if (!munkakor.trim()) errors.munkakor = 'A munkakör megadása kötelező.';
              if (!Number.isFinite(munkaora) || munkaora < 0 || munkaora > 12) errors.munkaora = 'A munkaóra 0 és 12 között legyen.';

              if (Object.keys(errors).length) {
                     setFieldErrors(errors);
                     addToast('Kérlek javítsd a jelzett mezőket.', 'error');
                     return;
              }

              try {
                     const { apiPost } = await import('../../lib/api');
                     const data = await apiPost('/users', newUser);
                     console.log('Felhasználó sikeresen hozzáadva:', data);
                     addToast('Felhasználó sikeresen hozzáadva!', 'success');
                     setFieldErrors({});
                     
                     setFelhasznalonev('');
                     setEmail('');
                     setJelszo('');
                     setNev('');
                     setMunkakor('');
                     setMunkaora(8);
                     setIsAdmin(false);

                     setTimeout(() => navigate("/felhasznalok-kezelese"), 2000);
              } catch (error) {
                     const errorData = error instanceof Error ? error.message : String(error);
                     addToast(`Hiba a felhasználó hozzáadásakor: ${errorData}`, 'error');
                     console.error('Hiba:', error);
              }
       };

       return (
              <div className="user-form-page">
                     <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
                     <Container className="user-form-container-wide">
                            <Row className="justify-content-center">
                                   <Col lg={10} md={12} sm={12}>
                                          <Card className="user-form-card">
                                                 <Card.Body>
                                                        <h2 className="user-form-title">Új felhasználó</h2>
                                                        
                                                        <Form onSubmit={handleSubmit} noValidate>
                                                               <Form.Group className="form-group-custom">
                                                                      <Form.Label className="form-label-custom">Felhasználónév:</Form.Label>
                                                                      <Form.Control
                                                                             type="text"
                                                                             placeholder="Pl.: Szabolcs"
                                                                             value={felhasznalonev}
                                                                             onChange={e => setFelhasznalonev(e.target.value)}
                                                                             isInvalid={!!fieldErrors.felhasznalonev}
                                                                             className="form-control-custom"
                                                                      />
                                                                      {fieldErrors.felhasznalonev && (
                                                                             <Form.Control.Feedback type="invalid" className="d-block">
                                                                                    {fieldErrors.felhasznalonev}
                                                                             </Form.Control.Feedback>
                                                                      )}
                                                               </Form.Group>

                                                               <Form.Group className="form-group-custom">
                                                                      <Form.Label className="form-label-custom">Email:</Form.Label>
                                                                      <Form.Control
                                                                             type="email"
                                                                             placeholder="email@domain.hu"
                                                                             value={email}
                                                                             onChange={e => setEmail(e.target.value)}
                                                                             isInvalid={!!fieldErrors.email}
                                                                             className="form-control-custom"
                                                                      />
                                                                      {fieldErrors.email && (
                                                                             <Form.Control.Feedback type="invalid" className="d-block">
                                                                                    {fieldErrors.email}
                                                                             </Form.Control.Feedback>
                                                                      )}
                                                               </Form.Group>

                                                               <Form.Group className="form-group-custom">
                                                                      <Form.Label className="form-label-custom">Jelszó:</Form.Label>
                                                                      <Form.Control
                                                                             type="password"
                                                                             placeholder="Minimum 6 karakter"
                                                                             value={jelszo}
                                                                             onChange={e => setJelszo(e.target.value)}
                                                                             isInvalid={!!fieldErrors.jelszo}
                                                                             className="form-control-custom"
                                                                      />
                                                                      {fieldErrors.jelszo && (
                                                                             <Form.Control.Feedback type="invalid" className="d-block">
                                                                                    {fieldErrors.jelszo}
                                                                             </Form.Control.Feedback>
                                                                      )}
                                                               </Form.Group>

                                                               <Form.Group className="form-group-custom">
                                                                      <Form.Label className="form-label-custom">Teljes név:</Form.Label>
                                                                      <Form.Control
                                                                             type="text"
                                                                             placeholder="Pl.: Szabolcs Nagy"
                                                                             value={nev}
                                                                             onChange={e => setNev(e.target.value)}
                                                                             isInvalid={!!fieldErrors.nev}
                                                                             className="form-control-custom"
                                                                      />
                                                                      {fieldErrors.nev && (
                                                                             <Form.Control.Feedback type="invalid" className="d-block">
                                                                                    {fieldErrors.nev}
                                                                             </Form.Control.Feedback>
                                                                      )}
                                                               </Form.Group>

                                                               <Form.Group className="form-group-custom">
                                                                      <Form.Label className="form-label-custom">Munkakör:</Form.Label>
                                                                      <Form.Control
                                                                             type="text"
                                                                             placeholder="Pl.: Hegesztő"
                                                                             value={munkakor}
                                                                             onChange={e => setMunkakor(e.target.value)}
                                                                             isInvalid={!!fieldErrors.munkakor}
                                                                             className="form-control-custom"
                                                                      />
                                                                      {fieldErrors.munkakor && (
                                                                             <Form.Control.Feedback type="invalid" className="d-block">
                                                                                    {fieldErrors.munkakor}
                                                                             </Form.Control.Feedback>
                                                                      )}
                                                               </Form.Group>

                                                               <Form.Group className="form-group-custom">
                                                                      <Form.Label className="form-label-custom">
                                                                             Munkaóra: <span className="munkaora-value">{munkaora} óra</span>
                                                                      </Form.Label>
                                                                      <Form.Range
                                                                             min={0}
                                                                             max={12}
                                                                             value={munkaora}
                                                                             onChange={e => setMunkaora(Number(e.target.value))}
                                                                             className="range-input-custom"
                                                                      />
                                                                      {fieldErrors.munkaora && (
                                                                             <Form.Control.Feedback type="invalid" className="d-block">
                                                                                    {fieldErrors.munkaora}
                                                                             </Form.Control.Feedback>
                                                                      )}
                                                               </Form.Group>
                                                               <Form.Group className="form-group-custom">
                                                                      <Form.Label className="form-label-custom">Jogosultság:</Form.Label>
                                                                      <Form.Select
                                                                             value={isAdmin ? 'admin' : 'user'}
                                                                             onChange={e => setIsAdmin(e.target.value === 'admin')}
                                                                             className="form-control-custom"
                                                                      >
                                                                             <option value="user">Felhasználó</option>
                                                                             <option value="admin">Admin</option>
                                                                      </Form.Select>
                                                               </Form.Group>

                                                               <div className="button-group">
                                                                      <Button 
                                                                             className="btn-submit"
                                                                             type="submit"
                                                                      >
                                                                             Hozzáadás
                                                                      </Button>
                                                                      <Button 
                                                                             className="btn-back-secondary"
                                                                             onClick={() => navigate("/felhasznalok-kezelese")}
                                                                      >
                                                                             Vissza
                                                                      </Button>
                                                               </div>
                                                        </Form>
                                                 </Card.Body>
                                          </Card>
                                   </Col>
                            </Row>
                     </Container>
              </div>
       );
}