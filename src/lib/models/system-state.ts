import { Schema, model, models, Document } from 'mongoose';

export interface ISystemState extends Document {
    key: string;
    value: any; // Flexible value
}

const SystemStateSchema = new Schema<ISystemState>({
    key: { type: String, required: true, unique: true }, // e.g., 'draexlmaier_dashboard_images'
    value: { type: Schema.Types.Mixed, required: true }
});

const SystemStateModel = models.SystemState || model<ISystemState>('SystemState', SystemStateSchema);

export default SystemStateModel;
