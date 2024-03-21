export interface CustomTaskType {
	id?: number;
	name?: string;
	name_plural?: string;
	description?: string;
}

export interface GetTeamCustomTaskTypesResult {
	custom_items: CustomTaskType[];
}
