// users.js
import { createAsyncThunk } from '@reduxjs/toolkit';

// Actions... types
const GET_ALL_USERS = 'bios/GET_ALL_USERS';
const CURRENT_USER = 'bios/CURRENT_USER';

// Reducer
export default function reducer(state = [], action) {
    switch (action.type) {
        // do reducer stuff
        // GET all doctors from the API
        case `${GET_ALL_USERS}/fulfilled`:
            return action.payload;

        // CURRENT_USER from the API
        case CURRENT_USER:
            return action.payload;
        default: return state;
    }
}

// const userAPI = 'http://localhost:3001/api/v1/users';
const userAPI = 'http://localhost:3001/api/v1/users';

// Action Creators
export const getAllUsers = createAsyncThunk(GET_ALL_USERS, async () => {
    const response = await fetch(userAPI,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    return await response.json();
}); /* getAllUsers - createAsyncThunk - API */

export function currentUser(obj) {
    return { type: CURRENT_USER, payload: obj };
} /* currentUser */