import nunjucks from 'nunjucks';
import * as path from 'path';
import * as fs from 'fs';

type TDict = {[x: string]: any};

const APP_ROOT: string = process.env.PWD;
const DATA_PATH:string = path.join(APP_ROOT, "data");
const ENCODING:string = 'utf8';
const MODIFIER_FILE:string = path.join(DATA_PATH, 'modifier.js');
const DEFAULT_MODIFIER = { default: (data: any):any => data };

const cleanName = (name: string) => name.replace(path.extname(name), '');
const modifierExists = () => fs.existsSync(MODIFIER_FILE);
const getModifier = async (name: string) => modifierExists() ? import(MODIFIER_FILE) : DEFAULT_MODIFIER;
const applyFilter = (list, filterf) => filterf ? list.filter(filterf) : list;

const iterateFiles = (basedir: string, iterator: any, filterf: any) => applyFilter(
    fs.readdirSync(basedir).map(file => path.join(basedir, file)), filterf).map(iterator);

const getObject = (filename: string) => JSON.parse(fs.readFileSync(filename).toString());
const nameObject = (object: any, name: string) => ({ [name]: object });
const getObjects = (basedir: string) => {
    return iterateFiles(
        basedir,
        (filename: string) => nameObject(getObject(filename), cleanName(path.relative(basedir, filename))),
        (filename: string) => path.extname(filename).toLowerCase() === '.json'
    );
}
const mergeObjects = (objects: any[]): TDict => Object.assign({}, ...objects);

const generateContext = (basedir:string):TDict => mergeObjects(getObjects(basedir));

export default function(source:string) {
    const callback = this.async();

    getModifier(path.join(DATA_PATH, MODIFIER_FILE))
        .then(modifier => callback(null, nunjucks.renderString(
            source, modifier.default(generateContext(DATA_PATH)))))
                .catch(err => console.log(err));;
};
