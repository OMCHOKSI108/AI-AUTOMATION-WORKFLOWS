import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
};

// Action types
const AUTH_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_USER: 'SET_USER'
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            };
        case AUTH_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                isLoading: false
            };
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing authentication on mount
    useEffect(() => {
        const checkAuth = () => {
            const user = authAPI.getCurrentUser();
            const token = authAPI.getToken();

            if (user && token) {
                dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
            } else {
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

            const response = await authAPI.login(credentials);

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user: response.user }
            });

            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            throw error;
        }
    };

    // Signup function
    const signup = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

            const response = await authAPI.signup(userData);

            // After successful signup, automatically log in
            const loginResponse = await authAPI.login({
                emailOrUsername: userData.email,
                password: userData.password
            });

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user: loginResponse.user }
            });

            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Signup failed';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        authAPI.logout();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Clear error function
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    const value = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        login,
        signup,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;