## Nodejs Js rule intepreter engine

* Step1: The Rules are composed as `nodejs` code and store in data base as string
* Step2: Prepare the input for the Rule engine
* Step3: The Rule engine will be loaded as utf8 string and the input in step 2 are the paras input of intepreter. 
    * The `HTNRule.js` file is used to simulate the DMP policy as string
    * The `pat_response` variable to simulate the patient input and the careplan information of this patient
* Step4: Exe and get result

```javascript
//0. Init Policy Engine
const Engine = require('./RuleEngine');
const fs = require('fs');
let engine = new Engine();

//1. Load the patient DMP response
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
    ]
}

//2. Load the HTN careplan from dtb as string
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
//3. Load the RULE Policy from dtb as string
let rule_code = fs.readFileSync('./HTNRule.js','utf-8');

//4. Execute the engine with the rule and DMP response
let res = engine.exe(rule_code,pat_response,careplan);
console.log(res);
```


* Rule engine  `HTNRule.js` get from DTB as string
```javascript
//================== Input stratification =====================
function bloodpressure_stratification(pat_response,careplan){
    let questions = pat_response.questions;
    for(let i=0;i<questions.length;i++){
        if(questions[i]['response-type']=='BP'){
            let sys=questions[i][0];
            let dia=questions[i][1];
            let hr=questions[i][2];
            if((sys> careplan.stratification.BP.SYS_GOAL)||(dia>careplan.stratification.DIA_GOAL)){
                pat_response.questions[i]['stratificaton-level']='RED'
            }else{
                pat_response.questions[i]['stratificaton-level']='GREEN'
            }
        }
    }
    return pat_response;
}

//DMP Inference to compute risk factor
function RuleEngine(pat_response,careplan){
    let rf =0;
    let questions = pat_response.questions;

    //Rule R1 : R1: If Q3.1 is in RED stratification or Q1.totalweight >0  then rf= rf  + 50​
    if((questions[2]['stratificaton-level']=='RED')|| 
        questions[0]['total_weight']>0){
            rf = rf+50

    }

    //Rule R2: rf = rf + 25* Q1.totalweight​
    rf = rf + 25*questions[0]['total_weight'];

    // Rule3: euler_dist= sqrt(  (Q3.sys –Q3.risksys)^2 + (Q3.dia –Q3.riskdia)^2)​
            //If Q3.1 is in RED : rf = rf + 25* euler_dist/50​
            //Else rf = rf + 25/(1+euler_dist/10)
    let SYS_GOAL = careplan.stratification.BP.SYS_GOAL;
    let DIA_GOAL = careplan.stratification.BP.DIA_GOAL;
    let sys=questions[2][0];
    let dia=questions[2][1];
    let hr=questions[2][2];
    let dsys = sys -SYS_GOAL;
    let ddia = dia-DIA_GOAL;

    let euler_dist = Math.sqrt(dsys*dsys + ddia*ddia);
    if(questions[2]['stratificaton-level']=='RED'){
        rf = rf + 25*euler_dist/50;
    }else{
        rf = rf + 25/(1+euler_dist/10)
    }
  
    rf = Math.min(rf,100);
    pat_response['result']={
        riskFactor:rf,
        stratification:''
    }
    return pat_response;
}

//======================= Output stratification ================
function riskfactor_stratification(pat_response,careplan){
    if(pat_response['result']['riskFactor']<=careplan.stratification.riskFactor.RED_THR){
        pat_response['result']['stratification']='GREEN';
    }else{
        pat_response['result']['stratification']='RED';
    }
    return pat_response;
}


//======================= Execute Rule ================
// paras: input,output,careplan are declare in  :  const context = { input: fact ,careplan: careplan,output:null} in RuleEngine.js

output=bloodpressure_stratification(input,careplan)

output=RuleEngine(output,careplan);

output=riskfactor_stratification(output,careplan);

```

* Expected result

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
  result: { riskFactor: 67.5, stratification: 'RED' }
}
```



## Reference
* https://nodejs.org/api/vm.html
* https://github.com/patriksimek/vm2

