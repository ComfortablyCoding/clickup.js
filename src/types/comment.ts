import { User } from './authorization';

export interface BaseCommentQuery {
	start?: number;
	start_id?: string;
}

export interface GetCommentsResult {
	comments: Comment[];
}

export interface Comment {
	id: string;
	comment: CommentContent[];
	comment_text: string;
	user: User;
	resolved: boolean;
	assignee: User | null;
	assigned_by: User | null;
	reactions: CommentReaction[];
	date: string;
}

export type CommentReaction = unknown;

export interface CommentContent {
	text: string;
}

export interface AddCommentResult {
	id: string;
	hist_id: string;
	date: number;
}

export interface AddCommentData {
	comment_text: string;
	assignee: number;
	notify_all: boolean;
}

export type UpdateCommentData = Omit<AddCommentData, 'notify_all'> & {
	resolved: boolean;
};

export type UpdateCommentResult = Comment;
