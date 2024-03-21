import { AddCommentData, AddCommentResult, BaseCommentQuery } from './comment';

export interface BaseTaskQuery {
	custom_task_ids?: boolean;
	team_id?: number;
}

export interface CustomField {
	id: string;
	name: string;
	type: string;
	type_config: CustomFieldTypeConfig;
	date_created: string;
	hide_from_guests: boolean;
}

export interface CustomFieldTypeConfig {
	options: CustomFieldTypeConfigOption[];
	default?: string | number | null;
	precision?: number;
	currency_type?: string;
	placeholder?: string | null;
	end?: number;
	start?: number;
	count?: number;
	code_point?: string;
	tracking?: CustomFieldTypeConfigTracking;
	complete_on?: number;
}

export interface CustomFieldTypeConfigOption {
	id: string;
	label?: string;
	color: string | null;
	name?: string;
	value?: number;
	type?: string;
	orderindex?: number;
}

export interface CustomFieldTypeConfigTracking {
	subtasks: boolean;
	checklists: boolean;
	assigned_comments: boolean;
}

export type AddTaskAttachmentQuery = BaseTaskQuery;

export interface AddTaskAttachmentResult {
	id: string;
	version: string;
	date: number;
	title: string;
	extension: string;
	thumbnail_small: string;
	thumbnail_large: string;
	url: string;
}

export type GetTaskCommentsQuery = BaseTaskQuery & BaseCommentQuery;

export interface GetTaskCommentsResult {
	comments: Comment[];
}

export type AddTaskCommentQuery = BaseTaskQuery;

export type AddTaskCommentData = AddCommentData;

export type AddTaskCommentResult = AddCommentResult;

export type AddTaskCustomFieldValueQuery = BaseTaskQuery;

export interface StringCustomFieldValue {
	value: string;
}

export interface NumberCustomFieldValue {
	value: number;
}

export interface DateCustomFieldValue {
	value: string;
	value_options?: {
		time: boolean;
	};
}

export interface RelationalCustomFieldValue {
	value: {
		add?: string[];
		rem?: string[];
	};
}

export interface ProgressCustomFieldValue {
	value: {
		current: number;
	};
}

export interface LabelCustomFieldValue {
	value: string[];
}

export interface LocationCustomFieldValue {
	value: {
		location?: {
			lat?: number;
			lng?: number;
		};
		formatted_address: string;
	};
}

export type AddTaskCustomFieldValueData =
	| StringCustomFieldValue
	| NumberCustomFieldValue
	| DateCustomFieldValue
	| RelationalCustomFieldValue
	| RelationalCustomFieldValue
	| ProgressCustomFieldValue
	| LabelCustomFieldValue
	| LocationCustomFieldValue;

export type RemoveTaskCustomFieldValueQuery = BaseTaskQuery;
