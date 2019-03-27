const typeorm = require("typeorm/browser");
const EntitySchema = typeorm.EntitySchema;

const schema = new EntitySchema({
    name: "Setting",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        key: {
            type: "varchar"
        },
        value: {
            type: "varchar"
        }
    }
});

module.exports = schema;