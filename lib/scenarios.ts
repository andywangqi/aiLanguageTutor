export const scenarios = [
  {
    slug: "english-job-interview",
    title: "English Job Interview Practice With an AI Tutor",
    description: "Practice English interview answers with sample questions, useful phrases, and an AI tutor. Get help expressing your experience and rehearse follow-up questions.",
    audience: "For learners who know their experience but struggle to explain it clearly in English. Start with one real example from your work or studies, rather than memorizing an impressive answer that does not describe you.",
    prompt: "Please act as an interviewer for an English job interview. Ask one question at a time, starting with my experience. After my answer, ask a relevant follow-up. When I request feedback, suggest one clearer expression.",
    questions: [
      ["Tell me about yourself.", "I work in customer support. I help customers solve account problems, and I enjoy explaining difficult topics clearly."],
      ["Why are you interested in this role?", "I would like to use my support experience in a team that works closely with product development."],
      ["Tell me about a challenge you handled.", "A customer could not access an urgent report. I checked the permissions, worked with our engineer, and kept the customer updated until it was fixed."],
      ["What is one strength you bring?", "I stay organized when several requests arrive together. I check urgency first and explain the next steps to each customer."],
      ["What would you like to improve?", "I am practicing shorter presentations. I now prepare three key points and rehearse them aloud before meetings."],
      ["What would you like to ask us?", "What would success look like in the first three months of this role?"]
    ],
    phrases: ["Let me give you a specific example.", "My responsibility was…", "The result was…", "Could you clarify what you mean by…?"],
    pitfalls: ["Avoid unsupported claims such as being perfect at everything. Give a concrete example instead.", "Do not memorize these sample answers as your own. Replace the role, actions, and outcomes with truthful details.", "Answer the question first, then add one supporting detail. Ask the tutor to challenge an unclear answer."],
    routine: "Choose one question. Draft a truthful answer in your own language, use Say It to find an English expression, then return to Talk and answer without reading. Ask for one follow-up question. Save the phrase you had trouble recalling and use it in a different answer tomorrow.",
    faq: [["Will this predict whether I get the job?", "No. This is language rehearsal, not a hiring assessment. It helps you practice explaining your experience."], ["Should I ask for feedback after every sentence?", "Try finishing a short answer first. Then request help with one expression so the conversation can keep moving."]]
  },
  {
    slug: "english-travel-conversation",
    title: "Travel English Conversation Practice With AI",
    description: "Rehearse hotel, restaurant, and airport conversations in English. Use sample dialogues, ask for expression help, and practice follow-up questions with an AI tutor.",
    audience: "For travelers who want to ask clear questions and handle a reply they did not expect. Practice the information you need to exchange: a time, a location, a price, or a request.",
    prompt: "Help me practice travel English. Play a hotel receptionist and ask one question at a time. I am checking in and want to ask about breakfast. Include a realistic follow-up and help with expressions when I ask.",
    questions: [
      ["How can I help you?", "I have a reservation under the name Lee. Could I check in, please?"],
      ["Would you like breakfast included?", "What time is breakfast served, and how much does it cost?"],
      ["What would you like to order?", "Could I have the vegetable soup, please? Does it contain milk?"],
      ["Where are you trying to go?", "I am looking for Gate 24. Could you point me in the right direction?"],
      ["Is there a problem with your room?", "The air conditioning is not working. Could someone take a look?"],
      ["Would you like me to repeat that?", "Yes, please. Could you say the departure time again more slowly?"]
    ],
    phrases: ["Could you help me with…?", "How much does it cost?", "Could you write that down?", "Just to check, did you say…?"],
    pitfalls: ["Practice understanding the reply, not only delivering your opening sentence.", "Repeat important numbers back to confirm them. Do not pretend to understand a time or price.", "Use examples to rehearse language; check actual travel arrangements with the service provider."],
    routine: "Start with a hotel check-in. Answer two questions, then ask one question of your own. Change one detail, such as a missing reservation or a different breakfast time, and practice again. Save one request and one clarification phrase.",
    faq: [["Can I start with text?", "Yes. Type a reply first, listen to it, and try saying it aloud when you are ready. Say It repetition can be skipped."], ["What if I do not understand the tutor?", "Choose the translation action or use slower playback. Practice a clarification question before continuing."]]
  },
  {
    slug: "ielts-speaking",
    title: "IELTS Speaking Practice With an AI Language Tutor",
    description: "Rehearse IELTS-style speaking prompts with example answers and follow-up questions. Build clearer English responses with an AI tutor, without predicted band scores.",
    audience: "For learners who want more opportunities to speak about familiar experiences and explain opinions. These are original practice prompts, not official test questions or an exam simulation.",
    prompt: "Help me rehearse IELTS-style English speaking. Ask one original question at a time about familiar experiences, then move to a topic description and opinion follow-ups. Do not assign a band score. Give expression help when I request it.",
    questions: [
      ["What do you enjoy about the place where you live?", "I like the park near my apartment. It gives me somewhere quiet to walk after work, even though the neighborhood is busy."],
      ["Do you prefer studying alone or with others?", "I usually begin alone so I can identify what I do not understand. Later, discussing it with a friend helps me notice different approaches."],
      ["Describe a skill you enjoyed learning.", "I enjoyed learning to cook a few simple meals. At first I followed every step in a recipe, but gradually I learned how to adjust the seasoning myself."],
      ["Why was that experience memorable?", "It changed a daily routine into something creative. I could also share the result with my family."],
      ["How can technology help people learn practical skills?", "It can make examples easier to find and repeat. However, watching a demonstration is different from doing the task yourself."],
      ["Is feedback always helpful?", "It depends on how specific it is. A suggestion I can try immediately is more useful than a general comment such as do better."]
    ],
    phrases: ["One reason is…", "For example…", "On the other hand…", "It depends on…"],
    pitfalls: ["Avoid memorized answers. Change the example and explain your own reason.", "Do not add complex words simply to sound advanced; choose expressions you understand and can reuse.", "Repeat Check compares recognized text. It cannot assign a pronunciation band or predict an IELTS result."],
    routine: "Answer a familiar-topic question, describe one experience, and discuss one follow-up opinion. Listen to your own answer if you have recorded it. Request help with one unclear phrase, then answer the same question again using different wording.",
    faq: [["Is this an official IELTS product?", "No. AI Language Tutor is an independent language practice tool and is not affiliated with or endorsed by IELTS."], ["Will the tutor give a reliable band score?", "This practice does not provide validated IELTS scoring. Use it for speaking opportunities and expression help, not score prediction."]]
  }
] as const;

export type Scenario = (typeof scenarios)[number];
export function findScenario(slug: string) {
  return scenarios.find((scenario) => scenario.slug === slug);
}
