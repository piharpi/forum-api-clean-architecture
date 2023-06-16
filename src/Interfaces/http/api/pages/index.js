const PagesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "pages",
  register: async (server) => {
    const pagesHandler = new PagesHandler();
    server.route(routes(pagesHandler));
  },
};
