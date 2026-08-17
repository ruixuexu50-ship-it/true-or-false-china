import type { QrDiagnosisId } from "./qr-diagnosis.ts";

export interface QrInteractionState {
  diagnosisId: QrDiagnosisId | null;
  weakLink: string | null;
  revealed: boolean;
}

export function createQrInteractionState(): QrInteractionState {
  return { diagnosisId: null, weakLink: null, revealed: false };
}

export function revealQrDiagnosis(
  _state: QrInteractionState,
  diagnosisId: QrDiagnosisId,
  weakLink: string,
): QrInteractionState {
  return { diagnosisId, weakLink, revealed: true };
}

export function invalidateQrDiagnosis(
  _state: QrInteractionState,
): QrInteractionState {
  return createQrInteractionState();
}

export interface CultureInteractionState {
  openedClaims: Set<string>;
  selectedFramings: Set<string>;
  scaffold: string;
  observationSelected: boolean;
  unknownSelected: boolean;
  revisionComplete: boolean;
  interactionStarted: boolean;
  canOpenStage2: boolean;
  canOpenStage3: boolean;
}

export function createCultureInteractionState(): CultureInteractionState {
  return {
    openedClaims: new Set<string>(),
    selectedFramings: new Set<string>(),
    scaffold: "",
    observationSelected: false,
    unknownSelected: false,
    revisionComplete: false,
    interactionStarted: false,
    canOpenStage2: false,
    canOpenStage3: false,
  };
}

export function resetCultureInteractionState(
  state: CultureInteractionState,
): CultureInteractionState {
  state.openedClaims.clear();
  state.selectedFramings.clear();
  Object.assign(state, createCultureInteractionState(), {
    openedClaims: state.openedClaims,
    selectedFramings: state.selectedFramings,
  });
  return state;
}

export function scrollBehaviorForMotion(
  reducedMotion: boolean,
): ScrollBehavior {
  return reducedMotion ? "auto" : "smooth";
}
