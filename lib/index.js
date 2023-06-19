#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const fs = __importStar(require("fs/promises"));
const process_1 = require("process");
const path_1 = __importDefault(require("path"));
let destinationArgument = 'destination';
let sourceArgument = 'source';
let typesArgument = 'types';
let helpArgument = 'help';
let _destination;
let _source;
let _types = [];
/**
 * Opens a folder and checks if any files match the specified extensions
 * @param currentFilepath the absolute path of the current folder
 * @param types the file types / extensions to match
 * @param baseFolder the folder relative to the entry point
 * @param destination the destionation to copy new files to
 */
function openFolder(currentFilepath, types, baseFolder, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        let desinationFolder = path_1.default.join(destination, baseFolder);
        yield fs.mkdir(desinationFolder, { recursive: true });
        let files = yield fs.readdir(currentFilepath);
        for (let file of files) {
            let subFilepath = path_1.default.join(currentFilepath, file);
            if ((yield fs.lstat(subFilepath)).isDirectory()) {
                let newBaseFolder = path_1.default.join(baseFolder, file);
                openFolder(subFilepath, types, newBaseFolder, destination);
                continue;
            }
            copyFile(file, subFilepath, types, baseFolder, destination);
        }
    });
}
/**
 * Check if a file matches the specified type and copy it
 * @param filename the current file's name
 * @param currentFilepath the absolute path of the file
 * @param types the file types / extensions to match
 * @param baseFolder the folder relative to the entry point
 * @param destination the destionation to copy new files to
 */
function copyFile(filename, currentFilepath, types, baseFolder, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let type of types) {
            if (!filename.endsWith(type))
                continue;
            let desinationFolder = path_1.default.join(destination, baseFolder);
            let newFilename = path_1.default.join(desinationFolder, filename);
            fs.copyFile(currentFilepath, newFilename);
        }
    });
}
/**
 * The module's main function
 * Takes in the following arguements
 * @param folder the source folder to copy files and folders from
 * @param types comma-separated file extensions
 * @param destination the folder to copy the files and folder structure to
 */
function copyFiles() {
    return __awaiter(this, void 0, void 0, function* () {
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
        }
        ;
        if (!_source || !_types || !_destination)
            return help();
        yield openFolder(_source, _types, '/', _destination);
    });
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
    
    npm exec simplecopyfiles source=./src/views destination=./build/views types=.png,.html,.css`);
    (0, process_1.exit)();
}
copyFiles();
