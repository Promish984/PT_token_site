import axios from 'axios';

export const mineTokens = async (amount, username) => {
  try {
    const response = await axios.post('/api/mine', { amount, username });
    return response.data;
  } catch (error) {
    console.error('Error mining tokens:', error);
    throw error;
  }
};

export const sendTokens = async (from, to, amount) => {
  try {
    const response = await axios.post('/api/send', { from, to, amount });
    return response.data;
  } catch (error) {
    console.error('Error sending tokens:', error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const response = await axios.get('/api/transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getBalance = async () => {
  try {
    const response = await axios.get('/api/balance');
    return response.data;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};