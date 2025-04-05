import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  authProvider?: string;
  dailyGenerationCount?: number;
  lastGenerationDate?: Date;
  rewardedGenerations?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },
    authProvider: {
      type: String,
      required: false,
      trim: true,
    },
    dailyGenerationCount: {
      type: Number,
      required: false,
      default: 3,
    },
    lastGenerationDate: {
      type: Date,
      required: false,
    },
    rewardedGenerations: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
