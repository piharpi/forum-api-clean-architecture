class PagesHandler {
  constructor() {
    this.getPageRootHandler = this.getPageRootHandler.bind(this);
  }

  async getPageRootHandler(request, h) {
    return h
      .response({
        status: "success",
        value: "Homepage",
      })
      .code(200);
  }
}

module.exports = PagesHandler;
