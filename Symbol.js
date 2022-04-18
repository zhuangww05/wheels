(function() {
    const root = this

    const generateName = (function() {
        let postfix = 0
        return function(descString) {
            postfix++
            return `@@${descString}_${postfix}`
        }
    })()

    const SymbolPolyfill = function (description) {
        if(this instanceof SymbolPolyfill) throw new TypeError("SymbolPolyfill is not a constructor")
        const descString = description === undefined ? undefined : Object.prototype.toString.call(description)
        const symbol = Object.create({
            toString: function() {
                return this.__Name__
            },
            valueOf: function() {
                return this
            }
        })
        Object.defineProperties(symbol, {
            "__Description__": {
                value: descString,
                writable: false,
                enumerable: false,
                configurable: false
            },
            "__Name__": {
                value: generateName(descString),
                writable: false,
                enumerable: false,
                configurable: false
            }
        })
        return symbol
    }

    const forMap = {}

    Object.defineProperties(SymbolPolyfill, {
        "for": {
            value: function(description) {
                const descString = description === undefined ? undefined : Object.prototype.toString.call(description)
                return forMap[descString] ? forMap[descString] : forMap[descString] = SymbolPolyfill(descString)
            },
            writable: true,
            enumerable: false,
            configurable: true
        },
        "keyFor": {
            value: function(symbol) {
                for(let key in forMap) {
                    if(forMap[key] === symbol) return key
                }
            },
            writable: true,
            enumerable: false,
            configurable: true
        }
    })

    root.SymbolPolyfill = SymbolPolyfill
})()