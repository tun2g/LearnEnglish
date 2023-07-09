const routes = (app) => {
    app.use("/v1/api/volcab", require("./routers/volcab.router"));
    app.use("/v1/api/user",require("./routers/user.router"))
    app.use("/v1/api/auth",require("./routers/auth.router"))
};

module.exports = routes;
