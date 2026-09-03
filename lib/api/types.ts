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

export type Profile = {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  timezone: string | null;
  planCode: string;
};

export type Settings = {
  nativeLanguageCode: string;
  learningLanguageCode: string;
  levelCode: string;
  partnerId: string | null;
  partnerPreferences: JsonObject;
};

export type Entitlement = {
  planCode: string;
  planName: string;
  status: string;
  canStartConversation: boolean;
  canUseVoice: boolean;
  currentPeriodEnd?: string;
  limits: {
    messagesPerDay: number | null;
    voiceSecondsPerDay: number | null;
    insightsPerDay: number | null;
  };
};

export type Partner = {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  gender: string | null;
  location: string | null;
  description: string | null;
  personality: string | null;
  avatarUrl: string | null;
  supportedModes: string[];
  configuration: JsonObject;
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
  clientMessageId?: string;
  role: "user" | "tutor" | "assistant" | string;
  content?: string;
  text?: string;
  inputType?: string;
  createdAt?: string;
  contentType?: string;
  processingStatus?: "pending" | "generating" | "succeeded" | "failed" | null;
  metadata?: JsonObject;
  occurredAt?: string;
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
  title?: string | null;
  language?: string | null;
  summary?: string | null;
  metadata?: JsonObject;
  startedAt?: string;
  lastMessageAt?: string | null;
  updatedAt?: string;
};

export type ConversationList = {
  items: TutorConversation[];
  nextCursor: string | null;
};

export type SendMessageResult = {
  userMessage: TutorMessage;
  tutorMessage: TutorMessage | null;
  idempotent: boolean;
  processing?: boolean;
};

export type WorkbenchData = {
  profile?: Profile | JsonObject;
  settings?: LanguageSettings;
  entitlement?: JsonObject;
  partner?: TutorPartner | JsonObject | null;
  currentConversation?: TutorConversation | null;
  conversation?: TutorConversation | null;
  recentConversations?: TutorConversation[];
  cards?: JsonObject[];
  todayMessageCount?: number;
  today?: { messageCount: number };
  savedCards?: LearningCard[];
  notices?: unknown[];
};

export type BillingPlan = {
  id?: string;
  code?: string;
  planCode?: string;
  name?: string;
  type?: string;
  currency?: string;
  amount?: number;
  price?: number;
  interval?: string;
  billingInterval?: string | null;
  providerProductId?: string | null;
  description?: string;
  features?: string[];
  popular?: boolean;
  entitlements?: JsonObject;
  isActive?: boolean;
};

export type BillingPlansResponse = {
  plans?: BillingPlan[];
};

export type CheckoutResponse = {
  checkoutUrl?: string;
  url?: string;
  orderId?: string;
  status?: "checkout_opened";
  sessionId?: string;
  expiresAt?: string;
  replayed?: boolean;
};

export type LearningCard = {
  id: string;
  prompt: string;
  answer: string | null;
  language: string | null;
  cardType: string;
  status: "active" | "paused" | "mastered" | "archived";
  reviewCount: number;
  nextReviewAt: string | null;
  lastReviewedAt: string | null;
  metadata: JsonObject;
  createdAt: string;
  updatedAt: string;
};

export type MessageOutput = {
  id: string;
  type: "translation" | "grammar" | "natural_expression";
  content: string | JsonObject;
  generatedAt: string;
};

export type VoiceUpload = {
  bucket: string;
  path: string;
  signedUrl: string;
  token: string;
  expiresIn: number;
  uploadUrl?: string;
  url?: string;
  audioPath?: string;
  objectPath?: string;
};

export type VoiceInput = {
  id: string;
  audioId?: string;
  conversationId: string;
  status: "pending" | "processing" | "succeeded" | "failed";
  transcript: string | null;
  languageCode: string | null;
  durationMs: number;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BillingOrder = {
  id: string;
  externalOrderId: string;
  planCode: string;
  name: string;
  provider: "waffo";
  status: string;
  currency: string;
  amount: number;
  paidAt: string | null;
  occurredAt: string;
};

export type BillingSubscription = {
  id: string;
  externalSubscriptionId: string;
  planCode: string;
  provider: "waffo";
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  updatedAt: string;
};

export type BillingMe = {
  entitlement: Entitlement;
  orders: BillingOrder[];
  subscriptions: BillingSubscription[];
};
