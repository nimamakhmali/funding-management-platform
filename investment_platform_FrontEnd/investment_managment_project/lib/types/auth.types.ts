export type LoginFormValues = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type OtpFormValues = {
  otp: string;
};

export type SignupFormValues = {
  mobile: string;
  role: "investor" | "executor";
  terms: boolean;
};

export type SignupOtpFormValues = {
  otp: string;
};
export type SignupFormData = {
  mobile: string;
  username: string;
  password: string;
};
export type ForgotPasswordFormValues = {
  mobile: string;
};