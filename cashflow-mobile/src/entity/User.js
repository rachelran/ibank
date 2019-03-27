const typeorm = require("typeorm/browser");
const EntitySchema = typeorm.EntitySchema;

const schema = new EntitySchema(
    {
        name: "User",
        columns: {
            id: {
                primary: true,
                type: "varchar"
            },
            name: {
                type: "varchar"
            },
            email: {
                type: "varchar"

            },
            password: {
                type: "varchar"
            },
            createDate: {
                type: "varchar",
                nullable: true
            },
            loginDate: {
                type: "varchar",
                nullable: true
            }
        }
    }
);

module.exports = schema; 