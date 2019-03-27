const typeorm = require("typeorm/browser");
const EntitySchema = typeorm.EntitySchema;

const schema = new EntitySchema({
    name: "Account",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        accountName: {
            type: "varchar"
        },
        accountNumber: {
            type: "varchar"
        },
        amount: {
            type: "float"
        }
    },
    relations: {
        accountType: {
            target: "AccountType",
            type: "many-to-one",
            joinTable: true
        },
        bank: {
            target: "Bank",
            type: "many-to-one",
            joinTable: true
        },
        currency: {
            target: "Currency",
            type: "many-to-one",
            joinTable: true
        }
    }
});

module.exports = schema;