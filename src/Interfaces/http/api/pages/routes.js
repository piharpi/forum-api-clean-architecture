module.exports = (handler) => [
  {
    method: "GET",
    path: "/",
    handler: handler.getPageRootHandler,
  },
];
