import mongoose from 'mongoose';

const AttractionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    region: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Attraction || mongoose.model('Attraction', AttractionSchema);