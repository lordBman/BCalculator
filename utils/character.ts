class Character{
    value: string;

    constructor(value: string){
        this.value = value;
    }
    
    isAlphabetic(): boolean{
        return /^[A-Za-z]$/.test(this.value);
    }
    
    isNumeric(): boolean{
        return /^[0-9.]$/.test(this.value);
    }
    
    isAlphanumeric(): boolean{
        return this.isAlphabetic() || this.isNumeric();
    }
}

export default Character;