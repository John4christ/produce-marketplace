import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-toastify';
import { FiUser, FiSettings, FiCheck } from 'react-icons/fi';
import { resizeImage } from '../../utils/resizeImage';

export const AccountSettings = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [saving, setSaving] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());

  const nameRef = useRef(name);
  const emailRef = useRef(email);
  const avatarRef = useRef(user?.avatar);
  nameRef.current = name;
  emailRef.current = email;
  avatarRef.current = user?.avatar;

  useEffect(() => {
    if (!editing) {
      setName(user?.name || '');
      setEmail(user?.email || '');
      setAvatarPreview(user?.avatar || null);
      setAvatarFile(null);
    }
  }, [user, editing]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resized = await resizeImage(file, 400, 0.9);
      setAvatarFile(resized.file);
      setAvatarPreview(resized.preview);
      setAvatarError(null);
    } catch (err) {
      toast.error('Failed to process image. Please try another file.');
    }
  };

  const startEditing = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAvatarPreview(user?.avatar || null);
    setAvatarFile(null);
    setAvatarError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setAvatarError(null);

    try {
      const trimmedName = (nameRef.current || '').trim();
      const trimmedEmail = (emailRef.current || '').trim();

      if (!trimmedName) {
        toast.error('Name is required.');
        return;
      }

      if (!trimmedEmail) {
        toast.error('Email is required.');
        return;
      }

      const payload = new FormData();
      payload.append('_method', 'PUT');
      payload.append('name', trimmedName);
      payload.append('email', trimmedEmail);

      if (avatarFile) {
        payload.append('avatar', avatarFile);
      }

      const response = await apiClient.post('/auth/profile', payload);

      const updatedUser = response.data.data ?? response.data;

      updateUser(updatedUser);

      if (updatedUser.avatar !== avatarRef.current) {
        setAvatarTimestamp(Date.now());
      }

      setName(updatedUser.name || '');
      setEmail(updatedUser.email || '');
      setAvatarPreview(updatedUser.avatar || null);
      setAvatarFile(null);

      setSaveSuccess(true);
      toast.success('Profile updated successfully');

      setTimeout(() => {
        setSaveSuccess(false);
        setEditing(false);
      }, 1200);
    } catch (err) {
      setSaveSuccess(false);
      if (err.errors && typeof err.errors === 'object') {
        Object.values(err.errors).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(message));
          } else {
            toast.error(messages);
          }
        });
      } else if (err.originalData?.errors && typeof err.originalData.errors === 'object') {
        Object.values(err.originalData.errors).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(message));
          } else {
            toast.error(messages);
          }
        });
      } else {
        toast.error(
          err.message ||
            err.originalData?.message ||
            'Failed to update profile.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || null);
    setAvatarError(null);
  };

  const displayName = editing ? name : user?.name || 'N/A';
  const displayEmail = editing ? email : user?.email || 'N/A';
  const displayAvatar = editing ? avatarPreview : (user?.avatar ? `${user.avatar}?t=${avatarTimestamp}` : null);
  const displayRole = user?.roles?.[0]?.slug || 'buyer';

  return (
    <div className="dash-section">
      <div className="flex-between mb-4">
        <h3 className="section-title-sm flex-center gap-2">
          <FiSettings /> Account Settings
        </h3>
        {!editing && (
          <Button variant="outline" size="sm" onClick={startEditing}>
            Edit Profile
          </Button>
        )}
      </div>
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex-center gap-2 mb-4">
          <FiUser />
          <h4>Profile</h4>
        </div>

        <div className="avatar-upload-row mb-4">
          <div className="avatar-preview">
            {displayAvatar ? (
              <img
                key={displayAvatar}
                src={displayAvatar}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setAvatarError('Failed to load image')}
              />
            ) : (
              <div className="avatar-placeholder">
                <FiUser />
              </div>
            )}
          </div>
          {editing && (
            <div className="avatar-upload-controls">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="file-input"
                id="settings-avatar-upload"
              />
              <label htmlFor="settings-avatar-upload" className="btn btn-outline btn-sm">
                Change Photo
              </label>
              <p className="text-muted text-sm">JPG, PNG or WebP. Max 2MB. Square images work best.</p>
              {avatarError && (
                <p className="text-danger text-sm mt-1">{avatarError}</p>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <div className="form-grid">
            <div className="form-group">
              <label className="input-label">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={saving}
                isDisabled={saveSuccess}
                icon={saveSuccess ? FiCheck : undefined}
              >
                {saveSuccess ? 'Saved!' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={handleCancel} isDisabled={saving || saveSuccess}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-muted">Name: {displayName}</p>
            <p className="text-muted">Email: {displayEmail}</p>
            <p className="text-muted">Role: {displayRole}</p>
          </div>
        )}
      </div>
    </div>
  );
};
