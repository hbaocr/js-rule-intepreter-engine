const vm = require('node:vm');

class RuleEngine{

    constructor(){}

    exe(strRuleCode,fact,careplan){
        try {
                const context = { input: fact ,careplan: careplan,output:null}; //declare input and output variable for the rule
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
