import { Types } from "mongoose";
import { Request as ExpressRequest } from "express";

declare module "express" {
  interface Request extends ExpressRequest {
    user?: IUser & { _id: Types.ObjectId };
  }
}
