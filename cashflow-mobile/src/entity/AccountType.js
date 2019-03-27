const typeorm = require("typeorm/browser");
const EntitySchema = typeorm.EntitySchema;

const schema = new EntitySchema({
    name: "AccountType",
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
        }
    }
});

module.exports = schema;