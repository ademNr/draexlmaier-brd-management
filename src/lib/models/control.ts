import { Schema, model, models, Document } from 'mongoose';

export interface IControl extends Document {
    username: string;
    shift: string;
    nmKsk: string;
    nmBbrd: string;
    commentaire: string;
    partierDefauts: Map<string, string[]>;
    totalDefauts: number;
    date: string;
}

const ControlSchema = new Schema<IControl>({
    username: { type: String, required: true },
    shift: { type: String, required: true },
    nmKsk: { type: String, required: true },
    nmBbrd: { type: String, required: true },
    commentaire: { type: String },
    partierDefauts: { type: Map, of: [String], required: true },
    totalDefauts: { type: Number, required: true },
    date: { type: String, required: true }, // Using String to match current format "dd/mm/yyyy hh:mm:ss"
}, { timestamps: true });

const ControlModel = models.Control || model<IControl>('Control', ControlSchema);

export default ControlModel;
