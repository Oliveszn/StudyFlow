import type { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";

const STORAGE_KEY = "createCourse";

let timeout: ReturnType<typeof setTimeout>;

export const persistCreateCourseMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const result = next(action);

    // set it to only persist if the action belongs to the createCourse slice
    if (action.type?.startsWith("createCourse/")) {
      // dont persist the reset action just clear it
      if (action.type === "createCourse/resetForm") {
        clearPersistedData();
        return result;
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const state: RootState = store.getState();
        const { formData, currentStep } = state.createCourse;

        ///Remove file object before serializing cos files cant store in localstorage
        const { thumbnail, ...serializableFormData } = formData;

        const payload = {
          currentStep,
          formData: serializableFormData,
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
          console.error("[createCourse] Failed to persist state:", e);
        }
      }, 300);
    }

    return result;
  };

export const loadPersistedData = (): {
  currentStep: number;
  formData: Record<string, any>;
} | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("[createCourse] Failed to load persisted state:", e);
    return null;
  }
};

export const clearPersistedData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("[createCourse] Failed to clear persisted state:", e);
  }
};
