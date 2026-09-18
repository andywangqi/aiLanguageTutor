import "server-only";

import type { User } from "@supabase/supabase-js";
import { generateMessageInsight, generatePronunciationFeedback, generateTutorReply, type TutorMode } from "@/lib/ai/tutor";
import { isQwenConfigured } from "@/lib/ai/qwen";
import { syncCentralEntity } from "@/lib/central/server";
import { createSupabaseAdminClient, getSupabaseUserFromRequest } from "@/lib/supabase/server";
import type { BillingPlan, JsonObject, TutorConversation, TutorMessage } from "./types";
import { defaultPlans as catalogPlans } from "@/lib/billing/catalog";

type LocalMessage = {
  id: string;
  conversationId: string;
  userId: string;
  role: "user" | "tutor";
  inputType: "text" | "voice";
  sourceLanguageCode?: string;
  targetLanguageCode?: string;
  content: string;
  sequenceNo: number;
  clientMessageId?: string;
  metadata?: JsonObject;
  createdAt: string;
};

type LocalConversation = {
  id: string;
  userId: string;
  mode: TutorMode;
  nativeLanguageCode: string;
  learningLanguageCode: string;
  levelCode: string;
  status: string;
  startedAt: string;
  updatedAt: string;
  messages: LocalMessage[];
};

type LocalCard = {
  id: string;
  userId: string;
  sourceMessageId?: string;
  phrase: string;
  meaning?: string;
  explanation?: string;
  languageCode: string;
  cardType: string;
  reviewState: string;
  createdAt: string;
};

type LocalVoiceInput = {
  id: string;
  userId: string;
  conversationId?: string;
  audioPath?: string;
  mimeType?: string;
  durationMs?: number;
  transcript?: string;
  createdAt: string;
};

type MemoryState = {
  conversations: Map<string, LocalConversation>;
  settingsByUser: Map<string, JsonObject>;
  cards: Map<string, LocalCard>;
  voiceInputs: Map<string, LocalVoiceInput>;
};

type RequestContext = {
  request: Request;
  requestId: string;
  user: User | null;
  userId: string;
};

type DbRow = Record<string, unknown>;

type GlobalWithMemory = typeof globalThis & {
  __aiTutorLocalApiMemory?: MemoryState;
};

const localRoots = new Set(["auth", "me", "workbench", "partners", "conversations", "messages", "cards", "voice", "billing"]);
const protectedLocalRoots = new Set(["workbench", "conversations", "messages", "cards", "voice"]);
const defaultPartner = {
  id: "clara-ruiz",
  slug: "clara-ruiz",
  name: "Clara Ruiz",
  displayName: "Clara Ruiz",
  gender: "female",
  location: "Valencia",
  description: "Calm, observant, gently witty",
  personality: "Calm, observant, gently witty",
  avatarUrl: null,
  supportedModes: ["say_it", "talk"]
};

const defaultPlans: BillingPlan[] = [
  ...catalogPlans,
  {
    code: "lifetime",
    planCode: "lifetime",
    name: "Lifetime",
    type: "one_time",
    currency: "USD",
    amount: 149,
    interval: "one_time",
    description: "One-time access for later pricing tests.",
    features: ["Unlimited conversations", "Current core features", "No subscription"]
  }
];

function memory() {
  const globalMemory = globalThis as GlobalWithMemory;
  globalMemory.__aiTutorLocalApiMemory ??= {
    conversations: new Map(),
    settingsByUser: new Map(),
    cards: new Map(),
    voiceInputs: new Map()
  };
  return globalMemory.__aiTutorLocalApiMemory;
}

export function shouldHandleLocalProductApi(segments: string[]) {
  const mode = process.env.PRODUCT_API_BACKEND?.trim().toLowerCase();
  if (!localRoots.has(segments[0] || "")) return false;
  if (mode === "central") return false;
  if (mode === "local") return true;

  return isQwenConfigured() && ["conversations", "messages", "voice"].includes(segments[0] || "");
}

