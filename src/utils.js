import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
export { __dirname };