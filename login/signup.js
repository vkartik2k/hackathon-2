$(function () {
    $("#notify").hide()
    $("#signup").click(function () {

        let username = $("#username").val()
        let name = $("#name").val()
        let password = $("#password").val()
        let repassword = $("#repassword").val()
        let phoneno = $("#phoneno").val()
        let email = $("#email").val()

        let flag = true
        let msg = ""

        if((phoneno.toString()).length != 10 ){
            msg +="Invalid Phone Number!<br>"
            flag = false
        }
        if(password!=repassword){
            flag = false
            msg +="Password does not match with re-entered password!<br/>"
        }
        if(password.length < 6){
            flag = false
            msg +="Password is too short!<br/>"
        }
        let emailcheck1 =  email.split('@').length
        let emailcheck2 = email.split('.')
        if(emailcheck2.length >= 2){
            if(emailcheck1!=2 || emailcheck2[emailcheck2.length-1].length <= 0 || emailcheck2[emailcheck2.length-2].length <= 0){
                flag = false
                msg +="Invalid Email Address!<br/>"
            }
        }
        else{
            flag = false
            msg +="Invalid Email Address!<br/>"
        }

        if(flag){
            $.post('../route/signup',{
                username : username,
                name : name,
                password:password,
                phoneno:phoneno,
                email:email
            },
            function (data) {
                if(data){
                    alert("Welcome!")
                }
                else{
                    alert("Username is not unique!")
                    msg = "Username is not unique!"
                }
            })
        }
        $("#notify").show()
        $("#notify").html(msg)
    })

    $('#username').on('keydown', function(e) {
        if (e.which == 13) {
            e.preventDefault()
            $("#name").focus()
        }
    })
    $('#name').on('keydown', function(e) {
        if (e.which == 13) {
            e.preventDefault()
            $("#email").focus()
        }
    })
    $('#email').on('keydown', function(e) {
        if (e.which == 13) {
            e.preventDefault()
            $("#phoneno").focus()
        }
    })
    $('#phoneno').on('keydown', function(e) {
        if (e.which == 13) {
            e.preventDefault()
            $("#password").focus()
        }
    })
    $('#password').on('keydown', function(e) {
        if (e.which == 13) {
            e.preventDefault()
            $("#repassword").focus()
        }
    })
    $('#repassword').on('keydown', function(e) {
        if (e.which == 13) {
            e.preventDefault()
            $("#signup").click()
        }
    })
})