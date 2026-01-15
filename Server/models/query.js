import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    reply: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Query = mongoose.models.Query || mongoose.model('Query', querySchema);
export default Query;