
const Engine = require('./RuleEngine');
const fs = require('fs');

let engine = new Engine();

let pat_response = {
    questions: [
        {
            'quesiton-type':'subjective',
            'response-type':'multiple-choice',
            'stratificaton-level':'',
            '0':0.1,
            '2':0.2,
            'total_weight': 0.3,
        },
        {
            'quesiton-type':'subjective',
            'response-type':'multiple-choice',
            'stratificaton-level':'',
            '0':0,
            'total_weight':0,
        },
        {
            'quesiton-type':'objective',
            'response-type':'BP',
            'stratificaton-level':'',
            '0':150,//sys
            '1':75,//dia
            '2':100,//hr
            
        }
    ],
    stratification:{
        BP:{// these are gotten from careplan DTB
            SYS_GOAL:150,
            DIA_GOAL:90
        }
    },
    result:{
        riskFactor:0,
        stratification:'GREEN'
    }
}

let rule_code = fs.readFileSync('./HTNRule.js','utf-8');
let res = engine.exe(rule_code,pat_response);
console.log(res);