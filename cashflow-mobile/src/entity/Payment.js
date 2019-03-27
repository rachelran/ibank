const typeorm = require("typeorm/browser");
const EntitySchema = typeorm.EntitySchema;

const schema = new EntitySchema({
    name: "Payment",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        amount: {
            type: "float"
        },
        type: {
            //IN, OUT
            type: "varchar"
        },
        fromName: {
            type: "varchar",
            nullable: true
        },
        toName: {
            type: "varchar",
            nullable: true
        },
        transDate: {
            type: "varchar"
        },
        reference: {
            type: "varchar",
            nullable: true
        },
        createdBy: {
            type: "varchar"
        },
        createDate: {
            type: "varchar"
        },
        year: {
            type: "int"
        },
        month: {
            type: "int"
        },
        day: {
            type: "int"
        },
        isActive: {
            type: "boolean",
            nullable: true
        },
        accountBalance: {
            type: "float",
            nullable: true
        }
    },
    relations: {
        category: {
            target: "Category",
            type: "many-to-one",
            joinTable: true
        },
        fromAccount: {
            target: "Account",
            type: "many-to-one",
            joinTable: true
        },
        toAccount: {
            target: "Account",
            type: "many-to-one",
            joinTable: true
        },
        attachments: {
            target: "Attachment",
            type: "one-to-many",
            cascade: true,
            inverseSide: "payment"
        }
    }
});

module.exports = schema;