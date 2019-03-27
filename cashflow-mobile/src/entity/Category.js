const typeorm = require("typeorm/browser");
const EntitySchema = typeorm.EntitySchema;

const schema = new EntitySchema({
    name: "Category",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        code: {
            type: "varchar"
        },
        name: {
            type: "varchar"
        },
        type: {
            //IN, OUT
            type: "varchar"
        }
    }
});

module.exports = schema;