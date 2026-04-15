import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiGet, apiPatch } from "../../lib/api";
import "../../designs/UserForm.css";
import { ToastContainer } from "../common/Toast";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface User {
       user_id: number;
       felhasznalonev: string;
       email: string;
       nev: string;
       munkakor: string;
       munkaora: number;
       isActice: boolean;
       isAdmin: boolean;
}

export function UserPatch() {
        const navigate = useNavigate();
        const { user_id } = useParams();
        const [felhasznalonev, setFelhasznalonev] = useState('');
        const [email, setEmail] = useState('');
        const [nev, setNev] = useState('');
        const [munkakor, setMunkakor] = useState('');
        const [munkaora, setMunkaora] = useState(0);
        const [isAdmin, setIsAdmin] = useState(false);
        
        const [loading, setLoading] = useState<boolean>(true);
        const [toasts, setToasts] = useState<Toast[]>([]);
        const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

        const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
              const id = Date.now().toString();
              setToasts(prev => [...prev, { id, message, type }]);
        };

        const removeToast = (id: string) => {
              setToasts(prev => prev.filter(t => t.id !== id));
        };

        useEffect(() => {
            const id = Number(user_id);

            const fetchUser = async () => {
                try {
                    const data = await apiGet<User>(`/users/${id}`);
                    setFelhasznalonev(data.felhasznalonev);
                    setEmail(data.email);
                    setNev(data.nev);
                    setMunkakor(data.munkakor);
                    setMunkaora(data.munkaora);
                    setIsAdmin(data.isAdmin);
                } catch (err) {
                    console.error('Hiba:', err);
                    addToast('Felhasználó adatainak betöltése sikertelen.', 'error');
                } finally {
                    setLoading(false);
                }
            };

            fetchUser();
        }, [user_id]);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            setFieldErrors({});

            const errors: Record<string,string> = {};
            if (!felhasznalonev.trim()) errors.felhasznalonev = 'A felhasználónév megadása kötelező.';
            if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Érvényes email cím szükséges.';
            if (!nev.trim()) errors.nev = 'A név megadása kötelező.';
            if (!munkakor.trim()) errors.munkakor = 'A munkakör megadása kötelező.';
            if (!Number.isFinite(munkaora) || munkaora < 0 || munkaora > 12) errors.munkaora = 'A munkaóra 0 és 12 között legyen.';

            if (Object.keys(errors).length) {
                setFieldErrors(errors);
                addToast('Kérlek javítsd a jelzett mezőket.', 'error');
                return;
            }

            const updatedUser = {
                felhasznalonev,
                email,
                nev,
                munkakor,
                munkaora,
                isAdmin,
            };

            try {
                await apiPatch(`/users/${user_id}`, updatedUser);
                addToast('Felhasználó sikeresen módosítva!', 'success');
                setTimeout(() => navigate('/felhasznalok-kezelese'), 1500);
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                addToast(`Hiba a módosítás közben: ${errorMsg}`, 'error');
                console.error('Hiba:', err);
            }
        };

        if (loading) {
            return (
                <div className="user-form-page">
                    <Container className="user-form-container-wide">
                        <Row className="justify-content-center">
                            <Col lg={10} md={12} sm={12}>
                                <Card className="user-form-card">
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
            <div className="user-form-page">
                <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
                <Container className="user-form-container-wide">
                    <Row className="justify-content-center">
                        <Col lg={10} md={12} sm={12}>
                            <Card className="user-form-card">
                                <Card.Body>
                                    <h2 className="user-form-title">Felhasználó módosítása</h2>
                                    
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
                                                Módosítás
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
