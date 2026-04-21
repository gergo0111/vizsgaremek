import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "../../interfaces/User";
import { Menusor } from "../Menusor";
import { apiGet, apiDelete, apiPatch } from "../../lib/api";
import { Container, Row, Col, Form, InputGroup, Table, Button, Card, Nav } from "react-bootstrap";
import "./UsersList.css";

export function UsersList() {
       const [users, setUsers] = useState<User[]>([]);
       const [deletedUsers, setDeletedUsers] = useState<User[]>([]);
       const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
       const [filteredDeletedUsers, setFilteredDeletedUsers] = useState<User[]>([]);
       const [searchTerm, setSearchTerm] = useState('');
       const [sortBy, setSortBy] = useState<'name' | 'department' | 'none'>('name');
       const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
       const [currentPage, setCurrentPage] = useState(1);
       const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');
       const itemsPerPage = 5;
       const navigate = useNavigate();

       useEffect(() => {
              const fetchUsers = async () => {
                     try {
                            const data = await apiGet<User[]>('/users');
                            setUsers(data);
                            setFilteredUsers(data);
                     } catch (error) {
                            console.error('Hiba:', error);
                     }   
              };

              const fetchDeletedUsers = async () => {
                     try {
                            const data = await apiGet<User[]>('/users/deleted');
                            setDeletedUsers(data);
                            setFilteredDeletedUsers(data);
                     } catch (error) {
                            console.error('Hiba a törölt felhasználók betöltésénél:', error);
                     }
              };

              fetchUsers();
              fetchDeletedUsers();
       }, []);

       useEffect(() => {
              let filtered = users.filter(user =>
                     user.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     user.munkakor.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (sortBy === 'name') {
                     filtered.sort((a, b) => a.nev.localeCompare(b.nev, 'hu', { numeric: true, sensitivity: 'base' }));
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              } else if (sortBy === 'department') {
                     filtered.sort((a, b) => a.munkakor.localeCompare(b.munkakor, 'hu', { numeric: true, sensitivity: 'base' }));
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              }

              setFilteredUsers(filtered);
              setCurrentPage(1);
       }, [searchTerm, sortBy, sortOrder, users]);

       useEffect(() => {
              let filtered = deletedUsers.filter(user =>
                     user.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     user.munkakor.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (sortBy === 'name') {
                     filtered.sort((a, b) => a.nev.localeCompare(b.nev, 'hu', { numeric: true, sensitivity: 'base' }));
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              } else if (sortBy === 'department') {
                     filtered.sort((a, b) => a.munkakor.localeCompare(b.munkakor, 'hu', { numeric: true, sensitivity: 'base' }));
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              }

              setFilteredDeletedUsers(filtered);
              setCurrentPage(1);
       }, [searchTerm, sortBy, sortOrder, deletedUsers]);

       const deleteUser = async (userId: number) => {
              if (!Number.isFinite(userId) || userId <= 0) {
                     console.warn('Invalid userId, skip delete:', userId);
                     return;
              }
              try {
                     await apiDelete(`/users/${userId}`);
                     // Újra betöltjük az aktív felhasználókat
                     const data = await apiGet<User[]>('/users');
                     setUsers(data);
                     setFilteredUsers(data);
                     // Újra betöltjük a törölt felhasználókat
                     const deletedData = await apiGet<User[]>('/users/deleted');
                     setDeletedUsers(deletedData);
                     setFilteredDeletedUsers(deletedData);
              } catch (error) {
                     console.error('Hiba:', error);
              }
       };

       const restoreUser = async (userId: number) => {
              if (!Number.isFinite(userId) || userId <= 0) {
                     console.warn('Invalid userId, skip restore:', userId);
                     return;
              }
              try {
                     await apiPatch(`/users/${userId}/restore`, {});
                     // Újra betöltjük az aktív felhasználókat
                     const data = await apiGet<User[]>('/users');
                     setUsers(data);
                     setFilteredUsers(data);
                     // Újra betöltjük a törölt felhasználókat
                     const deletedData = await apiGet<User[]>('/users/deleted');
                     setDeletedUsers(deletedData);
                     setFilteredDeletedUsers(deletedData);
              } catch (error) {
                     console.error('Hiba a visszaállításnál:', error);
              }
       };

       const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
       const startIndex = (currentPage - 1) * itemsPerPage;
       const endIndex = startIndex + itemsPerPage;
       const currentUsers = filteredUsers.slice(startIndex, endIndex);

       const totalDeletedPages = Math.ceil(filteredDeletedUsers.length / itemsPerPage);
       const deletedStartIndex = (currentPage - 1) * itemsPerPage;
       const deletedEndIndex = deletedStartIndex + itemsPerPage;
       const currentDeletedUsers = filteredDeletedUsers.slice(deletedStartIndex, deletedEndIndex);

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
                                   <h2>Felhasználók kezelése</h2>
                            </Col>
                            <Col md={6} className="text-end">
                                   <Button 
                                          className="btn-new-user"
                                          onClick={() => navigate('/uj-felhasznalo')}
                                   >
                                          + Új felhasználó
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
                                                        Aktív felhasználók
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
                                                        Törölt felhasználók
                                                 </Nav.Link>
                                          </Nav.Item>
                                   </Nav>

                                   <Card className="users-table-card">
                                          <Table responsive hover className="users-table">
                                                 <thead>
                                                        <tr>
                                                               <th>Név</th>
                                                               <th>Munkacsoportneve</th>
                                                               <th colSpan={2} className="text-center">Műveletek</th>
                                                        </tr>
                                                 </thead>
                                                 <tbody>
                                                        {activeTab === 'active' && currentUsers.length > 0 ? (
                                                               currentUsers.map((user) => (
                                                                      <tr key={user.user_id} className="user-row">
                                                                             <td className="user-name">{user.nev}</td>
                                                                             <td className="user-department">{user.munkakor}</td>
                                                                             <td className="action-cell">
                                                                                    <button 
                                                                                           className="action-btn edit-btn"
                                                                                           aria-label={`Szerkesztés ${user.nev}`}
                                                                                           onClick={() => navigate(`/felhasznalo-modositas/${user.user_id}`)}
                                                                                           title="Szerkesztés"
                                                                                    >
                                                                                           ✏️
                                                                                    </button>
                                                                             </td>
                                                                             <td className="action-cell">
                                                                                    <button
                                                                                           className="action-btn delete-btn"
                                                                                           aria-label={`Törlés ${user.nev}`}
                                                                                           onClick={() => {
                                                                                                  if (window.confirm(`Biztosan törlöd ${user.nev} felhasználót?`)) {
                                                                                                         deleteUser(user.user_id);
                                                                                                  }
                                                                                           }}
                                                                                           title="Törlés"
                                                                                    >
                                                                                           ❌
                                                                                    </button>
                                                                             </td>
                                                                      </tr>
                                                               ))
                                                        ) : activeTab === 'deleted' && currentDeletedUsers.length > 0 ? (
                                                               currentDeletedUsers.map((user) => (
                                                                      <tr key={user.user_id} className="user-row">
                                                                             <td className="user-name">{user.nev}</td>
                                                                             <td className="user-department">{user.munkakor}</td>
                                                                             <td colSpan={2} className="action-cell text-center">
                                                                                    <button
                                                                                           className="action-btn restore-btn"
                                                                                           aria-label={`Visszaállítás ${user.nev}`}
                                                                                           onClick={() => {
                                                                                                  if (window.confirm(`Biztosan visszaállítod ${user.nev} felhasználót?`)) {
                                                                                                         restoreUser(user.user_id);
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
                                                                      <td colSpan={4} className="text-center text-muted">
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
                                                               placeholder="Keresés névre vagy munkacsoportra..."
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
                                                                      setSortBy(e.target.value as 'name' | 'department' | 'none');
                                                                      setSortOrder('asc');
                                                               }}
                                                               className="sort-select"
                                                        >
                                                               <option value="name">Név szerint</option>
                                                               <option value="department">Munkacsoportnév szerint</option>
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

export default UsersList;