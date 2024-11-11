import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';

import CustomerRegistrationPage from './components/CustomerRegistration';
import DashboardLayout from './components/dashboard/DashboardLayout';
import VerifyPage from './components/dashboard/VerifyPage';
import TransactionsPage from './components/dashboard/TransactionPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/customerLogin" element={<LoginPage />} />
        <Route path='/registration' element={<CustomerRegistrationPage/>}/>
        <Route path="/dashboard" element={
          <DashboardLayout>
            <Navigate to="/dashboard/verify" replace />
          </DashboardLayout>
        } />
        <Route path="/dashboard/verify" element={
          <DashboardLayout>
            <VerifyPage />
          </DashboardLayout>
        } />
        <Route path="/dashboard/transaction" element={
          <DashboardLayout>
            <TransactionsPage />
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
