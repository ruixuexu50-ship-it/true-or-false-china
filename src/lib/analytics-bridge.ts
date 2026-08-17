import {
  createAnalytics,
  type AnalyticsOptions,
} from "./analytics.ts";
import {
  sanitizeUiEventDetail,
  WORKING_ANSWER_EVENT,
} from "./ui-events.ts";

export interface AnalyticsBridgeOptions {
  target: EventTarget;
  topicSlug: string;
  publicKey?: string;
  doNotTrack?: boolean;
  clientFactory?: AnalyticsOptions["clientFactory"];
}

export interface AnalyticsBridge {
  enabled: boolean;
  readonly forwarded: number;
  dispose(): void;
}

/**
 * Local pages call this with no key and no factory, creating a no-op adapter.
 * A future approved integration must inject both values explicitly; this module
 * never imports, initializes, or discovers a PostHog client on its own.
 */
export function installAnalyticsBridge(
  options: AnalyticsBridgeOptions,
): AnalyticsBridge {
  let forwarded = 0;
  const analytics = createAnalytics({
    publicKey: options.publicKey,
    doNotTrack: options.doNotTrack,
    clientFactory: options.clientFactory,
  });

  const handleEvent: EventListener = (event) => {
    const detail = sanitizeUiEventDetail(
      (event as CustomEvent<unknown>).detail,
    );
    if (!detail || detail.properties.topic !== options.topicSlug) return;
    if (analytics.capture(detail.event, detail.properties)) forwarded += 1;
  };

  options.target.addEventListener(WORKING_ANSWER_EVENT, handleEvent);
  return {
    enabled: analytics.enabled,
    get forwarded() {
      return forwarded;
    },
    dispose() {
      options.target.removeEventListener(WORKING_ANSWER_EVENT, handleEvent);
    },
  };
}
