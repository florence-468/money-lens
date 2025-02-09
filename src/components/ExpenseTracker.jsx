import React, { useState, useEffect } from 'react';
import { PlusCircle, Wallet, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';


const SummaryCard = ({ title, amount, icon: Icon, type }) => {
  const getTextColor = () => {
    if (type === 'balance') return amount >= 0 ? 'text-green-600' : 'text-red-600';
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Icon className={type === 'income' ? 'text-green-500' : 'text-red-500'} />
      </div>
      <p className={`text-2xl font-bold ${getTextColor()}`}>
        #{Math.abs(amount).toFixed(2)}
      </p>
    </div>
  );
};

const TransactionForm = ({ onSubmit, categories }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('general');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    onSubmit({
      description,
      amount: parseFloat(amount),
      type,
      category,
    });

    setDescription('');
    setAmount('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="flex-1 p-2 border rounded-md"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full md:w-32 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCategory(categories[e.target.value][0]);
            }}
            className="p-2 border rounded-md"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded-md"
          >
            {categories[type].map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <PlusCircle className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

const TransactionList = ({ transactions, onDelete, onFilter }) => {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredAndSortedTransactions = () => {
    let filtered = transactions;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    return filtered.sort((a, b) => {
      const sortMultiplier = sortOrder === 'desc' ? -1 : 1;
      if (sortBy === 'date') {
        return sortMultiplier * (new Date(b.date) - new Date(a.date));
      }
      if (sortBy === 'amount') {
        return sortMultiplier * (b.amount - a.amount);
      }
      return 0;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <div className="flex gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedTransactions().length === 0 ? (
          <p className="text-gray-500 text-center">No transactions found</p>
        ) : (
          filteredAndSortedTransactions().map(transaction => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <p className="font-semibold">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {transaction.category} • {transaction.date}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p
                  className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}#{transaction.amount.toFixed(2)}
                </p>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ExpenseTracker = ({ onReturn }) => {  
  const [transactions, setTransactions] = useState([]);

  const categories = {
    expense: ['food', 'transportation', 'power-supply', 'subscription', 'general'],
    income: ['salary', 'allowance', 'investments', 'other']
  };

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  
  const totals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc.income += transaction.amount;
    } else {
      acc.expenses += transaction.amount;
    }
    return acc;
  }, { income: 0, expenses: 0 });

  const balance = totals.income - totals.expenses;

  const handleAddTransaction = (transactionData) => {
    const newTransaction = {
      id: Date.now(),
      ...transactionData,
      date: new Date().toLocaleDateString()
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/expense2.jpg')"
      }}
    >
    
      <button
        onClick={onReturn}
        className="fixed top-4 right-4 bg-blue-500 text-white  hover:bg-white hover:text-black font-semibold py-2 px-4 rounded-lg shadow-lg transform transition hover:scale-105 z-50"
      >
        Return Home
      </button>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">money lens</h1>
          <p className="text-gray-600 pb-9 pt-3">Let's help you Track your income and expenses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Balance"
            amount={balance}
            icon={Wallet}
            type="balance"
          />
          <SummaryCard
            title="Income"
            amount={totals.income}
            icon={TrendingUp}
            type="income"
          />
          <SummaryCard
            title="Expenses"
            amount={totals.expenses}
            icon={TrendingDown}
            type="expense"
          />
        </div>

        <TransactionForm
          onSubmit={handleAddTransaction}
          categories={categories}
        />

        <TransactionList
          transactions={transactions}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default ExpenseTracker;