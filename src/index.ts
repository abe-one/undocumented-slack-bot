export { }

const { PORT } = require("./utils/env-fallbacks");

const server = require("./api/server");

server.listen(PORT, () => {
  console.log("listening on", PORT);
});
