// src/features/admin-article/application/article-edit-state.spec.ts

import { describe, expect, it } from 'vitest';

import { articleEditReducer, initialArticleEditState } from './article-edit-state';
import type { ArticleEditAction, ArticleEditState } from './article-edit-state';

describe('articleEditReducer', () => {
  it('初始状态应为 idle', () => {
    expect(initialArticleEditState).toEqual({ status: 'idle' });
  });

  it('LOAD_START 应将状态转为 loading', () => {
    const next = articleEditReducer({ status: 'idle' }, { type: 'LOAD_START' });
    expect(next).toEqual({ status: 'loading' });
  });

  it('START_EDIT 应将状态转为 editing', () => {
    const next = articleEditReducer({ status: 'loading' }, { type: 'START_EDIT' });
    expect(next).toEqual({ status: 'editing' });
  });

  it('SAVE_START 应将状态转为 saving', () => {
    const next = articleEditReducer({ status: 'editing' }, { type: 'SAVE_START' });
    expect(next).toEqual({ status: 'saving' });
  });

  it('SAVE_SUCCESS 应将状态转为 saved', () => {
    const next = articleEditReducer({ status: 'saving' }, { type: 'SAVE_SUCCESS' });
    expect(next).toEqual({ status: 'saved' });
  });

  it('PUBLISH_START 应将状态转为 publishing', () => {
    const next = articleEditReducer({ status: 'editing' }, { type: 'PUBLISH_START' });
    expect(next).toEqual({ status: 'publishing' });
  });

  it('PUBLISH_SUCCESS 应将状态转为 published', () => {
    const next = articleEditReducer({ status: 'publishing' }, { type: 'PUBLISH_SUCCESS' });
    expect(next).toEqual({ status: 'published' });
  });

  it('FAILURE 应将状态转为 failed 并携带错误信息', () => {
    const next = articleEditReducer({ status: 'saving' }, {
      type: 'FAILURE',
      error: '保存失败',
    });
    expect(next).toEqual({ status: 'failed', error: '保存失败' });
  });

  it('RESET 应将状态重置为 idle', () => {
    const next = articleEditReducer({ status: 'failed', error: 'x' }, { type: 'RESET' });
    expect(next).toEqual({ status: 'idle' });
  });

  it('未知 action 应返回原状态', () => {
    const state: ArticleEditState = { status: 'editing' };
    const next = articleEditReducer(state, { type: 'UNKNOWN' } as unknown as ArticleEditAction);
    expect(next).toBe(state);
  });
});
