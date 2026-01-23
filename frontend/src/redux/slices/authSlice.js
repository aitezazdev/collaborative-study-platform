import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login , register } from '../../api/authApi'

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, thunkAPI) => {
        try {
            const response = await register(userData)
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, thunkAPI) => {
        try {
            const response = await login(credentials)
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }   
    }
)
const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending , (state)=>{
                state.loading = true
                state.error = null
                state.user = null
                state.token = null
            })
            .addCase(registerUser.fulfilled , (state , action)=>{
                state.loading = false
                state.user = action.payload.user
                state.token  = action.payload.token
                state.error = null
            })
            .addCase(registerUser.rejected , (state , action)=>{
                state.loading = false
                state.error = action.payload
                state.user = null
                state.token = null
            }
            )
            .addCase(loginUser.pending , (state)=>{
                state.loading = true
                state.error = null
                state.user = null
                state.token = null
            })
            .addCase(loginUser.fulfilled , (state , action)=>{
                state.loading = false
                state.user = action.payload.user
                state.token  = action.payload.token
                state.error = null
            })
            .addCase(loginUser.rejected , (state , action)=>{
                state.loading = false
                state.error = action.payload
                state.user = null
                state.token = null
            }   
            )
    }
})
export const { logout } = authSlice.actions
export default authSlice.reducer