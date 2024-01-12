import { model, Schema } from 'mongoose';
const userSchema = new Schema(
	{
		username: { type: String },
		email: { type: String },
		password: { type: String, select: false },
		authTokens: [{ type: String }],
	},
	{ timestamps: true }
);

export const User = model('User', userSchema);
