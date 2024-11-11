import React, { useState } from 'react';

const TransactionPage = () => {
    
  const [transactionData, setTransactionData] = useState({
    amount: "",
    currency: "",
    accountNumber: "",
    swiftCode: ""
  });

  const [status, setStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
  };

  async function handleSubmitTransaction(e){
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    const resp = await fetch(`https://localhost:3001/transaction/pay`,
       { method: "POST", 
        headers: {"Authorization" : `Bearer ${token}`},
        body: JSON.stringify(transactionData)
       })
       .catch(error =>{
        window.alert(error);
        return;
       });

    if(resp.ok){
        setStatus({ type: 'success', message: 'Transaction successful!' });
    }else{
        setStatus({ type: 'failure', message: 'Transaction failed!' });
    }
  };

  return (
      <div className="transaction-page">
        <h2 className="transaction-title">Make a Transaction</h2>

        {status.type && (
          <div
            className={`transaction-status ${
              status.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmitTransaction} className="transaction-form">
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={transactionData.amount}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
                <label htmlFor="currency" className="form-label">
                    Currency:
                </label>
                <select
                    id="currency"
                    name="currency"
                    value={transactionData.currency}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    >
                    <option value="">Select Currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="AUD">AUD</option>
                    <option value="CAD">CAD</option>
                    <option value="JPY">JPY</option>
                    <option value="INR">INR</option>
                    <option value="CNY">CNY</option>
                    <option value="MXN">MXN</option>
                    <option value="SGD">SGD</option>
                </select>
          </div>

          <div className="form-group">
            <label htmlFor="provider" className="form-label">
              Provider:
            </label>
            <textarea
              id="provider"
              name="provider"
              value={"SWIFT"}
              className="form-input"
              disabled
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="account_number" className="form-label">
              Recipient Account Number:
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={transactionData.accountNumber}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="account_number" className="form-label">
              SWIFT Code:
            </label>
            <input
              type="text"
              id="swiftCode"
              name="swiftCode"
              value={transactionData.swiftCode}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit Transaction
          </button>
        </form>
      </div>
  );
};

export default TransactionPage;