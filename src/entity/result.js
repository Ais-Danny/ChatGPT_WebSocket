class Result {
    constructor(data,code = 200, success = true) {
        this.code = code;
        this.success = success;
        this.data = data;
    }
}

module.exports = Result