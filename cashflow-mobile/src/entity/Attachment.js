const typeorm = require("typeorm/browser");
const EntitySchema = typeorm.EntitySchema;

const schema = new EntitySchema({
    name: "Attachment",
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        file: {
            type: "varchar"
        }
    },
    relations: {
        payment: {
            target: "Payment",
            type: "many-to-one",
            onDelete: "CASCADE",
            joinTable: true
        }
    }
});

module.exports = schema;