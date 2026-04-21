import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menusor } from "../Menusor";
import { apiGet, apiPatch } from "../../lib/api";
import { Container, Button, Card, Col, Form, Row } from "react-bootstrap";

interface User {
  user_id: number;
  nev: string;
}

interface Tool {
  eszkoz_id: number;
  nev: string;
}

interface MunkaUser {
  munka_id: number;
  user_id: number;
  user?: User;
}

interface MunkaEszkoz {
  munka_id: number;
  eszkoz_id: number;
  eszkoz?: Tool;
}

interface WorkData {
  munka_id: number;
  munka_neve: string;
  leiras?: string;
  kezdeti_datum?: string;
  varhato_befejezes_datuma?: string;
  munkaUsers?: MunkaUser[];
  munkaEszkozok?: MunkaEszkoz[];
  feladat?: Array<{ feladat_id: number; leiras: string }>;
}

export function ModifyWork() {
  const navigate = useNavigate();
  const { munka_id } = useParams<{ munka_id: string }>();

  const [users, setUsers] = useState<User[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [workData, setWorkData] = useState<WorkData>({
    munka_id: 0,
    munka_neve: "",
    leiras: "",
    kezdeti_datum: "",
    varhato_befejezes_datuma: "",
    munkaUsers: [],
    munkaEszkozok: [],
    feladat: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedTools, setSelectedTools] = useState<number[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([""]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet<User[]>("/users");
        setUsers(data);
      } catch (error) {
        console.error("Hiba:", error);
      }
    };

    const fetchTools = async () => {
      try {
        const data = await apiGet<Tool[]>("/eszkozok");
        setTools(data);
      } catch (error) {
        console.error("Hiba:", error);
      }
    };

    const fetchWorkData = async () => {
      try {
        const data = await apiGet<WorkData>(`/munka/${munka_id}`);

        const kezdeti = data.kezdeti_datum
          ? new Date(data.kezdeti_datum).toISOString().split("T")[0]
          : "";
        const varhato = data.varhato_befejezes_datuma
          ? new Date(data.varhato_befejezes_datuma).toISOString().split("T")[0]
          : "";

        setWorkData({
          ...data,
          kezdeti_datum: kezdeti,
          varhato_befejezes_datuma: varhato,
        });

        const userIds = data.munkaUsers?.map((mu) => mu.user_id) || [];
        setSelectedUsers(userIds.length > 0 ? userIds : [0]);

        const toolIds = data.munkaEszkozok?.map((me) => me.eszkoz_id) || [];
        setSelectedTools(toolIds.length > 0 ? toolIds : [0]);

        setSelectedTasks(
          data.feladat ? data.feladat.map((f: any) => f.leiras) : [""],
        );
        setLoading(false);
      } catch (error) {
        console.error("Hiba:", error);
        setLoading(false);
      }
    };

    fetchUsers();
    fetchTools();
    fetchWorkData();
  }, [munka_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setWorkData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserChange = (index: number, value: number) => {
    setSelectedUsers((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addUser = () => {
    setSelectedUsers((prev) => [...prev, 0]);
  };

  const removeUser = (index: number) => {
    setSelectedUsers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToolChange = (index: number, value: number) => {
    setSelectedTools((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addTool = () => {
    setSelectedTools((prev) => [...prev, 0]);
  };

  const removeTool = (index: number) => {
    setSelectedTools((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index: number, value: string) => {
    setSelectedTasks((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addTask = () => {
    setSelectedTasks((prev) => [...prev, ""]);
  };

  const removeTask = (index: number) => {
    setSelectedTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      munka_neve: workData.munka_neve,
      leiras: workData.leiras,
      kezdeti_datum: workData.kezdeti_datum || undefined,
      varhato_befejezes_datuma: workData.varhato_befejezes_datuma || undefined,
      dolgozok: selectedUsers.filter((u) => u > 0),
      eszkozok: selectedTools.filter((t) => t > 0),
      feladatok: selectedTasks.filter((t) => t && t.trim() !== ""),
    };

    try {
      await apiPatch(`/munka/${munka_id}`, payload);
      navigate("/fooldal");
    } catch (err) {
      console.error("Hiba:", err);
    }
  };

  if (loading) {
    return <div>Betöltés...</div>;
  }

  return (
    <>
      <Menusor />

      <Container fluid className="new-work-page">
        <Row>
          <Col lg={10} md={12} className="mx-auto">
            <Card className="new-work-card">
              <Card.Body>
                <Card.Title className="new-work-header">
                  Munka módosítása
                </Card.Title>

                <form onSubmit={handleSubmit}>
                  <div className="work-form-grid">
                    <Form.Group className="mb-3">
                      <Form.Label>Munka neve</Form.Label>
                      <Form.Control
                        type="text"
                        name="munka_neve"
                        value={workData.munka_neve}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Leírás</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="leiras"
                        value={workData.leiras || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Dolgozó</Form.Label>
                      {selectedUsers.map((userId, idx) => (
                        <div key={idx} className="dynamic-row">
                          <Form.Select
                            value={userId}
                            onChange={(e) =>
                              handleUserChange(
                                idx,
                                parseInt(e.target.value || "0", 10) || 0,
                              )
                            }
                          >
                            <option value={0}>-- válassz --</option>
                            {users.map((user) => (
                              <option key={user.user_id} value={user.user_id}>
                                {user.nev}
                              </option>
                            ))}
                          </Form.Select>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeUser(idx)}
                          >
                            Törlés
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={addUser}
                        className="mt-2"
                      >
                        + Új dolgozó hozzáadása
                      </Button>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Eszköz</Form.Label>
                      {selectedTools.map((toolId, idx) => (
                        <div key={idx} className="dynamic-row">
                          <Form.Select
                            value={toolId}
                            onChange={(e) =>
                              handleToolChange(
                                idx,
                                parseInt(e.target.value || "0", 10) || 0,
                              )
                            }
                          >
                            <option value={0}>-- válassz --</option>
                            {tools.map((tool) => (
                              <option
                                key={tool.eszkoz_id}
                                value={tool.eszkoz_id}
                              >
                                {tool.nev}
                              </option>
                            ))}
                          </Form.Select>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeTool(idx)}
                          >
                            Törlés
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={addTool}
                        className="mt-2"
                      >
                        + Új eszköz hozzáadása
                      </Button>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Kezdeti dátum</Form.Label>
                      <Form.Control
                        type="date"
                        name="kezdeti_datum"
                        value={workData.kezdeti_datum || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Várható befejezés</Form.Label>
                      <Form.Control
                        type="date"
                        name="varhato_befejezes_datuma"
                        value={workData.varhato_befejezes_datuma || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 work-form-full">
                      <Form.Label>Feladatok</Form.Label>

                      {selectedTasks.map((task, idx) => (
                        <div key={idx} className="dynamic-row">
                          <Form.Control
                            type="text"
                            value={task}
                            onChange={(e) =>
                              handleTaskChange(idx, e.target.value)
                            }
                          />

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeTask(idx)}
                          >
                            Törlés
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={addTask}
                        className="mt-2"
                      >
                        + Új feladat hozzáadása
                      </Button>
                    </Form.Group>

                    <Form.Group className="mt-4 work-form-full d-flex gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-grow-1"
                      >
                        Mentés
                      </Button>

                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => navigate("/munka-lista")}
                        className="flex-grow-1"
                      >
                        Mégse
                      </Button>
                    </Form.Group>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ModifyWork;
