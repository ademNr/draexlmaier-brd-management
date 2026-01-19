import { Schema, model, models, Document } from 'mongoose';

export interface IControl extends Document {
    id: number; // Keep existing ID structure for compatibility or migrate to _id? best to keep 'id' field for now to match frontend logic
    date: string;
    shift: string;
    username: string;
    nmKsk: string;
    nmBbrd: string;
    commentaire: string;
    selectedImage: string | null;
    imageFile: string | null; // Base64 string
    partierDefauts: Record<string, string[]>;
    totalDefauts: number;
    createdAt: Date;
}

const ControlSchema = new Schema<IControl>({
    id: { type: Number, required: true, unique: true },
    date: { type: String, required: true },
    shift: { type: String, required: true },
    username: { type: String, required: true },
    nmKsk: { type: String, required: true },
    nmBbrd: { type: String, required: true },
    commentaire: { type: String, default: '' },
    selectedImage: { type: String, default: null },
    imageFile: { type: String, default: null },
    partierDefauts: { type: Schema.Types.Mixed, default: {} },
    totalDefauts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const ControlModel = models.Control || model<IControl>('Control', ControlSchema);

export default ControlModel;
