export type FloralTheme = "rose" | "jasmine" | "marigold" | "mogra";

export type ColorMood = "romantic-pink" | "royal-gold" | "garden-green";

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index into options (0, 1, or 2)
  enabled: boolean;
  isCustom: boolean;
}

export interface UploadedAsset {
  name: string;
  url: string;
  path: string;
  mimeType: string;
  size: number;
}

export interface AnniversaryOrderState {
  // Step 1 — Couple Details
  yourName: string;
  partnerName: string;
  anniversaryDate: string;
  yearsTogether: number;
  couplePhoto: UploadedAsset | null;

  // Step 2 — Quiz Builder
  questions: QuizQuestion[];

  // Step 3 — Personalise Theme
  floralTheme: FloralTheme;
  colorMood: ColorMood;
  customBgPhoto: UploadedAsset | null;

  // Step 4 — Personal Message
  loveNote: string;
  voiceNote: UploadedAsset | null;
  backgroundMusic: string | null;
  /** Custom uploaded audio file for background music (not a predefined track) */
  customBackgroundMusic: UploadedAsset | null;

  // Contact / Payment
  phone: string;
  email: string;
}

export interface AnniversaryRazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface AnniversaryPaymentVerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderData: AnniversaryOrderState;
}
