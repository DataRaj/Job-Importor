"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
let RedisService = class RedisService {
    redisClient;
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async setUserOnline(userId, username) {
        await this.redisClient.hSet(`onlineUsers:${userId}`, {
            userId,
            username,
        });
    }
    async removeOnlineUser(userId) {
        await this.redisClient.del(`onlineUsers:${userId}`);
    }
    async getAllOnlineUsers() {
        const keys = await this.redisClient.keys('onlineUsers:*');
        const users = [];
        for (const key of keys) {
            const userData = await this.redisClient.hGetAll(key);
            if (userData?.userId && userData?.username) {
                users.push({
                    userId: userData.userId,
                    username: userData.username,
                });
            }
        }
        return users;
    }
    async isUserOnline(userId) {
        return (await this.redisClient.exists(`onlineUsers:${userId}`)) === 1;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [Object])
], RedisService);
//# sourceMappingURL=redis.service.js.map