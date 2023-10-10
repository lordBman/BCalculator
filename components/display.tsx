import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { Parser } from "../logic";
import { ExpressionType } from "../logic/parser";

const Display = (props:{ problem: string, solve: boolean }) =>{
    let parser = new Parser(props.problem);

    let answer = "";
    let finalAnswer = "";

    if(parser.showErrors().length > 0){
        parser.showErrors().forEach((error)=>{
            console.log(error);
        });
    }else if(props.solve){
        answer = props.problem;

        let step =  parser.solve().step();
        while(step.expression.getType() !== ExpressionType.Number){
            answer += step.desc.length > 0 ? "\n" + step.desc : "";
            answer += "\n" + step.expression.display();
            step = step.expression.step();
        }
        answer += step.desc.length > 0 ? `\n ${step.desc}` : "";
        answer += `\nanswer: ${step.expression.getValue()}`;

        finalAnswer = `answer: ${step.expression.getValue()}`;
    }

    return (
        <View style={styles.body}>
            <ScrollView style={styles.anwser_container}>
                <Text style={styles.solution}>{answer}</Text>
            </ScrollView>
            { finalAnswer.length > 0 && <Text style={styles.finalAnswer}>{finalAnswer}</Text> }
            <AutoSizeText mode={ResizeTextMode.step_granularity} granularity={5} style={styles.problem} fontSize={60} numberOfLines={1}>{props.problem}</AutoSizeText>
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
        fontSize: 60,
        fontWeight: "600"
    },
    finalAnswer: {
        color: "grey",
        fontSize: 24,
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