export async function handleLocalProductApi(request: Request, segments: string[], requestId: string) {
  if (segments[0] === "ai-tutor") segments = segments.slice(1);
  if (!shouldHandleLocalProductApi(segments)) return null;

  const context: RequestContext = {
    request,
    requestId,
    user: await getSupabaseUserFromRequest(request),
    userId: "guest"
  };
  context.userId = context.user?.id || guestId(request);

  if (protectedLocalRoots.has(segments[0] || "") && !context.user) {
    return apiError("UNAUTHORIZED", "Sign in to use tutor practice data.", requestId, 401);
  }

  if (context.user) await ensureProfile(context.user, requestId);

  try {
    const method = request.method.toUpperCase();
    const path = segments.join("/");

    if (path === "auth/sync" && method === "POST") return ok(await syncAuth(context, await readBody(request)), requestId);
    if (path === "auth/logout" && method === "POST") return ok(await logout(context), requestId);
    if (path === "me" && method === "GET") return ok(await getMe(context), requestId);
    if (path === "me" && method === "PATCH") return ok(await updateMe(context, await readBody(request)), requestId);
    if (path === "me/settings" && method === "GET") return ok(await getSettings(context), requestId);
    if (path === "me/settings" && method === "PUT") return ok(await saveSettings(context, await readBody(request)), requestId);
    if (path === "me/partner" && method === "PATCH") return ok(await savePartner(context, await readBody(request)), requestId);
    if (path === "workbench" && method === "GET") return ok(await getWorkbench(context), requestId);
    if (path === "partners" && method === "GET") return ok({ partners: [defaultPartner] }, requestId);
    if (path === "conversations" && method === "POST") return ok(await createConversation(context, await readBody(request)), requestId);
    if (path === "conversations" && method === "GET") return ok(await listConversations(context), requestId);
    if (segments[0] === "conversations" && segments[1] && segments.length === 2 && method === "GET") return ok(await getConversation(context, segments[1]), requestId);
    if (segments[0] === "conversations" && segments[1] && segments[2] === "messages" && segments.length === 3 && method === "POST") {
      return ok(await sendConversationMessage(context, segments[1], await readBody(request), "text"), requestId);
    }
    if (segments[0] === "conversations" && segments[1] && segments[2] === "messages" && segments[3] === "from-voice" && method === "POST") {
      return ok(await sendConversationMessage(context, segments[1], await readBody(request), "voice"), requestId);
    }
    if (segments[0] === "conversations" && segments[1] && segments[2] === "reset" && method === "POST") return ok(await resetConversation(context, segments[1], await readBody(request)), requestId);
    if (segments[0] === "conversations" && segments[1] && segments[2] === "end" && method === "POST") return ok(await endConversation(context, segments[1]), requestId);
    if (path === "messages/translate" && method === "POST") return ok(await textMessageAction(context, "translation", await readBody(request)), requestId);
    if (path === "messages/grammar" && method === "POST") return ok(await textMessageAction(context, "grammar", await readBody(request)), requestId);
    if (path === "messages/pronunciation" && method === "POST") return ok(await textPronunciationAction(context, await readBody(request)), requestId);
    if (segments[0] === "messages" && segments[1] && segments.length === 3 && method === "POST") return ok(await messageAction(context, segments[1], segments[2], await readBody(request)), requestId);
    if (path === "cards" && method === "GET") return ok(await listCards(context), requestId);
    if (segments[0] === "cards" && segments[1] && method === "PATCH") return ok(await updateCard(context, segments[1], await readBody(request)), requestId);
    if (segments[0] === "cards" && segments[1] && method === "DELETE") return ok(await deleteCard(context, segments[1]), requestId);
    if (path === "voice/upload-url" && method === "POST") return ok(await createVoiceUploadUrl(context, await readBody(request)), requestId);
    if (path === "voice/inputs" && method === "POST") return ok(await registerVoiceInput(context, await readBody(request)), requestId);
    if (path === "billing/plans" && method === "GET") return ok({ plans: defaultPlans }, requestId);
    if (path === "billing/me" && method === "GET") return ok(defaultEntitlement(), requestId);
    if (path === "billing/checkout" && method === "POST") return paymentPending(requestId);
  } catch (error) {
    return apiError("INTERNAL_ERROR", error instanceof Error ? error.message : "The request could not be completed.", requestId, 500);
  }

  return apiError("NOT_FOUND", "Product API route not found.", requestId, 404);
}

async function readBody(request: Request) {
  return (await request.json().catch(() => ({}))) as JsonObject;
}

function ok<T>(data: T, requestId: string, status = 200) {
  return Response.json({ data, requestId, success: true }, { status, headers: { "X-Request-Id": requestId } });
}

function apiError(code: string, message: string, requestId: string, status: number, details?: unknown) {
  return Response.json({ error: { code, message, details }, requestId, success: false }, { status, headers: { "X-Request-Id": requestId } });
}

function paymentPending(requestId: string) {
  return apiError("PAYMENT_PENDING", "Waffo checkout is not configured yet.", requestId, 503);
}

function guestIdFromAnonymous(anonymousId: string) {
  return `guest_${anonymousId.slice(0, 64)}`;
}

function guestId(request: Request) {
  const browserId = request.headers.get("X-Browser-Id") || request.headers.get("X-Session-Id");
  return browserId ? guestIdFromAnonymous(browserId) : `guest_request_${crypto.randomUUID()}`;
}

function now() {
  return new Date().toISOString();
}

