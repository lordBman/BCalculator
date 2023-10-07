/////////////////////////
///Enums              ///
/////////////////////////
import Lexer, { Token, TokenType } from "./lexer";

/////////////////////////
enum ExpressionType{ None, Number, Binary, Negation, Coefficient, Bracket }

/////////////////////////
///Expession Class    ///
/////////////////////////
abstract class Expression{
	abstract getValue():number;
	abstract getType():ExpressionType;
	abstract display(): string;
	abstract step(): { expression: Expression, desc: string }
}

/////////////////////////
///None Expession     ///
/////////////////////////
class NoneExpression extends Expression{
    getValue = (): number => 0.0;
    getType = (): ExpressionType => ExpressionType.None;
	display = (): string => "0";
	step(): { expression: Expression; desc: string; } {
		return { expression: new NumberExpression(0), desc: "" };
	}
}

/////////////////////////
///Number Expession   ///
/////////////////////////
class NumberExpression extends Expression{
	private value: number;

	constructor(value: number){
		super();
		this.value = value;
	}
    getValue = (): number => this.value;
    getType = (): ExpressionType => ExpressionType.Number;
	display = (): string => this.value.toString();
	step(): { expression: Expression; desc: string; } {
		return { expression: this, desc: "" }
	}
}

/////////////////////////
///Coefficient Exp    ///
/////////////////////////
class CoExpression extends Expression{
	left: Expression;
	right: Expression;

	constructor(left: Expression, right: Expression){
		super();
		this.left = left;
		this.right = right;
	}

	getValue = (): number => this.left.getValue() * this.right.getValue();
    getType = (): ExpressionType => ExpressionType.Coefficient;
	display = (): string => this.left.display() + this.right.display();
	step(): { expression: Expression; desc: string; } {
		let init = this.right.step();
		this.right = init.expression;
		if(this.left.getType() === ExpressionType.Number && this.right.getType() === ExpressionType.Number){
			return { expression: new BinaryExpression(this.left, "x", this.right), desc: init.desc }
		}
		return { expression: this, desc: init.desc };
	}
}

/////////////////////////
///Binary Expession   ///
/////////////////////////
class BinaryExpression extends Expression{
	left: Expression;
	right: Expression;
	op: string;

	constructor(left: Expression, op: string, right: Expression){
		super();
		this.left = left;
		this.right = right;
		this.op = op;
	}

	getValue = (): number =>{
		switch(this.op){
			case "-":
				return this.left.getValue() - this.right.getValue();
			case "+":
				return this.left.getValue() + this.right.getValue();
			case "x":
				return this.left.getValue() * this.right.getValue();
			case "\u00f7":
				return this.left.getValue() / this.right.getValue();
			default:
				return 0;
		}
	}
    getType = (): ExpressionType => ExpressionType.Binary;
	display = (): string => `${this.left.display()} ${this.op} ${this.right.display()}`;

	step(): { expression: Expression; desc: string; } {
		if(this.left.getType() === ExpressionType.Number && this.right.getType() === ExpressionType.Number){
			let left_value = this.left.getValue();
			let right_value = this.right.getValue();
			let final_value = this.getValue();
			let desc = "";
			switch(this.op){
				case "+":
					desc = `added ${left_value} to ${right_value} which equals ${final_value}`;
					break;
				case "-":
					desc = `substracted ${left_value} from ${right_value} which equals ${final_value}`;
					break;
				case "x":
					desc = `multiplied ${left_value} with ${right_value} which equals ${final_value}`;
					break;
				case "\u00f7":
					desc = `divided ${left_value} with ${right_value} which equals ${final_value}`;
					break;
			}
			return { expression: new NumberExpression(final_value), desc };
		}else if(this.left.getType() !== ExpressionType.Number){
			let init = this.left.step();
			this.left = init.expression;
		
			return { expression: this, desc: init.desc };
		}else{
			let init = this.right.step();
			this.right = init.expression;
		
			return { expression: this, desc: init.desc };
		}
	}
}

/////////////////////////
///Negation Expession ///
/////////////////////////
class NegationExpression extends Expression{
	expression: Expression;
	operator: string;

	constructor(operator: string, expression: Expression){
		super();
		this.expression = expression;
		this.operator = operator;
	}

