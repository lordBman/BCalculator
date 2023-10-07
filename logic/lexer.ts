import { Character, Result } from "../utils";

enum TokenType{
    Factor, Sub, Number, OpenBracket, CloseBracket, None
}

class Token{
    ttype: TokenType;
    value?: number | string;

    constructor(ttype: TokenType, value?: number | string){
        this.ttype = ttype;
        this.value = value;
    }

    static None = (): Token => new Token(TokenType.None);
    static Factor = (op: string): Token => new Token(TokenType.Factor, op);
    static Sub = (op: string): Token => new Token(TokenType.Sub, op);
    static Number = (value: number): Token => new Token(TokenType.Number, value); 
    static OpenBracket = (op: string): Token => new Token(TokenType.OpenBracket, op);
    static CloseBracket = (op: string): Token => new Token(TokenType.CloseBracket, op);
}

class Lexer{
    private index = 0;
    private current: Character;
    private data: string;

    constructor(data: string){
        this.data = data;
        this.current = new Character(data.charAt(0));
        this.index = 0;
    }

    hasNext(): boolean{
        if(this.data.length > 0){
            while(this.index < this.data.length){
                let init = this.data.charAt(this.index);
                let passable = ( init === ' ') || ( init === '\n') || ( init === '\t');
				if (!passable){
                    this.current = new Character(init);
                    return true;
                }
				this.index+= 1;
            }
        }
        return false;
    }

    private pop(): string{
		this.index += 1;
		return this.current.value;
	}

    getNextToken(): Result<Token>{
		if(this.current.value == '.' || this.current.isNumeric()){
			return this.getNumber();
		}else if(this.current.value == '+' || this.current.value == '-'){
			return Result.Ok(Token.Sub(this.pop()));
		}else if(this.current.value == '\u00f7' || this.current.value == 'x'){
			return Result.Ok(Token.Factor(this.pop()));
		}else if(this.current.value === '('){
			return Result.Ok(Token.OpenBracket(this.pop()));
		}else if(this.current.value === ')'){
			return Result.Ok(Token.CloseBracket(this.pop()));
		}else{
			return Result.Error("unexpected token: " + this.pop());
		}
	}

    private getNumber(): Result<Token>{
		let builder = "";
		while(this.hasNext() && (this.current.isNumeric() || this.current.value === '.')){
			builder+= this.pop();
		}

        try{
            let value = Number.parseFloat(builder);
            return Result.Ok(Token.Number(value));
        }catch{
            return Result.Error("Invalid number token: " + builder);
        }
	}
}

export { Token, TokenType }
export default Lexer;