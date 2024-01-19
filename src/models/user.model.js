import { model, Schema } from 'mongoose';
const userSchema = new Schema(
	{
		username: { type: String, require: true, unique: true },
		email: { type: String, require: true, unique: true },
		password: { type: String, select: false },
		notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
		lastLogin: { type: Date },
	},
	{ timestamps: true }
);

export const User = model('User', userSchema);
