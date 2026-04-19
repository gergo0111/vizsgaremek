import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menusor } from "../Menusor";
import { apiGet, apiDelete } from "../../lib/api";
import { Container, Row, Col, Form, InputGroup, Table, Button, Card } from "react-bootstrap";
import "../users/UsersList.css";

interface Eszkoz {
       eszkoz_id: string;
       nev: string;
       tipus: string;
       darabszam: number
}

export function ToolsList() {
       const [tools, setTools] = useState<Eszkoz[]>([]);
       const [filteredTools, setFilteredTools] = useState<Eszkoz[]>([]);
       const [searchTerm, setSearchTerm] = useState('');
       const [sortBy, setSortBy] = useState<'name' | 'type' | 'quantity' | 'none'>('name');
       const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
       const [currentPage, setCurrentPage] = useState(1);
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

              fetchTools();
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

       const deleteTool = async (eszkozId: string) => {
              try {
                     await apiDelete(`/eszkozok/${eszkozId}`);
                     setTools(prev => prev.filter(tool => tool.eszkoz_id !== eszkozId));
              } catch (error) {
                     console.error('Hiba:', error);
              }
       };

       const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
       const startIndex = (currentPage - 1) * itemsPerPage;
       const endIndex = startIndex + itemsPerPage;
       const currentTools = filteredTools.slice(startIndex, endIndex);

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
                                                        {currentTools.length > 0 ? (
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
                                                        ) : (
                                                               <tr>
                                                                      <td colSpan={6} className="text-center text-muted">
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

