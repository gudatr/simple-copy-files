# simple-copy-files
A simple but powerful cli command to copy files during e.g. a build without dependencies

### Required parameters:

source - the folder to copy files and the folder structures from
e.g.: source=./src/views

destination - the folder to copy to
e.g.: destination=./build/views

types - file types to copy
e.g.: types=.png,.html,.css

```
npm exec simplecopyfiles source=./src/views destination=./build/views types=.png,.html,.css
```

This command would copy all .png, .html and .css files from the /src/views folder to the ./build/views folder and keep the file structure.