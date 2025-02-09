import React from 'react';

const LandingPage = ({ onEnter }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center before:absolute before:inset-0 before:bg-black/50"
      style={{
        backgroundImage: "url('/expense2.jpg')" 
      }}
    >
      <div className="text-center">
      <h1 class="text-4xl font-bold mb-4">
    Always been bothered about manually calculating your income and expenses?
       </h1>
      <p class="text-lg mb-6 pb-8">
    Say no more! <span class="text-blue-500 font-semibold">MONEY LENS</span> gat you covered.
       </p>
 
        <button
          onClick={onEnter}
          className="bg-blue-300 text-white  hover:bg-white hover:text-black  font-bold py-4 px-8 rounded-lg shadow-lg transform transition hover:scale-105 text-xl cursor-pointer"
        >
          Track My cash-flow
        </button>
      </div>
    </div>
  );
};

export default LandingPage;