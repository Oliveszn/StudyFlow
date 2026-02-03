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
}

interface CreateCourseState {
  currentStep: number;
  formData: Partial<CreateCourseFormData>;
  isSubmitting: boolean;
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
    resetForm: (state) => {
      state.currentStep = 1;
      state.formData = {
        language: "en",
        price: 0,
        requirements: [],
        whatYouWillLearn: [],
      };
      state.isSubmitting = false;
    },
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  updateFormData,
  setSubmitting,
  resetForm,
} = createCourseSlice.actions;

export default createCourseSlice.reducer;
