
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menusor } from "../Menusor";
import { apiGet } from "../../lib/api";
import { apiDelete } from "../../lib/api";
import { apiPatch } from "../../lib/api";
import { isAdmin } from "../../lib/auth";
import {
  Container,
  Col,
  Form,
  InputGroup,
  Button,
  Card,
  Row,
  Table,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../users/UsersList.css";

interface MunkaUser {
  munka_id: number;
  user_id: number;
  user?: UserData;
}

interface MunkaEszkoz {
  munka_id: number;
  eszkoz_id: number;
  eszkoz?: EszkozData;
}

interface WorkData {
  munka_id: number;
  munka_neve: string;
  leiras?: string;
  kezdeti_datum?: string;
  varhato_befejezes_datuma?: string;
  isActive?: boolean;
  munkaUsers?: MunkaUser[];
  munkaEszkozok?: MunkaEszkoz[];
  feladat?: Array<{ feladat_id: number; leiras: string }>;
}

interface UserData {
  user_id: number;
  nev: string;
}

interface EszkozData {
  eszkoz_id: number;
  nev: string;
}

export function WorkList() {
  const [works, setWorks] = useState<WorkData[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<WorkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, SetUsers] = useState<UserData[]>([]);
  const [tools, SetTools] = useState<EszkozData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<
    "name" | "user" | "tool" | "date" | "none"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const data = await apiGet<WorkData[]>("/munka");
        const normalized = data.map((work) => ({
          ...work,
          kezdeti_datum: work.kezdeti_datum
            ? new Date(work.kezdeti_datum).toISOString().split("T")[0]
            : "",
          varhato_befejezes_datuma: work.varhato_befejezes_datuma
            ? new Date(work.varhato_befejezes_datuma)
                .toISOString()
                .split("T")[0]
            : "",
        }));
        setWorks(normalized);
      } catch (error) {
        console.error("Hiba:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  useEffect(() => {
    let filtered = works.filter(
      (work) =>
        work.munka_neve.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.leiras?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.munka_neve.localeCompare(b.munka_neve, "hu", { numeric: true, sensitivity: 'base' }));
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    } else if (sortBy === "user") {
      filtered.sort((a, b) =>
        getUsersNames(a).join(', ').localeCompare(getUsersNames(b).join(', '), "hu", { numeric: true, sensitivity: 'base' }),
      );
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    } else if (sortBy === "tool") {
      filtered.sort((a, b) =>
        getToolsNames(a).join(', ').localeCompare(getToolsNames(b).join(', '), "hu", { numeric: true, sensitivity: 'base' }),
      );
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    } else if (sortBy === "date") {
      filtered.sort(
        (a, b) => getDateValue(a.kezdeti_datum) - getDateValue(b.kezdeti_datum),
      );
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    }

    setFilteredWorks(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, tools, works]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet<UserData[]>("/users");
        SetUsers(data);
      } catch (error) {
        console.error("Hiba:", error);
      }
    };

    const fetchTools = async () => {
      try {
        const data = await apiGet<EszkozData[]>("/eszkozok");
        SetTools(data);
      } catch (error) {
        console.error("Hiba:", error);
      }
    };

    fetchUsers();
    fetchTools();
  }, []);

  const deleteWork = async (workId: number) => {
    if (!Number.isFinite(workId) || workId <= 0) {
      console.warn("Invalid workId, skip delete:", workId);
      return;
    }
    try {
      await apiDelete(`/munka/${workId}`);
      setWorks((prev) => prev.filter((work) => work.munka_id !== workId));
    } catch (error) {
      console.error("Hiba:", error);
    }
  };

  const getUsersNames = (work: WorkData) => {
    if (!work.munkaUsers || work.munkaUsers.length === 0) return [];
    return work.munkaUsers
      .map((mu) => mu.user?.nev || users.find((u) => u.user_id === mu.user_id)?.nev || "")
      .filter((name) => name);
  };
  const getToolsNames = (work: WorkData) => {
    if (!work.munkaEszkozok || work.munkaEszkozok.length === 0) return [];
    return work.munkaEszkozok
      .map((me) => me.eszkoz?.nev || tools.find((t) => t.eszkoz_id === me.eszkoz_id)?.nev || "")
      .filter((name) => name);
  };

  const getDateValue = (dateString?: string) =>
    dateString ? new Date(dateString).getTime() : 0;

  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorks = filteredWorks.slice(startIndex, endIndex);

  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Menusor />
      <Container fluid className="users-list-container">
        <Row className="users-header">
          <Col md={6}>
            <h2>Munkák kezelése</h2>
          </Col>
          <Col md={6} className="text-end">
            <Button 
              className="btn-new-user"
              onClick={() => navigate('/uj-munka')}
            >
              + Új munka
            </Button>
            <Button 
              className="btn-back"
              onClick={() => navigate('/fooldal')}
            >
              ← Vissza
            </Button>
          </Col>
        </Row>

        <Row className="users-content">
          <Col md={9} className="users-table-column">
            <Card className="users-table-card work-list-card">
              <Table responsive hover className="users-table work-table" style={{ tableLayout: 'auto' }}>
                <thead>
                  <tr>
                    <th>Munka neve</th>
                    <th>Leírás</th>
                    <th>Alkalmazott</th>
                    <th>Eszköz</th>
                    <th>Kezdete</th>
                    <th>Befejezés</th>
                    <th className="text-center">Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center">
                        Betöltés...
                      </td>
                    </tr>
                  ) : filteredWorks.length > 0 ? (
                    currentWorks.map((work) => (
                      <tr key={work.munka_id} className="user-row">
                        <td className="user-name">{work.munka_neve}</td>
                        <td className="user-department">
                          <div className={expandedRows[work.munka_id] ? 'description-expanded' : 'description-truncated'}>
                            {work.leiras || "-"}
                          </div>
                          {work.leiras && work.leiras.length > 120 && (
                            <button
                              className="toggle-desc-btn"
                              onClick={() => toggleExpand(work.munka_id)}
                              aria-label={expandedRows[work.munka_id] ? 'Rejtés' : 'Teljes leírás megtekintése'}
                            >
                              {expandedRows[work.munka_id] ? 'Kevesebb' : 'Tovább...'}
                            </button>
                          )}
                        </td>
                        <td>
                          <div className="chip-wrap">
                            {getUsersNames(work).length === 0 ? (
                              <span className="text-muted">-</span>
                            ) : (
                              getUsersNames(work).map((n, i) => (
                                <Badge key={i} bg="light" text="dark" className="chip">
                                  {n}
                                </Badge>
                              ))
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="chip-wrap">
                            {getToolsNames(work).length === 0 ? (
                              <span className="text-muted">-</span>
                            ) : (
                              getToolsNames(work).map((t, i) => (
                                <Badge key={i} bg="light" text="dark" className="chip">
                                  {t}
                                </Badge>
                              ))
                            )}
                          </div>
                        </td>
                        <td>{work.kezdeti_datum || "-"}</td>
                        <td>{work.varhato_befejezes_datuma || "-"}</td>
                        <td className="action-cell">
                          <div className="actions-row">
                            <Button variant="outline-primary" size="sm" onClick={() => navigate(`/munka-modositas/${work.munka_id}`)}>✏️</Button>
                            <Button variant="outline-danger" size="sm" onClick={() => deleteWork(work.munka_id)}>❌</Button>
                            {isAdmin() ? (
                              <Button variant={work.isActive ? 'outline-secondary' : 'outline-success'} size="sm" onClick={() => { const newActive = !work.isActive; apiPatch(`/munka/${work.munka_id}`, { isActive: newActive }).then(() => setWorks((prev) => prev.map((w) => w.munka_id === work.munka_id ? { ...w, isActive: newActive } : w))).catch((err) => { console.error(err); alert('Hiba történt'); }); }}>
                                {work.isActive ? '🔒' : '🔓'}
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-muted">
                        Nincs találat
                      </td>
                    </tr>
                  )}
                  {currentWorks.length < itemsPerPage && !loading && Array.from({ length: itemsPerPage - currentWorks.length }).map((_, i) => (
                    <tr key={`empty-${i}`} className="user-row empty-row">
                      <td colSpan={7}>&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
            <div className="pagination-controls">
              <Button 
                variant="primary"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                title="Előző oldal"
              >
                ← Előző
              </Button>
              <span className="pagination-info">
                Oldal {currentPage} / {totalPages || 1}
              </span>
              <Button 
                variant="primary"
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Következő oldal"
              >
                Következő →
              </Button>
            </div>
          </Col>

          <Col md={3} className="users-sidebar">
            <Card className="search-filter-card sidebar-card">
              <Card.Body>
                <h5>Keresés és szűrés</h5>

                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Keresés név alapján..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <InputGroup.Text>🔍</InputGroup.Text>
                </InputGroup>

                <div className="filter-section">
                  <h6>Rendezés módja</h6>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(
                        e.target.value as
                          | "name"
                          | "user"
                          | "tool"
                          | "date"
                          | "none"
                      );
                      setSortOrder('asc');
                    }}
                    className="sort-select"
                  >
                    <option value="name">Munka neve</option>
                    <option value="user">Alkalmazott</option>
                    <option value="tool">Eszköz</option>
                    <option value="date">Dátum</option>
                  </Form.Select>
                </div>

                <div className="filter-section">
                  <h6>Rendezési sorrend</h6>
                  <div className="sort-order-buttons">
                    <button
                      className={`sort-order-btn ${sortOrder === "asc" ? "active" : ""}`}
                      onClick={() => setSortOrder("asc")}
                    >
                      ▲ Növekvő
                    </button>
                    <button
                      className={`sort-order-btn ${sortOrder === "desc" ? "active" : ""}`}
                      onClick={() => setSortOrder("desc")}
                    >
                      ▼ Csökkenő
                    </button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default WorkList;
