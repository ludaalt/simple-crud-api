const users = []

function addUser(data) {
    console.log(data)
    users.push(data)
}

function findUser(idx) {
    for(let i = 0; i < users.length; i += 1) {
        if(users[i]["id"] === idx) {
            return users[i]
        }
    }
    return null
}

function updateUser(data, idx) {
    for(let i = 0; i < users.length; i += 1) {
        if(users[i]["id"] === idx) {
            for(let prop in data) {
                users[i][prop] = data[prop]
            } 
            
            return users[i]
        }
    }    
}

function deleteUser(id) {
    return users.filter(item => item.id !== id)
}

module.exports = {users, addUser, findUser, updateUser, deleteUser}