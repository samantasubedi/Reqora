"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const server = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
server.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
server.use(express_1.default.json());
server.use((0, cookie_parser_1.default)());
server.use(index_1.default);
server.use(errorMiddleware_1.errorMiddleware);
server.listen(4000, () => {
    console.log("server running in port 4000");
});
//# sourceMappingURL=server.js.map