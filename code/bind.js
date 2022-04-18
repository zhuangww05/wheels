Function.prototype.bind = function(context) {
    if(typeof this !== "function") throw new Error("Function.prototype.bind - what is trying to be bound is not callable")
    const self = this
    const args = Array.prototype.slice.call(arguments, 1)
    const fNOP = function(){}
    const fbound = function() {
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)))
    }
    fNOP.prototype = this.prototype
    fbound.prototype = new fNOP()

    return fbound
}