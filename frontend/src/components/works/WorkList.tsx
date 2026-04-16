import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menusor } from "../Menusor";
import { apiGet } from "../../lib/api";
import { apiDelete } from "../../lib/api";
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

interface WorkData {
  munka_id: number;
  munka_neve: string;
  leiras?: string;
  kezdeti_datum?: string;
  varhato_befejezes_datuma?: string;
  user_id?: number;
  eszkoz_id?: number;
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
      filtered.sort((a, b) => a.munka_neve.localeCompare(b.munka_neve, "hu"));
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    } else if (sortBy === "user") {
      filtered.sort((a, b) =>
        getUserName(a.user_id).localeCompare(getUserName(b.user_id), "hu"),
      );
      if (sortOrder === "desc") {
        filtered.reverse();
      }
    } else if (sortBy === "tool") {
      filtered.sort((a, b) =>
        getToolName(a.eszkoz_id).localeCompare(getToolName(b.eszkoz_id), "hu"),
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

  const getUserName = (userId?: number) =>
    users.find((user) => user.user_id === userId)?.nev ?? "";

  const getToolName = (eszkozId?: number) =>
    tools.find((tool) => tool.eszkoz_id === eszkozId)?.nev ?? "";

  const getDateValue = (dateString?: string) =>
    dateString ? new Date(dateString).getTime() : 0;

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
            <Card className="users-table-card">
              <Table responsive hover className="users-table">
                <thead>
                  <tr>
                    <th>Munka neve</th>
                    <th>Leírás</th>
                    <th>Alkalmazott</th>
                    <th>Eszköz</th>
                    <th>Kezdete</th>
                    <th>Befejezés</th>
                    <th colSpan={2} className="text-center">Műveletek</th>
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
                    filteredWorks.map((work) => (
                      <tr key={work.munka_id} className="user-row">
                        <td className="user-name">{work.munka_neve}</td>
                        <td className="user-department">
                          {work.leiras || "-"}
                        </td>
                        <td>{getUserName(work.user_id) || "-"}</td>
                        <td>{getToolName(work.eszkoz_id) || "-"}</td>
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
                </InputGroup>

                <Form.Group className="mb-3">
                  <Form.Label className="filter-label">Rendezés:</Form.Label>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "name"
                          | "user"
                          | "tool"
                          | "date"
                          | "none"
                      )
                    }
                    className="sort-select"
                  >
                    <option value="none">Nincs rendezés</option>
                    <option value="name">Munka neve</option>
                    <option value="user">Alkalmazott</option>
                    <option value="tool">Eszköz</option>
                    <option value="date">Dátum</option>
                  </Form.Select>
                </Form.Group>

                <div className="sort-order-buttons">
                  <Button
                    size="sm"
                    variant={sortOrder === "asc" ? "primary" : "outline-primary"}
                    onClick={() => setSortOrder("asc")}
                    className="order-btn"
                  >
                    ⬆️ Növekvő
                  </Button>
                  <Button
                    size="sm"
                    variant={sortOrder === "desc" ? "primary" : "outline-primary"}
                    onClick={() => setSortOrder("desc")}
                    className="order-btn"
                  >
                    ⬇️ Csökkenő
                  </Button>
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
