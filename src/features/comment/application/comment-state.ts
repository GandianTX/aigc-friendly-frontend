// src/features/comment/application/comment-state.ts

export type CommentFormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'failed'; error: string };

export type CommentFormAction =
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_FAILURE'; error: string }
  | { type: 'RESET' };

export const initialCommentFormState: CommentFormState = { status: 'idle' };

export function commentFormReducer(state: CommentFormState, action: CommentFormAction): CommentFormState {
  switch (action.type) {
    case 'SUBMIT_START':
      return { status: 'submitting' };
    case 'SUBMIT_SUCCESS':
      return { status: 'success' };
    case 'SUBMIT_FAILURE':
      return { status: 'failed', error: action.error };
    case 'RESET':
      return { status: 'idle' };
    default:
      return state;
  }
}