function stringField(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function numberField(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function modeField(value: unknown): TutorMode {
  return value === "talk" ? "talk" : "say_it";
}

function defaultSettings(): JsonObject {
  return {
    nativeLanguageCode: "zh-CN",
    learningLanguageCode: "en",
    levelCode: "auto",
    partnerId: null,
    onboardingCompleted: false,
    onboardingCompletedAt: null
  };
}

function defaultEntitlement() {
  return {
    planCode: "free",
    status: "active",
    canStartConversation: true,
    canUseVoice: true,
    provider: isQwenConfigured() ? "qwen" : "fallback"
  };
}

async function syncCentralSafely(entity: JsonObject, idempotencyKey: string) {
  if (!process.env.ZHYADMIN_SERVER_KEY?.trim()) return;
  try {
    await syncCentralEntity(entity);
  } catch {
    // Central sync is useful for reporting, but it must not block the tutor experience.
  }
}

async function ensureProfile(user: User, requestId: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const metadata = user.user_metadata as JsonObject;
  const displayName = stringField(metadata.full_name, stringField(metadata.name, user.email || "Learner"));
  const avatarUrl = stringField(metadata.avatar_url, "");
  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    display_name: displayName,
    avatar_url: avatarUrl || null,
    last_seen_at: now(),
    updated_at: now()
  }, { onConflict: "id" });

  const identity = Array.isArray(user.identities) ? user.identities[0] as unknown as Record<string, unknown> | undefined : undefined;
  const provider = stringField(identity?.provider, stringField(user.app_metadata?.provider, "google"));
  const providerSubject = stringField(identity?.id, user.id);
  await supabase.from("user_identities").upsert({
    user_id: user.id,
    provider,
    provider_subject: providerSubject,
    email_snapshot: user.email,
    provider_metadata: identity || {},
    last_login_at: now(),
    updated_at: now()
  }, { onConflict: "provider,provider_subject" });

  await supabase.from("user_language_settings").upsert({
    user_id: user.id,
    updated_at: now()
  }, { onConflict: "user_id" });

  await syncCentralSafely({ entityType: "profile", action: "upsert", userId: user.id, email: user.email }, `profile:${user.id}:${requestId}`);
}

function mergeLocalAnonymousData(anonymousId: string, userId: string) {
  const sourceUserId = guestIdFromAnonymous(anonymousId);
  const state = memory();
  let merged = false;

  for (const conversation of state.conversations.values()) {
    if (conversation.userId !== sourceUserId) continue;
    conversation.userId = userId;
    conversation.messages = conversation.messages.map((message) => ({ ...message, userId }));
    merged = true;
  }
  for (const card of state.cards.values()) {
    if (card.userId !== sourceUserId) continue;
    card.userId = userId;
    merged = true;
  }
  for (const voiceInput of state.voiceInputs.values()) {
    if (voiceInput.userId !== sourceUserId) continue;
    voiceInput.userId = userId;
    merged = true;
  }

  const anonymousSettings = state.settingsByUser.get(sourceUserId);
  if (anonymousSettings) {
    if (!state.settingsByUser.has(userId)) state.settingsByUser.set(userId, anonymousSettings);
    state.settingsByUser.delete(sourceUserId);
    merged = true;
  }
  return merged;
}

async function syncAuth(context: RequestContext, body: JsonObject) {
  if (!context.user) {
    return { profileSynced: false, identitySynced: false, settingsCreated: false, mode: "guest" };
  }

  const anonymousId = stringField(body.anonymousId);
  const anonymousDataMerged = anonymousId ? mergeLocalAnonymousData(anonymousId, context.user.id) : false;

  const supabase = createSupabaseAdminClient();
  await supabase?.from("auth_login_events").insert({
    user_id: context.user.id,
    provider: "google",
    event_type: "login_success",
    email_snapshot: context.user.email,
    user_agent: context.request.headers.get("User-Agent"),
    request_id: context.requestId,
    metadata: { product: "ai_language_tutor" }
  });

  await syncCentralSafely({ entityType: "auth", action: "login_success", userId: context.user.id, email: context.user.email }, `auth:${context.user.id}:${context.requestId}`);

  return { profileSynced: true, identitySynced: true, settingsCreated: true, anonymousDataMerged };
}

async function logout(context: RequestContext) {
  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    await supabase.from("auth_login_events").insert({
      user_id: context.user.id,
      provider: "google",
      event_type: "logout",
      email_snapshot: context.user.email,
      user_agent: context.request.headers.get("User-Agent"),
      request_id: context.requestId,
      metadata: { product: "ai_language_tutor" }
    });
  }
  return { loggedOut: true };
}

async function getMe(context: RequestContext) {
  const settings = await getSettings(context);
  return {
    profile: await profilePayload(context.user),
    settings,
    entitlement: defaultEntitlement()
  };
}

async function updateMe(context: RequestContext, body: JsonObject) {
  const supabase = createSupabaseAdminClient();
  const displayName = stringField(body.displayName);
  const avatarUrl = stringField(body.avatarUrl);
  if (context.user && supabase) {
    await supabase.from("profiles").update({
      ...(displayName ? { display_name: displayName } : {}),
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      updated_at: now()
    }).eq("id", context.user.id);
  }
  return getMe(context);
}

