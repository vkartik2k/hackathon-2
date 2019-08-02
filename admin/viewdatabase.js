function capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

$(function () {
    // Filling Data of each table and it is only called when clicked
    // History of table data is not stored every time it is rendered again
    function fillTableData(tableName) {
        $("#dataTable").html()
        var dynamicTable = ``
        var templateTable = [`<tr>`, `</tr>`]
        var templateTableHead = [`<th>`, `</th>`]
        var templateTableContent = [`<td>`, `</td>`]
        var templateInput = [`<td><input placeholder="`,`" id="`,`"/></td>`]
        var fieldName = []
        $.post('../route/getTableData/',{
            tableName : tableName
        },
        function(data){
            var attr = []
            for(var k in data[0]) attr.push(k)
            var temp = ``
            var temp2 = ``
            attr.forEach(function(i){
                if(!(capitalize(i)=='CreatedAt' || capitalize(i)=='UpdatedAt')){
                    temp += templateTableHead[0] + capitalize(i) + templateTableHead[1]
                    temp2 += templateInput[0] + capitalize(i) + templateInput[1] + i +templateInput[2]
                    fieldName.push(i)
                }
            })
            temp += `<th>Edit</th> <th>Delete</th>`
            temp2 += `<td><button class="btn btn-outline-primary" id="clearCells">Clear</button></td>
                      <td><button class="btn btn-primary" id="addToDB">Add</button></td>`
            dynamicTable = templateTable[0] + temp + templateTable[1]
            dynamicTable += templateTable[0] + temp2 + templateTable[1]
            for(var i in data){
                temp = ``
                for(var j in data[i]){
                    if(!(capitalize(j)=='CreatedAt' || capitalize(j)=='UpdatedAt')){
                        temp += templateTableContent[0] + data[i][j] + templateTableContent[1]
                    }
                }
                temp += `<td><!--<button class="btn btn-warning editBtn disabled" id="edit`+data[i]['id']+`">Edit</button>--></td>
                         <td><button class="btn btn-danger deleteBtn" id="delete`+data[i]['id']+`">Delete</button></td>`
                dynamicTable += templateTable[0] + temp + templateTable[1]
            }
            $("#dataTable").html(dynamicTable)
            setTimeout(function () {
                $("#clearCells").click(function () {
                    for(var i in fieldName){
                        $("#"+fieldName[i]).val("")
                    }
                })
                $("#addToDB").click(function () {
                    var obj = {
                        tableName : tableName,
                        attr : {}
                    }
                    for(var i in fieldName){
                        obj.attr[fieldName[i]] = $("#"+fieldName[i]).val()
                    }
                    $.post('../route/addTableData', obj,
                    function(data){
                        if(data){
                            location.reload()
                        }
                        else{
                            alert("Error in Insertion!")
                        }
                    })
                })
                $(".deleteBtn").click(function() {
                    var obj = {
                        tableName : tableName,
                        id : $(this).attr('id').slice(6)
                    }
                    $.post('../route/deleteTableData', obj,
                    function(data){
                        if(data){
                            location.reload()
                        }
                        else{
                            alert("Error in Deletion!")
                        }
                    })
                })
            },500)
        })
    }
    // Add name of tables to SIDEBAR and making default table as user.
    $.post('../route/getTableNames',{},
    function(data){
        var dynamicHTML = ``
        var templateSideNav = [`
        <div class="navBtn" id="`,`">
            &nbsp;
            &nbsp;
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 48 48" stroke-width="2"><g stroke-width="2" transform="translate(0, 0)"><polyline data-cap="butt" fill="none" stroke="#ffffff" stroke-width="2" stroke-miterlimit="10" points="30,2 30,14 42,14 " stroke-linejoin="miter" stroke-linecap="butt"></polyline> <polygon fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" points="30,2 6,2 6,46 42,46 42,14 " stroke-linejoin="miter"></polygon> <line data-color="color-2" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" x1="14" y1="36" x2="34" y2="36" stroke-linejoin="miter"></line> <line data-color="color-2" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" x1="14" y1="26" x2="34" y2="26" stroke-linejoin="miter"></line> <line data-color="color-2" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" x1="14" y1="16" x2="22" y2="16" stroke-linejoin="miter"></line></g></svg>`,
        `</div>`]
        data.arr.forEach(function (i) {
            dynamicHTML = dynamicHTML + templateSideNav[0] + i + templateSideNav[1] + capitalize(i) + templateSideNav[2]
        })
        setTimeout(function() {
            $("#user").addClass("navBtnSelected")
            data.arr.forEach(function (i) {
                $("#"+i).click( function() {
                    $("#"+i).addClass("navBtnSelected")
                    fillTableData(i)
                    data.arr.forEach(function (j) {
                        if(!(i===j))
                            $("#"+j).removeClass("navBtnSelected")
                    })
                })
            })
        },100)
        $('#databaseTableContainer').html(dynamicHTML)
    })
    fillTableData('user')
})