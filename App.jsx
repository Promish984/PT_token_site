import React, { useState, useEffect } from 'react';
import { FaCoins, FaExchangeAlt, FaHistory, FaSignOutAlt, FaSyncAlt } from 'react-icons/fa';
import { mineTokens, sendTokens, getTransactions, getBalance, getUsers } from './api';

const App = () => {
  const [activeTab, setActiveTab] = useState('mine');
  const [balance, setBalance] = useState(0);
  const [mineAmount, setMineAmount] = useState(100);
  const [sendAmount, setSendAmount] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('user1');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, transactionsRes, usersRes] = await Promise.all([
        getBalance(),
        getTransactions(),
        getUsers()
      ]);
      setBalance(balanceRes);
      setTransactions(transactionsRes);
      setUsers(usersRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleMine = async () => {
    try {
      const updatedUser = await mineTokens(mineAmount, username);
      setBalance(updatedUser.balance);
      await fetchData();
    } catch (error) {
      console.error('Error mining tokens:', error);
    }
  };

  const handleSend = async () => {
    try {
      await sendTokens(username, recipient, sendAmount);
      await fetchData();
      setSendAmount(0);
      setRecipient('');
    } catch (error) {
      console.error('Error sending tokens:', error);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleLogout = () => {
    alert('Logout functionality would go here');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 glow-effect">PT Token</h1>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('mine')}
            className={`flex items-center ${activeTab === 'mine' ? 'tab-active' : ''}`}
          >
            <FaCoins className="mr-2" /> Mine
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`flex items-center ${activeTab === 'send' ? 'tab-active' : ''}`}
          >
            <FaExchangeAlt className="mr-2" /> Send
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center ${activeTab === 'transactions' ? 'tab-active' : ''}`}
          >
            <FaHistory className="mr-2" /> Transactions
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'mine' && (
          <div className="max-w-md mx-auto bg-pk-dark border border-pk-gold rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Mine PT Tokens</h2>
            <div className="mb-6">
              <h3 className="text-xl mb-2">Principal:</h3>
              <p className="mb-1">- Mine: Make single answer messages and update answers.</p>
              <p className="mb-4">- Balance: {balance}</p>
              <div className="flex space-x-2">
                <button onClick={handleLogout} className="btn-outline flex items-center">
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
                <button onClick={handleRefresh} className="btn-outline flex items-center">
                  <FaSyncAlt className="mr-2" /> Refresh
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl mb-2">Mine PT Tokens</h3>
              <p className="mb-4">Enter the amount of PT Tokens you want to mine.</p>
              <div className="flex items-center">
                <input
                  type="number"
                  value={mineAmount}
                  onChange={(e) => setMineAmount(parseInt(e.target.value) || 0)}
                  className="input-field mr-2 w-20"
                />
                <button onClick={handleMine} className="btn-gold flex items-center">
                  M I N E
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'send' && (
          <div className="max-w-md mx-auto bg-pk-dark border border-pk-gold rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Send PK Tokens</h2>
            <div className="mb-4">
              <label className="block mb-2">Recipient:</label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="input-field w-full"
              >
                <option value="">Select a user</option>
                {users
                  .filter(user => user.username !== username)
                  .map(user => (
                    <option key={user.id} value={user.username}>
                      {user.username} (Balance: {user.balance})
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Amount:</label>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(parseInt(e.target.value) || 0)}
                className="input-field w-full"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!recipient || sendAmount <= 0 || sendAmount > balance}
              className="btn-gold w-full disabled:opacity-50"
            >
              S E N D
            </button>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="max-w-3xl mx-auto bg-pk-dark border border-pk-gold rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-pk-gold">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">From</th>
                    <th className="text-left py-2">To</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-pk-gold border-opacity-30">
                      <td className="py-2">{tx.id.slice(0, 8)}...</td>
                      <td className="py-2">{tx.from}</td>
                      <td className="py-2">{tx.to}</td>
                      <td className="py-2">{tx.amount}</td>
                      <td className="py-2">
                        {new Date(tx.timestamp * 1000).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;