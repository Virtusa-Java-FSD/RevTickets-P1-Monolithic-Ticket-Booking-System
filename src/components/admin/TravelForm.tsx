import { useState } from 'react';

interface Travel {
    id?: number;
    type: string;
    operator: string;
    vehicleNumber: string;
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    availableSeats: number;
    rating: number;
    amenities: string[];
}

interface TravelFormProps {
    travel?: Travel;
    onSave: (travel: Travel) => void;
    onCancel: () => void;
}

const TravelForm = ({ travel, onSave, onCancel }: TravelFormProps) => {
    const [formData, setFormData] = useState<Travel>(travel || {
        type: 'bus',
        operator: '',
        vehicleNumber: '',
        departure: '',
        arrival: '',
        departureTime: '',
        arrivalTime: '',
        duration: '',
        price: 0,
        availableSeats: 0,
        rating: 0,
        amenities: []
    });

    const [amenitiesInput, setAmenitiesInput] = useState(
        travel?.amenities?.join(', ') || ''
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const travelData = {
            ...formData,
            amenities: amenitiesInput.split(',').map(a => a.trim()).filter(a => a)
        };
        onSave(travelData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'availableSeats' || name === 'rating'
                ? Number(value)
                : value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
                <div className="form-group">
                    <label>Type *</label>
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="bus">Bus</option>
                        <option value="flight">Flight</option>
                        <option value="train">Train</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Operator *</label>
                    <input
                        type="text"
                        name="operator"
                        value={formData.operator}
                        onChange={handleChange}
                        required
                        placeholder={
                            formData.type === 'flight' ? 'e.g., IndiGo, Air India' :
                                formData.type === 'train' ? 'e.g., Indian Railways' :
                                    'e.g., Volvo, Mercedes'
                        }
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>
                        {formData.type === 'flight' ? 'Flight Number' :
                            formData.type === 'train' ? 'Train Number' :
                                'Vehicle Number'} *
                    </label>
                    <input
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        required
                        placeholder={
                            formData.type === 'flight' ? 'e.g., 6E-123, AI-456' :
                                formData.type === 'train' ? 'e.g., 12951, 12027' :
                                    'e.g., KA-01-AB-1234'
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Rating (0-5) *</label>
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                        min="0"
                        max="5"
                        step="0.1"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>From (Departure) *</label>
                    <input
                        type="text"
                        name="departure"
                        value={formData.departure}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Delhi"
                    />
                </div>

                <div className="form-group">
                    <label>To (Arrival) *</label>
                    <input
                        type="text"
                        name="arrival"
                        value={formData.arrival}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Mumbai"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Departure Time *</label>
                    <input
                        type="text"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleChange}
                        required
                        placeholder={
                            formData.type === 'flight' ? 'e.g., 06:00, 14:00' :
                                formData.type === 'train' ? 'e.g., 16:55, 06:00' :
                                    'e.g., 20:00, 22:30'
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Arrival Time *</label>
                    <input
                        type="text"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleChange}
                        required
                        placeholder={
                            formData.type === 'flight' ? 'e.g., 08:30, 16:30' :
                                formData.type === 'train' ? 'e.g., 08:35+1, 14:25' :
                                    'e.g., 12:00+1, 05:30+1'
                        }
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Duration *</label>
                    <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        placeholder={
                            formData.type === 'flight' ? 'e.g., 2h 30m, 1h 45m' :
                                formData.type === 'train' ? 'e.g., 15h 40m, 8h 25m' :
                                    'e.g., 16h, 7h'
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Available Seats *</label>
                    <input
                        type="number"
                        name="availableSeats"
                        value={formData.availableSeats}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>

                <div className="form-group">
                    <label>Amenities (comma separated)</label>
                    <input
                        type="text"
                        value={amenitiesInput}
                        onChange={(e) => setAmenitiesInput(e.target.value)}
                        placeholder={
                            formData.type === 'flight' ? 'e.g., WiFi, Meals, Entertainment' :
                                formData.type === 'train' ? 'e.g., AC, Meals, Bedding' :
                                    'e.g., AC, WiFi, Charging Point'
                        }
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn-cancel">
                    Cancel
                </button>
                <button type="submit" className="btn-save">
                    {travel ? 'Update Travel' : 'Create Travel'}
                </button>
            </div>
        </form>
    );
};

export default TravelForm;
