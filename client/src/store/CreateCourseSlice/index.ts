import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadPersistedData } from "../middleware/PersistCreateCourse";

export interface CreateCourseFormData {
  // Step 1
  title: string;
  subtitle: string;
  description: string;

  // Step 2
  category: string;
  price: number;
  discountPrice?: number;
  language: string;

  // Step 3
  requirements: string[];
  whatYouWillLearn: string[];
  thumbnail?: File | null;

  existingThumbnailUrl?: string;
}

interface CreateCourseState {
  currentStep: number;
  formData: Partial<CreateCourseFormData>;
  isSubmitting: boolean;
  isEditMode: boolean;
  editCourseId: string | null;
}

const persisted = loadPersistedData();

const initialState: CreateCourseState = {
  currentStep: persisted?.currentStep ?? 1,

  formData: {
    language: "en",
    price: 0,
    requirements: [],
    whatYouWillLearn: [],
    ...persisted?.formData,
  },
  isSubmitting: false,
  isEditMode: false,
  editCourseId: null,
};

const createCourseSlice = createSlice({
  name: "createCourse",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 3) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    updateFormData: (
      state,
      action: PayloadAction<Partial<CreateCourseFormData>>,
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    initializeEditMode: (
      state,
      action: PayloadAction<{
        courseId: string;
        formData: Partial<CreateCourseFormData>;
      }>,
    ) => {
      state.isEditMode = true;
      state.editCourseId = action.payload.courseId;
      state.formData = {
        ...state.formData,
        ...action.payload.formData,
      };
      state.currentStep = 1;
    },
    resetForm: (state) => {
      state.currentStep = 1;
      state.formData = {
        language: "en",
        price: 0,
        requirements: [],
        whatYouWillLearn: [],
      };
      state.isSubmitting = false;
      state.isEditMode = false;
      state.editCourseId = null;
    },
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  updateFormData,
  setSubmitting,
  initializeEditMode,
  resetForm,
} = createCourseSlice.actions;

export default createCourseSlice.reducer;
