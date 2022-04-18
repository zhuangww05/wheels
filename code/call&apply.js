Function.prototype.call = function(context) {
    context = context || window
    context.fn = this
    const args = []
    for(let i = 1; i < arguments.length; i++) {
        args.push('arguments[' + i +']')
    }
    const result = eval('context.fn(' + args + ')')
    delete context.fn
    return result
}

Function.prototype.apply = function(context, arr) {
    context = context || window
    context.fn = this
    const args = []
    if(!arr) {
        context.fn()
    } else {
        for(let i = 0; i < arr.length; i++) {
            args.push('arr[' + i + ']')
        }
    }
    const result = eval('context.fn(' + args + ')')
    delete context.fn
    return result
}