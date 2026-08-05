import React, { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiUser, FiTrash2, FiEdit3 } from 'react-icons/fi';
import { apiClient } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { toast } from 'react-toastify';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(15);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('newest');
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, per_page: perPage, search: search || undefined, role: role || undefined, sort };
      const res = await apiClient.get('/admin/users', { params });
      const finalItems = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

      setUsers(finalItems);
      setTotal(res?.meta?.total ?? res?.data?.meta?.total ?? 0);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, role, sort]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (user) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    if (currentUser && user.id === currentUser.id) {
      toast.error('You cannot delete your own admin account.');
      return;
    }
    try {
      setDeletingId(user.id);
      setDeleting(true);
      await apiClient.delete(`/admin/users/${user.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success('User deleted successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="panel glass-panel">
          <Skeleton height="24px" width="220px" />
          <div style={{ marginTop: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <Skeleton height="48px" width="48px" borderRadius="8px" />
                <div style={{ flex: 1 }}>
                  <Skeleton height="12px" width="60%" />
                  <Skeleton height="10px" width="40%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={fetchUsers} />;

  return (
    <div className="admin-users-page">
      <div className="flex-between mb-4">
        <h2 className="section-title-sm">User Management</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="input-group">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" />
            <Button onClick={() => { setPage(1); fetchUsers(); }} icon={FiSearch}>Search</Button>
          </div>
          <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>
      </div>

      <div className="table-panel glass-panel">
        {users.length === 0 ? (
          <div className="empty-state">No users found.</div>
        ) : (
          <table className="responsive-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="user-cell">
                    <div className="user-meta">
                      <div className="avatar-small">
                        {u.avatar ? <img src={u.avatar} alt={u.name} /> : <FiUser />}
                      </div>
                      <div>
                        <strong>{u.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{Array.isArray(u.roles) ? u.roles.join(', ') : u.roles}</td>
                  <td>{u.email_verified_at ? 'Yes' : 'No'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="outline" size="sm" onClick={() => window.alert('View not implemented yet') } icon={FiEdit3}>View</Button>
                      <Button variant="ghost" size="sm" onClick={() => window.alert('Edit placeholder') } icon={FiEdit3}>Edit</Button>
                      <Button variant="amber" size="sm" onClick={() => handleDelete(u)} isLoading={deleting && deletingId === u.id} icon={FiTrash2}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex-between mt-4">
        <div>Showing {users.length} of {total}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <div style={{ alignSelf: 'center' }}>Page {page}</div>
          <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
