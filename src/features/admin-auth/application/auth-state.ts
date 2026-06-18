// src/features/admin-auth/application/auth-state.ts

export type AuthState =
  | { status: 'idle' }
  | { status: 'logging-in' }
  | { status: 'authenticated'; accountId: number; role: string }
  | { status: 'failed'; error: string };

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; accountId: number; role: string }
  | { type: 'LOGIN_FAILURE'; error: string }
  | { type: 'LOGOUT' };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { status: 'logging-in' };
    case 'LOGIN_SUCCESS':
      return { status: 'authenticated', accountId: action.accountId, role: action.role };
    case 'LOGIN_FAILURE':
      return { status: 'failed', error: action.error };
    case 'LOGOUT':
      return { status: 'idle' };
    default:
      return state;
  }
}

export const initialAuthState: AuthState = { status: 'idle' };