async function profilePayload(user: User | null) {
  if (!user) return { id: "guest", email: null, displayName: "Learner", avatarUrl: null, planCode: "free", onboardingCompleted: false };
  const supabase = createSupabaseAdminClient();
  const { data } = supabase ? await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle() : { data: null };
  const row = (data || {}) as DbRow;
  return {
    id: user.id,
    email: stringField(row.email, user.email || ""),
    displayName: stringField(row.display_name, stringField(user.user_metadata?.name, user.email || "Learner")),
    avatarUrl: stringField(row.avatar_url, "") || null,
    planCode: stringField(row.plan_code, "free"),
    onboardingCompleted: row.onboarding_completed === true
  };
}

async function getSettings(context: RequestContext) {
  const defaults = defaultSettings();
  const supabase = createSupabaseAdminClient();

  if (context.user && supabase) {
    const { data } = await supabase.from("user_language_settings").select("*").eq("user_id", context.user.id).maybeSingle();
    const row = (data || {}) as DbRow;
    if (data) {
      return {
        nativeLanguageCode: stringField(row.native_language_code, defaults.nativeLanguageCode as string),
        learningLanguageCode: stringField(row.learning_language_code, defaults.learningLanguageCode as string),
        levelCode: stringField(row.level_code, defaults.levelCode as string),
        partnerId: stringField(row.selected_partner_id, "") || null,
        onboardingCompleted: Boolean(row.onboarding_completed_at),
        onboardingCompletedAt: stringField(row.onboarding_completed_at, "") || null
      };
    }
  }

  return memory().settingsByUser.get(context.userId) || defaults;
}

async function saveSettings(context: RequestContext, body: JsonObject, completeOnboarding = true) {
  const completedAt = completeOnboarding ? now() : stringField(body.onboardingCompletedAt, "") || null;
  const settings = {
    nativeLanguageCode: stringField(body.nativeLanguageCode, "zh-CN"),
    learningLanguageCode: stringField(body.learningLanguageCode, "en"),
    levelCode: stringField(body.levelCode, "auto"),
    partnerId: stringField(body.partnerId, "") || null,
    onboardingCompleted: completeOnboarding || body.onboardingCompleted === true,
    onboardingCompletedAt: completedAt
  };
  memory().settingsByUser.set(context.userId, settings);

  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    await supabase.from("user_language_settings").upsert({
      user_id: context.user.id,
      native_language_code: settings.nativeLanguageCode,
      learning_language_code: settings.learningLanguageCode,
      level_code: settings.levelCode,
      selected_partner_id: settings.partnerId,
      ...(completeOnboarding ? { onboarding_completed_at: completedAt } : {}),
      updated_at: now()
    }, { onConflict: "user_id" });

    if (completeOnboarding) {
      await supabase.from("profiles").update({ onboarding_completed: true, updated_at: now() }).eq("id", context.user.id);
    }
  }

  return settings;
}

async function savePartner(context: RequestContext, body: JsonObject) {
  const settings = await getSettings(context);
  return saveSettings(context, { ...settings, partnerId: body.partnerId || defaultPartner.id }, false);
}

async function getWorkbench(context: RequestContext) {
  const conversations = await listConversations(context);
  const recentConversations = Array.isArray((conversations as JsonObject).conversations) ? (conversations as { conversations: TutorConversation[] }).conversations : [];
  return {
    profile: await profilePayload(context.user),
    settings: await getSettings(context),
    entitlement: defaultEntitlement(),
    partner: defaultPartner,
    currentConversation: recentConversations[0] || null,
    recentConversations,
    cards: (await listCards(context)).cards,
    todayMessageCount: recentConversations.reduce((count, conversation) => count + (conversation.messages?.length || 0), 0)
  };
}

async function createConversation(context: RequestContext, body: JsonObject): Promise<TutorConversation> {
  const mode = modeField(body.mode);
  const conversation: LocalConversation = {
    id: crypto.randomUUID(),
    userId: context.userId,
    mode,
    nativeLanguageCode: stringField(body.nativeLanguageCode, "zh-CN"),
    learningLanguageCode: stringField(body.learningLanguageCode, "en"),
    levelCode: stringField(body.levelCode, "auto"),
    status: "active",
    startedAt: now(),
    updatedAt: now(),
    messages: []
  };
  conversation.messages.push(openingMessage(conversation));
  memory().conversations.set(conversation.id, conversation);

  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    const { data, error } = await supabase.from("conversations").insert({
      user_id: context.user.id,
      partner_id: null,
      mode: conversation.mode,
      native_language_code: conversation.nativeLanguageCode,
      learning_language_code: conversation.learningLanguageCode,
      level_code: conversation.levelCode,
      status: "active"
    }).select("*").single();

    if (!error && data) {
      conversation.id = stringField((data as DbRow).id, conversation.id);
      conversation.messages = [openingMessage(conversation)];
      memory().conversations.delete([...memory().conversations.keys()].find((id) => id !== conversation.id && memory().conversations.get(id)?.startedAt === conversation.startedAt) || "");
      memory().conversations.set(conversation.id, conversation);
      await insertDbMessage(context, conversation, conversation.messages[0]);
    }
  }

  await syncCentralSafely({ entityType: "conversation", action: "created", conversationId: conversation.id, userId: context.userId, mode }, `conversation:${conversation.id}:created`);
  return formatConversation(conversation);
}