	getValue = (): number => -1 * this.expression.getValue();
    getType = (): ExpressionType => ExpressionType.Negation;
	display = (): string => "-" + this.expression.getValue();
	step(): { expression: Expression; desc: string; } {
		let init = this.expression.step();
		this.expression = init.expression;
		if(this.expression.getType() === ExpressionType.Number){
			let final_value = this.getValue();
			let desc = `multiply -1 with ${this.expression.getValue()} to ${final_value}`;

			return { expression:  new NumberExpression(final_value), desc };
		}
		return { expression: this, desc: init.desc };
	}
}

/////////////////////////
///Bracket Expession  ///
/////////////////////////
class BracketExpression extends Expression{ 
	expression:Expression;
	open: string;
	close: string;

	constructor(open: string, expression:Expression, close: string){
		super();
		this.expression = expression;
		this.open = open;
		this.close = close;
	}

	getValue = (): number => this.expression.getValue();
    getType = (): ExpressionType => ExpressionType.Bracket;
	display = (): string => `(${this.expression.display()})`;
	step(): { expression: Expression; desc: string; } {
		if(this.expression.getType() === ExpressionType.Number){
			let value = this.expression.getValue();
			return { expression:  new NumberExpression(value), desc: `removed bracket ${this.display()} to ${value}` };
		}

		let init = this.expression.step();
		this.expression = init.expression;
	
		return { expression: this, desc: init.desc };
	}
}

/////////////////////////
///Parser   		  ///
/////////////////////////
class Parser{
	private lexer: Lexer;
	private errors: string[];
	private current: Token;

	constructor(data: string){
		this.lexer = new Lexer(data);
		this.errors = []; 
		this.current = Token.None();
	}

	private pop = ():Token =>{
		let init = this.current!;
		while(this.lexer.hasNext()){
			let result = this.lexer.getNextToken();
			if(!result.isError()){
				this.current = result.unwrap() as Token;
				return init;
			}else{
				this.errors.push(result.getMessage() as string);
			}
		}
		this.current = Token.None();
		return init;
	}

	private has = ():boolean =>{
		return this.current.ttype !== TokenType.None;
	}

	public solve = (): Expression =>{
		while(this.lexer.hasNext()){
			let result = this.lexer.getNextToken();
			if(!result.isError()){
				this.current = result.unwrap() as Token;
				return this.sum();
			}else{
				this.errors.push(result.getMessage() as string);
			}
		}
		return new NoneExpression();
	}

	private sum = (): Expression =>{
		let left = this.factor();
		while(this.has()){
			if(this.current.ttype === TokenType.Sub){
				left = new BinaryExpression(left, this.pop().value as string, this.sum());
			}else{
				break;
			}
		}
		return left;
	}

	private factor = (): Expression =>{
		let left = this.others();
		while(this.has()){
			if(this.current.ttype === TokenType.Factor){
				left = new BinaryExpression(left, this.pop().value as string, this.factor());
			}else{
				break;
			}
		}
		return left;
	}

	private others = (): Expression =>{
		let _current = this.current;
		if(this.has() && _current.ttype === TokenType.OpenBracket){
			let open = this.pop();
			let exp = this.sum();
			if(this.has() && this.current.ttype === TokenType.CloseBracket){
				let close = this.pop();
				return new BracketExpression(open.value as string, exp, close.value as string);
			}else{
				this.errors.push(`expected a closing bracket instead got: ${this.current.value}`); 
			}
		}else if(this.has() && (_current.ttype === TokenType.Number || _current.ttype === TokenType.Sub)){
			let left = this.number();
			while(this.has() && this.current.ttype === TokenType.OpenBracket){
				left = new CoExpression(left, this.others());
			}
			return left;
		}else{
			this.errors.push("expected end of expression"); 
		}
		return new NoneExpression;
	}

	private number = () : Expression =>{
		if(this.current.ttype === TokenType.Number){
			return new NumberExpression(this.pop().value as number);
		}else if(this.current.ttype === TokenType.Sub){
			if(this.current.value === '-'){
				let op_token = this.pop();
				if(this.has()){
					let init = this.others();
					if(init.getType() === ExpressionType.Number){
						return new NumberExpression(init.getValue() * 1);
					}
					return new NegationExpression(op_token.value as string, init);
				}
				this.pop();
				return this.number(); 
			}
		}else{
			let error = `expected a number instead got: ${this.pop()}`;
			this.errors.push(error); 
		}
		return new NoneExpression;
	}

	public showErrors = (): String[] => this.errors;
}

export { Expression, ExpressionType, NoneExpression, NegationExpression, NumberExpression, BinaryExpression, CoExpression, BracketExpression }
export default Parser;