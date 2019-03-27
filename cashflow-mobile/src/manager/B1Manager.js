import {getConnection} from "typeorm/browser";
import {
    Platform,
    AsyncStorage
} from 'react-native';
import {serial, parallel} from 'items-promise'
import Config from "./Config";
import Utility from '../screens/utility';
import AllEntities from '../entity';
import AllServices from '../service';
import RemoteManager from './RemoteManager';
import Provision from './Provision';

//const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';
const typeorm = require("typeorm/browser");
const EntitySchema = typeorm.EntitySchema; //this used in eval(), can't remove it

const dbName = "testorm.db";

function stashLogin(mEntityJson, token, email, name, conn) {
    return Promise.all([
        AsyncStorage.setItem('entity_json', JSON.stringify(mEntityJson)),
        AsyncStorage.setItem('token', token),
        AsyncStorage.setItem('email', email || ''),
        AsyncStorage.setItem('name', name || ''),
        setCurrency(conn)
    ]).then(() => {
        return AsyncStorage.setItem('login', "true");
    });
}

function setCurrency(conn) {
    return AllServices.SettingService(conn).findOne({"key": "currency"})
        .then(setting => {
            console.log(setting);
            return AllServices.CurrencyService(conn).findOne({"code": setting.value});
        }).then(curreny => {
            console.log(curreny);
            Utility.setCurrency(curreny);
            return curreny;
        });
}

function unstashLogin() {
    return AsyncStorage.getItem("login")
        .then(login => {
            if (login !== 'true') {
                return false;
            } else {
                var dbConn = null;
                return Promise.all([
                    AsyncStorage.getItem('entity_json'),
                    AsyncStorage.getItem('token'),
                    AsyncStorage.getItem('email'),
                    AsyncStorage.getItem('name')
                ]).then(([sEntityJson, token, email, name]) => {
                    let aEntities = JSON.parse(sEntityJson);
                    let oEntities = aEntities.map(d => new EntitySchema(d.options));

                    Config.setToken(token, email, name);
                    dbName = email + '.db';
                    return typeorm.createConnection({
                        type: "react-native",
                        database: dbName,
                        location: 'default',
                        logging: ['error', 'query', 'schema'],
                        synchronize: true,
                        entities: oEntities
                    });
                }).then(conn => {
                   return setCurrency(conn);
                }).then(curreny => {
                    return true;
                });
            }
        });
}

const bOrigDev = global.__DEV__;


module.exports = {
    getConnection: () => {
        return typeorm.getConnection();
    },
    login: function(email, sPassword) {
        // email = email.toLowerCase();
        console.log(email);
        let data = {
            email: email,
            password: sPassword
        };

        let token = null;
        let name = null;
        let sServiceJS = null;
        let mEntity = null;

        let formBody = [];
        for (let k in data) {
            formBody.push(encodeURIComponent(k) + "=" + encodeURIComponent(data[k]));
        }

        return RemoteManager.auth(data)
        .then(response => {
            Config.setToken(response.token, response.user.email, response.user.name);
            dbName = response.user.email + '.db';
            token = response.token;
            name = response.user.name;
        }).then(() => {
            //drop database firstly
            return new Promise(resolve => {
                try {
                    let conn = typeorm.getConnection();

                    if (conn) {
                        conn.close().then(resolve);
                    } else {
                        resolve();
                    }
                } catch (ex) {
                    resolve();
                }
            }).then(() => {
                return AllEntities;
            }).then(schemas => {
                console.log("schemas");
                console.log(schemas);
                mEntity = schemas;
                return typeorm.createConnection({
                    type: "react-native",
                    database: dbName,
                    location: 'default',
                    logging: ['error', 'query', 'schema'],
                    synchronize: true,
                    entities: schemas
                });
            });
        }).then(conn => {
            console.log("Provision init");
            let type, isDemo;
            if (dbName == "DemoCN.db") {
                type = "cn";
                isDemo = true;
            } else if (dbName == "DemoUS.db") {
                type = "us";
                isDemo = true;
            } else {
                type = "cn";
                isDemo = false;
            }

            return Provision.init(conn, type, isDemo);
        })
        .then(() => {
            return stashLogin(mEntity, token, email, name, typeorm.getConnection());
        }).then(() => {
            global.__DEV__ = bOrigDev;
            console.log("Provision done");
        })
    },
    logout: function() {
        return AsyncStorage.setItem('login', "false")
            .then(() => {
                Config.setToken(null, null, null);
            });
    },
    stashLogin: stashLogin,
    unstashLogin: unstashLogin
}
