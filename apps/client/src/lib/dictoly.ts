import { DictolyClient } from "dictoly.js";

import { API_URL } from "~/config";

const token = localStorage.getItem("token");

const dictoly = new DictolyClient(token ?? "", API_URL);
dictoly.ws.connect();

export { dictoly };
