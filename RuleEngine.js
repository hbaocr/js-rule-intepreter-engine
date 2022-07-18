const vm = require('node:vm');

class RuleEngine{

    constructor(){}
    exe(strRuleCode,fact){
        try {
                const context = { input: fact ,output:null}; //declare input and output variable for the rule
                vm.createContext(context); // Contextify the object. 
                vm.runInContext(strRuleCode, context);
                return context.output;
        } catch (error) {
                console.error(error);
                return null
        }
     
    }
}

module.exports=RuleEngine


// let code = 'x += 40; var y = 17;';
// let fact = { x: 2 };

// let r = engine.exe(code, fact)
// console.log(r)