import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GoogleSignInProps {
    mode?: 'login' | 'register';
}

declare global {
    interface Window {
        google: any;
    }
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ mode = 'login' }) => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const buttonRef = useRef<HTMLDivElement>(null);
    const [showFallback, setShowFallback] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let checkInterval: NodeJS.Timeout;

        const initializeGoogleSignIn = () => {
            if (window.google && buttonRef.current) {
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
                
                if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID' || clientId.trim() === '') {
                    setShowFallback(true);
                    return;
                }

                try {
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleCredentialResponse,
                    });

                    window.google.accounts.id.renderButton(
                        buttonRef.current,
                        {
                            theme: 'outline',
                            size: 'large',
                            width: '100%',
                            text: mode === 'login' ? 'signin_with' : 'signup_with',
                            locale: 'en'
                        }
                    );
                    setIsInitialized(true);
                } catch (error) {
                    console.error('Error initializing Google Sign-In:', error);
                    setShowFallback(true);
                }
            }
        };

        if (window.google) {
            initializeGoogleSignIn();
        } else {
            checkInterval = setInterval(() => {
                if (window.google) {
                    clearInterval(checkInterval);
                    initializeGoogleSignIn();
                }
            }, 100);

            timeoutId = setTimeout(() => {
                if (!isInitialized) {
                    clearInterval(checkInterval);
                    setShowFallback(true);
                }
            }, 5000);
        }

        return () => {
            if (checkInterval) clearInterval(checkInterval);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [mode, isInitialized]);

    const handleCredentialResponse = async (response: any) => {
        try {
            await loginWithGoogle(response.credential);
            const authData = localStorage.getItem('rev_auth');
            if (authData) {
                const { user } = JSON.parse(authData);
                if (user?.role === 'ADMIN') {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }
            } else {
                navigate("/");
            }
        } catch (error: any) {
            console.error('Google sign-in error:', error);
            alert('Google sign-in failed: ' + (error.message || 'Unknown error'));
        }
    };

    const handleFallbackClick = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
        if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
            alert('Google Sign-In is not configured. Please set VITE_GOOGLE_CLIENT_ID in .env file');
            return;
        }
        
        if (window.google) {
            window.google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: 'email profile',
                callback: (response: any) => {
                    if (response.access_token) {
                        handleCredentialResponse({ credential: response.access_token });
                    }
                },
            }).requestAccessToken();
        } else {
            alert('Google Sign-In SDK is not loaded. Please refresh the page.');
        }
    };

    return (
        <div className="google-signin-container">
            {showFallback && !isInitialized ? (
                <button
                    type="button"
                    onClick={handleFallbackClick}
                    className="google-signin-fallback"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '8px' }}>
                        <path
                            fill="#4285F4"
                            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                        />
                        <path
                            fill="#34A853"
                            d="M9 18c2.43 0 4.467-.806 5.96-2.184l-2.908-2.258c-.806.54-1.837.86-3.052.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
                        />
                        <path
                            fill="#EA4335"
                            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
                        />
                    </svg>
                    Sign in with Google
                </button>
            ) : (
                <div ref={buttonRef} className="google-signin-button"></div>
            )}
        </div>
    );
};

export default GoogleSignIn;

