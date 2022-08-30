module.exports = (ENTITY, DATATYPES) => {
    return ENTITY.define('user_table', {
        username: {
            type: DATATYPES.STRING
        },
        class: {
            type: DATATYPES.STRING
        }
    })
}