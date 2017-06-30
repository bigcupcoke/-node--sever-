const { log, randomStr} = require('../../utils.js')
// log('a', randomStr())
const fs = require('fs')

const enSureExist = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data, 'utf8')
    }
}

const save = (path, data) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s, 'utf8')
}

const load = (path) => {
    enSureExist(path)
    const options = {
        encoding: 'utf8',
    }
    const data = fs.readFileSync(path, options)
    const s =JSON.parse(data, null, 2)
    return s
}

class Model {
    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = `../db/${classname}.txt`
        return path
    }

    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = []
        models.forEach((m) => {
            let model = this.create(m)
            ms.push(model)
        })
        return ms
    }

    static create(form={}) {
        const instance = new this(form)
        return instance
    }

    static findOne(key, value) {
        const models = this.all()
        let instance = null
        models.forEach((m) => {
            if (m[key] === value) {
                instance = m
                return false
            }
        })
        return instance
    }

    save() {
        const cls = this.constructor
        const models = cls.all()
        if (this.id === undefined) {
            const len = models.length
            if (len > 0) {
                const last = models[len - 1]
                this.id = last.id + 1
            } else {
                this.id = 0
            }
            models.push(this)
        } else {
            let index = -1
            models.forEach((m, i) => {
                if (m.id === this.id) {
                    index = i
                    return false
                }
            })
            if (index > -1) {
                models[index] = this
            }
        }
        const path = cls.dbPath()
        save(path, models)
    }
}

module.exports = Model
