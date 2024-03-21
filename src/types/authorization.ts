export interface AccessTokenQuery {
	client_id: string;
	client_secret: string;
	code: string;
}

export interface AccessTokenResult {
	access_token: string;
}

export type AuthorizedUserResult = AuthorizedTeamMember;

export interface User {
	id: number;
	username: string;
	initials: string;
	email: string;
	color: string;
	profilePicture: string;
}

export interface AuthorizedTeamMember {
	user: Omit<User, 'initials' | 'email'>;
}

export interface AuthorizedTeam {
	id: string;
	name: string;
	color: string;
	avatar: string;
	members: AuthorizedTeamMember[];
}

export interface AuthorizedTeamsResult {
	teams: AuthorizedTeam[];
}
