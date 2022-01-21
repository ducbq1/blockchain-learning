"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
    });
    app.use(session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
    }));
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map