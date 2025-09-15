"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    volcengineApiKey: process.env.VOLCENGINE_API_KEY || 'b159bdbf-b2e4-4f6d-9560-30d938de2f6f',
    volcengineEndpointId: process.env.VOLCENGINE_ENDPOINT_ID || 'ep-20250915133445-727mq',
};
//# sourceMappingURL=config.js.map