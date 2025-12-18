import { useState } from 'react';

interface Movie {
    id?: number;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    rating?: number;
    genre?: string;
    duration?: number;
    releaseDate?: string;
    language?: string;
    format?: string;
    price?: number;
    isNewRelease?: boolean;
}

interface MovieFormProps {
    movie?: Movie;
    onSave: (movie: Movie) => void;
    onCancel: () => void;
}

const MovieForm = ({ movie, onSave, onCancel }: MovieFormProps) => {
    const [formData, setFormData] = useState<Movie>(movie || {
        title: '',
        description: '',
        category: 'movie',
        imageUrl: '',
        rating: 0,
        genre: '',
        duration: 0,
        releaseDate: '',
        language: 'English',
        format: '2D',
        price: 0,
        isNewRelease: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                    type === 'number' ? (value === '' ? 0 : Number(value)) :
                    value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
                <div className="form-group">
                    <label>Movie Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter movie title"
                    />
                </div>

                <div className="form-group">
                    <label>Language *</label>
                    <select name="language" value={formData.language} onChange={handleChange} required>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Marathi">Marathi</option>
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
                    placeholder="Enter movie description"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Genre *</label>
                    <input
                        type="text"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Action, Drama, Comedy"
                    />
                </div>

                <div className="form-group">
                    <label>Format *</label>
                    <select name="format" value={formData.format} onChange={handleChange} required>
                        <option value="2D">2D</option>
                        <option value="3D">3D</option>
                        <option value="IMAX">IMAX</option>
                        <option value="4DX">4DX</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Duration (minutes) *</label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="120"
                    />
                </div>

                <div className="form-group">
                    <label>Release Date *</label>
                    <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Rating (0-10) *</label>
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="8.5"
                    />
                </div>

                <div className="form-group">
                    <label>Base Price (₹) *</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="200"
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
                    placeholder="https://example.com/movie-poster.jpg"
                />
            </div>

            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        name="isNewRelease"
                        checked={formData.isNewRelease}
                        onChange={handleChange}
                    />
                    Mark as New Release
                </label>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn-cancel">
                    Cancel
                </button>
                <button type="submit" className="btn-save">
                    {movie ? 'Update Movie' : 'Create Movie'}
                </button>
            </div>
        </form>
    );
};

export default MovieForm;


