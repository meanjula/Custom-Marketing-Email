import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import EmailListContainer from './containers/campaignEmail/EmailListContainer';
import CampaignEmailContainer from './containers/campaignEmail/campaignEmail.container';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/campaigns" replace />} />
          <Route path="/campaigns" element={<EmailListContainer />} />
          <Route path="/campaigns/create" element={<CampaignEmailContainer />} />
          <Route path="/campaigns/edit/:id" element={<CampaignEmailContainer />} />
          <Route path="*" element={<Navigate to="/campaigns" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
