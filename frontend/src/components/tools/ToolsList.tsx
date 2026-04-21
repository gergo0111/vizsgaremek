import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menusor } from "../Menusor";
import { apiGet, apiDelete, apiPatch } from "../../lib/api";
import { Container, Row, Col, Form, InputGroup, Table, Button, Card, Nav } from "react-bootstrap";
import "../users/UsersList.css";

interface Eszkoz {
       eszkoz_id: string;
       nev: string;
       tipus: string;
       darabszam: number
}

export function ToolsList() {
       const [tools, setTools] = useState<Eszkoz[]>([]);
       const [deletedTools, setDeletedTools] = useState<Eszkoz[]>([]);
       const [filteredTools, setFilteredTools] = useState<Eszkoz[]>([]);
       const [filteredDeletedTools, setFilteredDeletedTools] = useState<Eszkoz[]>([]);
       const [searchTerm, setSearchTerm] = useState('');
       const [sortBy, setSortBy] = useState<'name' | 'type' | 'quantity' | 'none'>('name');
       const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
       const [currentPage, setCurrentPage] = useState(1);
       const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');
       const itemsPerPage = 5;
       const navigate = useNavigate();

       useEffect(() => {
              const fetchTools = async () => {
                     try {
                            const data = await apiGet<Eszkoz[]>('/eszkozok');
                            setTools(data);
                            setFilteredTools(data);
                     } catch (error) {
                            console.error('Hiba:', error);
                     }
              };

              const fetchDeletedTools = async () => {
                     try {
                            const data = await apiGet<Eszkoz[]>('/eszkozok/deleted');
                            setDeletedTools(data);
                            setFilteredDeletedTools(data);
                     } catch (error) {
                            console.error('Hiba a törölt eszközök betöltésénél:', error);
                     }
              };

              fetchTools();
              fetchDeletedTools();
       }, []);

       useEffect(() => {
              let filtered = tools.filter(tool =>
                     tool.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     tool.tipus.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (sortBy === 'name') {
                     filtered.sort((a, b) => a.nev.localeCompare(b.nev, 'hu', { numeric: true, sensitivity: 'base' }));
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              } else if (sortBy === 'type') {
                     filtered.sort((a, b) => a.tipus.localeCompare(b.tipus, 'hu', { numeric: true, sensitivity: 'base' }));
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              } else if (sortBy === 'quantity') {
                     filtered.sort((a, b) => a.darabszam - b.darabszam);
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              }

              setFilteredTools(filtered);
              setCurrentPage(1);
       }, [searchTerm, sortBy, sortOrder, tools]);

       useEffect(() => {
              let filtered = deletedTools.filter(tool =>
                     tool.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     tool.tipus.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (sortBy === 'name') {
                     filtered.sort((a, b) => a.nev.localeCompare(b.nev, 'hu', { numeric: true, sensitivity: 'base' }));
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              } else if (sortBy === 'type') {
                     filtered.sort((a, b) => a.tipus.localeCompare(b.tipus, 'hu', { numeric: true, sensitivity: 'base' }));
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              } else if (sortBy === 'quantity') {
                     filtered.sort((a, b) => a.darabszam - b.darabszam);
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              }

              setFilteredDeletedTools(filtered);
              setCurrentPage(1);
       }, [searchTerm, sortBy, sortOrder, deletedTools]);

       const deleteTool = async (eszkozId: string) => {
              try {
                     await apiDelete(`/eszkozok/${eszkozId}`);
                     // Újra betöltjük az aktív eszközöket
                     const data = await apiGet<Eszkoz[]>('/eszkozok');
                     setTools(data);
                     setFilteredTools(data);
                     // Újra betöltjük a törölt eszközöket
                     const deletedData = await apiGet<Eszkoz[]>('/eszkozok/deleted');
                     setDeletedTools(deletedData);
                     setFilteredDeletedTools(deletedData);
              } catch (error) {
                     console.error('Hiba:', error);
              }
       };

       const restoreTool = async (eszkozId: string) => {
              try {
                     await apiPatch(`/eszkozok/${eszkozId}/restore`, {});
                     // Újra betöltjük az aktív eszközöket
                     const data = await apiGet<Eszkoz[]>('/eszkozok');
                     setTools(data);
                     setFilteredTools(data);
                     // Újra betöltjük a törölt eszközöket
                     const deletedData = await apiGet<Eszkoz[]>('/eszkozok/deleted');
                     setDeletedTools(deletedData);
                     setFilteredDeletedTools(deletedData);
              } catch (error) {
                     console.error('Hiba a visszaállításnál:', error);
              }
       };

       const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
       const startIndex = (currentPage - 1) * itemsPerPage;
       const endIndex = startIndex + itemsPerPage;
       const currentTools = filteredTools.slice(startIndex, endIndex);

       const totalDeletedPages = Math.ceil(filteredDeletedTools.length / itemsPerPage);
       const deletedStartIndex = (currentPage - 1) * itemsPerPage;
       const deletedEndIndex = deletedStartIndex + itemsPerPage;
       const currentDeletedTools = filteredDeletedTools.slice(deletedStartIndex, deletedEndIndex);

       const goToNextPage = () => {
              const currentTabTotal = activeTab === 'active'
                     ? totalPages
                     : totalDeletedPages;
              if (currentPage < currentTabTotal) {
                     setCurrentPage(currentPage + 1);
              }
       };

       const goToPrevPage = () => {
              if (currentPage > 1) {
                     setCurrentPage(currentPage - 1);
              }
       };

       const currentTabTotal = activeTab === 'active'
              ? totalPages
              : totalDeletedPages;

       return (
              <>
              <Menusor />
              <Container fluid className="users-list-container">
                     <Row className="users-header">
                            <Col md={6}>
                                   <h2>Eszközök kezelése</h2>
                            </Col>
                            <Col md={6} className="text-end">
                                   <Button 
                                          className="btn-new-user"
                                          onClick={() => navigate('/uj-eszkoz')}
                                   >
                                          + Új eszköz
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
                                   <Nav fill variant="tabs" className="mb-3">
                                          <Nav.Item>
                                                 <Nav.Link 
                                                        eventKey="active"
                                                        active={activeTab === 'active'}
                                                        onClick={() => {
                                                               setActiveTab('active');
                                                               setCurrentPage(1);
                                                        }}
                                                 >
                                                        Aktív eszközök
                                                 </Nav.Link>
                                          </Nav.Item>
                                          <Nav.Item>
                                                 <Nav.Link 
                                                        eventKey="deleted"
                                                        active={activeTab === 'deleted'}
                                                        onClick={() => {
                                                               setActiveTab('deleted');
                                                               setCurrentPage(1);
                                                        }}
                                                 >
                                                        Törölt eszközök
                                                 </Nav.Link>
                                          </Nav.Item>
                                   </Nav>

                                   <Card className="users-table-card">
                                          <Table responsive hover className="users-table tools-table">
                                                 <thead>
                                                        <tr>
                                                               <th>Eszköz neve</th>
                                                               <th>Típus</th>
                                                               <th>Darabszám</th>
                                                               <th colSpan={2} className="text-center">Műveletek</th>
                                                        </tr>
                                                 </thead>
                                                 <tbody>
                                                        {activeTab === 'active' && currentTools.length > 0 ? (
                                                               currentTools.map((tool) => (
                                                                      <tr key={tool.eszkoz_id} className="user-row">
                                                                             <td className="user-name">{tool.nev}</td>
                                                                             <td className="user-department">{tool.tipus}</td>
                                                                             <td className="text-center">{tool.darabszam}</td>
                                                                             
                                                                             <td className="action-cell">
                                                                                    <button 
                                                                                           className="action-btn edit-btn"
                                                                                           aria-label={`Szerkesztés ${tool.nev}`}
                                                                                           onClick={() => navigate(`/eszkoz-modositas/${tool.eszkoz_id}`)}
                                                                                           title="Szerkesztés"
                                                                                    >
                                                                                           ✏️
                                                                                    </button>
                                                                             </td>
                                                                             <td className="action-cell">
                                                                                    <button
                                                                                           className="action-btn delete-btn"
                                                                                           aria-label={`Törlés ${tool.nev}`}
                                                                                           onClick={() => {
                                                                                                  if (window.confirm(`Biztosan törlöd ${tool.nev} eszközt?`)) {
                                                                                                         deleteTool(tool.eszkoz_id);
                                                                                                  }
                                                                                           }}
                                                                                           title="Törlés"
                                                                                    >
                                                                                           ❌
                                                                                    </button>
                                                                             </td>
                                                                      </tr>
                                                               ))
                                                        ) : activeTab === 'deleted' && currentDeletedTools.length > 0 ? (
                                                               currentDeletedTools.map((tool) => (
                                                                      <tr key={tool.eszkoz_id} className="user-row">
                                                                             <td className="user-name">{tool.nev}</td>
                                                                             <td className="user-department">{tool.tipus}</td>
                                                                             <td className="text-center">{tool.darabszam}</td>
                                                                             <td colSpan={2} className="action-cell text-center">
                                                                                    <button
                                                                                           className="action-btn restore-btn"
                                                                                           aria-label={`Visszaállítás ${tool.nev}`}
                                                                                           onClick={() => {
                                                                                                  if (window.confirm(`Biztosan visszaállítod ${tool.nev} eszközt?`)) {
                                                                                                         restoreTool(tool.eszkoz_id);
                                                                                                  }
                                                                                           }}
                                                                                           title="Visszaállítás"
                                                                                    >
                                                                                           ↻ Visszaállítás
                                                                                    </button>
                                                                             </td>
                                                                      </tr>
                                                               ))
                                                        ) : (
                                                               <tr>
                                                                      <td colSpan={5} className="text-center text-muted">
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
                                                 Oldal {currentPage} / {currentTabTotal || 1}
                                          </span>
                                          <button 
                                                 className="pagination-btn"
                                                 onClick={goToNextPage}
                                                 disabled={currentPage === currentTabTotal || currentTabTotal === 0}
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
                                                               placeholder="Keresés név vagy típus alapján..."
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
                                                                      setSortBy(e.target.value as 'name' | 'type' | 'quantity' | 'none');
                                                                      setSortOrder('asc');
                                                               }}
                                                               className="sort-select"
                                                        >
                                                               <option value="name">Eszköz neve</option>
                                                               <option value="type">Típus</option>
                                                               <option value="quantity">Darabszám</option>
                                                        </Form.Select>
                                                 </div>

                                                 <div className="filter-section">
                                                        <h6>Rendezési sorrend</h6>
                                                        <div className="sort-order-buttons">
                                                               <button
                                                                      className={`sort-order-btn ${sortOrder === 'asc' ? 'active' : ''}`}
                                                                      onClick={() => setSortOrder('asc')}
                                                               >
                                                                      ▲ Növekvő
                                                               </button>
                                                               <button
                                                                      className={`sort-order-btn ${sortOrder === 'desc' ? 'active' : ''}`}
                                                                      onClick={() => setSortOrder('desc')}
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

export default ToolsList;

