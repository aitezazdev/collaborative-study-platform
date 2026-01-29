import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { login } from "../../api/authApi";

const initialState = {
  user: (() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const firebaseToken = await userCredential.user.getIdToken();
      console.log("Firebase token:", firebaseToken);

      let userData = null;

      try {
        const response = await login({ token: firebaseToken });
        console.log("Backend response:", response);

        if (response.success && response.user) {
          userData = {
            ...response.user,
            firebaseUid: userCredential.user.uid,
          };
        }
      } catch (backendError) {
        console.error("Backend call failed:", backendError);
      }

      // Fallback if backend didn't return user data
      if (!userData) {
        userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || credentials.email.split("@")[0],
        };
      }

      return {
        user: userData,
        token: firebaseToken
      };
    } catch (error) {
      let errorMessage = "Login failed";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password";
          break;
        default:
          errorMessage = error.message;
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, thunkAPI) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();
      console.log("Google Firebase token:", firebaseToken);

      let userData = null;

      try {
        const response = await login({ token: firebaseToken });

        if (response.success && response.user) {
          userData = {
            ...response.user,
            firebaseUid: result.user.uid,
            photoURL: result.user.photoURL,
          };
        }
      } catch (backendError) {
        console.error("Backend call failed:", backendError);
      }

      if (!userData) {
        userData = {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL,
        };
      }

      return {
        user: userData,
        token: firebaseToken
      };
    } catch (error) {
      let errorMessage = "Google sign-in failed";

      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in popup was closed";
          break;
        case "auth/cancelled-popup-request":
          errorMessage = "Sign-in was cancelled";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup was blocked by browser";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with this email";
          break;
        default:
          errorMessage = error.message;
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      await updateProfile(userCredential.user, {
        displayName: userData.name
      });

      const firebaseToken = await userCredential.user.getIdToken();
      console.log("Register Firebase token:", firebaseToken);

      let user = null;

      try {
        const response = await login({ token: firebaseToken });
        console.log("Register backend response:", response);
        console.log("Register backend response.user:", response.user);

        if (response.success && response.user) {
          user = {
            ...response.user,
            firebaseUid: userCredential.user.uid,
          };
        }
      } catch (backendError) {
        console.error("Backend call failed:", backendError);
      }

      if (!user) {
        user = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userData.name,
        };
      }

      return {
        user,
        token: firebaseToken
      };
    } catch (error) {
      let errorMessage = "Registration failed";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        default:
          errorMessage = error.message;
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      signOut(auth);
    },
    setUser: (state, action) => {
      if (action.payload?.user && action.payload?.token) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user && action.payload?.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.token);
        }
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user && action.payload?.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.token);
        }
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user && action.payload?.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.token);
        }
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;