// ============================================
// File: src/components/Sidebar/Sidebar.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { Nav, Spinner, Alert, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Users, Settings, User, UserCheck, UserX } from 'lucide-react';
import type { User as UserState } from "../../types";
import './Sidebar.css';
import RequestUser from '../../api/users/RequestUser';
// import RequestFile from '../../api/files/RequestFile';
// import type { FileInfo } from '../../types/FileInfo';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [users, setUsers] = useState<UserState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const getMainFile = (userId: number): void => {
    localStorage.setItem('userId', userId.toString());
  };

  // Static menu items (always visible)
  const staticMenuItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { id: 'users', icon: Users, label: 'Users', path: '/users' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await RequestUser.getUsers();
        console.log('Fetched users:', data);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <h4>Dashboard</h4>
      </div>

      {/* Main Navigation */}
      <Nav className="flex-column sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">Main Menu</div>
          {staticMenuItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={20} />
                <span className="ms-3">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Users Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <User size={16} className="me-2" />
            Users
            {users.length > 0 && (
              <Badge bg="primary" className="ms-2">{users.length}</Badge>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="sidebar-loading">
              <Spinner animation="border" size="sm" variant="light" />
              <span className="ms-2">Loading users...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert variant="danger" className="sidebar-alert">
              {error}
            </Alert>
          )}

          {/* Users List */}
          {!loading && !error && users.length > 0 && (
            <div>
              {users.map(user => (
                <NavLink
                  key={user.id}
                  to={`/FilesTree/${user.id}`}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => {
                    getMainFile(user.id)
                  }}
                >
                  {user.isState ? (
                    <UserCheck size={18} className="text-success" />
                  ) : (
                    <UserX size={18} className="text-danger" />
                  )}
                  <span className="ms-3">{user.username}</span>
                  {user.isState && (
                    <Badge bg="success" className="ms-auto" pill>Active</Badge>
                  )}
                </NavLink>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <div className="sidebar-empty">
              <User size={32} className="mb-2 opacity-50" />
              <small>No users found</small>
            </div>
          )}
        </div>
      </Nav>
    </div>
  );
};

// --------------------------------------------------------------------------------------

// ============================================
// File: src/components/Sidebar/Sidebar.tsx (Updated)
// ============================================
// import React, { useEffect, useState } from 'react';
// import { Nav, Spinner, Alert, Badge, Button } from 'react-bootstrap';
// import { NavLink } from 'react-router-dom';
// import { Home, BarChart2, Users, Settings, User, UserCheck, UserX, FolderTree } from 'lucide-react';
// import type { User as UserState } from "../../types";
// import { FileTreeModal } from '../FileTreeModal';
// import './Sidebar.css';
// import RequestUser from '../../api/users/RequestUser';

// interface SidebarProps {
//   isOpen: boolean;
//   toggleSidebar: () => void;
// }

// export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
//   const [users, setUsers] = useState<UserState[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedUser, setSelectedUser] = useState<{ id: number; username: string } | null>(null);
//   const [showFilesModal, setShowFilesModal] = useState(false);

//   const staticMenuItems = [
//     { id: 'home', icon: Home, label: 'Home', path: '/' },
//     { id: 'analytics', icon: BarChart2, label: 'Analytics', path: '/analytics' },
//     { id: 'users', icon: Users, label: 'Users', path: '/users' },
//     { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }
//   ];

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await RequestUser.getUsers();
//         setUsers(data);
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//         setError("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleShowFiles = (user: UserState, e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setSelectedUser({ id: user.id, username: user.username });
//     setShowFilesModal(true);
//   };

//   const handleCloseFilesModal = () => {
//     setShowFilesModal(false);
//     setSelectedUser(null);
//   };

//   return (
//     <>
//       <div className={`sidebar ${isOpen ? 'open' : ''}`}>
//         <div className="sidebar-header">
//           <h4>Dashboard</h4>
//         </div>

//         <Nav className="flex-column sidebar-nav">
//           <div className="sidebar-section">
//             <div className="sidebar-section-title">Main Menu</div>
//             {staticMenuItems.map(item => {
//               const Icon = item.icon;
//               return (
//                 <NavLink
//                   key={item.id}
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `sidebar-link ${isActive ? 'active' : ''}`
//                   }
//                 >
//                   <Icon size={20} />
//                   <span className="ms-3">{item.label}</span>
//                 </NavLink>
//               );
//             })}
//           </div>

//           <div className="sidebar-section">
//             <div className="sidebar-section-title">
//               <User size={16} className="me-2" />
//               Users
//               {users.length > 0 && (
//                 <Badge bg="primary" className="ms-2">{users.length}</Badge>
//               )}
//             </div>

//             {loading && (
//               <div className="sidebar-loading">
//                 <Spinner animation="border" size="sm" variant="light" />
//                 <span className="ms-2">Loading users...</span>
//               </div>
//             )}

//             {error && !loading && (
//               <Alert variant="danger" className="sidebar-alert">
//                 {error}
//               </Alert>
//             )}

//             {!loading && !error && users.length > 0 && (
//               <>
//                 {users.map(user => (
//                   <div key={user.id} className="sidebar-user-item">
//                     <NavLink
//                       to={`/user/${user.id}`}
//                       className={({ isActive }) =>
//                         `sidebar-link user-link ${isActive ? 'active' : ''}`
//                       }
//                     >
//                       {user.isState ? (
//                         <UserCheck size={18} className="text-success" />
//                       ) : (
//                         <UserX size={18} className="text-danger" />
//                       )}
//                       <span className="ms-3 flex-grow-1">{user.username}</span>
//                     </NavLink>
//                     <Button
//                       variant="link"
//                       size="sm"
//                       className="files-button"
//                       onClick={(e) => handleShowFiles(user, e)}
//                       title="View file tree"
//                     >
//                       <FolderTree size={16} />
//                     </Button>
//                   </div>
//                 ))}
//               </>
//             )}

//             {!loading && !error && users.length === 0 && (
//               <div className="sidebar-empty">
//                 <User size={32} className="mb-2 opacity-50" />
//                 <small>No users found</small>
//               </div>
//             )}
//           </div>
//         </Nav>
//       </div>

//       {selectedUser && (
//         <FileTreeModal
//           show={showFilesModal}
//           onHide={handleCloseFilesModal}
//           userId={selectedUser.id}
//           username={selectedUser.username}
//         />
//       )}
//     </>
//   );
// };
