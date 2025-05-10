type SessionData<UserType> = {
	user: UserType;
	expiresAt: number;
};

export type SessionRecord<UserType> = Record<
	string,
	SessionData<UserType> | undefined
>;
