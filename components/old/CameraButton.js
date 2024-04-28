import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function CameraButton({ onPress, icon, color, title, size }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Ionicons name={icon} size={size ? size : 40} color={color ? color : "f1f1f1"} />
            <Text style={styles.text}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#f1f1f1',
        marginLeft: 10,
    }
})