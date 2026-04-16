import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const wineInputSchema = new Schema(
  {
    fixedAcidity: { type: Number, required: true },
    volatileAcidity: { type: Number, required: true },
    citricAcid: { type: Number, required: true },
    residualSugar: { type: Number, required: true },
    chlorides: { type: Number, required: true },
    freeSulfurDioxide: { type: Number, required: true },
    totalSulfurDioxide: { type: Number, required: true },
    density: { type: Number, required: true },
    pH: { type: Number, required: true },
    sulphates: { type: Number, required: true },
    alcohol: { type: Number, required: true },
  },
  { _id: false },
);

const predictionSchema = new Schema(
  {
    score: { type: Number, required: true },
    rating: { type: Number, required: true },
    category: { type: String, required: true },
    metrics: [
      {
        _id: false,
        name: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
  },
  { _id: false },
);

const wineRecordSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    inputs: {
      type: wineInputSchema,
      required: true,
    },
    prediction: {
      type: predictionSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'wine_records',
  },
);

wineRecordSchema.index({ user: 1, createdAt: -1 });
wineRecordSchema.index({ user: 1, 'prediction.category': 1, createdAt: -1 });
wineRecordSchema.index({ createdAt: -1 });
wineRecordSchema.index({ 'prediction.category': 1 });

export const WineRecord = model('WineRecord', wineRecordSchema);
