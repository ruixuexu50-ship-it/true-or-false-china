import {
  sanitizeFeedbackEvent,
  type FeedbackEventName,
  type FeedbackEventProperties,
} from "./feedback.ts";
import type { CaptureResult, PostHogConfig } from "posthog-js";

const COOKIELESS_SENTINEL = "$posthog_cookieless";

export const POSTHOG_PROPERTY_DENYLIST: string[] = [
  "$current_url",
  "$host",
  "$pathname",
  "$referrer",
  "$referring_domain",
  "$initial_referrer",
  "$initial_referring_domain",
  "$initial_current_url",
  "$session_entry_url",
  "$session_entry_referrer",
  "$session_entry_referring_domain",
  "$search_engine",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gad_source",
  "gbraid",
  "wbraid",
  "dclid",
  "fbclid",
  "msclkid",
  "twclid",
  "li_fat_id",
  "$elements",
  "$element_text",
  "$external_click_url",
  "title",
  "$device_id",
  "$session_id",
  "$window_id",
  "$browser",
  "$browser_version",
  "$device_type",
  "$device_name",
  "$device_model",
  "$os",
  "$os_version",
  "$screen_height",
  "$screen_width",
  "$viewport_height",
  "$viewport_width",
  "$geoip_city_name",
  "$geoip_country_name",
  "$geoip_country_code",
  "$geoip_latitude",
  "$geoip_longitude",
  "email",
  "name",
  "pageText",
  "replay",
];

/**
 * Runs after PostHog has enriched an event. It rebuilds the transport payload
 * from a strict allowlist and fails closed unless the SDK is demonstrably in
 * anonymous cookieless mode. This intentionally drops person writes, URLs,
 * referrers, campaign data, page text, browser/device data, and arbitrary SDK
 * or extension properties even if a later SDK default tries to add them.
 */
export function filterPostHogEvent(
  capture: CaptureResult | null,
): CaptureResult | null {
  if (!capture || typeof capture.uuid !== "string" || !capture.properties) {
    return null;
  }

  const properties = capture.properties;
  if (
    typeof properties.token !== "string" ||
    properties.token.length === 0 ||
    properties.$cookieless_mode !== true ||
    properties.distinct_id !== COOKIELESS_SENTINEL ||
    properties.$process_person_profile !== false
  ) {
    return null;
  }

  const sanitized = sanitizeFeedbackEvent(capture.event, properties);
  if (!sanitized?.properties.topic) return null;

  const filtered: CaptureResult = {
    uuid: capture.uuid,
    event: sanitized.event,
    properties: {
      token: properties.token,
      $cookieless_mode: true,
      distinct_id: COOKIELESS_SENTINEL,
      $process_person_profile: false,
      ...sanitized.properties,
    },
  };
  if (capture.timestamp instanceof Date) filtered.timestamp = capture.timestamp;
  return filtered;
}

export const SAFE_POSTHOG_CONFIG = {
  api_host: "https://eu.i.posthog.com",
  cookieless_mode: "always",
  autocapture: false,
  rageclick: false,
  capture_pageview: false,
  capture_pageleave: false,
  save_referrer: false,
  save_campaign_params: false,
  custom_campaign_params: [],
  disable_capture_url_hashes: true,
  persistence: "memory",
  disable_persistence: true,
  disable_session_recording: true,
  disable_surveys: true,
  disable_web_experiments: true,
  disable_external_dependency_loading: true,
  capture_performance: false,
  capture_exceptions: false,
  capture_heatmaps: false,
  capture_dead_clicks: false,
  disable_scroll_properties: true,
  mask_all_text: true,
  mask_all_element_attributes: true,
  mask_personal_data_properties: true,
  disableDeviceModel: true,
  advanced_disable_flags: true,
  person_profiles: "never",
  respect_dnt: true,
  ip: false,
  property_denylist: POSTHOG_PROPERTY_DENYLIST,
  before_send: filterPostHogEvent,
} as const satisfies Partial<PostHogConfig>;

export interface AnalyticsClient {
  capture(event: string, properties: FeedbackEventProperties): void;
}

export interface AnalyticsOptions {
  publicKey?: string;
  doNotTrack?: boolean;
  clientFactory?: (
    publicKey: string,
    config: typeof SAFE_POSTHOG_CONFIG,
  ) => AnalyticsClient;
}

export interface AnalyticsAdapter {
  enabled: boolean;
  capture(event: string, input?: Record<string, unknown>): boolean;
}

export function createAnalytics(options: AnalyticsOptions): AnalyticsAdapter {
  if (!options.publicKey || options.doNotTrack || !options.clientFactory) {
    return {
      enabled: false,
      capture() {
        return false;
      },
    };
  }

  const client = options.clientFactory(options.publicKey, SAFE_POSTHOG_CONFIG);
  return {
    enabled: true,
    capture(event: string, input: Record<string, unknown> = {}) {
      const sanitized = sanitizeFeedbackEvent(event, input);
      if (!sanitized) return false;
      client.capture(
        sanitized.event as FeedbackEventName,
        sanitized.properties,
      );
      return true;
    },
  };
}
