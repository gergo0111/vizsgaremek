import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "../../interfaces/User";
import { Menusor } from "../Menusor";
import { apiGet, apiDelete } from "../../lib/api";
import { Container, Row, Col, Form, InputGroup, Table, Button, Card } from "react-bootstrap";
import "./UsersList.css";

export function UsersList() {
       const [users, setUsers] = useState<User[]>([]);
       const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
       const [searchTerm, setSearchTerm] = useState('');
       const [sortBy, setSortBy] = useState<'name' | 'department' | 'none'>('name');
       const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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

              fetchUsers();
       }, []);

       useEffect(() => {
              let filtered = users.filter(user =>
                     user.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     user.munkakor.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (sortBy === 'name') {
                     filtered.sort((a, b) => a.nev.localeCompare(b.nev, 'hu'));
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              } else if (sortBy === 'department') {
                     filtered.sort((a, b) => a.munkakor.localeCompare(b.munkakor, 'hu'));
                     if (sortOrder === 'desc') {
                            filtered.reverse();
                     }
              }

              setFilteredUsers(filtered);
       }, [searchTerm, sortBy, sortOrder, users]);

       const deleteUser = async (userId: number) => {
              if (!Number.isFinite(userId) || userId <= 0) {
                     console.warn('Invalid userId, skip delete:', userId);
                     return;
              }
              try {
                     await apiDelete(`/users/${userId}`);
                     setUsers(prev => prev.filter(user => user.user_id !== userId));
              } catch (error) {
                     console.error('Hiba:', error);
              }
       };

       
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
                                                        {filteredUsers.length > 0 ? (
                                                               filteredUsers.map((user) => (
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
                                                                      ⬆️ Növekvő
                                                               </button>
                                                               <button
                                                                      className={`sort-order-btn ${sortOrder === 'desc' ? 'active' : ''}`}
                                                                      onClick={() => setSortOrder('desc')}
                                                               >
                                                                      ⬇️ Csökkenő
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