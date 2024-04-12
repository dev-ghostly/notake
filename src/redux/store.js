import { configureStore } from "@reduxjs/toolkit";
import subjectsReducer from "./slices/subjects";
import noteReducer from "./slices/note";

export default configureStore({
  reducer: {
    subjects: subjectsReducer,
    note: noteReducer,
  }
})