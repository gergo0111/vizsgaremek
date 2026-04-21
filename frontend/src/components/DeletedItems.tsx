import { useEffect, useState } from 'react';
import { Container, Nav, Table, Button, Card, Row, Col } from 'react-bootstrap';
import { Menusor } from './Menusor';
import { apiGet, apiPatch } from '../lib/api';

type AnyRecord = Record<string, any>;

export function DeletedItems() {
  const [activeTab, setActiveTab] = useState<'users'|'munka'|'feladat'|'comment'>('users');
  const [items, setItems] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeleted();
  }, [activeTab]);

  async function fetchDeleted() {
    setLoading(true);
    setError(null);
    try {
      let path = '/users/deleted';
      if (activeTab === 'munka') path = '/munka/deleted';
      if (activeTab === 'feladat') path = '/feladatok/deleted';
      if (activeTab === 'comment') path = '/comment/deleted';

      const data = await apiGet<any[]>(path);
      setItems(data || []);
    } catch (err: any) {
      setError(err?.message || 'Hiba történt a törölt elemek lekérésekor');
    } finally {
      setLoading(false);
    }
  }

  const restore = async (id: number, entity: string) => {
    try {
      await apiPatch(`/${entity}/${id}/restore`, {});
      setItems(prev => prev.filter(i => {
        return !Object.values(i).includes(id);
      }));
    } catch (err) {
      console.error('Restore error', err);
      setError('Visszaállítás sikertelen');
    }
  };

  const renderTable = () => {
    if (loading) return <div>Betöltés…</div>;
    if (error) return <div className="text-danger">{error}</div>;
    if (items.length === 0) return <div className="text-muted">Nincsenek törölt elemek</div>;

    const keys = Object.keys(items[0]).slice(0, 6);

    return (
      <Table responsive hover>
        <thead>
          <tr>
            {keys.map(k => <th key={k}>{k}</th>)}
            <th>Akciók</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={idx}>
              {keys.map(k => <td key={k + idx}>{String(it[k])}</td>)}
              <td>
                <Button size="sm" onClick={() => {
                  let entity = activeTab === 'users' ? 'users' : activeTab === 'munka' ? 'munka' : activeTab === 'feladat' ? 'feladatok' : 'comment';
                  const id = it.user_id ?? it.munka_id ?? it.feladat_id ?? it.comment_id;
                  if (!id) return;
                  restore(id, entity);
                }}>
                  Visszaállít
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <Menusor />
      <Container className="mt-4">
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k as any)}>
                  <Nav.Item>
                    <Nav.Link eventKey="users">Felhasználók</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="munka">Munkák</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="feladat">Feladatok</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="comment">Kommentek</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                {renderTable()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DeletedItems;
