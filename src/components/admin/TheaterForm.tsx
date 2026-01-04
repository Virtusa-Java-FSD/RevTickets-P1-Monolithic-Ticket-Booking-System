import { useState } from 'react';

interface Theater {
    id?: number;
    name: string;
    location?: string;
    city?: string;
    state?: string;
    totalScreens?: number;
    isActive?: boolean;
}

interface TheaterFormProps {
    theater?: Theater;
    onSave: (theater: Theater) => void;
    onCancel: () => void;
}

const TheaterForm = ({ theater, onSave, onCancel }: TheaterFormProps) => {
    const [formData, setFormData] = useState<Theater>(theater || {
        name: '',
        location: '',
        city: '',
        state: '',
        totalScreens: 1,
        isActive: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                    type === 'number' ? (value === '' ? 1 : Number(value)) :
                    value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
                <div className="form-group">
                    <label>Theater Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter theater name"
                    />
                </div>

                <div className="form-group">
                    <label>City *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleChange}
                        required
                        placeholder="Enter city"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>State *</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state || ''}
                        onChange={handleChange}
                        required
                        placeholder="Enter state"
                    />
                </div>

                <div className="form-group">
                    <label>Total Screens *</label>
                    <input
                        type="number"
                        name="totalScreens"
                        value={formData.totalScreens || 1}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="4"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Location</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    placeholder="Enter full address (optional)"
                />
            </div>

            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive !== false}
                        onChange={handleChange}
                    />
                    Active
                </label>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn-cancel">
                    Cancel
                </button>
                <button type="submit" className="btn-save">
                    {theater ? 'Update Theater' : 'Create Theater'}
                </button>
            </div>
        </form>
    );
};

export default TheaterForm;







