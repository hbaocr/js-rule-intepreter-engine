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
        rf = rf + 25*euler_dist/20;
    }else{
        rf = rf + 25/(1+euler_dist/20)
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