function openingMessage(conversation: LocalConversation): LocalMessage {
  const target = conversation.learningLanguageCode === "en" ? "English" : conversation.learningLanguageCode;
  return {
    id: crypto.randomUUID(),
    conversationId: conversation.id,
    userId: conversation.userId,
    role: "tutor",
    inputType: "text",
    targetLanguageCode: conversation.learningLanguageCode,
    content: conversation.mode === "talk" ? "What would you like to talk about today?" : `What would you like to say in ${target}?`,
    sequenceNo: 1,
    createdAt: now()
  };
}

async function listConversations(context: RequestContext) {
  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    const { data, error } = await supabase.from("conversations").select("*").eq("user_id", context.user.id).order("updated_at", { ascending: false }).limit(20);
    if (!error && data) {
      const conversations = await Promise.all((data as DbRow[]).map((row) => conversationFromDb(context, row)));
      return { conversations };
    }
  }

  const conversations = [...memory().conversations.values()]
    .filter((conversation) => conversation.userId === context.userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(formatConversation);
  return { conversations };
}

async function getConversation(context: RequestContext, id: string): Promise<TutorConversation> {
  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    const { data, error } = await supabase.from("conversations").select("*").eq("id", id).eq("user_id", context.user.id).maybeSingle();
    if (!error && data) return conversationFromDb(context, data as DbRow);
  }

  const conversation = memory().conversations.get(id);
  if (!conversation || conversation.userId !== context.userId) throw new Error("Conversation not found.");
  return formatConversation(conversation);
}

async function resetConversation(context: RequestContext, id: string, body: JsonObject) {
  const current = await getConversation(context, id);
  const base = toLocalConversation(current, context.userId);
  base.mode = modeField(body.mode);
  base.nativeLanguageCode = stringField(body.nativeLanguageCode, base.nativeLanguageCode);
  base.learningLanguageCode = stringField(body.learningLanguageCode, base.learningLanguageCode);
  base.levelCode = stringField(body.levelCode, base.levelCode);
  base.status = "active";
  base.updatedAt = now();
  base.messages = [openingMessage(base)];
  memory().conversations.set(id, base);

  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    await supabase.from("messages").delete().eq("conversation_id", id).eq("user_id", context.user.id);
    await supabase.from("conversations").update({
      mode: base.mode,
      native_language_code: base.nativeLanguageCode,
      learning_language_code: base.learningLanguageCode,
      level_code: base.levelCode,
      status: "active",
      updated_at: now()
    }).eq("id", id).eq("user_id", context.user.id);
    await insertDbMessage(context, base, base.messages[0]);
  }

  return formatConversation(base);
}

async function endConversation(context: RequestContext, id: string) {
  const current = await getConversation(context, id);
  const localConversation = memory().conversations.get(id);
  const conversation = localConversation && localConversation.userId === context.userId
    ? localConversation
    : toLocalConversation(current, context.userId);
  conversation.status = "completed";
  conversation.updatedAt = now();
  memory().conversations.set(id, conversation);

  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    await supabase.from("conversations").update({ status: "completed", ended_at: now(), updated_at: now() }).eq("id", id).eq("user_id", context.user.id);
  }

  return { ended: true, conversationId: id };
}

