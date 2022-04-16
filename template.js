function template(literals, ...values) {
    const result = literals.reduce((pre, next, i) => {
        return pre + values[i - 1] + next
    })
    return result
}