"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nunjucks_1 = __importDefault(require("nunjucks"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const APP_ROOT = process.env.PWD;
const DATA_PATH = path.join(APP_ROOT, "data");
const ENCODING = 'utf8';
const MODIFIER_FILE = path.join(DATA_PATH, 'modifier.js');
const DEFAULT_MODIFIER = { default: (data) => data };
const cleanName = (name) => name.replace(path.extname(name), '');
const modifierExists = () => fs.existsSync(MODIFIER_FILE);
const getModifier = (name) => __awaiter(void 0, void 0, void 0, function* () { return modifierExists() ? Promise.resolve().then(() => __importStar(require(MODIFIER_FILE))) : DEFAULT_MODIFIER; });
const applyFilter = (list, filterf) => filterf ? list.filter(filterf) : list;
const iterateFiles = (basedir, iterator, filterf) => applyFilter(fs.readdirSync(basedir).map(file => path.join(basedir, file)), filterf).map(iterator);
const getObject = (filename) => JSON.parse(fs.readFileSync(filename).toString());
const nameObject = (object, name) => ({ [name]: object });
const getObjects = (basedir) => {
    return iterateFiles(basedir, (filename) => nameObject(getObject(filename), cleanName(path.relative(basedir, filename))), (filename) => path.extname(filename).toLowerCase() === '.json');
};
const mergeObjects = (objects) => Object.assign({}, ...objects);
const generateContext = (basedir) => mergeObjects(getObjects(basedir));
function default_1(source) {
    const callback = this.async();
    getModifier(path.join(DATA_PATH, MODIFIER_FILE))
        .then(modifier => callback(null, nunjucks_1.default.renderString(source, modifier.default(generateContext(DATA_PATH)))))
        .catch(err => console.log(err));
    ;
}
exports.default = default_1;
;
//# sourceMappingURL=index.js.map