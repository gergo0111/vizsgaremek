import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiPatch, apiGet } from "../../lib/api";
import { ToastContainer } from "../common/Toast";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../../designs/ToolForm.css";

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

export function PatchTools() {
       const [nev, setNev] = useState('');
       const [tipus, setTipus] = useState('');
       const [darabszam, setDarabszam] = useState(1);

       const [toasts, setToasts] = useState<Toast[]>([]);
       const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
                            setNev(data.nev);
                            setTipus(data.tipus);
                            setDarabszam(data.darabszam);
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
                     await apiPatch<Eszkoz>(`/eszkozok/${eszkoz_id}`, formState);
                     addToast('Eszköz sikeresen módosítva!', 'success');
                     setTimeout(() => navigate('/eszkozok'), 1500);
              } catch (error) {
                     const errorMsg = error instanceof Error ? error.message : String(error);
                     addToast(`Hiba a módosítás közben: ${errorMsg}`, 'error');
                     console.error('Hiba történt az eszköz módosításakor:', error);
              }
       };

       if (loading) {
              return (
                     <div className="tool-form-page">
                            <Container className="tool-form-container-wide">
                                   <Row className="justify-content-center">
                                          <Col lg={10} md={12} sm={12}>
                                                 <Card className="tool-form-card">
                                                        <Card.Body style={{ textAlign: 'center' }}>
                                                               <p>Betöltés...</p>
                                                        </Card.Body>
                                                 </Card>
                                          </Col>
                                   </Row>
                            </Container>
                     </div>
              );
       }

       return (
              <div className="tool-form-page">
                     <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
                     <Container className="tool-form-container-wide">
                            <Row className="justify-content-center">
                                   <Col lg={10} md={12} sm={12}>
                                          <Card className="tool-form-card">
                                                 <Card.Body>
                                                        <h2 className="tool-form-title">Eszköz módosítása</h2>
                                                        
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
                                                                             Mentés
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


