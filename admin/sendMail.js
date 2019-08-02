$(function () {
    let tags = []
    $(document).keyup(function(e) {
        if(e.keyCode === 13) {
            event.preventDefault()
        }
    })
    $("#addTag").click(function() {
        let temparr = $("#inputTag").val().split(" ")
        tags = tags.concat(temparr)
        $("#inputTag").val("")
        let temp = '';
        let template = [`<small class="tag">`,
        `</small>`]
        for(let i in tags){
            temp += template[0] +tags[i]+ template[1]
        }
        $("#tagContainer").html(temp)
    })
    $("#sendEmail").click(function() {
        let usernames = $("#usernames").val()
        let subject = $("#subject").val()
        let mainBody = $("#mainBody").val()
        let tag = '';
        for(let i in tags){
            tag += tags[i] + " "
        }
        tag = tag.trim()
        $.post("../route/sendMail",{
            usernames : usernames,
            subject : subject,
            mainBody : mainBody,
            tag : tag
        },function(data){
            if(data){
                alert("Mail Send!")
            }
        })
    })
})