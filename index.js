
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
            '0':0.1,
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

function compute_total_weight(pat_response){
    for(let i=0;i<pat_response.questions.length;i++){
        if(pat_response.questions[i]['quesiton-type']=='objective') continue;

        let ql= pat_response.questions[i].length||0;
        let total_w =0;
        for(let k=0;k<ql;k++){
           let w= pat_response.questions[i][k]||0;
           total_w = total_w+w;
        }
        pat_response.questions[i]['total_weight']=total_w;
    }
    return pat_response;
}

pat_response =  compute_total_weight(pat_response);


let rule_code = fs.readFileSync('./HTNRule.js','utf-8');
let res = engine.exe(rule_code,pat_response,careplan);
console.log(res);