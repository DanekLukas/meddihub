import SQLite from 'react-native-sqlite-storage';
import { Platform } from 'react-native';
import { createContext, useContext, useEffect, useRef } from 'react';

SQLite.enablePromise(true);

type DbContextType = {

    getUser: (params: any, callBack: (rows: any) => void) => void,
    addUser: (params: any, callBack: (id: number) => void) => void,
    updateUser: (params: any, callBack: (rows: any) => void) => void,
    removeUser: (params: any, callBack: (rows: any) => void) => void,
    getCities: (params: any, callBack: (rows: any) => void) => void,
    addCity: (params: any, callBack: (rows: any) => void) => void,
    updateCity: (params: any, callBack: (rows: any) => void) => void,
    removeCity: (params: any, callBack: (rows: any) => void) => void
}

// Function to open or copy the SQLite database
export const DbProvider = ({ children }: { children: React.ReactNode }) => {

    const dbName = 'meddihub.db'; // The name of your SQLite database

    const db = useRef<SQLite.SQLiteDatabase>(undefined);

    useEffect(() => {
        const init = async () => {
            try {
                // Check if this is Android, we need to copy the database from the assets folder to internal storage
                if (Platform.OS === 'android') {
                    const fs = require('react-native-fs');

                    const dbPath = fs.DocumentDirectoryPath + '/' + dbName;

                    // Check if the database already exists
                    const fileExists = await fs.exists(dbPath);

                    if (!fileExists) {
                        // Copy the database file from assets to the internal storage
                        await fs.copyFileAssets(dbName, dbPath);
                    }

                    db.current = await SQLite.openDatabase({ name: dbPath, location: 'default' });
                } else {
                    // For iOS, we can directly open the database from the app's bundle
                    db.current = await SQLite.openDatabase({ name: dbName, location: 'Library' });
                }

            } catch (error) {
                console.error('Error opening SQLite database: ', error);
            }
        }

        init();

    }, []);

    const getUser =  (params: any, callBack: (id: number) => void) => {
        processQuery(
        "SELECT id, email, phoneNumber, password FROM user WHERE email = ? OR phoneNumber = ?;",
            params,
            callBack
        )
    }

    const addUser = (params: any, callBack: (id: number) => void) => {
        processQuery(
            "INSERT INTO user (email, phoneNumber, password) VALUES (?, ?, ?);",
            params,
            callBack
        )
    }

    const updateUser = (params: any, callBack: (id: number) => void) => {
        processQuery(
            "INSERT OR REPLACE INTO user (id, email, phoneNumber, password) VALUES (?, ?, ?, ?);",
            params,
            callBack
        )
    }

    const removeUser = (id: number, callBack: (rows: number | any[]) => void) => {
        processQuery(
            "DELETE FROM user WHERE id = ?",
            [id],
            callBack
        )
    }

    const getCities =  (params: any, callBack: (id: number) => void) => {
        processQuery(
            "SELECT id, name, postCode FROM city WHERE user_id = ?;",
            params,
            callBack
        )
    }

    const addCity = (params: any, callBack: (id: number) => void) => {
        processQuery(
            "INSERT INTO city (name, postCode, user_id) VALUES (?, ?, ?);",
            params,
            callBack
        )
    }

    const updateCity = (params: any, callBack: (id: number) => void) => {
        processQuery(
            "INSERT OR REPLACE INTO city (id, name, postCode, user_id) VALUES (?, ?, ?, ?);",
            params,
            callBack
        )
    }

    const removeCity = (id: number, callBack: (rows: number | any[]) => void) => {
        processQuery(
            "DELETE FROM city WHERE id = ?",
            [id],
            callBack
        )
    }

    const processQuery = (query: string, params: (string | number)[], callBack: (rows: any) => void) => {
        if (!db.current) return;
        db.current.transaction((tx: SQLite.Transaction) => {
            tx.executeSql(query, params,
                (tx, results) => {
                    if (results.insertId)
                        callBack(results.insertId);
                    const rows = results.rows.raw();  // Extract rows from the results
                    callBack(rows);
                },
                (tx, error) => {
                    callBack(undefined);
                    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='user';", [], (tx, results) => {
                        if (!results) tx.executeSql("CREATE TABLE user (id integer primary key autoincrement not null, email varchar(160) not null unique, phoneNumber varchar(30) unique, password varchar(140) not null);");
                    })
                    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='city';", [], (tx, results) => {
                        if (!results) tx.executeSql("CREATE TABLE city (id integer primary key autoincrement not null, name varchar(100) not null, postCode varchar(12), user_id integer not null, CONSTRAINT `user_fk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`));");
                    })
                },
            );
        });
    }

    return (
        <DbContext.Provider
            value={{
                getUser,
                addUser,
                updateUser,
                removeUser,
                getCities,
                addCity,
                updateCity,
                removeCity
            }}
        >
            {children}
        </DbContext.Provider>
    )

};

const DbContext = createContext<DbContextType>({
    getUser: function (params: any, callBack: (rows: any) => void): void {
        throw new Error('Function not implemented.');
    },
    addUser: function (params: any, callBack: (id: number) => void): void {
        throw new Error('Function not implemented.');
    },
    updateUser: function (params: any, callBack: (rows: any) => void): void {
        throw new Error('Function not implemented.');
    },
    removeUser: function (params: any, callBack: (rows: any) => void): void {
        throw new Error('Function not implemented.');
    },
    getCities: function (params: any, callBack: (rows: any) => void): void {
        throw new Error('Function not implemented.');
    },
    addCity: function (params: any, callBack: (rows: any) => void): void {
        throw new Error('Function not implemented.');
    },
    updateCity: function (params: any, callBack: (rows: any) => void): void {
        throw new Error('Function not implemented.');
    },
    removeCity: function (params: any, callBack: (rows: any) => void): void {
        throw new Error('Function not implemented.');
    }
})

export const useDbContext = () => useContext(DbContext);