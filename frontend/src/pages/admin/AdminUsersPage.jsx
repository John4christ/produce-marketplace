import React, { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiUser, FiEye, FiEdit3, FiUserX, FiUserCheck, FiAlertTriangle } from 'react-icons/fi';
import { apiClient } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import ConfirmModal from '../../components/common/ConfirmModal';
import Avatar from '../../components/common/Avatar';
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
  const [busyId, setBusyId] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      const params = { page, per_page: perPage, search: search || undefined, role: role || undefined, sort };
      const res = await apiClient.get('/admin/users', { params });
      const finalItems = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

      setUsers(finalItems);
      setTotal(res?.meta?.total ?? res?.data?.meta?.total ?? 0);
    } catch (err) {
      if (!silent) setError(err.message || 'Failed to load users');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [page, perPage, search, role, sort]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const isSelf = (u) => currentUser && u.id === currentUser.id;

  const isAdminUser = (u) => (Array.isArray(u.roles) ? u.roles.includes('admin') : u.roles === 'admin');

  const isLastActiveAdmin = (u) => {
    if (!isAdminUser(u)) return false;
    if (total !== users.length) return false;
    const activeAdmins = users.filter((x) => isAdminUser(x) && x.status !== 'inactive');
    return activeAdmins.length === 1 && activeAdmins[0].id === u.id;
  };

  const handleDeactivateRequest = (user) => {
    if (isSelf(user)) {
      toast.error('You cannot deactivate your own account.');
      return;
    }
    if (isLastActiveAdmin(user)) {
      toast.error('You cannot deactivate the last remaining admin account.');
      return;
    }
    setConfirmUser(user);
  };

  const handleConfirmDeactivate = async () => {
    if (!confirmUser) return;
    try {
      setBusyId(confirmUser.id);
      await apiClient.post(`/admin/users/${confirmUser.id}/deactivate`);
      toast.success(`${confirmUser.name}'s account has been deactivated.`);
      setConfirmUser(null);
      fetchUsers(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to deactivate user');
      setConfirmUser(null);
    } finally {
      setBusyId(null);
    }
  };

  const handleReactivate = async (user) => {
    try {
      setBusyId(user.id);
      await apiClient.post(`/admin/users/${user.id}/reactivate`);
      toast.success(`${user.name}'s account has been reactivated.`);
      fetchUsers(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to reactivate user');
    } finally {
      setBusyId(null);
    }
  };

  const statusBadge = (status) =>
    status === 'inactive' ? (
      <Badge variant="red">Inactive</Badge>
    ) : (
      <Badge variant="green">Active</Badge>
    );

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
                <th>Status</th>
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
                      <Avatar
                        src={u.avatar}
                        name={u.name}
                        alt={u.name}
                        className="avatar-small"
                        icon={FiUser}
                        fallbackSize={16}
                        fallbackWeight={600}
                      />
                      <div>
                        <strong>{u.name}</strong>
                        {isSelf(u) && <span className="text-muted" style={{ fontSize: '0.75rem', marginLeft: 4 }}>(you)</span>}
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{Array.isArray(u.roles) ? u.roles.join(', ') : u.roles}</td>
                  <td>{statusBadge(u.status)}</td>
                  <td>{u.email_verified_at ? 'Yes' : 'No'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="outline" size="sm" onClick={() => window.alert('View not implemented yet')} icon={FiEye}>View</Button>
                      <Button variant="ghost" size="sm" onClick={() => window.alert('Edit placeholder')} icon={FiEdit3}>Edit</Button>
                      {u.status === 'inactive' ? (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => handleReactivate(u)}
                          isLoading={busyId === u.id}
                          icon={FiUserCheck}
                          isDisabled={isSelf(u)}
                        >
                          Reactivate
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeactivateRequest(u)}
                          isLoading={busyId === u.id}
                          icon={FiUserX}
                          isDisabled={isSelf(u)}
                        >
                          Deactivate
                        </Button>
                      )}
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

      <ConfirmModal
        isOpen={!!confirmUser}
        title="Deactivate Account"
        message={`Are you sure you want to deactivate ${confirmUser ? confirmUser.name : ''}'s account? This user will no longer be able to log in, and any deactivated farmers' products will be hidden from buyers. You can reactivate this account at any time.`}
        icon={FiAlertTriangle}
        iconTone="danger"
        confirmText="Deactivate"
        confirmVariant="danger"
        isLoading={busyId === (confirmUser && confirmUser.id)}
        onConfirm={handleConfirmDeactivate}
        onClose={() => setConfirmUser(null)}
      />
    </div>
  );
};

export default AdminUsersPage;
