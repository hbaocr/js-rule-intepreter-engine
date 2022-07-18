## Nodejs Js rule intepreter engine

* Step1: The Rules are composed as `nodejs` code and store in data base as string
* Step2: Prepare the input for the Rule engine
* Step3: The Rule engine will be loaded as utf8 string and the input in step 2 are the paras input of intepreter. 
    * The `HTNRule.js` file is used to simulate the DMP policy as string
    * The `pat_response` variable to simulate the patient input and the careplan information of this patient
* Step4: Exe and get result

```javascript

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
        stratification:''
    }
}

let rule_code = fs.readFileSync('./HTNRule.js','utf-8');
let res = engine.exe(rule_code,pat_response);
console.log(res);
```

* The output is :` result: { riskFactor: 62.5, stratification: 'RED' }`

```javascript
{
  questions: [
    {
      '0': 0.1,
      '2': 0.2,
      'quesiton-type': 'subjective',
      'response-type': 'multiple-choice',
      'stratificaton-level': '',
      total_weight: 0.3
    },
    {
      '0': 0,
      'quesiton-type': 'subjective',
      'response-type': 'multiple-choice',
      'stratificaton-level': '',
      total_weight: 0
    },
    {
      '0': 150,
      '1': 75,
      '2': 100,
      'quesiton-type': 'objective',
      'response-type': 'BP',
      'stratificaton-level': 'GREEN'
    }
  ],
  stratification: { BP: { SYS_GOAL: 150, DIA_GOAL: 90 } },
  result: { riskFactor: 62.5, stratification: 'RED' }
}
```

## Reference
* https://nodejs.org/api/vm.html
* https://github.com/patriksimek/vm2

