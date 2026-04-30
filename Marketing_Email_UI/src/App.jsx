import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmailListContainer from './containers/campaignEmail/EmailListContainer';
import CampaignEmailContainer from './containers/campaignEmail/campaignEmail.container';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/campaigns" replace />} />
          <Route path="/campaigns" element={<EmailListContainer />} />
          <Route path="/campaigns/create" element={<CampaignEmailContainer />} />
          <Route path="/campaigns/edit/:id" element={<CampaignEmailContainer />} />
          <Route path="*" element={<Navigate to="/campaigns" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
