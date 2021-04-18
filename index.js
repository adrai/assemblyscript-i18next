import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
import fs from 'fs'
import loader from '@assemblyscript/loader'
import jsify from './jsify.js'
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + '/build/optimized.wasm'),
  // These are the JavaScript imports to our WebAssembly module, translating
  // from WebAssembly strings, received as a pointer into the module's memory,
  // to JavaScript's console API as JavaScript strings.
  {
    myConsole: {
      log(messagePtr) { // Called as `console.log` in assembly/index.ts
        console.log(wasmModule.exports.__getString(messagePtr))
      }
    }
  }
);

export default jsify(wasmModule.exports)
