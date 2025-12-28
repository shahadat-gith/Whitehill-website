import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
		transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
		status: {
			type: String,
			enum: ['pending', 'confirmed', 'cancelled', 'completed'],
			default: 'pending',
		},

        date: { type: Date, default: Date.now },
    },
);

const Investment = mongoose.model('Investment', investmentSchema);

export default Investment;