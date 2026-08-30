import { localizedPath, type Locale } from "./config";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

type FooterCopy = {
  columns: FooterColumn[];
};

const footerLabels: Record<Locale, FooterCopy> = {
  en: {
    columns: [
      {
        title: "Practice",
        links: [
          { label: "Talk", href: "/practice/talk" },
          { label: "Get Help", href: "/practice/get-help" },
          { label: "Pronunciation", href: "/practice/pronunciation" },
          { label: "Vocabulary", href: "/practice/vocabulary" }
        ]
      },
      {
        title: "Learn",
        links: [
          { label: "Conversation Topics", href: "/learn/conversation-topics" },
          { label: "Learning Tips", href: "/learn/learning-tips" },
          { label: "Practice Guide", href: "/learn/practice-guide" },
          { label: "Blog", href: "/learn/blog" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/company/about" },
          { label: "Contact", href: "/contact" },
          { label: "Careers", href: "/company/careers" }
        ]
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Cookies", href: "/legal/cookies" }
        ]
      }
    ]
  },
  ja: {
    columns: [
      {
        title: "練習",
        links: [
          { label: "話す", href: "/practice/talk" },
          { label: "ヘルプ", href: "/practice/get-help" },
          { label: "発音", href: "/practice/pronunciation" },
          { label: "語彙", href: "/practice/vocabulary" }
        ]
      },
      {
        title: "学ぶ",
        links: [
          { label: "会話テーマ", href: "/learn/conversation-topics" },
          { label: "学習のコツ", href: "/learn/learning-tips" },
          { label: "練習ガイド", href: "/learn/practice-guide" },
          { label: "ブログ", href: "/learn/blog" }
        ]
      },
      {
        title: "会社",
        links: [
          { label: "会社概要", href: "/company/about" },
          { label: "お問い合わせ", href: "/contact" },
          { label: "採用情報", href: "/company/careers" }
        ]
      },
      {
        title: "法務",
        links: [
          { label: "プライバシーポリシー", href: "/privacy" },
          { label: "利用規約", href: "/terms" },
          { label: "Cookie", href: "/legal/cookies" }
        ]
      }
    ]
  },
  th: {
    columns: [
      {
        title: "ฝึกฝน",
        links: [
          { label: "พูด", href: "/practice/talk" },
          { label: "ขอความช่วยเหลือ", href: "/practice/get-help" },
          { label: "การออกเสียง", href: "/practice/pronunciation" },
          { label: "คำศัพท์", href: "/practice/vocabulary" }
        ]
      },
      {
        title: "เรียนรู้",
        links: [
          { label: "หัวข้อสนทนา", href: "/learn/conversation-topics" },
          { label: "เคล็ดลับการเรียน", href: "/learn/learning-tips" },
          { label: "คู่มือฝึก", href: "/learn/practice-guide" },
          { label: "บล็อก", href: "/learn/blog" }
        ]
      },
      {
        title: "บริษัท",
        links: [
          { label: "เกี่ยวกับเรา", href: "/company/about" },
          { label: "ติดต่อ", href: "/contact" },
          { label: "ร่วมงานกับเรา", href: "/company/careers" }
        ]
      },
      {
        title: "กฎหมาย",
        links: [
          { label: "นโยบายความเป็นส่วนตัว", href: "/privacy" },
          { label: "ข้อกำหนดการให้บริการ", href: "/terms" },
          { label: "คุกกี้", href: "/legal/cookies" }
        ]
      }
    ]
  },
  ko: {
    columns: [
      {
        title: "연습",
        links: [
          { label: "말하기", href: "/practice/talk" },
          { label: "도움 요청", href: "/practice/get-help" },
          { label: "발음", href: "/practice/pronunciation" },
          { label: "어휘", href: "/practice/vocabulary" }
        ]
      },
      {
        title: "배우기",
        links: [
          { label: "대화 주제", href: "/learn/conversation-topics" },
          { label: "학습 팁", href: "/learn/learning-tips" },
          { label: "연습 가이드", href: "/learn/practice-guide" },
          { label: "블로그", href: "/learn/blog" }
        ]
      },
      {
        title: "회사",
        links: [
          { label: "회사 소개", href: "/company/about" },
          { label: "문의", href: "/contact" },
          { label: "채용", href: "/company/careers" }
        ]
      },
      {
        title: "법적 정보",
        links: [
          { label: "개인정보처리방침", href: "/privacy" },
          { label: "이용약관", href: "/terms" },
          { label: "쿠키", href: "/legal/cookies" }
        ]
      }
    ]
  },
  "zh-CN": {
    columns: [
      {
        title: "练习",
        links: [
          { label: "开口说", href: "/practice/talk" },
          { label: "求助", href: "/practice/get-help" },
          { label: "发音", href: "/practice/pronunciation" },
          { label: "词汇", href: "/practice/vocabulary" }
        ]
      },
      {
        title: "学习",
        links: [
          { label: "对话主题", href: "/learn/conversation-topics" },
          { label: "学习技巧", href: "/learn/learning-tips" },
          { label: "练习指南", href: "/learn/practice-guide" },
          { label: "博客", href: "/learn/blog" }
        ]
      },
      {
        title: "公司",
        links: [
          { label: "关于我们", href: "/company/about" },
          { label: "联系我们", href: "/contact" },
          { label: "招聘", href: "/company/careers" }
        ]
      },
      {
        title: "法务",
        links: [
          { label: "隐私政策", href: "/privacy" },
          { label: "服务条款", href: "/terms" },
          { label: "Cookie", href: "/legal/cookies" }
        ]
      }
    ]
  },
  "zh-TW": {
    columns: [
      {
        title: "練習",
        links: [
          { label: "開口說", href: "/practice/talk" },
          { label: "求助", href: "/practice/get-help" },
          { label: "發音", href: "/practice/pronunciation" },
          { label: "詞彙", href: "/practice/vocabulary" }
        ]
      },
      {
        title: "學習",
        links: [
          { label: "對話主題", href: "/learn/conversation-topics" },
          { label: "學習技巧", href: "/learn/learning-tips" },
          { label: "練習指南", href: "/learn/practice-guide" },
          { label: "部落格", href: "/learn/blog" }
        ]
      },
      {
        title: "公司",
        links: [
          { label: "關於我們", href: "/company/about" },
          { label: "聯絡我們", href: "/contact" },
          { label: "招募", href: "/company/careers" }
        ]
      },
      {
        title: "法務",
        links: [
          { label: "隱私政策", href: "/privacy" },
          { label: "服務條款", href: "/terms" },
          { label: "Cookie", href: "/legal/cookies" }
        ]
      }
    ]
  },
  es: {
    columns: [
      {
        title: "Práctica",
        links: [
          { label: "Hablar", href: "/practice/talk" },
          { label: "Pedir ayuda", href: "/practice/get-help" },
          { label: "Pronunciación", href: "/practice/pronunciation" },
          { label: "Vocabulario", href: "/practice/vocabulary" }
        ]
      },
      {
        title: "Aprender",
        links: [
          { label: "Temas de conversación", href: "/learn/conversation-topics" },
          { label: "Consejos de estudio", href: "/learn/learning-tips" },
          { label: "Guía de práctica", href: "/learn/practice-guide" },
          { label: "Blog", href: "/learn/blog" }
        ]
      },
      {
        title: "Empresa",
        links: [
          { label: "Quiénes somos", href: "/company/about" },
          { label: "Contacto", href: "/contact" },
          { label: "Trabaja con nosotros", href: "/company/careers" }
        ]
      },
      {
        title: "Legal",
        links: [
          { label: "Política de privacidad", href: "/privacy" },
          { label: "Términos del servicio", href: "/terms" },
          { label: "Cookies", href: "/legal/cookies" }
        ]
      }
    ]
  }
};

export function getFooterCopy(locale: Locale): FooterCopy {
  const copy = footerLabels[locale];

  return {
    columns: copy.columns.map((column) => ({
      title: column.title,
      links: column.links.map((link) => ({
        ...link,
        href: localizedPath(locale, link.href)
      }))
    }))
  };
}
