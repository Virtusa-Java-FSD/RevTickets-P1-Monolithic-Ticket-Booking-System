// Test if backend is accessible
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Backend test response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};

// Test with a simple ping
export const pingBackend = async () => {
  try {
<<<<<<< HEAD
    await fetch('http://localhost:8081', {
=======
    const response = await fetch('http://localhost:8080', {
>>>>>>> Develop
      method: 'GET',
      mode: 'no-cors'
    });
    console.log('Backend ping successful');
    return true;
  } catch (error) {
    console.error('Backend ping failed:', error);
    return false;
  }
};