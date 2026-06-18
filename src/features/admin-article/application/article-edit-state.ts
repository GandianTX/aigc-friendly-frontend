// src/features/admin-article/application/article-edit-state.ts

export type ArticleEditState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'editing' }
  | { status: 'saving' }
  | { status: 'saved' }
  | { status: 'publishing' }
  | { status: 'published' }
  | { status: 'failed'; error: string };

export type ArticleEditAction =
  | { type: 'LOAD_START' }
  | { type: 'START_EDIT' }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'PUBLISH_START' }
  | { type: 'PUBLISH_SUCCESS' }
  | { type: 'FAILURE'; error: string }
  | { type: 'RESET' };

export function articleEditReducer(state: ArticleEditState, action: ArticleEditAction): ArticleEditState {
  switch (action.type) {
    case 'LOAD_START':
      return { status: 'loading' };
    case 'START_EDIT':
      return { status: 'editing' };
    case 'SAVE_START':
      return { status: 'saving' };
    case 'SAVE_SUCCESS':
      return { status: 'saved' };
    case 'PUBLISH_START':
      return { status: 'publishing' };
    case 'PUBLISH_SUCCESS':
      return { status: 'published' };
    case 'FAILURE':
      return { status: 'failed', error: action.error };
    case 'RESET':
      return { status: 'idle' };
    default:
      return state;
  }
}

export const initialArticleEditState: ArticleEditState = { status: 'idle' };
