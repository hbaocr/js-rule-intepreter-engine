
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
            'length':7 // 7 options of answer
        },
        {
            'quesiton-type':'subjective',
            'response-type':'multiple-choice',
            'stratificaton-level':'',
            '0':0,
            'total_weight':0,
            'length':1 // 3 options
        },
        {
            'quesiton-type':'objective',
            'response-type':'BP',
            'stratificaton-level':'',
            '0':160,//sys
            '1':100,//dia
            '2':100,//hr
            'length':3
        }
    ]
}

let careplan ={
    stratification:{
        BP:{// these are gotten from careplan DTB
            SYS_GOAL:150,
            DIA_GOAL:90
        },
        riskFactor:{
            RED_THR:50
        }
    }
}

let rule_code = fs.readFileSync('./HTNRule.js','utf-8');
let res = engine.exe(rule_code,pat_response,careplan);
console.log(res);