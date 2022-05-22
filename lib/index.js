"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpeaker = exports.createListener = void 0;
const listener_1 = require("./listener");
const speaker_1 = require("./speaker");
function createListener(address) {
    return new listener_1.Listener(address);
}
exports.createListener = createListener;
function createSpeaker() {
    return new speaker_1.Speaker();
}
exports.createSpeaker = createSpeaker;
