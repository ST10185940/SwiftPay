import React, { useState ,useEffect } from 'react';

function VerifyPage() {
  const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    async function getTransactions(){
      const token = sessionStorage.getItem('token');
        const response = await fetch(`https://localhost:3001/bankEmp/transactions/`,
          { method: "GET", 
            headers: {"Authorization" : `Bearer ${token}`}});   
        if(!response.ok){
            const message = `an error occurred: ${response.message}`;
            window.alert(message);
            return;
        }
        const transactions = await response.json();
        setTransactions(transactions.data);
   }
    getTransactions();
  }, []);

  async function Verify(id){
    const token = sessionStorage.getItem('token');
    await fetch(`https://localhost:3001/bankEmp/verify/${id}`,
       { method: "PATCH", 
        headers: {"Authorization" : `Bearer ${token}`}
       });
  };

  async function handleSendToSwift(){
    const token = sessionStorage.getItem('token');
    await fetch(`https://localhost:3001/bankEmp/submit/`,
       { method: "PATCH", 
        headers: {"Authorization" : `Bearer ${token}`}
       });
  };

  return (
    <div className="verify-page">
      <h2>Verify Transactions</h2>
      
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Currency</th>
              <th>Amount</th>
              <th>SWIFT</th>
              <th>Account Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction._id}>
                <td>{transaction._id.toString()}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.swiftCode}</td>

                <td>
                  <button
                    className={`verify-button ${transaction.isVerified ? 'verified' : ''}`}
                    onClick={() => Verify(transaction._id.toString())}
                    disabled={transaction.isVerified}
                  >
                    {transaction.isVerified ? 'Verified' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="swift-action">
        <button 
          className="send-swift-button"
          onClick={handleSendToSwift}
        >
          Submit all verified to SWIFT
        </button>
      </div>
    </div>
  );
}

export default VerifyPage;
