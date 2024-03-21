import { AddCommentData, AddCommentResult, BaseCommentQuery, GetCommentsResult } from './comment';

export type GetViewCommentsQuery = BaseCommentQuery;

export type GetViewCommentsResult = GetCommentsResult;

export type AddViewCommentData = Omit<AddCommentData, 'assignee'>;
export type AddViewCommentResult = AddCommentResult;
