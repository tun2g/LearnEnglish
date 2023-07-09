const routes = (app) => {
    app.use("/v1/api/volcab", require("./volcab.router"));
    app.use("/v1/api/user",require("./user.router"))
    app.use("/v1/api/auth",require("./auth.router"))
};

module.exports = routes;
