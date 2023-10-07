import { StyleSheet, TouchableOpacity, View } from "react-native";
import { EqualsKey, EraseKey, Keys } from "./keys";

const Keypad = (props: { onAdd: CallableFunction, onSolve: CallableFunction, onclear: CallableFunction, onErase: CallableFunction }) =>{
    const add = (character: string) =>props.onAdd(character);
    const solve = () => props.onSolve();
    const clear = () => props.onclear();
    const backspace = () => props.onErase();

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Keys command text="C" onclick={clear} />
                <Keys command text="&#247;" onclick={add} />
                <Keys command text="x" onclick={add} />
                <EraseKey onclick={backspace}/>
            </View>
            <View style={styles.row}>
                <Keys text="1" onclick={add} />
                <Keys text="2" onclick={add} />
                <Keys text="3" onclick={add} />
                <Keys command text="-"onclick={add} />
            </View>
            <View style={styles.row}>
                <Keys text="4" onclick={add}/>
                <Keys text="5" onclick={add}/>
                <Keys text="6" onclick={add}/>
                <Keys command text="+" onclick={add}/>
            </View>
            <View style={styles.section}>
                <View style={{ flex:3 }}>
                    <View style={styles.row}>
                        <Keys text="7" onclick={add}/>
                        <Keys text="8" onclick={add}/>
                        <Keys text="9" onclick={add}/>
                    </View>
                    <View  style={styles.row}>
                        <Keys text="%" />
                        <Keys text="0" onclick={add}/>
                        <Keys text="." onclick={add}/>
                    </View>
                </View>
                <View style={{ flex: 1, margin: 0 }}>
                    <EqualsKey onclick={solve}/>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "stretch"
    },
    row: {
        flexDirection: "row",
        justifyContent:"space-around"
    },
    section:{
        flexDirection: "row",
        width: "100%",
    }
});

export default Keypad;