export type JsonObject = Record<string, unknown>;

export type ApiErrorPayload = {
  code?: string;
  message?: string;
  details?: unknown;
};

export type ApiEnvelope<T> = {
  data?: T;
  requestId?: string;
  error?: ApiErrorPayload;
  success?: boolean;
};

export class ApiError extends Error {
  code: string;
  details: unknown;
  requestId?: string;
  status: number;

  constructor(payload: ApiErrorPayload, status: number, requestId?: string) {
    super(payload.message || "The request could not be completed.");
    this.name = "ApiError";
    this.code = payload.code || "API_ERROR";
    this.details = payload.details;
    this.requestId = requestId;
    this.status = status;
  }
}

export type LanguageSettings = {
  nativeLanguageCode?: string;
  learningLanguageCode?: string;
  levelCode?: string;
  partnerId?: string | null;
};

export type TutorPartner = {
  id: string;
  name: string;
  gender?: string;
  location?: string;
  description?: string;
  avatarUrl?: string;
};

export type TutorMessage = {
  id: string;
  role: "user" | "tutor" | "assistant" | string;
  content?: string;
  text?: string;
  inputType?: string;
  createdAt?: string;
};

export type TutorConversation = {
  id: string;
  mode?: "say_it" | "talk" | string;
  status?: string;
  nativeLanguageCode?: string;
  learningLanguageCode?: string;
  levelCode?: string;
  messages?: TutorMessage[];
  createdAt?: string;
};

export type WorkbenchData = {
  profile?: JsonObject;
  settings?: LanguageSettings;
  entitlement?: JsonObject;
  partner?: TutorPartner | JsonObject | null;
  currentConversation?: TutorConversation | null;
  conversation?: TutorConversation | null;
  recentConversations?: TutorConversation[];
  cards?: JsonObject[];
  todayMessageCount?: number;
};

export type BillingPlan = {
  code?: string;
  planCode?: string;
  name?: string;
  type?: string;
  currency?: string;
  amount?: number;
  price?: number;
  interval?: string;
  description?: string;
  features?: string[];
  popular?: boolean;
};

export type BillingPlansResponse = {
  plans?: BillingPlan[];
};

export type CheckoutResponse = {
  checkoutUrl?: string;
  url?: string;
  orderId?: string;
};
