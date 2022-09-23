const fs = require('fs')

module.exports = class Contenedor {
    constructor(file){
        this.file = file
    }
    async openFile(){
        try {
            let data = await fs.promises.readFile(`./${this.file}`,'utf-8') || '[]'
            return JSON.parse(data)
        } catch(err) {
            console.log(`Error Open File: ${err}`)
        }
    }
    
    async save(newData){
        let actualData = await this.openFile()
        newData["id"] = actualData.length + 1
        actualData.push(newData)
        let saveData = JSON.stringify(actualData)
        await fs.promises.writeFile(`./${this.file}`,saveData)
    }


    async deleteById(id){
        let actualData = await this.openFile()
        let index = actualData.findIndex(val => val.id == id)
        if(index != -1){
            actualData.splice(index,1)
            //! Index format
            actualData.forEach((val,i=0) => val["id"] = i+1)
        }else{
            console.log(`Id ${id} no encontrado, ingrese otro id.`)
        }
        let saveData = JSON.stringify(actualData)
        await fs.promises.writeFile(`./${this.file}`,saveData)
    }

    async getById(id){
        let actualData = await this.openFile()
        let item = actualData.filter((val)=> val.id == id )[0] || `Id ${id} no encontrado.`        
        return console.log(item)
    }

    async getAll(){
        let actualData = await this.openFile()
        return actualData
    }

    async deleteAll(){
        let actualData = await this.openFile()
        actualData = []
        let saveData = JSON.stringify(actualData)
        fs.promises.writeFile(`./${this.file}`,saveData)
        console.log('All data has been removed.')
    }
}
