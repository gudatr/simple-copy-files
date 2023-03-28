# simple-copy-files
A simple but powerful cli command to copy files during e.g. a build without dependencies


### Installation

```
npm install --save-dev simple-copy-files
```

### Required parameters:

#### source
Folder to copy files and folder structure from
e.g.: source=./src/views

#### destination
Folder to copy to
e.g.: destination=./build/views

#### types
File types to copy
e.g.: types=.png,.html,.css

```
npm exec simplecopyfiles source=./src/views destination=./build/views types=.png,.html,.css
```

This command would copy all .png, .html and .css files from the ./src/views folder to the ./build/views folder and keep the necessary file structure.


### Example build command with simple-copy-files

Used in gudatr/status package.json

```
"build": "tsc --build --force && npm exec simple-copy-files source=./src/frontend/ types=.html,.ico,.css,.js,.map,.png,.jpg,.jpeg destination=./build/frontend/"


