module.exports = (ENTITY, DATATYPES) => {
    const Details = ENTITY.define("user_details", {
        phoneNumber: {
            type: DATATYPES.INTEGER
        },
        address: {
            type: DATATYPES.STRING
        }
    })
    return Details
}