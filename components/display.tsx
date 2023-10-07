import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Parser } from "../logic";
import { ExpressionType } from "../logic/parser";

const Display = (props:{ problem: string, solve: boolean }) =>{
    let parser = new Parser(props.problem);

    let answer = props.problem;

    if(parser.showErrors().length > 0){
        parser.showErrors().forEach((error)=>{
            console.log(error);
        });
    }else if(props.solve){
        let step =  parser.solve().step();
        while(step.expression.getType() !== ExpressionType.Number){
            answer += step.desc.length > 0 ? "\n" + step.desc : "";
            answer += "\n" + step.expression.display();
            step = step.expression.step();
        }
        answer += step.desc.length > 0 ? "\n" + step.desc : "";
        answer += "\nAnswer: " + step.expression.getValue();
    }

    return (
        <View style={styles.body}>
            <ScrollView style={styles.anwser_container}>
                <Text style={styles.solution}>{answer}</Text>
            </ScrollView>
            <Text style={styles.problem}>{props.problem}</Text>
        </View>);
}

const styles = StyleSheet.create({
    body: {
        flexGrow: 1,
        justifyContent:"flex-end",
        alignItems:"flex-end",
        paddingHorizontal: 10
    },
    anwser_container:{
        flexGrow: 1,
        width: "100%"
    },
    problem: {
        color: "grey",
        fontSize: 34,
        fontWeight: "400"
    },
    solution: {
        color: "grey",
        fontSize: 18,
        fontWeight: "300",
        letterSpacing: 1.7
    }
});

export default Display;