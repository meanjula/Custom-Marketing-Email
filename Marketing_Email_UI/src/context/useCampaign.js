import { useContext } from 'react';
import { CampaignContext } from './campaignContextInstance';

export function useCampaign() {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error('useCampaign must be used inside CampaignProvider');
  return ctx;
}
