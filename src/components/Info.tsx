import { Animated, Text } from "react-native"
import { themeStyles } from "../utils/theme"
import { setVariable } from "../utils";
import { useState } from "react";

const Info = ({ showInfoRef }: { showInfoRef: React.RefObject<((err: string, color?: string) => void) | undefined> }) => {

    const [opacity] = useState(new Animated.Value(0));
    const [err, setErr] = useState('');
    const [color, setColor] = useState('red');

    showInfoRef.current = (err: string, color = 'red') => {
        setColor(color);
        setErr(err);
        setVariable(opacity, 1);
        setTimeout(() => { setVariable(opacity, 0); setErr('') }, 5000);
    }

    return <Animated.View className={themeStyles.info}
        style={{ opacity: opacity, backgroundColor: color }}
    >
        <Text className='text-white'>{err}</Text>
    </Animated.View>
}

export default Info;