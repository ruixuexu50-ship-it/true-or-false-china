import type { Locale } from "./i18n.ts";

export type FundingChoice =
  | "foreign-card"
  | "overseas-wallet"
  | "mainland-funding"
  | "funding-unknown";

export type WalletChoice =
  | "alipay-linked"
  | "weixin-linked"
  | "compatible-wallet-visible"
  | "wallet-incomplete"
  | "wallet-unknown";

export type MerchantChoice =
  | "merchant-app-qr"
  | "international-pos"
  | "small-or-personal-qr"
  | "merchant-unknown";

export interface QrRouteChoices {
  funding: FundingChoice;
  wallet: WalletChoice;
  merchant: MerchantChoice;
}

export type QrDiagnosisId =
  | "onboarding"
  | "merchant-route"
  | "issuer-or-live-check"
  | "direct-card-route"
  | "cross-border-route"
  | "unknown-link"
  | "mainland-comparison";

export interface QrDiagnosis {
  id: QrDiagnosisId;
  weakLink: "funding" | "onboarding" | "merchant-route" | "live-check";
  lead: string;
  nextCheck: string;
}

type DiagnosisText = Record<QrDiagnosisId, { lead: string; nextCheck: string }>;

// English is the canonical copy. Chinese is a faithful, machine-generated
// draft (DRAFT_TRANSLATION) that preserves the original's uncertainty — it is
// not approved for publication until human review.
const diagnosisText: Record<Locale, DiagnosisText> = {
  en: {
    onboarding: {
      lead: "Your card may be fine. The bridge is not finished.",
      nextCheck:
        "Complete the official app route before relying on it, then try one low-value purchase.",
    },
    "merchant-route": {
      lead: "Your wallet may be ready. The merchant route is still the unknown.",
      nextCheck:
        "Look for another offered route. The square pattern alone does not reveal compatibility.",
    },
    "issuer-or-live-check": {
      lead:
        "The three links line up on paper. A live bank or platform check can still stop the route.",
      nextCheck:
        "Test early, keep a second method, and treat the result as specific to that account and merchant.",
    },
    "direct-card-route": {
      lead: "This merchant offers a separate card road around the QR stack.",
      nextCheck:
        "Confirm the terminal's card network. Keep the QR route as a separate option, not as proof.",
    },
    "cross-border-route": {
      lead: "A cross-border bridge may exist, but availability still needs a live check.",
      nextCheck:
        "Confirm the route appears in the current account and that the merchant path is compatible.",
    },
    "unknown-link": {
      lead: "You found the real problem: one link is still unknown.",
      nextCheck: "Verify the highlighted link before travel instead of guessing from the QR.",
    },
    "mainland-comparison": {
      lead: "This is the domestic route most QR-payment videos quietly assume.",
      nextCheck:
        "Use it as a comparison, not as evidence that a foreign-funded route behaves the same way.",
    },
  },
  zh: {
    onboarding: {
      lead: "你的卡也许没问题。但那座桥还没搭完。",
      nextCheck: "在依赖它之前，先把官方 App 的路线走完，再做一笔小额消费试试。",
    },
    "merchant-route": {
      lead: "你的钱包也许就绪了。商户这条路线仍是未知。",
      nextCheck: "再找找还有没有别的路线。光看那个方块图案，看不出是否兼容。",
    },
    "issuer-or-live-check": {
      lead: "三条链接在纸面上对上了。但银行或平台的一次实时核验，仍可能拦下整条路线。",
      nextCheck: "尽早实测，保留第二种方式，并把结果看作只针对这个账户和这家商户。",
    },
    "direct-card-route": {
      lead: "这家商户另开了一条绕过二维码栈的卡通道。",
      nextCheck: "确认终端支持的卡组织。把二维码路线当作另一个选项，而不是当作证据。",
    },
    "cross-border-route": {
      lead: "也许存在一条跨境通道，但能不能用仍需一次实时核验。",
      nextCheck: "确认这条路线确实出现在你当前的账户里，且商户路径兼容。",
    },
    "unknown-link": {
      lead: "你找到了真正的问题：有一个环节仍是未知。",
      nextCheck: "出行前核实那个被高亮的环节，别只凭二维码猜。",
    },
    "mainland-comparison": {
      lead: "这是大多数二维码支付视频默认悄悄假设的境内路线。",
      nextCheck: "把它当作对比，而不要当作“外资路线表现也一样”的证据。",
    },
  },
};

export function diagnoseQrRoute(
  choices: QrRouteChoices,
  locale: Locale = "en",
): QrDiagnosis {
  let id: QrDiagnosisId;
  let weakLink: QrDiagnosis["weakLink"];

  if (choices.funding === "funding-unknown") {
    id = "unknown-link";
    weakLink = "funding";
  } else if (
    choices.wallet === "wallet-incomplete" ||
    choices.wallet === "wallet-unknown"
  ) {
    id = "onboarding";
    weakLink = "onboarding";
  } else if (choices.merchant === "merchant-unknown") {
    id = "unknown-link";
    weakLink = "merchant-route";
  } else if (choices.merchant === "international-pos") {
    id = "direct-card-route";
    weakLink = "merchant-route";
  } else if (choices.funding === "mainland-funding") {
    id = "mainland-comparison";
    weakLink = "live-check";
  } else if (choices.merchant === "small-or-personal-qr") {
    id = "merchant-route";
    weakLink = "merchant-route";
  } else if (
    choices.funding === "overseas-wallet" &&
    choices.wallet === "compatible-wallet-visible"
  ) {
    id = "cross-border-route";
    weakLink = "live-check";
  } else {
    id = "issuer-or-live-check";
    weakLink = "live-check";
  }

  const text = diagnosisText[locale][id];
  return { id, weakLink, lead: text.lead, nextCheck: text.nextCheck };
}
