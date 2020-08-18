import nunjucks from 'nunjucks';
import * as path from 'path';
import * as fs from 'fs';

type TDict = {[x: string]: any};

const DATA_PATH:string = path.join(__dirname, "data");
const ENCODING:string = 'utf8';
const MODIFIER_FILE:string = 'modifier.js';

const cleanName = (name: string) => name.replace(path.extname(name), '');
const getHandler = async (name: string) => import(name.replace(path.extname(name), '.js'));
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

    getHandler(path.join(DATA_PATH, MODIFIER_FILE))
        .then(handler => callback(null, nunjucks.renderString(
            source, handler.default(generateContext(DATA_PATH)))))
                .catch(err => console.log(err));;
};
