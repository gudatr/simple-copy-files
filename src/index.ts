import * as fs from "fs/promises";
import { exit } from "process";
import path from "path";

let destinationArgument = 'destination';
let sourceArgument = 'source';
let typesArgument = 'types';
let helpArgument = 'help';

let _destination: string | undefined;
let _source: string | undefined;
let _types: string[] = [];

/**
 * Opens a folder and checks if any files match the specified extensions
 * @param currentFilepath the absolute path of the current folder
 * @param types the file types / extensions to match
 * @param baseFolder the folder relative to the entry point
 * @param destination the destionation to copy new files to
 */
async function openFolder(currentFilepath: string, types: string[], baseFolder: string, destination: string) {
    let files = await fs.readdir(currentFilepath);

    for (let file of files) {
        let subFilepath = path.join(currentFilepath, file);

        if ((await fs.lstat(subFilepath)).isDirectory()) {
            let newBaseFolder = path.join(baseFolder, file);
            openFolder(subFilepath, types, newBaseFolder, destination); continue;
        }

        copyFile(file, subFilepath, types, baseFolder, destination);
    }
}

/**
 * Check if a file matches the specified type and copy it
 * @param filename the current file's name
 * @param currentFilepath the absolute path of the file
 * @param types the file types / extensions to match
 * @param baseFolder the folder relative to the entry point
 * @param destination the destionation to copy new files to
 */
async function copyFile(filename: string, currentFilepath: string, types: string[], baseFolder: string, destination: string) {
    for (let type of types) {

        if (!filename.endsWith(type)) continue;

        let desinationFolder = path.join(destination, baseFolder);
        let newFilename = path.join(desinationFolder, filename);

        await fs.mkdir(desinationFolder, { recursive: true });
        fs.copyFile(currentFilepath, newFilename);
    }
}

/**
 * The module's main function
 * Takes in the following arguements
 * @param folder the source folder to copy files and folders from
 * @param types comma-separated file extensions
 * @param destination the folder to copy the files and folder structure to
 */
async function copyFiles() {
    for (let element of process.argv.slice(2)) {
        switch (element.split('=').shift()) {
            case sourceArgument:
                _source = element.substring(sourceArgument.length + 1);
                break;
            case typesArgument:
                _types = element.substring(typesArgument.length + 1).split(',');
                _types.forEach((value, i) => _types[i] = value.trim());
                break;
            case destinationArgument:
                _destination = element.substring(destinationArgument.length + 1);
                break;
            case helpArgument:
                help();
        }
    };

    if (!_source || !_types || !_destination) return help();

    await openFolder(_source, _types, '/', _destination);
}

function help() {

    console.log(`
    Simple Copy Files v1.0.0

    Required parameters:

    source - the folder to copy files and the folder structures from
    e.g.: source=./src/views

    destination - the folder to copy to
    e.g.: destination=./build/views

    types - file types to copy
    e.g.: types=.png,.html,.css
    
    npm run simplecopyfiles source=./src/views destination=./build/views types=.png,.html,.css`);

    exit();
}

copyFiles();