import { useState, useEffect } from 'react';

interface ConnectionStatusProps {
  onConnectionChange?: (connected: boolean) => void;
}

const ConnectionStatus = ({ onConnectionChange }: ConnectionStatusProps) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('http://localhost:8081/api/events', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      const connected = response.ok;
      setIsConnected(connected);
      if (onConnectionChange) {
        onConnectionChange(connected);
      }
    } catch (error) {
      setIsConnected(false);
      if (onConnectionChange) {
        onConnectionChange(false);
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null || isChecking) {
    return null; // Don't show anything while checking
  }

  if (!isConnected) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#ef4444',
        color: 'white',
        padding: '0.5rem 1rem',
        textAlign: 'center',
        zIndex: 9999,
        fontSize: '0.9rem',
        fontWeight: 500
      }}>
        ⚠️ Backend server is not connected. Some features may not work. 
        <button 
          onClick={checkConnection}
          style={{
            marginLeft: '1rem',
            background: 'white',
            color: '#ef4444',
            border: 'none',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
};

export default ConnectionStatus;

