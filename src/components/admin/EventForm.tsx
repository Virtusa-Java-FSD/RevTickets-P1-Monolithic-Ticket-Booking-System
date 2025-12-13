import { useState } from 'react';

interface Event {
    id?: number;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    price: number;
    seats: number;
    imageUrl: string;
    category: string;
}

interface EventFormProps {
    event?: Event;
    onSave: (event: Event) => void;
    onCancel: () => void;
}

const EventForm = ({ event, onSave, onCancel }: EventFormProps) => {
    const [formData, setFormData] = useState<Event>(event || {
        title: '',
        description: '',
        eventDate: '',
        location: '',
        price: 0,
        seats: 0,
        imageUrl: '',
        category: 'Concert'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'seats' ? Number(value) : value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
                <div className="form-group">
                    <label>Event Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter event title"
                    />
                </div>

                <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="Concert">Concert</option>
                        <option value="Sports">Sports</option>
                        <option value="Theater">Theater</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Conference">Conference</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Enter event description"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Event Date *</label>
                    <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Location *</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="Enter venue location"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="0"
                    />
                </div>

                <div className="form-group">
                    <label>Total Seats *</label>
                    <input
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="0"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Image URL *</label>
                <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn-cancel">
                    Cancel
                </button>
                <button type="submit" className="btn-save">
                    {event ? 'Update Event' : 'Create Event'}
                </button>
            </div>
        </form>
    );
};

export default EventForm;
