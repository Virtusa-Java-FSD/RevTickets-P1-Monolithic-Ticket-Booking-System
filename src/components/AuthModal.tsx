import React from 'react';
import '../styles/authModal.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="auth-modal-header">
                    <h3>Sign In Required</h3>
                    <button className="auth-modal-close" onClick={onClose}>×</button>
                </div>
                <div className="auth-modal-body">
                    <div className="auth-modal-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <p>Please sign in to book tickets!</p>
                </div>
                <div className="auth-modal-footer">
                    <button className="auth-modal-btn auth-modal-btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="auth-modal-btn auth-modal-btn-primary" onClick={onLogin}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
