
//================== Input stratification =====================
function bloodpressure_stratification(pat_response){
    let questions = pat_response.questions;
    for(let i=0;i<questions.length;i++){
        if(questions[i]['response-type']=='BP'){
            let sys=questions[i][0];
            let dia=questions[i][1];
            let hr=questions[i][2];
            if((sys> pat_response.stratification.BP.SYS_GOAL)||(dia>pat_response.stratification.DIA_GOAL)){
                pat_response.questions[i]['stratificaton-level']='RED'
            }else{
                pat_response.questions[i]['stratificaton-level']='GREEN'
            }
        }
    }
    return pat_response;
}


//DMP Inference to compute risk factor
function RuleEngine(pat_response){
    let rf =0;
    let questions = pat_response.questions;

    //Rule R1 : R1: If Q3.1 is in RED stratification or Q1.totalweight >0  then rf= rf  + 50​
    if((questions[2]['stratificaton-level']=='RED')|| 
        questions[0]['total_weight']>0){
            rf = rf+50

    }

    //Rule R2: rf = rf + 25* Q1.totalweight​
    rf = rf + 25*questions[0]['total_weight'];

    // Rule R3 : R3: rf = rf + 25* sqrt(  (Q3.sys –Q3.risksys)^2 + (Q3.dia –Q3.riskdia)^2)/20​
    let SYS_GOAL = pat_response.stratification.BP.SYS_GOAL;
    let DIA_GOAL = pat_response.stratification.BP.DIA_GOAL;
    let sys=questions[2][0];
    let dia=questions[2][1];
    let hr=questions[2][2];
    let dsys = sys -SYS_GOAL;
    let ddia = dia-DIA_GOAL;

    let euler_dist = Math.sqrt(dsys*dsys + ddia*ddia);
    if(questions[2]['stratificaton-level']=='RED'){
        rf = rf + 25*euler_dist/50;
    }else{
        rf = rf + 20/(1+euler_dist/5)
    }
  
    rf = Math.min(rf,100);
    pat_response.result.riskFactor=rf;
    return pat_response;
}


//======================= Output stratification ================
function riskfactor_stratification(pat_response){
    if(pat_response.result.riskFactor<=50){
        pat_response.result.stratification='GREEN'
    }else{
        pat_response.result.stratification='RED'
    }
    return pat_response;
}


//======================= Execute Rule ================
// input,output are declare in  :  const context = { input: fact ,output:null} in RuleEngine.js

output=bloodpressure_stratification(input)

output=RuleEngine(output);

output=riskfactor_stratification(output);
