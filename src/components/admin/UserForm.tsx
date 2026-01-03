import { useState } from 'react';

interface User {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    role?: string;
}

interface UserFormProps {
    user?: User;
    onSave: (user: User) => void;
    onCancel: () => void;
}

const UserForm = ({ user, onSave, onCancel }: UserFormProps) => {
    const [formData, setFormData] = useState<User>(user || {
        name: '',
        email: '',
        phone: '',
        role: 'USER'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
                <div className="form-group">
                    <label>Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter user name"
                    />
                </div>

                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email address"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                    />
                </div>

                <div className="form-group">
                    <label>Role *</label>
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn-cancel">
                    Cancel
                </button>
                <button type="submit" className="btn-save">
                    {user ? 'Update User' : 'Create User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;







