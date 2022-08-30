module.exports = (ENTITY, DATATYPES) => {
    return ENTITY.define('user_roles', {
        role: {
            type: DATATYPES.STRING
        }
    })
}