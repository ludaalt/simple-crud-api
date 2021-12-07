const isUserIdValid = (id) => {
    const regUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    return regUUID.test(id)
}

module.exports = isUserIdValid