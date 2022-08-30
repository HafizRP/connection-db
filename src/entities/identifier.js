module.exports = (ENTITY, DATATYPES) => {
    return ENTITY.define("nim_table", {
        nim: {
            type: DATATYPES.STRING,
        },
    })

}