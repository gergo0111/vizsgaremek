import { useState } from "react";
import { useNavigate } from "react-router";
import { apiPost } from "../../lib/api";
import { ToastContainer } from "../common/Toast";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../../designs/UserForm.css";

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface Eszkoz {
       eszkoz_id: string;
       nev: string;
       tipus: string;
       darabszam: number;
}

export function NewToolAdd() {
       const [nev, setNev] = useState('');
       const [tipus, setTipus] = useState('');
       const [darabszam, setDarabszam] = useState(1);

       const [toasts, setToasts] = useState<Toast[]>([]);
       const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

              const formState = {
                     nev,
                     tipus,
                     darabszam
              };

              const errors: Record<string, string> = {};
              if (!nev.trim()) errors.nev = 'Az eszköz neve kötelező.';
              if (!tipus.trim()) errors.tipus = 'Az eszköz típusa kötelező.';
              if (!Number.isFinite(darabszam) || darabszam <= 0) errors.darabszam = 'A darabszám nagyobb kell, hogy legyen 0-nál.';

              if (Object.keys(errors).length) {
                     setFieldErrors(errors);
                     addToast('Kérlek javítsd a jelzett mezőket.', 'error');
                     return;
              }

              try {
                     await apiPost<Eszkoz>('/eszkozok', formState);
                     addToast('Eszköz sikeresen hozzáadva!', 'success');
                     setFieldErrors({});
                     
                     setNev('');
                     setTipus('');
                     setDarabszam(1);

                     setTimeout(() => navigate("/eszkozok"), 2000);
              } catch (error) {
                     const errorData = error instanceof Error ? error.message : String(error);
                     addToast(`Hiba az eszköz hozzáadásakor: ${errorData}`, 'error');
                     console.error('Hiba:', error);
              }
       };

       return (
              <div className="tool-form-page">
                     <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
                     <Container className="tool-form-container-wide">
                            <Row className="justify-content-center">
                                   <Col lg={10} md={12} sm={12}>
                                          <Card className="tool-form-card">
                                                 <Card.Body>
                                                        <h2 className="tool-form-title">Új eszköz</h2>
                                                        
                                                        <Form onSubmit={handleSubmit} noValidate>
                                                               <Form.Group className="form-group-custom">
                                                                      <Form.Label className="form-label-custom">Eszköz neve:</Form.Label>
                                                                      <Form.Control
                                                                             type="text"
                                                                             placeholder="Pl.: Marógép 5201"
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
                                                                      <Form.Label className="form-label-custom">Típus:</Form.Label>
                                                                      <Form.Control
                                                                             type="text"
                                                                             placeholder="Pl.: Marógép"
                                                                             value={tipus}
                                                                             onChange={e => setTipus(e.target.value)}
                                                                             isInvalid={!!fieldErrors.tipus}
                                                                             className="form-control-custom"
                                                                      />
                                                                      {fieldErrors.tipus && (
                                                                             <Form.Control.Feedback type="invalid" className="d-block">
                                                                                    {fieldErrors.tipus}
                                                                             </Form.Control.Feedback>
                                                                      )}
                                                               </Form.Group>

                                                               <Form.Group className="form-group-custom">
                                                                      <Form.Label className="form-label-custom">Darabszám:</Form.Label>
                                                                      <Form.Control
                                                                             type="number"
                                                                             min="1"
                                                                             value={darabszam}
                                                                             onChange={e => setDarabszam(Number(e.target.value))}
                                                                             isInvalid={!!fieldErrors.darabszam}
                                                                             className="form-control-custom"
                                                                      />
                                                                      {fieldErrors.darabszam && (
                                                                             <Form.Control.Feedback type="invalid" className="d-block">
                                                                                    {fieldErrors.darabszam}
                                                                             </Form.Control.Feedback>
                                                                      )}
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
                                                                             onClick={() => navigate("/eszkozok")}
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

