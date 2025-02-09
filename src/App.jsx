import React, { useState } from 'react';
import ExpenseTracker from './components/ExpenseTracker';
import LandingPage from './components/LandingPage';

const App = () => {
  const [showExpenseTracker, setShowExpenseTracker] = useState(false);

  return (
    <div>
      {!showExpenseTracker ? (
        <LandingPage onEnter={() => setShowExpenseTracker(true)} />
      ) : (
        <ExpenseTracker onReturn={() => setShowExpenseTracker(false)} />
      )}
    </div>
  );
};

export default App;