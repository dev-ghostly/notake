import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: "modal",
    initialState: {
        subject : {
            open : false,
            data : null
        }
    },
    reducers: {
        openSubject: (state, action) => {
            state.subject.open = true;
            state.subject.data = action.payload;
        },
    },
})