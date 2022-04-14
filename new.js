function objectFactory() {
    const obj = new Object()
    const constructor = Array.prototype.shift.call(arguments)
    obj.__proto__ = constructor.prototype
    const result = constructor.apply(obj, arguments)
    return typeof result === "object" ? result : obj
}