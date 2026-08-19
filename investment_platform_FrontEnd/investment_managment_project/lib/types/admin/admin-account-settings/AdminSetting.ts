export type AdminSettingsFormValues = {
  // Platform
  platformName: string;
  supportEmail: string;
  paymentApiKey: string;
  sessionDuration: number;

  // Finance
  minimumInvestment: number;
  dailyWithdrawLimit: number;
  transactionFee: number;

  // Features
  instantDeposit: boolean;
  createProject: boolean;
  sms2FA: boolean;
  liveSupport: boolean;
};