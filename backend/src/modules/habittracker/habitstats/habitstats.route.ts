import { Router } from "express";

import { getAllTimeStats } from "./habitstats.controller.js";

const habitStatsRouter = Router();

habitStatsRouter.get("/all-time/", getAllTimeStats);

export default habitStatsRouter;
