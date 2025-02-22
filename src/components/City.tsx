import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { cityType, useUserContext } from "../contexts/UserContext";
import { RefObject, useState } from "react";
import { themeStyles } from "../utils/theme";
import { useDbContext } from "../contexts/DbContext";
import { cityInit } from "../utils";

type Props = {
    city: cityType
    showInfo: ((err: string, color?: string | undefined) => void) | undefined
}

const City = ({ city, showInfo }: Props) => {
    const { updateCity, deleteCity } = useUserContext();

    const [name, setName] = useState(city.name || '');
    const [postCode, setPostCode] = useState(city.address.postCode || '');
    const isNew = !city.id;
    const operation = isNew ? 'Add city' : 'Update city data'

    const show = (text: string, color?: string) => {
        if (typeof showInfo === 'function')
            showInfo(text, color)
    }

    const process = (id: number) => {
        if (typeof id === 'undefined') {
            show(operation + ' failed');
            return
        }

        show(operation + ' successful', 'green');
        if (!isNew) return;
        city.id = id;
        setName('');
        setPostCode('');
    }

    const doUpdateCity = () => {
        updateCity({ ...{ id: city.id, name, postCode } }, process)
    }

    const processDelete = (id: number) =>
        show('Removing city was successful', 'green')

    const removeCity = () => {
        if (!city.id) return;
        deleteCity(city.id, processDelete)
    }

    const button = isNew ? (
        <TouchableOpacity onPress={doUpdateCity}>
            <Text className={themeStyles.button}>{operation}</Text>
        </TouchableOpacity>) : (
        <View className="flex-row justify-between">
            <TouchableOpacity onPress={doUpdateCity}>
                <Text className={themeStyles.button}>{operation}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={removeCity}>
                <Text className={themeStyles.button}>Remove</Text>
            </TouchableOpacity>
        </View>)

    return (
        <View className="gap-1">
            <TextInput
                autoCapitalize="words"
                placeholder={'City name'}
                value={name}
                onChangeText={setName}
                placeholderTextColor={'gray'}
                className={themeStyles.textInput}
            />
            <TextInput
                autoCapitalize="none"
                placeholder={'Post code'}
                value={postCode}
                onChangeText={setPostCode}
                placeholderTextColor={'gray'}
                className={themeStyles.textInput}
            />
            {button}
        </View>)
}

export default City;