// Mock authentication service for development
export const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    password: "password123"
  },
  {
    id: 2,
    name: "Jane Smith", 
    email: "jane@example.com",
    phone: "0987654321",
    password: "password123"
  }
];

export const mockLogin = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
        phone: user.phone
      }
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

export const mockRegister = async (name: string, email: string, phone: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }
  
  // Create new user
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