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
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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
  }, [searchTerm, sortBy, sortOrder, tools]);

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
            <Button className="btn-back" onClick={() => navigate("/fooldal")}>
              ← Vissza
            </Button>
          </Col>
        </Row>

          <Col md={3} className="users-sidebar">
            <Card className="search-filter-card">
              <Card.Body>
                <h5>Keresés és szűrés</h5>

                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Keresés név vagy típus alapján..."
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
                          | "none",
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
                    variant={
                      sortOrder === "asc" ? "primary" : "outline-primary"
                    }
                    onClick={() => setSortOrder("asc")}
                    className="order-btn"
                  >
                    ⬆️ Növekvő
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      sortOrder === "desc" ? "primary" : "outline-primary"
                    }
                    onClick={() => setSortOrder("desc")}
                    className="order-btn"
                  >
                    ⬇️ Csökkenő
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {loading ? (
            <p>Betöltés...</p>
          ) : works.length === 0 ? (
            <p>Nincsenek megjeleníthető munkák.</p>
          ) : (
            <div className="row gy-4">
              {works.map((work) => (
                <div key={work.munka_id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{work.munka_neve}</h5>
                      <p className="card-text">
                        {work.leiras || "Nincs leírás"}
                      </p>
                    </div>

                    <ul className="list-group list-group-flush">
                      <div className="card-body">
                        <h6>Alkalmazottak:</h6>
                        <ul className="mb-0">
                          {users
                            .filter((user) => work.user_id === user.user_id)
                            .map((user) => (
                              <li key={user.user_id}>{user.nev}</li>
                            ))}
                        </ul>
                      </div>
                    </ul>

                    <ul className="list-group list-group-flush">
                      <div className="card-body">
                        <h6>Eszközök:</h6>
                        <ul className="mb-0">
                          {tools
                            .filter((tool) => work.eszkoz_id === tool.eszkoz_id)
                            .map((tool) => (
                              <li key={tool.eszkoz_id}>{tool.nev}</li>
                            ))}
                        </ul>
                      </div>
                    </ul>

                    {work.feladat && work.feladat.length > 0 && (
                      <div className="card-body">
                        <h6>Feladatok:</h6>
                        <ul className="mb-0">
                          {work.feladat.map((task) => (
                            <li key={task.feladat_id}>{task.leiras}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        Kezdete: {work.kezdeti_datum || "-"}
                      </li>
                      <li className="list-group-item">
                        Várható befejezés:{" "}
                        {work.varhato_befejezes_datuma || "-"}
                      </li>
                    </ul>

                    <div className="card-body">
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          navigate(`/munka-modositas/${work.munka_id}`)
                        }
                      >
                        Szerkesztés
                      </button>

                      <button
                        className="btn btn-danger ms-2"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Biztosan törlöd ${work.munka_neve} munkát?`,
                            )
                          ) {
                            deleteWork(work.munka_id);
                          }
                        }}
                      >
                        Törlés
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </Container>
    </>
  );
}

export default WorkList;
