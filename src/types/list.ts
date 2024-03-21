import { AddCommentData, AddCommentResult, BaseCommentQuery, GetCommentsResult } from './comment';
import { CustomField } from './task';

export type GetListCommentsQuery = BaseCommentQuery;
export type GetListCommentsResult = GetCommentsResult;

export type AddListCommentData = AddCommentData;
export type AddListCommentResult = AddCommentResult;

export interface GetListCustomFieldsResult {
	fields: CustomField[];
}
