$(function () {
    let q= 1;
    $("#next").click(function(){
        if(q<7) q++;
        $("#q"+q).addClass("selected")
        let ques = ['Are you a student, working professional or homemaker?', 'How often do you meditate?','How often do you exercise?','Do you feel stressed, angry or depressed often in a day?','Are you facing problems in your personal or professional relationships?','Are you aware of any mental health problems you might be facing?']
        let options = [['student','working professional','homemaker'],['daily','weekly','never'],['daily','weekly','never'],['yes','no','sometimes'],['yes','no','cant say'],['depression','bipolar disorder','anxiety','stress','None of the above']]
        let temp = ['<span>','</span><br>','<div style="text-align: left; padding: 50px;padding-top: 30px;padding-bottom: 30px;"><div class="custom-control custom-radio"><input type="radio" id="','"class="custom-control-input"><label class="custom-control-label" for="','">','</label>',
        '</label>','</div>']
        let template = temp[0]+ ques[q-1] + temp[1] 
        options[q-1].forEach(element => {
            template += temp[2]+element + temp[3] + element + temp[4] + element + temp[5] + '</div></div>'
        });
        console.log(temp[6])
        template += temp[6];

        $('.main').html(template)


    })

})