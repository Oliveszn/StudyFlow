import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./auth-slice";
import createCourseReducer from "./CreateCourseSlice";
import { persistCreateCourseMiddleware } from "./middleware/PersistCreateCourse";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    createCourse: createCourseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore File objects in Redux state
        ignoredActions: ["createCourse/updateFormData"],
        ignoredPaths: ["createCourse.formData.thumbnail"],
      },
    }).concat(persistCreateCourseMiddleware),
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
