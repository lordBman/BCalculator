import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5"

const Keys = (props:{ text: string,  onclick?: (character: string)=>void, command?: boolean}) =>{

    const clicked = () =>props.onclick && props.onclick(props.text);

    return (
        <TouchableOpacity onPress={clicked} style={styles.parent}>
            <Text style={props.command ? blueText : greyText }>{props.text}</Text>
        </TouchableOpacity>
    );
}

const EqualsKey = (props: { onclick?: ()=>void }) =>{
    const clicked = () => props.onclick && props.onclick();
    return (
        <View style={equals}>
            <TouchableOpacity onPress={clicked} style={styles.equalsButton}>
                <Text style={whiteText}>=</Text>
            </TouchableOpacity>
        </View>
    );
}


const EraseKey = (props: { onclick?: ()=>void }) =>{
    const clicked = () => props.onclick && props.onclick();
    return (
        <TouchableOpacity onPress={clicked} style={styles.parent}>
            <Icon name="backspace" size={30} color="#0288D1"/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    parent:{
        justifyContent: "center",
        alignItems: "center",
        height: 80,
        flex: 1
    },
    equals:{
        height: 160,
        width: "100%",
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    equalsButton:{
        backgroundColor: "#0288D1",
        borderRadius: 8,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    text:{
        fontSize: 30,
        fontWeight: "600",
    }
});

const equals = StyleSheet.compose(styles.parent, styles.equals);
const blueText = StyleSheet.compose(styles.text, { color: "#0288D1" });
const greyText = StyleSheet.compose(styles.text, { color: "#6f6f6f" });
const whiteText = StyleSheet.compose(styles.text, { color: "#f0f0f0" });

export { Keys, EqualsKey, EraseKey };