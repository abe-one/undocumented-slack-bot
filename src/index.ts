import { PORT } from "./utils/env-fallbacks"

import server from "./api/server";

server.listen(PORT, (): void => {
  console.log("listening on", PORT);
});
