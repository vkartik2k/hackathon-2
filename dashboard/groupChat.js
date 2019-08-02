$(function () {
    function capitalize(s){
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    let socket = io()
    let today = new Date()
    let username = ''
    let prevUsername = ''
    let noOfChats = 0
    let readMsg = 0
    let readChats = 0
    let unreadChats = 0
    let prevDate = ''
    let todayDate = ''
    let yestDate = ''
    let chatContainer = $(".chatContainer")

    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    var yyyy = today.getFullYear()
    todayDate = dd + '/' + mm + '/' + yyyy
    yestDate = dd-1 + '/' + mm + '/' + yyyy

    // Loading Data from DB
    $.post('/../route/getUsername',{}, function(data) {
        username = data.username
        readChats = data.readMsg
        prevUsername = ''
    })
    
    $.post('/route/noOfChats',{}, function(data){
        noOfChats = data.count
        readMsg = noOfChats
    })
    setTimeout(function() {
        unreadChats = noOfChats - readChats
        if(unreadChats ===0){
            $(".unreadMsgContainer").hide()
        }
    },100)

    // Logout functionality
    $("#logout").click(function () {
        $.post('../route/logout/',{},
        function(data){
            window.location.href = '/'
        })
    })

    // Making secure connection
    socket.on('connected',function() {
    })

    // Loading and Bot functionality
    setTimeout(function() {
        $('.loadingDiv').slideUp()
    },400)
    $("#chatBotContainer").hide()
    if($( window ).width() < 600) $(".navBarBtn").removeClass("open")

    $(".navBarBtn").click(function() {
        if($(".navBar").css("width")==="270px"){
            $(".main").css("padding-left","0px")
            $(".navBar").css("width","0")
            $(".chatFooter").css("margin","auto")
            $(".chatFooter").css("width","100%")
            $(".navBarBtn").removeClass("open")
        } else{
            if($( window ).width() > 600){
                $(".main").css("padding-left","270px")
                $(".chatFooter").css("width","calc(100% - 270px)")
                $(".chatFooter").css("margin-left","270px")
            }
            $(".navBar").css("width","270px")
            $(".navBarBtn").addClass("open")
        }
    })

    // Emitting Chat through Socket
    $("#chatSubmit").click(function() {
        let msg = $("#chatInput").val()
        let date = ''
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()
        date = dd + '/' + mm + '/' + yyyy
        socket.emit('send_msg', {
            msg : msg,
            username : username,
            time: today.toLocaleTimeString().slice(0,5),
            date : date
        })
        $("#chatInput").focus()
    })

    // Loading last 20 Chats before opening the page
    setTimeout(function() {
        $.post('/route/getUnreadChats',{
            lastCount : noOfChats,
            unreadChats : unreadChats
        }, function(data) {
            let templateUser = [`
            <div id="chatBotCLIENTSIDE">`,
            `   <span>`,
            `   </span>`,
            `</div>`]
            let templateBot = [`
            <div id="chatBotBOTSIDE">`,
            `   <span>`,
            `   </span>`,
            `</div>`]
            let tempMsg = ''
            for(let d in data){
                if(data[d].date !== prevDate){
                    if(data[d].date === todayDate){

                        tempMsg += '<div class="chatDate">TODAY</div>'
                    }
                    else if(data[d].date === yestDate){
                        tempMsg += '<div class="chatDate">YESTERDAY</div>'
                    }
                    else{
                        tempMsg += '<div class="chatDate">'+ data[d].date+'</div>'
                    }
                    prevDate = data[d].date
                }
                if(data[d].username === username){
                    tempMsg += templateUser[0]+templateUser[1] + '<span class="chatText">'+ data[d].message + '</span>' +'<div class="chatTime">'+data[d].time +'</div>'  + templateUser[2] + templateUser[3]
                }
                else{
                    if(prevUsername != data[d].username){
                        tempMsg += templateBot[0] + '<div>' + capitalize(data[d].username) + '</div>'
                    }
                    else{
                        tempMsg += templateBot[0]
                    }
                    tempMsg += templateBot[1]+ '<span class="chatText">'+ data[d].message + '</span>'+'<div class="chatTime">'+data[d].time +'</div>'  + templateBot[2] + templateBot[3]
                }
                prevUsername = data[d].username
            }
            chatContainer.append(tempMsg)
            chatContainer.animate({
                scrollTop: $(".unreadMsgContainer").css('display') === 'none' ? chatContainer.prop("scrollHeight") : $(".unreadMsgContainer").offset().top
            }, 10)
            noOfChats -= unreadChats
        })
    },200)

    setTimeout(function() {
        $.post('/route/getNextChat',{
            lastCount : noOfChats
        }, function(data) {
            let templateUser = [`
            <div id="chatBotCLIENTSIDE">`,
            `   <span>`,
            `   </span>`,
            `</div>`]
            let templateBot = [`
            <div id="chatBotBOTSIDE">`,
            `   <span>`,
            `   </span>`,
            `</div>`]
            let tempMsg = ''
            for(let d in data){
                if(data[d].date !== prevDate){
                    if(data[d].date === todayDate){
                        tempMsg += '<div class="chatDate">TODAY</div>'
                    }
                    else if(data[d].date === yestDate){
                        tempMsg += '<div class="chatDate">YESTERDAY</div>'
                    }
                    else{
                        tempMsg += '<div class="chatDate">'+ data[d].date+'</div>'
                    }
                    prevDate = data[d].date
                }
                if(data[d].username === username){
                    tempMsg += templateUser[0]+templateUser[1] + '<span class="chatText">'+ data[d].message + '</span>' +'<div class="chatTime">'+data[d].time +'</div>'  + templateUser[2] + templateUser[3]
                }
                else{
                    if(prevUsername != data[d].username){
                        tempMsg += templateBot[0] + '<div>' + capitalize(data[d].username) + '</div>'
                    }
                    else{
                        tempMsg += templateBot[0]
                    }
                    tempMsg += templateBot[1]+ '<span class="chatText">'+ data[d].message + '</span>'+'<div class="chatTime">'+data[d].time +'</div>'  + templateBot[2] + templateBot[3]
                }
                prevUsername = data[d].username
            }
            chatContainer.prepend(tempMsg)
            chatContainer.animate({
                scrollTop: $(".unreadMsgContainer").css('display') === 'none' ? chatContainer.prop("scrollHeight") : $(".unreadMsgContainer").offset().top
            }, 10)
            noOfChats -= 20
        })
    },300)

    // On receiving msg added that into current chat
    socket.on('receive_msg', function(data){
        $(".unreadMsgContainer").hide()
        let templateUser = [`
        <div id="chatBotCLIENTSIDE">`,
        `   <span>`,
        `   </span>`,
        `</div>`]
        let templateBot = [`
        <div id="chatBotBOTSIDE">`,
        `   <span>`,
        `   </span>`,
        `</div>`]
        let tempMsg = ''
        if(data.date !== prevDate){
            if(data.date === todayDate){
                tempMsg += '<div class="chatDate">TODAY</div>'
            }
            else if(data.date === yestDate){
                tempMsg += '<div class="chatDate">YESTERDAY</div>'
            }
            else{
                tempMsg += '<div class="chatDate">'+ data.date+'</div>'
            }
            prevDate = data.date
        }
        if(data.username === username){
            $("#chatInput").val("")
            tempMsg = templateUser[0]+templateUser[1] + '<span class="chatText">'+ data.msg + '</span>' +'<div class="chatTime">'+data.time +'</div>' + templateUser[2] + templateUser[3]
        }
        else{
            $('audio')[0].play()
            if(prevUsername != data.username){
                tempMsg = templateBot[0] + '<div>' + capitalize(data.username) + '</div>'
            }
            else{
                tempMsg = templateBot[0]
            }
            tempMsg += templateBot[1]+ '<span class="chatText">'+ data.msg + '</span>'+'<div class="chatTime">'+data.time +'</div>' + templateBot[2] + templateBot[3]
        }
        prevUsername = data.username
        chatContainer.append(tempMsg)
        chatContainer.animate({
            scrollTop: chatContainer.prop("scrollHeight")
        }, 1000)
        readMsg++
        $.post("/route/updateReadChats",{
            readMsg : readMsg
        },function(data){
        })
        
    })

    // For Mobile view bring the scroll to end when the user is typing.
    $("#chatInput").on('click', function(){
        chatContainer.animate({
            scrollTop: chatContainer.prop("scrollHeight")
        }, 1)
    })
    $("#chatInput").on('focus', function(){
        chatContainer.animate({
            scrollTop: chatContainer.prop("scrollHeight")
        }, 1)
    })

    // Enter key to send message
    $('#chatInput').on('keydown', function(e) {
        if (e.which == 13) {
            e.preventDefault()
            $("#chatSubmit").click()
        }
    })

    // Load Chat History (20 each time) when scrolled at top
    $('.chatContainer').scroll(function() {
        let currentHeight = $(".chatContainer")[0].scrollHeight
        if($(".chatContainer").scrollTop() === 0  && noOfChats>0){
            $.post('/route/getNextChat',{
                lastCount : noOfChats
            }, function(data) {
                let templateUser = [`
                <div id="chatBotCLIENTSIDE">`,
                `   <span>`,
                `   </span>`,
                `</div>`]
                let templateBot = [`
                <div id="chatBotBOTSIDE">`,
                `   <span>`,
                `   </span>`,
                `</div>`]
                let tempMsg = ''
                for(let d in data){
                    if(data[d].date !== prevDate){
                        if(data[d].date === todayDate){
                            tempMsg += '<div class="chatDate">TODAY</div>'
                        }
                        else if(data[d].date === yestDate){
                            tempMsg += '<div class="chatDate">YESTERDAY</div>'
                        }
                        else{
                            tempMsg += '<div class="chatDate">'+ data[d].date+'</div>'
                        }
                        prevDate = data[d].date
                    }
                    if(data[d].username === username){
                        tempMsg += templateUser[0]+templateUser[1] + '<span class="chatText">'+ data[d].message + '</span>'+'<div class="chatTime">'+data[d].time +'</div>'  + templateUser[2] + templateUser[3]
                    }
                    else{
                        if(prevUsername != data[d].username){
                            tempMsg += templateBot[0] + '<div>' + capitalize(data[d].username) + '</div>'
                        }
                        else{
                            tempMsg += templateBot[0]
                        }
                        tempMsg += templateBot[1]+ '<span class="chatText">'+ data[d].message + '</span>'+'<div class="chatTime">'+data[d].time +'</div>'  + templateBot[2] + templateBot[3]
                    }
                    prevUsername = data[d].username
                }
                chatContainer.prepend(tempMsg)
                noOfChats -= 20
                newHeight = $(".chatContainer")[0].scrollHeight
                chatContainer.scrollTop(newHeight - currentHeight)
            })
        }
    })

    setTimeout(function() {
        $.post("/route/updateReadChats",{
            readMsg : readMsg
        },function(data){
        })
    },400)
})