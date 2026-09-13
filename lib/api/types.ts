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
  onboardingCompleted?: boolean;
  onboardingCompletedAt?: string | null;
};

export type Profile = {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  timezone: string | null;
  planCode: string;
  onboardingCompleted?: boolean;
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

export type BlogLayout = {
  template?: "magazine" | "grid" | "editorial" | string;
  accentColor?: string;
  contentWidth?: string;
  cardStyle?: string;
  heroStyle?: string;
  typography?: string;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  showCover?: boolean;
  showToc?: boolean;
};

export type BlogPostSummary = {
  id: string;
  slug: string;
  locale?: string;
  requestedLocale?: string;
  fallbackUsed?: boolean;
  title: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  authorName?: string | null;
  tags?: string[];
  featured?: boolean;
  publishedAt?: string | null;
  updatedAt?: string | null;
  readingTimeMinutes?: number;
  layout?: BlogLayout;
  seo?: { title?: string; description?: string; [key: string]: unknown };
};

export type BlogPost = BlogPostSummary & {
  contentMarkdown?: string;
  contentBlocks?: JsonObject[];
  tableOfContents?: Array<{ text: string; level?: number; anchor?: string }>;
  relatedArticles?: BlogPostSummary[];
  alternateLocales?: string[];
};

export type BlogListResponse = {
  site?: JsonObject;
  locale?: string;
  fallbackLocale?: string;
  layout?: BlogLayout;
  posts?: BlogPostSummary[];
};

export type BlogDetailResponse = {
  site?: JsonObject;
  post?: BlogPost;
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
  type: "translation" | "grammar" | "natural_expression" | "pronunciation";
  content: string | JsonObject;
  generatedAt: string;
};

export type PronunciationFeedback = {
  messageId: string | null;
  outputType: "pronunciation";
  content: {
    text: string;
    passed: boolean;
    score: number;
    correctedText: string;
    targetText: string;
    spokenText: string;
  };
  provider?: string;
  model?: string;
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

export type ReadingMaterial = {
  id: string;
  kind: "sample" | "user_text" | string;
  ownerUserId: string | null;
  title: string;
  content: string;
  contentLanguageCode: string;
  sourceFileName: string | null;
  status: "ready" | "processing" | "failed" | string;
  wordCount: number;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
};

export type ReadingVocabularyItem = {
  id: string;
  materialId: string;
  word: string;
  meaning: string;
  example: string;
  displayOrder: number;
  audioUrl?: string | null;
};

export type ReadingQuestion = {
  id: string;
  materialId: string;
  prompt: string;
  options: string[];
  displayOrder: number;
  correctOptionIndex?: number;
};

export type ReadingNotes = {
  materialId: string;
  content: string;
  updatedAt: string | null;
};

export type ReadingProgress = {
  materialId: string;
  readCompleted?: boolean;
  vocabularyViewed?: boolean;
  questionCount: number;
  answeredCount: number;
  correctCount: number;
  notesUpdatedAt?: string | null;
  lastOpenedAt?: string | null;
};

export type ReadingMaterialBundle = {
  material: ReadingMaterial;
  vocabulary: ReadingVocabularyItem[];
  questions: ReadingQuestion[];
  notes?: ReadingNotes | null;
  progress?: ReadingProgress | null;
  ui?: {
    category?: string;
    duration?: string;
    keyIdea?: string;
    tipTitle?: string;
    tipBody?: string;
  };
};

export type ReadingAttempt = {
  attemptId: string;
  materialId: string;
  score: number;
  total: number;
  answers: Array<{
    questionId: string;
    selectedOptionIndex: number;
    correct: boolean;
    correctOptionIndex?: number;
  }>;
  completedAt: string;
};

export type ReadingUpload = {
  signedUrl: string;
  objectPath?: string;
  path?: string;
  bucket?: string;
  expiresIn?: number;
};

export type ReadingAudio = {
  audioUrl: string;
  expiresAt?: string;
};
