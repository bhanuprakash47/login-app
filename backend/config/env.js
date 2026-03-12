import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT||3000
export const MONGO_URI=process.env.MONGO_URI;
export const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined in environment variables");
}

if (!JWT_SECRET_KEY) {
  throw new Error("❌ JWT_SECRET_KEY is not defined in environment variables");
}
