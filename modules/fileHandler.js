import fs from "fs"

const readFromFile = async () => {
    try {
        const data = await fs.promises.readFile("employees.json","utf-8")
        return JSON.parse(data || "[]")
    } catch (error) {
        throw error
    }
    
}

const writeToFile = async (data) => {
    try {
        await fs.promises.writeFile("employees.json", JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        throw error;
    }
    
}

export {readFromFile, writeToFile}