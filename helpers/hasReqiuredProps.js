const hasRequiredProps = (obj, propsArr) => {
    propsArr.forEach(prop => {
        if(!obj.hasOwnProperty(prop)) {
            console.log(prop)
            return false
        }
    })
    return true
}

module.exports = hasRequiredProps