async function sendConversationMessage(context: RequestContext, id: string, body: JsonObject, inputType: "text" | "voice") {
  const current = await getConversation(context, id);
  const local = toLocalConversation(current, context.userId);
  const content = stringField(inputType === "voice" ? body.transcript : body.content);
  if (!content) throw new Error("Message content is required.");

  const userMessage: LocalMessage = {
    id: crypto.randomUUID(),
    conversationId: id,
    userId: context.userId,
    role: "user",
    inputType,
    sourceLanguageCode: stringField(body.sourceLanguageCode, local.nativeLanguageCode),
    targetLanguageCode: local.learningLanguageCode,
    content,
    sequenceNo: local.messages.length + 1,
    clientMessageId: stringField(body.clientMessageId, ""),
    createdAt: now()
  };

  const reply = await generateTutorReply({
    mode: local.mode,
    nativeLanguageCode: local.nativeLanguageCode,
    learningLanguageCode: local.learningLanguageCode,
    levelCode: local.levelCode,
    userText: content,
    history: local.messages.map((message) => ({ role: message.role, content: message.content }))
  });

  const tutorMessage: LocalMessage = {
    id: crypto.randomUUID(),
    conversationId: id,
    userId: context.userId,
    role: "tutor",
    inputType: "text",
    sourceLanguageCode: local.learningLanguageCode,
    targetLanguageCode: local.learningLanguageCode,
    content: reply.text,
    sequenceNo: userMessage.sequenceNo + 1,
    metadata: reply.structured ? { sayIt: reply.structured } : undefined,
    createdAt: now()
  };

  local.messages.push(userMessage, tutorMessage);
  local.updatedAt = now();
  memory().conversations.set(id, local);

  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    const dbUserMessage = await insertDbMessage(context, local, userMessage);
    const dbTutorMessage = await insertDbMessage(context, local, tutorMessage);
    await supabase.from("conversations").update({
      message_count: local.messages.length,
      input_word_count: local.messages.filter((message) => message.role === "user").reduce((sum, message) => sum + countWords(message.content), 0),
      updated_at: now()
    }).eq("id", id).eq("user_id", context.user.id);
    if (dbTutorMessage?.id) {
      await supabase.from("message_outputs").upsert({
        message_id: dbTutorMessage.id,
        output_type: "reply",
        content: { text: reply.text, structured: reply.structured, provider: reply.provider, inputTokens: reply.inputTokens, outputTokens: reply.outputTokens },
        model_name: reply.model
      }, { onConflict: "message_id,output_type" });
    }
    if (inputType === "voice" && body.audioId) {
      await supabase.from("voice_inputs").update({ message_id: dbUserMessage?.id || userMessage.id, transcript: content, status: "completed", updated_at: now() }).eq("id", body.audioId as string).eq("user_id", context.user.id);
    }
  }

  await syncCentralSafely({ entityType: "message", action: "created", conversationId: id, userId: context.userId, inputType, provider: reply.provider }, `message:${id}:${userMessage.clientMessageId || userMessage.id}`);
  return formatConversation(local);
}

function toLocalConversation(conversation: TutorConversation, userId: string): LocalConversation {
  return {
    id: conversation.id,
    userId,
    mode: modeField(conversation.mode),
    nativeLanguageCode: stringField((conversation as JsonObject).nativeLanguageCode, "zh-CN"),
    learningLanguageCode: stringField((conversation as JsonObject).learningLanguageCode, "en"),
    levelCode: stringField((conversation as JsonObject).levelCode, "auto"),
    status: conversation.status || "active",
    startedAt: conversation.createdAt || now(),
    updatedAt: now(),
    messages: (conversation.messages || []).map((message, index) => ({
      id: message.id,
      conversationId: conversation.id,
      userId,
      role: message.role === "assistant" || message.role === "tutor" ? "tutor" : "user",
      inputType: message.inputType === "voice" ? "voice" : "text",
      content: stringField(message.content || message.text),
      sequenceNo: index + 1,
      metadata: message.metadata,
      createdAt: message.createdAt || now()
    }))
  };
}

async function insertDbMessage(context: RequestContext, conversation: LocalConversation, message: LocalMessage) {
  const supabase = createSupabaseAdminClient();
  if (!context.user || !supabase) return null;

  const payload = {
    conversation_id: conversation.id,
    user_id: context.user.id,
    role: message.role,
    input_type: message.inputType,
    source_language_code: message.sourceLanguageCode || null,
    target_language_code: message.targetLanguageCode || conversation.learningLanguageCode,
    content: message.content,
    sequence_no: message.sequenceNo,
    client_message_id: message.clientMessageId || null
  };

  const { data, error } = await supabase.from("messages").insert(payload).select("*").single();
  if (!error && data) return data as DbRow;

  if (message.clientMessageId) {
    const { data: existing } = await supabase.from("messages").select("*").eq("user_id", context.user.id).eq("client_message_id", message.clientMessageId).maybeSingle();
    return (existing || null) as DbRow | null;
  }

  return null;
}

async function conversationFromDb(context: RequestContext, row: DbRow): Promise<TutorConversation> {
  const supabase = createSupabaseAdminClient();
  const id = stringField(row.id);
  const { data } = supabase ? await supabase.from("messages").select("*").eq("conversation_id", id).order("sequence_no", { ascending: true }) : { data: [] };
  const messageRows = (data || []) as DbRow[];
  const messageIds = messageRows.map((message) => stringField(message.id)).filter(Boolean);
  const { data: outputRows } = supabase && messageIds.length
    ? await supabase.from("message_outputs").select("message_id, content").in("message_id", messageIds).eq("output_type", "reply")
    : { data: [] };
  const replyOutputs = new Map(((outputRows || []) as DbRow[]).map((output) => [
    stringField(output.message_id),
    output.content && typeof output.content === "object" ? output.content as JsonObject : {}
  ]));
  const messages = messageRows.map((message) => messageFromDb(message, replyOutputs.get(stringField(message.id))));
  return {
    id,
    mode: stringField(row.mode, "say_it"),
    status: stringField(row.status, "active"),
    createdAt: stringField(row.created_at, stringField(row.started_at, now())),
    nativeLanguageCode: stringField(row.native_language_code, "zh-CN"),
    learningLanguageCode: stringField(row.learning_language_code, "en"),
    levelCode: stringField(row.level_code, "auto"),
    messages
  } as TutorConversation;
}

