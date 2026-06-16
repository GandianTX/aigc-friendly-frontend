// src/features/comment/application/comment-state.spec.ts

import { describe, it, expect } from 'vitest';

import { commentFormReducer, initialCommentFormState } from './comment-state';
import type { CommentFormState, CommentFormAction } from './comment-state';

describe('commentFormReducer', () => {
  it('初始状态应为 idle', () => {
    expect(initialCommentFormState).toEqual({ status: 'idle' });
  });

  it('SUBMIT_START 应将状态设为 submitting', () => {
    const state: CommentFormState = { status: 'idle' };
    const action: CommentFormAction = { type: 'SUBMIT_START' };

    expect(commentFormReducer(state, action)).toEqual({ status: 'submitting' });
  });

  it('SUBMIT_SUCCESS 应将状态设为 success', () => {
    const state: CommentFormState = { status: 'submitting' };
    const action: CommentFormAction = { type: 'SUBMIT_SUCCESS' };

    expect(commentFormReducer(state, action)).toEqual({ status: 'success' });
  });

  it('SUBMIT_FAILURE 应将状态设为 failed 并携带错误信息', () => {
    const state: CommentFormState = { status: 'submitting' };
    const action: CommentFormAction = { type: 'SUBMIT_FAILURE', error: '网络错误' };

    expect(commentFormReducer(state, action)).toEqual({ status: 'failed', error: '网络错误' });
  });

  it('RESET 应将状态重置为 idle', () => {
    const state: CommentFormState = { status: 'failed', error: '网络错误' };
    const action: CommentFormAction = { type: 'RESET' };

    expect(commentFormReducer(state, action)).toEqual({ status: 'idle' });
  });

  it('从 success 状态 RESET 应回到 idle', () => {
    const state: CommentFormState = { status: 'success' };
    const action: CommentFormAction = { type: 'RESET' };

    expect(commentFormReducer(state, action)).toEqual({ status: 'idle' });
  });
});
