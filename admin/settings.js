$(function () {
    $.post('../route/getSettings/',{},
    function(data){
        if(data){
            $("#companyName").val(data.companyname)
            $("#infoEmail").val(data.infoemail)
            $("#supportEmail").val(data.supportemail)
            $("#supportPhoneno").val(data.supportphoneno)
            $("#chatBotSupport").prop("checked",data.chatbotsupport==="true" ? true : false)
            $("#audioEffects").prop("checked",data.audioeffects==="true" ? true : false)
            $("#askForFeedback").prop("checked",data.askforfeedback==="true" ? true : false)
        }
        else{
            console.log("Settings not found!")
        }
    })
    $("#saveChanges1").click( function () {
        $.post('../route/setSettings1/',{
            companyname : $("#companyName").val(),
            infoemail : $("#infoEmail").val(),
            supportemail : $("#supportEmail").val(),
            supportphoneno : $("#supportPhoneno").val()
        },
        function(data){
            if(data){
                alert("Settings Changed !")
            }
        })
    })
    $("#saveChanges2").click( function () {
        $.post('../route/setSettings2/',{
            chatbotsupport : $('#chatBotSupport').is(':checked')? "true" : "false",
            audioeffects : $('#audioEffects').is(':checked')? "true" : "false",
            askforfeedback : $('#askForFeedback').is(':checked')? "true" : "false"
        },
        function(data){
            if(data){
                alert("Settings Changed !")
            }
        })
    })
})