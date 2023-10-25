const jsonServer = require("json-server");
const auth = require("json-server-auth");

const server = jsonServer.create();
const router = jsonServer.router("db.json");

// Apply the auth middleware
server.db = router.db;
server.use(auth);
server.use(router);

server.listen(8000, () => {
  console.log("JSON Server with auth is running on port 8000");
});
