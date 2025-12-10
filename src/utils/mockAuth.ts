// Mock authentication service - fallback when backend is not available
// No pre-populated users - users must register first
export const mockUsers: any[] = [];

export const mockLogin = async (email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = `mock-token-${user.id}-${Date.now()}`;
    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

export const mockRegister = async (name: string, email: string, phone: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    phone,
    password
  };
  
  mockUsers.push(newUser);
  
  const token = `mock-token-${newUser.id}-${Date.now()}`;
  return {
    success: true,
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone
    }
  };
};