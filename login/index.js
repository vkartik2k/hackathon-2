$(function () {
    $("#login").click(function () {
        let username = $("#username").val()
        let password = $("#password").val()
        $.post('../route/login/',{
            username : username,
            password : password
        },
        function(data){
            if(data){
                window.location.href = '/dashboard';
            }
            else{
                alert("Incorrect!")
            }
        })
    })

    $('#username').on('keydown', function(e) {
        if (e.which == 13) {
            e.preventDefault()
            $("#password").focus()
        }
    })
    $('#password').on('keydown', function(e) {
        if (e.which == 13) {
            e.preventDefault()
            $("#login").click()
        }
    })
})