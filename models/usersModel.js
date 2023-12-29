import fs from "fs";
import { filePath } from "../utils/dataFilePath.js";

const initiaizUsersFile = () =>{
    if(fs.existsSync(filePath)){
       fs.writeFileSync(filePath,JSON.parse([]),'utf8' )
    }
}
const readUsersFromFile = () => {
  try {
    if(fs.readFileSync == null){
        initiaizUsersFile()
    }
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    throw new Error("Error reading from users file");
  }
};

const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(users), "utf-8");
  } catch (error) {
    throw new Error("Error writing to the users file");
  }
};

export { readUsersFromFile, writeUsersToFile, initiaizUsersFile};
