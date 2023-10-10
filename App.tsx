import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Display from './components/display';
import Keypad from './components/keypad';
import { Character } from './utils';


const App = (): JSX.Element =>{
  const isDarkMode = useColorScheme() === 'dark'; 
  const [problem, setProblem] = useState<string>("");
  const [proceed, setProceed] = useState(false);

  const add = (character: string) => {
    setProceed(false);
    /*let init = new Character(character);
    if(init.isNumeric()){
      setProblem((value)=> `${value}${character}`);
    }else{
      setProblem((value)=> `${value} ${character} `);
    }*/
    setProblem((value)=> `${value} ${character} `);
  }
  const solve = () =>setProceed(true);
  const erase = () => {
    setProceed(false);
    setProblem((value)=> value?.substring(0, value.length - 1));
  }
  const clear = () => {
    setProceed(false);
    setProblem("");
  }

  return (
    <SafeAreaView>
        <View style={{...styles.home, backgroundColor: isDarkMode ? "#0d0d0d" : "#f0f0f0" }}>
          <Display problem={problem} solve={proceed} />
          <Keypad onAdd={add} onSolve={solve} onErase={erase} onclear={clear}/>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    home: {
        height: "100%"
    },

});

export default App;
