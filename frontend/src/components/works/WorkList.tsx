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
        getUsersNames(a).localeCompare(getUsersNames(b), "hu", { numeric: true, sensitivity: 'base' }),
      );
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    } else if (sortBy === "tool") {
      filtered.sort((a, b) =>
        getToolsNames(a).localeCompare(getToolsNames(b), "hu", { numeric: true, sensitivity: 'base' }),
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
    if (!work.munkaUsers || work.munkaUsers.length === 0) return "";
    return work.munkaUsers
      .map((mu) => mu.user?.nev || users.find((u) => u.user_id === mu.user_id)?.nev || "")
      .filter((name) => name)
      .join(", ");
  };
  const getToolsNames = (work: WorkData) => {
    if (!work.munkaEszkozok || work.munkaEszkozok.length === 0) return "";
    return work.munkaEszkozok
      .map((me) => me.eszkoz?.nev || tools.find((t) => t.eszkoz_id === me.eszkoz_id)?.nev || "")
      .filter((name) => name)
      .join(", ");
  };

  const getDateValue = (dateString?: string) =>
    dateString ? new Date(dateString).getTime() : 0;

  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorks = filteredWorks.slice(startIndex, endIndex);

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
              <Table responsive hover className="users-table work-table">
                <thead>
                  <tr>
                    <th>Munka neve</th>
                    <th>Leírás</th>
                    <th>Alkalmazott</th>
                    <th>Eszköz</th>
                    <th>Kezdete</th>
                    <th>Befejezés</th>
                    <th colSpan={3} className="text-center">Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center">
                        Betöltés...
                      </td>
                    </tr>
                  ) : filteredWorks.length > 0 ? (
                    currentWorks.map((work) => (
                      <tr key={work.munka_id} className="user-row">
                        <td className="user-name">{work.munka_neve}</td>
                        <td className="user-department">
                          {work.leiras || "-"}
                        </td>
                        <td>{getUsersNames(work) || "-"}</td>
                        <td>{getToolsNames(work) || "-"}</td>
                        <td>{work.kezdeti_datum || "-"}</td>
                        <td>{work.varhato_befejezes_datuma || "-"}</td>
                        <td className="action-cell">
                          <button
                            className="action-btn edit-btn"
                            aria-label={`Szerkesztés ${work.munka_neve}`}
                            onClick={() =>
                              navigate(`/munka-modositas/${work.munka_id}`)
                            }
                            title="Szerkesztés"
                          >
                            ✏️
                          </button>
                        </td>
                        <td className="action-cell">
                          <button
                            className="action-btn delete-btn"
                            aria-label={`Törlés ${work.munka_neve}`}
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Biztosan törlöd ${work.munka_neve} munkát?`
                                )
                              ) {
                                deleteWork(work.munka_id);
                              }
                            }}
                            title="Törlés"
                          >
                            ❌
                          </button>
                        </td>
                        <td className="action-cell">
                          {isAdmin() ? (
                            <button
                              className={`action-btn ${work.isActive ? 'close-btn' : 'open-btn'}`}
                              aria-label={`${work.isActive ? 'Lezárás' : 'Megnyitás'} ${work.munka_neve}`}
                              onClick={async () => {
                                const newActive = !work.isActive;
                                try {
                                  await apiPatch(`/munka/${work.munka_id}`, { isActive: newActive });
                                  setWorks((prev) => prev.map((w) => w.munka_id === work.munka_id ? { ...w, isActive: newActive } : w));
                                } catch (err) {
                                  console.error('Hiba a munka lezárásakor:', err);
                                  alert('Hiba történt a művelet végrehajtásakor');
                                }
                              }}
                              title={work.isActive ? 'Munka lezárása' : 'Munka megnyitása'}
                            >
                              {work.isActive ? '🔒' : '🔓'}
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center text-muted">
                        Nincs találat
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
            <div className="pagination-controls">
              <button 
                className="pagination-btn"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                title="Előző oldal"
              >
                ← Előző
              </button>
              <span className="pagination-info">
                Oldal {currentPage} / {totalPages || 1}
              </span>
              <button 
                className="pagination-btn"
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Következő oldal"
              >
                Következő →
              </button>
            </div>
          </Col>

          <Col md={3} className="users-sidebar">
            <Card className="search-filter-card">
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