function messageFromDb(row: DbRow, replyOutput?: JsonObject): TutorMessage {
  return {
    id: stringField(row.id),
    role: stringField(row.role, "tutor"),
    inputType: stringField(row.input_type, "text"),
    content: stringField(row.content),
    metadata: replyOutput?.structured && typeof replyOutput.structured === "object"
      ? { sayIt: replyOutput.structured as JsonObject }
      : undefined,
    createdAt: stringField(row.created_at, now())
  };
}

function formatConversation(conversation: LocalConversation): TutorConversation {
  return {
    id: conversation.id,
    mode: conversation.mode,
    status: conversation.status,
    createdAt: conversation.startedAt,
    nativeLanguageCode: conversation.nativeLanguageCode,
    learningLanguageCode: conversation.learningLanguageCode,
    levelCode: conversation.levelCode,
    messages: conversation.messages.map((message) => ({
      id: message.id,
      role: message.role,
      inputType: message.inputType,
      content: message.content,
      metadata: message.metadata,
      createdAt: message.createdAt
    }))
  } as TutorConversation;
}

function countWords(text: string) {
  const matches = text.match(/[A-Za-z0-9]+|[\u4e00-\u9fff]/g);
  return matches?.length || 0;
}

async function findMessage(context: RequestContext, id: string) {
  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    const { data } = await supabase.from("messages").select("*").eq("id", id).eq("user_id", context.user.id).maybeSingle();
    if (data) return messageFromDb(data as DbRow);
  }

  for (const conversation of memory().conversations.values()) {
    const message = conversation.messages.find((candidate) => candidate.id === id && candidate.userId === context.userId);
    if (message) return {
      id: message.id,
      role: message.role,
      inputType: message.inputType,
      content: message.content,
      createdAt: message.createdAt
    } as TutorMessage;
  }
  throw new Error("Message not found.");
}

async function messageAction(context: RequestContext, id: string, action: string, body: JsonObject = {}) {
  const message = await findMessage(context, id);
  const text = stringField(message.content || message.text);

  if (action === "audio") {
    return {
      messageId: id,
      audioUrl: null,
      provider: "browser_speech",
      text,
      note: "TTS endpoint is reserved. Use browser speech synthesis until a production TTS provider is configured."
    };
  }

  if (action === "cards") return saveCardFromMessage(context, message, body);

  if (action === "pronunciation") {
    const spokenText = stringField(body.spokenText);
    if (!spokenText || !/[\p{L}\p{N}]/u.test(spokenText)) throw new Error("Spoken text is required.");
    const result = await generatePronunciationFeedback(
      text,
      spokenText,
      stringField(body.targetLanguageCode, "en"),
      stringField(body.nativeLanguageCode, "zh-CN")
    );
    const supabase = createSupabaseAdminClient();
    if (context.user && supabase) {
      await supabase.from("message_outputs").upsert({
        message_id: id,
        output_type: "pronunciation",
        content: result.content,
        model_name: result.model
      }, { onConflict: "message_id,output_type" });
    }
    return { messageId: id, outputType: "pronunciation", ...result };
  }

  const outputType = action === "grammar" ? "grammar" : "translation";
  const targetLanguageCode = stringField(body.targetLanguageCode, "en");
  const nativeLanguageCode = stringField(body.nativeLanguageCode, "zh-CN");
  const result = await generateMessageInsight(outputType, text, outputType === "translation" ? nativeLanguageCode : targetLanguageCode);
  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    await supabase.from("message_outputs").upsert({
      message_id: id,
      output_type: outputType,
      content: result.content,
      model_name: result.model
    }, { onConflict: "message_id,output_type" });
  }
  return { messageId: id, outputType, ...result };
}

async function textMessageAction(context: RequestContext, kind: "translation" | "grammar", body: JsonObject) {
  const text = stringField(body.text);
  if (!text) throw new Error("Text is required.");

  const targetLanguageCode = stringField(body.targetLanguageCode, "zh-CN");
  const result = await generateMessageInsight(kind, text, targetLanguageCode);
  return { messageId: null, outputType: kind, ...result };
}

