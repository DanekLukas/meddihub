import { createContext, useContext, useRef, useState } from 'react';
import { useDbContext } from './DbContext';

type userType = {
    id?: number;
    email?: string;
    phoneNumber?: string;
    password?: string;
    cities: { [index: number]: cityType };
}

export type cityType = {
    id?: number;
    name: string;
    address: {
        postCode: string
    }
}

type passedCity = {
    id?: number;
    name: string;
    postCode: string;
}

export type passedUser = {
    id: number;
    email: string;
    phoneNumber: string;
    password: string;
}

type UserContextType = {
    user: userType
    actual: number
    initUser: (userRow: passedUser) => void
    updateUser: (userRow: passedUser) => void
    updateCity: (cityRow: passedCity, process: (id: number) => void) => void
    deleteCity: (id: number, process: (id: number) => void) => void
}

// Function to open or copy the SQLite database
export const UserProvider = ({ children }: { children: React.ReactNode }) => {

    const { getCities,
        updateUser: dbUpdateUser,
        updateCity: dbUpdateCity,
        addCity,
        removeCity } = useDbContext();

    const [actual, setActual] = useState(0);

    const user = useRef<userType>({ cities: {} });

    const refreshActual = () => { setActual(Object.keys(user.current.cities).length) }

    const initCities = (userId = user.current.id) => getCities(
        [userId],
        (rows: passedCity[]) => {
            rows.forEach(i => { if (i.id) user.current.cities[i.id] = convertCity(i) });
            refreshActual();
        })

    const convertCity = (cityRow: passedCity) => ({
        id: cityRow.id,
        name: cityRow.name,
        address: {
            postCode: cityRow.postCode
        }
    })

    const setUserValues = (userRow: passedUser) => {
        user.current.id = userRow.id;
        user.current.email = userRow.email;
        user.current.phoneNumber = userRow.phoneNumber;
        user.current.password = userRow.password;
    }

    const initUser = (userRow: passedUser) => {
        setUserValues(userRow);
        initCities(userRow.id);
        console.log('user', user)
    }

    const updateUser = (userRow: passedUser) => {
        dbUpdateUser(userRow, (id: number) => {
            if (typeof id === 'undefined') return;
            setUserValues(userRow);
        })
    }

    const updateCity = (cityRow: passedCity, process: (id: number) => void) => {
        const processCity = (id: number) => {
            if (typeof id === 'undefined') return;
            if (!!cityRow.id) {
                user.current.cities[cityRow.id] = convertCity(cityRow);
                return;
            }
            cityRow.id = id;
            user.current.cities[id] = convertCity(cityRow);
            refreshActual();
        };

        const params = Object.values(cityRow)
        params.push(user.current.id!)
        if (cityRow.id) {
            dbUpdateCity(params, (id) => {
                processCity(id);
                process(id);
            });
            return;
        }
        addCity(params.slice(1), (id) => {
            process(id);
            processCity(id);
        })
    }

    const deleteCity = (id: number, process: (id: number) => void) => {
        removeCity(id, (retId) => {
            if (!retId) return;
            delete user.current.cities[id];
            process(id);
            refreshActual();
        })
    }

    return (
        <UserContext.Provider
            value={{
                user: user.current,
                actual,
                initUser,
                updateUser,
                updateCity,
                deleteCity,
            }}
        >
            {children}
        </UserContext.Provider>
    )

};

const UserContext = createContext<UserContextType>({
    user: {
        id: undefined,
        email: undefined,
        phoneNumber: undefined,
        password: undefined,
        cities: {}
    },
    actual: 0,
    initUser: function (userRow: passedUser): void {
        throw new Error('Function not implemented.');
    },
    updateUser: function (userRow: passedUser): void {
        throw new Error('Function not implemented.');
    },
    updateCity: function (cityRow: passedCity, process: (id: number) => void): void {
        throw new Error('Function not implemented.');
    },
    deleteCity: function (id: number, process: (id: number) => void): void {
        throw new Error('Function not implemented.');
    }
})

export const useUserContext = () => useContext(UserContext);