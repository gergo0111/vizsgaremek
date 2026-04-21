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
  Nav,
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
  const [deletedWorks, setDeletedWorks] = useState<WorkData[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<WorkData[]>([]);
  const [filteredDeletedWorks, setFilteredDeletedWorks] = useState<WorkData[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, SetUsers] = useState<UserData[]>([]);
  const [tools, SetTools] = useState<EszkozData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
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

    const fetchDeletedWorks = async () => {
      try {
        const data = await apiGet<WorkData[]>("/munka/deleted");
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
        setDeletedWorks(normalized);
      } catch (error) {
        console.error("Hiba a törölt munkák betöltésénél:", error);
      }
    };

    fetchWorks();
    fetchDeletedWorks();
  }, []);

  useEffect(() => {
    let filtered = works.filter(
      (work) =>
        work.munka_neve.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.leiras?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortBy === "name") {
      filtered.sort((a, b) =>
        a.munka_neve.localeCompare(b.munka_neve, "hu", {
          numeric: true,
          sensitivity: "base",
        }),
      );
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    } else if (sortBy === "user") {
      filtered.sort((a, b) =>
        getUsersNames(a)
          .join(", ")
          .localeCompare(getUsersNames(b).join(", "), "hu", {
            numeric: true,
            sensitivity: "base",
          }),
      );
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    } else if (sortBy === "tool") {
      filtered.sort((a, b) =>
        getToolsNames(a)
          .join(", ")
          .localeCompare(getToolsNames(b).join(", "), "hu", {
            numeric: true,
            sensitivity: "base",
          }),
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
    let filtered = deletedWorks.filter(
      (work) =>
        work.munka_neve.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.leiras?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortBy === "name") {
      filtered.sort((a, b) =>
        a.munka_neve.localeCompare(b.munka_neve, "hu", {
          numeric: true,
          sensitivity: "base",
        }),
      );
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    } else if (sortBy === "user") {
      filtered.sort((a, b) =>
        getUsersNames(a)
          .join(", ")
          .localeCompare(getUsersNames(b).join(", "), "hu", {
            numeric: true,
            sensitivity: "base",
          }),
      );
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    } else if (sortBy === "tool") {
      filtered.sort((a, b) =>
        getToolsNames(a)
          .join(", ")
          .localeCompare(getToolsNames(b).join(", "), "hu", {
            numeric: true,
            sensitivity: "base",
          }),
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

    setFilteredDeletedWorks(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, tools, deletedWorks]);

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

  const deleteWork = async (workId: number, workName: string) => {
    if (!Number.isFinite(workId) || workId <= 0) {
      console.warn("Invalid workId, skip delete:", workId);
      return;
    }
    if (!window.confirm(`Biztosan szeretnéd törölni a "${workName}" munkát?`)) {
      return;
    }
    try {
      await apiDelete(`/munka/${workId}`);
      const data = await apiGet<WorkData[]>("/munka");
      const normalized = data.map((work) => ({
        ...work,
        kezdeti_datum: work.kezdeti_datum
          ? new Date(work.kezdeti_datum).toISOString().split("T")[0]
          : "",
        varhato_befejezes_datuma: work.varhato_befejezes_datuma
          ? new Date(work.varhato_befejezes_datuma).toISOString().split("T")[0]
          : "",
      }));
      setWorks(normalized);
      const deletedData = await apiGet<WorkData[]>("/munka/deleted");
      const normalizedDeleted = deletedData.map((work) => ({
        ...work,
        kezdeti_datum: work.kezdeti_datum
          ? new Date(work.kezdeti_datum).toISOString().split("T")[0]
          : "",
        varhato_befejezes_datuma: work.varhato_befejezes_datuma
          ? new Date(work.varhato_befejezes_datuma).toISOString().split("T")[0]
          : "",
      }));
      setDeletedWorks(normalizedDeleted);
    } catch (error) {
      console.error("Hiba:", error);
      alert("Hiba a munka törlésénél");
    }
  };

  const restoreWork = async (workId: number) => {
    if (!Number.isFinite(workId) || workId <= 0) {
      console.warn("Invalid workId, skip restore:", workId);
      return;
    }
    try {
      await apiPatch(`/munka/${workId}/restore`, {});
      const data = await apiGet<WorkData[]>("/munka");
      const normalized = data.map((work) => ({
        ...work,
        kezdeti_datum: work.kezdeti_datum
          ? new Date(work.kezdeti_datum).toISOString().split("T")[0]
          : "",
        varhato_befejezes_datuma: work.varhato_befejezes_datuma
          ? new Date(work.varhato_befejezes_datuma).toISOString().split("T")[0]
          : "",
      }));
      setWorks(normalized);
      const deletedData = await apiGet<WorkData[]>("/munka/deleted");
      const normalizedDeleted = deletedData.map((work) => ({
        ...work,
        kezdeti_datum: work.kezdeti_datum
          ? new Date(work.kezdeti_datum).toISOString().split("T")[0]
          : "",
        varhato_befejezes_datuma: work.varhato_befejezes_datuma
          ? new Date(work.varhato_befejezes_datuma).toISOString().split("T")[0]
          : "",
      }));
      setDeletedWorks(normalizedDeleted);
    } catch (error) {
      console.error("Hiba a visszaállításnál:", error);
      alert("Hiba a munka visszaállításánál");
    }
  };

  const getUsersNames = (work: WorkData) => {
    if (!work.munkaUsers || work.munkaUsers.length === 0) return [];
    return work.munkaUsers
      .map(
        (mu) =>
          mu.user?.nev ||
          users.find((u) => u.user_id === mu.user_id)?.nev ||
          "",
      )
      .filter((name) => name);
  };
  const getToolsNames = (work: WorkData) => {
    if (!work.munkaEszkozok || work.munkaEszkozok.length === 0) return [];
    return work.munkaEszkozok
      .map(
        (me) =>
          me.eszkoz?.nev ||
          tools.find((t) => t.eszkoz_id === me.eszkoz_id)?.nev ||
          "",
      )
      .filter((name) => name);
  };

  const getDateValue = (dateString?: string) =>
    dateString ? new Date(dateString).getTime() : 0;

  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorks = filteredWorks.slice(startIndex, endIndex);

  const totalDeletedPages = Math.ceil(
    filteredDeletedWorks.length / itemsPerPage,
  );
  const deletedStartIndex = (currentPage - 1) * itemsPerPage;
  const deletedEndIndex = deletedStartIndex + itemsPerPage;
  const currentDeletedWorks = filteredDeletedWorks.slice(
    deletedStartIndex,
    deletedEndIndex,
  );

  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const goToNextPage = () => {
    const currentTabTotal =
      activeTab === "active" ? totalPages : totalDeletedPages;
    if (currentPage < currentTabTotal) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentTabTotal =
    activeTab === "active" ? totalPages : totalDeletedPages;

  return (
    <>
      <Menusor />
      <Container fluid className="users-list-container">
        <Row className="users-header align-items-center mb-3">
          <Col xs={12} md={6} className="mb-2 mb-md-0">
            <h2 className="m-0">Munkák kezelése</h2>
          </Col>
          <Col xs={12} md={6} className="text-md-end">
            <div className="d-flex flex-column flex-md-row justify-content-md-end gap-2">
              <Button className="btn-new-user" onClick={() => navigate("/uj-munka")}>+ Új munka</Button>
              <Button className="btn-back" onClick={() => navigate("/fooldal")}>← Vissza</Button>
            </div>
          </Col>
        </Row>

        <Row className="users-content">
          <Col xs={12} md={3} className="users-sidebar order-1 order-md-2 mb-3 mb-md-0">
            <Card className="search-filter-card p-3 sidebar-card">
              <Card.Body className="p-0">
                <h5 className="mb-3">Keresés és szűrés</h5>

                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Keresés név alapján..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <InputGroup.Text>🔍</InputGroup.Text>
                </InputGroup>

                <div className="filter-section mb-3">
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
                          | "none",
                      );
                      setSortOrder("asc");
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
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className={`sort-order-btn btn btn-outline-secondary ${sortOrder === "asc" ? "active" : ""}`}
                      onClick={() => setSortOrder("asc")}
                    >
                      ▲ Növekvő
                    </button>
                    <button
                      className={`sort-order-btn btn btn-outline-secondary ${sortOrder === "desc" ? "active" : ""}`}
                      onClick={() => setSortOrder("desc")}
                    >
                      ▼ Csökkenő
                    </button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Main content */}
          <Col xs={12} md={9} className="users-table-column order-2 order-md-1">
            <Nav fill variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link
                  eventKey="active"
                  active={activeTab === "active"}
                  onClick={() => {
                    setActiveTab("active");
                    setCurrentPage(1);
                  }}
                >
                  Aktív munkák
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="deleted"
                  active={activeTab === "deleted"}
                  onClick={() => {
                    setActiveTab("deleted");
                    setCurrentPage(1);
                  }}
                >
                  Törölt munkák
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Card className="users-table-card work-list-card mb-3">
              {/* Desktop table */}
              <div className="d-none d-md-block">
                <Table responsive hover className="users-table work-table mb-0" style={{ tableLayout: "auto" }}>
                  <thead>
                    <tr>
                      <th>Munka neve</th>
                      <th>Leírás</th>
                      <th>Alkalmazott</th>
                      <th>Eszköz</th>
                      <th>Kezdete</th>
                      <th>Befejezés</th>
                      <th>Műveletek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center">Betöltés...</td>
                      </tr>
                    ) : activeTab === "active" && currentWorks.length > 0 ? (
                      currentWorks.map((work) => (
                        <tr key={work.munka_id} className="user-row">
                          <td className="user-name">
                            {work.munka_neve}
                            <Badge bg={work.isActive ? "success" : "danger"} className="ms-2" style={{ fontSize: '0.75rem' }}>{work.isActive ? "Folyamatban" : "Lezárva"}</Badge>
                          </td>
                          <td className="user-department">
                            <div className={expandedRows[work.munka_id] ? "description-expanded" : "description-truncated"}>{work.leiras || "-"}</div>
                            {work.leiras && work.leiras.length > 120 && (
                              <button className="toggle-desc-btn" onClick={() => toggleExpand(work.munka_id)} aria-label={expandedRows[work.munka_id] ? "Rejtés" : "Teljes leírás megtekintése"}>{expandedRows[work.munka_id] ? "Kevesebb" : "Tovább..."}</button>
                            )}
                          </td>
                          <td>
                            <div className="chip-wrap">
                              {getUsersNames(work).length === 0 ? <span className="text-muted">-</span> : getUsersNames(work).map((n, i) => (
                                <Badge key={i} bg="light" text="dark" className="chip">{n}</Badge>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="chip-wrap">
                              {getToolsNames(work).length === 0 ? <span className="text-muted">-</span> : getToolsNames(work).map((t, i) => (
                                <Badge key={i} bg="light" text="dark" className="chip">{t}</Badge>
                              ))}
                            </div>
                          </td>
                          <td>{work.kezdeti_datum || "-"}</td>
                          <td>{work.varhato_befejezes_datuma || "-"}</td>
                          <td className="action-cell">
                            <div className="actions-row">
                              <Button variant="outline-primary" size="sm" onClick={() => navigate(`/munka-modositas/${work.munka_id}`)}>✏️</Button>
                              <Button variant="outline-danger" size="sm" onClick={() => deleteWork(work.munka_id, work.munka_neve)}>❌</Button>
                              {isAdmin() ? (
                                <Button variant={work.isActive ? "outline-secondary" : "outline-success"} size="sm" onClick={() => {
                                  const newActive = !work.isActive;
                                  apiPatch(`/munka/${work.munka_id}`, { isActive: newActive })
                                    .then(() => setWorks((prev) => prev.map((w) => w.munka_id === work.munka_id ? { ...w, isActive: newActive } : w)))
                                    .catch((err) => { console.error(err); alert("Hiba történt"); });
                                }}>{work.isActive ? "🔓" : "🔒"}</Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : activeTab === "deleted" && currentDeletedWorks.length > 0 ? (
                      currentDeletedWorks.map((work) => (
                        <tr key={work.munka_id} className="user-row">
                          <td className="user-name">
                            {work.munka_neve}
                            <Badge bg={work.isActive ? "success" : "danger"} className="ms-2" style={{ fontSize: '0.75rem' }}>{work.isActive ? "Nyitott" : "Lezárva"}</Badge>
                          </td>
                          <td className="user-department">
                            <div className={expandedRows[work.munka_id] ? "description-expanded" : "description-truncated"}>{work.leiras || "-"}</div>
                            {work.leiras && work.leiras.length > 120 && (
                              <button className="toggle-desc-btn" onClick={() => toggleExpand(work.munka_id)} aria-label={expandedRows[work.munka_id] ? "Rejtés" : "Teljes leírás megtekintése"}>{expandedRows[work.munka_id] ? "Kevesebb" : "Tovább..."}</button>
                            )}
                          </td>
                          <td>
                            <div className="chip-wrap">
                              {getUsersNames(work).length === 0 ? <span className="text-muted">-</span> : getUsersNames(work).map((n, i) => (
                                <Badge key={i} bg="light" text="dark" className="chip">{n}</Badge>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="chip-wrap">
                              {getToolsNames(work).length === 0 ? <span className="text-muted">-</span> : getToolsNames(work).map((t, i) => (
                                <Badge key={i} bg="light" text="dark" className="chip">{t}</Badge>
                              ))}
                            </div>
                          </td>
                          <td>{work.kezdeti_datum || "-"}</td>
                          <td>{work.varhato_befejezes_datuma || "-"}</td>
                          <td className="action-cell text-center">
                            <Button variant="outline-success" size="sm" onClick={() => { if (window.confirm(`Biztosan visszaállítod ${work.munka_neve} munkát?`)) restoreWork(work.munka_id); }}>↻ Visszaállítás</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center text-muted">Nincs találat</td>
                      </tr>
                    )}
                    {activeTab === "active" && currentWorks.length < itemsPerPage && !loading && Array.from({ length: itemsPerPage - currentWorks.length }).map((_, i) => (
                      <tr key={`empty-${i}`} className="user-row empty-row">
                        <td colSpan={7}>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-block d-md-none">
                {loading ? (
                  <div className="text-center p-3">Betöltés...</div>
                ) : activeTab === "active" && currentWorks.length > 0 ? (
                  currentWorks.map((work) => (
                    <Card key={work.munka_id} className="mb-3">
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{work.munka_neve} <Badge bg={work.isActive ? "success" : "danger"} className="ms-2" style={{ fontSize: '0.65rem' }}>{work.isActive ? "Folyamatban" : "Lezárva"}</Badge></h6>
                            <div className="text-muted small mb-2">{work.leiras ? (work.leiras.length > 120 ? `${work.leiras.slice(0, 120)}...` : work.leiras) : "-"}</div>
                            <div className="mb-2">
                              {getUsersNames(work).map((n, i) => <Badge key={i} bg="light" text="dark" className="chip me-1">{n}</Badge>)}
                            </div>
                            <div>
                              {getToolsNames(work).map((t, i) => <Badge key={i} bg="light" text="dark" className="chip me-1">{t}</Badge>)}
                            </div>
                          </div>
                          <div className="d-flex flex-column ms-3">
                            <Button variant="outline-primary" size="sm" className="mb-2" onClick={() => navigate(`/munka-modositas/${work.munka_id}`)}>✏️</Button>
                            <Button variant="outline-danger" size="sm" className="mb-2" onClick={() => deleteWork(work.munka_id, work.munka_neve)}>❌</Button>
                            {isAdmin() ? <Button variant={work.isActive ? "outline-secondary" : "outline-success"} size="sm" onClick={() => { const newActive = !work.isActive; apiPatch(`/munka/${work.munka_id}`, { isActive: newActive }).then(() => setWorks((prev) => prev.map((w) => w.munka_id === work.munka_id ? { ...w, isActive: newActive } : w))).catch((err) => { console.error(err); alert("Hiba történt"); }); }}>{work.isActive ? "🔓" : "🔒"}</Button> : null}
                          </div>
                        </div>
                        <div className="mt-3 small text-muted">Kezdete: {work.kezdeti_datum || "-"} • Befejezés: {work.varhato_befejezes_datuma || "-"}</div>
                      </Card.Body>
                    </Card>
                  ))
                ) : activeTab === "deleted" && currentDeletedWorks.length > 0 ? (
                  currentDeletedWorks.map((work) => (
                    <Card key={work.munka_id} className="mb-3">
                      <Card.Body className="p-3 d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{work.munka_neve} <Badge bg={work.isActive ? "success" : "danger"} className="ms-2" style={{ fontSize: '0.65rem' }}>{work.isActive ? "Nyitott" : "Lezárva"}</Badge></h6>
                          <div className="text-muted small">{work.leiras ? (work.leiras.length > 120 ? `${work.leiras.slice(0, 120)}...` : work.leiras) : "-"}</div>
                        </div>
                        <div>
                          <Button variant="outline-success" size="sm" onClick={() => { if (window.confirm(`Biztosan visszaállítod ${work.munka_neve} munkát?`)) restoreWork(work.munka_id); }}>↻</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted p-3">Nincs találat</div>
                )}
              </div>
            </Card>

            <div className="pagination-controls d-flex justify-content-between align-items-center">
              <Button variant="primary" onClick={goToPrevPage} disabled={currentPage === 1} title="Előző oldal">← Előző</Button>
              <span className="pagination-info">Oldal {currentPage} / {currentTabTotal || 1}</span>
              <Button variant="primary" onClick={goToNextPage} disabled={currentPage === currentTabTotal || currentTabTotal === 0} title="Következő oldal">Következő →</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default WorkList;