async function textPronunciationAction(context: RequestContext, body: JsonObject) {
  const targetText = stringField(body.targetText);
  const spokenText = stringField(body.spokenText);
  if (!targetText || !spokenText || !/[\p{L}\p{N}]/u.test(spokenText)) throw new Error("Target text and spoken text are required.");

  const result = await generatePronunciationFeedback(
    targetText,
    spokenText,
    stringField(body.targetLanguageCode, "en"),
    stringField(body.nativeLanguageCode, "zh-CN")
  );
  return { messageId: null, outputType: "pronunciation", ...result };
}

async function saveCardFromMessage(context: RequestContext, message: TutorMessage, body: JsonObject = {}) {
  const text = stringField(message.content || message.text);
  const card: LocalCard = {
    id: crypto.randomUUID(),
    userId: context.userId,
    sourceMessageId: message.id,
    phrase: text,
    languageCode: stringField(body.languageCode, "en"),
    cardType: stringField(body.cardType, "phrase"),
    reviewState: "new",
    createdAt: now()
  };
  memory().cards.set(card.id, card);

  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    const { data } = await supabase.from("learning_cards").insert({
      user_id: context.user.id,
      source_message_id: message.id,
      phrase: card.phrase,
      language_code: card.languageCode,
      card_type: card.cardType,
      review_state: card.reviewState
    }).select("*").single();
    if (data) return { card: cardFromDb(data as DbRow) };
  }

  return { card };
}

async function listCards(context: RequestContext) {
  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    const { data, error } = await supabase.from("learning_cards").select("*").eq("user_id", context.user.id).is("archived_at", null).order("created_at", { ascending: false }).limit(50);
    if (!error && data) return { cards: (data as DbRow[]).map(cardFromDb) };
  }

  return { cards: [...memory().cards.values()].filter((card) => card.userId === context.userId) };
}

async function updateCard(context: RequestContext, id: string, body: JsonObject) {
  const card = memory().cards.get(id);
  if (card && card.userId === context.userId) {
    card.reviewState = stringField(body.reviewState, card.reviewState);
  }

  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    await supabase.from("learning_cards").update({ review_state: stringField(body.reviewState, "learning"), updated_at: now() }).eq("id", id).eq("user_id", context.user.id);
  }

  return { updated: true, id };
}

async function deleteCard(context: RequestContext, id: string) {
  const card = memory().cards.get(id);
  if (card && card.userId === context.userId) memory().cards.delete(id);
  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    await supabase.from("learning_cards").update({ archived_at: now(), updated_at: now() }).eq("id", id).eq("user_id", context.user.id);
  }
  return { deleted: true, id };
}

function cardFromDb(row: DbRow) {
  return {
    id: stringField(row.id),
    phrase: stringField(row.phrase),
    meaning: stringField(row.meaning, "") || undefined,
    explanation: stringField(row.explanation, "") || undefined,
    languageCode: stringField(row.language_code, "en"),
    cardType: stringField(row.card_type, "phrase"),
    reviewState: stringField(row.review_state, "new"),
    createdAt: stringField(row.created_at, now())
  };
}

async function createVoiceUploadUrl(context: RequestContext, body: JsonObject) {
  const bucket = process.env.SUPABASE_VOICE_BUCKET?.trim();
  const supabase = createSupabaseAdminClient();
  const extension = stringField(body.mimeType).includes("mp4") ? "mp4" : "webm";
  const audioPath = `voice/${new Date().toISOString().slice(0, 10)}/${context.userId}/${crypto.randomUUID()}.${extension}`;

  if (!bucket || !supabase) {
    return { uploadUrl: null, audioPath: null, storage: "disabled" };
  }

  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(audioPath);
  if (error || !data) return { uploadUrl: null, audioPath: null, storage: "unavailable" };
  return { uploadUrl: data.signedUrl, signedUrl: data.signedUrl, audioPath, path: audioPath };
}

async function registerVoiceInput(context: RequestContext, body: JsonObject) {
  const voiceInput: LocalVoiceInput = {
    id: crypto.randomUUID(),
    userId: context.userId,
    conversationId: stringField(body.conversationId, "") || undefined,
    audioPath: stringField(body.audioPath, "") || undefined,
    mimeType: stringField(body.mimeType, "audio/webm"),
    durationMs: numberField(body.durationMs, 0),
    createdAt: now()
  };
  memory().voiceInputs.set(voiceInput.id, voiceInput);

  const supabase = createSupabaseAdminClient();
  if (context.user && supabase) {
    const { data } = await supabase.from("voice_inputs").insert({
      user_id: context.user.id,
      conversation_id: voiceInput.conversationId || null,
      storage_path: voiceInput.audioPath || null,
      mime_type: voiceInput.mimeType,
      duration_ms: voiceInput.durationMs,
      status: "uploaded"
    }).select("*").single();
    if (data) return { id: stringField((data as DbRow).id), audioId: stringField((data as DbRow).id) };
  }

  return { id: voiceInput.id, audioId: voiceInput.id };
}
