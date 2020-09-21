$(function () {
    $.ajax({
        type: "post",
        url: "Event/GetStaffList",
        success: function (response) {
            var i
            var data = JSON.parse(response)
            for (i in data) {
                $('#Assign_To_Input').append("<option value=" + data[i].id + "> " + data[i].employee_name + " </option>")
            }
        }
    });

    if (document.getElementById('role').textContent != "9") {
        $('.create').addClass('d-none');
    }
});

function queryParamsEvent(params) {
    params.Transaction_Code = $("#Transaction_Code").val(),
        params.Request_By = $("#Request_By").val(),
        params.Request_Date = $("#Request_Date").val(),
        params.Status = $("#Status").val(),
        params.Created_Date = $("#Created_Date").val(),
        params.Created_By = $("#Created_By").val()
    return params
}

$('#searchButton').click(function () {
    var elems = document.getElementsByClassName('page-link');
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].getAttribute('aria-label') == "to page 1") {
            var btnClick = elems[i];
            btnClick.click();
        }
    }

    $("#table").bootstrapTable('refresh');
    $("#table").bootstrapTable("showLoading");
});

$('.create').click(function () {
    $(".modal-title").text('Add ' + ViewBag);
    cleanValue();
    removeDisableProp();
    $("#ModalAdUp").modal('show');
    $("#Request_By_Input").val(document.getElementById('sessionName').textContent);
    $('.approve').addClass('d-none');
    $('.reject').addClass('d-none');
    $('.closeRequest').addClass('d-none');
    $('.adminFormOnly').addClass('d-none');

    var today = new Date();
    $("#Request_Date_Input").val(today.getFullYear() + '/' + (today.getMonth()+1) + '/' + today.getDate());


    $.ajax({
        type: "post",
        url: "Event/GetLastEventCode",
        success: function (response) {
            var day = today.getDate().toString();
            day = day.length < 2 ? '0' + day : day;
            var month = (today.getMonth() + 1).toString();
            month = month.length < 2 ? '0' + month : month;
            var year = today.getFullYear();
            var yearArr = year.toString().split('');
            year = yearArr[2] + '' + yearArr[3];

            if (response != '') {
                var data = JSON.parse(response)
                var code_arr = data[0].code.split('');
                if (code_arr[16] != 9) {
                    code_arr[16] = parseInt(code_arr[16]) + 1;
                }
                else if (code_arr[15] != 9) {
                    code_arr[15] = parseInt(code_arr[15]) + 1;
                    code_arr[16] = "0";
                }
                else if (code_arr[14] != 9) {
                    code_arr[14] = parseInt(code_arr[14]) + 1;
                    code_arr[15] = "0";
                    code_arr[16] = "0";
                }
                else if (code_arr[13] != 9) {
                    code_arr[13] = parseInt(code_arr[13]) + 1;
                    code_arr[14] = "0";
                    code_arr[15] = "0";
                    code_arr[16] = "0";
                }
                else if (code_arr[12] != 9) {
                    code_arr[12] = parseInt(code_arr[12]) + 1;
                    code_arr[13] = "0";
                    code_arr[14] = "0";
                    code_arr[15] = "0";
                    code_arr[16] = "0";
                }

                day = day.split();
                code_arr[6] = day[0];
                code_arr[7] = day[1];
                month = month.split();
                code_arr[8] = month[0];
                code_arr[9] = month[1];
                year = year.split();
                code_arr[10] = year[0];
                code_arr[11] = year[1];

                
                $("#Transaction_Code_Input").val(code_arr.join(''));
            }
            else {

                $("#Transaction_Code_Input").val('TRWOEV' + day + month + year + '00001');
            }
        }
    });
});

window.operateEvents = {
    'click .like': function (e, value, row, index) {
        cleanValue();
        removeDisableProp();
        $(".modal-title").text('Edit ' + ViewBag);
        $("#ModalAdUp").modal('show');

        removeValidationWarning();

        $("#id").val(row.id);
        $("#Transaction_Code_Input").val(row.code);
        $("#Request_By_Input").val(row.request_by_name);
        $("#Event_Name_Input").val(row.event_name);
        $("#Request_Date_Input").val(row.request_date);
        $("#Event_Place_Input").val(row.place);
        $("#Event_Budget_Input").val(row.budget);
        $("#Start_Date_Input").val(row.start_date);
        $("#End_Date_Input").val(row.end_date);
        $("#Status_Input").val(row.status);
        $("#Note").val(row.note);
        $("#Assign_To_Input").val(row.assign_to);

        $(".add").removeClass("d-none");
        $(".closeRequest").removeClass("d-none");
        $(".approve").removeClass("d-none");
        $(".reject").removeClass("d-none");

        if (document.getElementById('role').textContent == "5") {
            $('.add').addClass('d-none');
            $('.closeRequest').addClass('d-none');
            
            $("#Transaction_Code_Input").prop("disabled", true);
            $("#Request_By_Input").prop("disabled", true);
            $("#Event_Name_Input").prop("disabled", true);
            $("#Request_Date_Input").prop("disabled", true);
            $("#Event_Place_Input").prop("disabled", true);
            $("#Event_Budget_Input").prop("disabled", true);
            $("#Start_Date_Input").prop("disabled", true);
            $("#End_Date_Input").prop("disabled", true);
            $("#Status_Input").prop("disabled", true);
            $("#Note").prop("disabled", true);
        }
        else if (document.getElementById('role').textContent == "8") {
            $('.approve').addClass('d-none');
            $('.reject').addClass('d-none');
            $('.add').addClass('d-none');

            if (row.status == "Done") {
                $('.closeRequest').addClass('d-none');
            }

            if (row.assign_to != document.getElementById('employeeID').textContent) {
                $(".closeRequest").prop("disabled", true);
                $('.closeRequest').text("Only Assigned Staff Can Close This Request");
            }
            else {
                $(".closeRequest").prop("disabled", false);
                $('.closeRequest').text("Close Request");
            }

            $("#Transaction_Code_Input").prop("disabled", true);
            $("#Request_By_Input").prop("disabled", true);
            $("#Event_Name_Input").prop("disabled", true);
            $("#Request_Date_Input").prop("disabled", true);
            $("#Event_Place_Input").prop("disabled", true);
            $("#Event_Budget_Input").prop("disabled", true);
            $("#Start_Date_Input").prop("disabled", true);
            $("#End_Date_Input").prop("disabled", true);
            $("#Status_Input").prop("disabled", true);
            $("#Note").prop("disabled", true);
            $("#Assign_To_Input").prop("disabled", true);
        }
        else if (document.getElementById('role').textContent == "9") {
            $('.approve').addClass('d-none');
            $('.reject').addClass('d-none');
            $('.closeRequest').addClass('d-none');
            $('.adminFormOnly').addClass('d-none');
        }
    },

    'click .detail': function (e, value, row, index) {
        cleanValue();
        removeDisableProp();
        $(".modal-title").text('Edit ' + ViewBag);
        $("#ModalAdUp").modal('show');

        removeValidationWarning();

        $("#id").val(row.id);
        $("#Transaction_Code_Input").val(row.code).prop("disabled", true);
        $("#Request_By_Input").val(row.request_by_name).prop("disabled", true);
        $("#Event_Name_Input").val(row.event_name).prop("disabled", true);
        $("#Request_Date_Input").val(row.request_date).prop("disabled", true);
        $("#Event_Place_Input").val(row.place).prop("disabled", true);
        $("#Event_Budget_Input").val(row.budget).prop("disabled", true);
        $("#Start_Date_Input").val(row.start_date).prop("disabled", true);
        $("#End_Date_Input").val(row.end_date).prop("disabled", true);
        $("#Status_Input").val(row.status).prop("disabled", true);
        $("#Note").val(row.note).prop("disabled", true);
        $("#Assign_To_Input").val(row.assign_to).prop("disabled", true);
        $('.add').addClass('d-none');
        $('.approve').addClass('d-none');
        $('.reject').addClass('d-none');
        $('.closeRequest').addClass('d-none');
    }
}

$('.modal-footer').on('click', '.add', function () {
    removeValidationWarning();
    $(".addL").removeClass("d-none");
    $(".cl").addClass("d-none");
    $(".add").addClass("d-none");
    $.ajax({
        type: 'POST',
        url: $(this).data('request-url'),
        data: {
            'id': $("#id").val(),
            'code': $("#Transaction_Code_Input").val(),
            'event_name': $("#Event_Name_Input").val(),
            'place': $("#Event_Place_Input").val(),
            'request_date': $("#Request_Date_Input").val(),
            'start_date': $("#Start_Date_Input").val(),
            'budget': $("#Event_Budget_Input").val(),
            'end_date': $("#End_Date_Input").val(),
            'note': $("#Note").val(),
            'status': 1,
        },
        success: function (data) {
            $('.errorName').addClass('d-none');

            if (data.Status == "Success") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Saved! New event has been add with name ' + data.Name + '!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');

            } else if (data.Status == "Failed") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                $(".alert").addClass("show");
            } else if (data.Status == "Update") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Updated! Event with name ' + data.Name + ' has been updated!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');

            } else {
                $(".addL").addClass("d-none");
                $(".add").removeClass("d-none");
                $(".cl").removeClass("d-none");
                var result = JSON.parse(data);
                if ((result.length > 0)) {
                    for (var i = 0; i < result.length; i++) {
                        console.log(result[i])
                        if (result[i]["key"] == "event_name") {
                            $('.errorEventName').removeClass('d-none');
                            $('.errorEventName').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "place") {
                            $('.errorEventPlace').removeClass('d-none');
                            $('.errorEventPlace').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "start_date") {
                            $('.errorStartDate').removeClass('d-none');
                            $('.errorStartDate').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "end_date") {
                            $('.errorEndDate').removeClass('d-none');
                            $('.errorEndDate').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "budget") {
                            $('.errorEventBudget').removeClass('d-none');
                            $('.errorEventBudget').text(result[i]["errors"]);
                        }
                    }
                }
            }
        },
    });
});

$('.modal-footer').on('click', '.approve', function () {
    removeValidationWarning();
    $(".add").addClass("d-none");
    if ($('#Assign_To_Input').val() != "") {
        $.ajax({
            type: 'POST',
            url: $(this).data('request-url'),
            data: {
                'id': $("#id").val(),
                'code': $("#Transaction_Code_Input").val(),
                'event_name': $("#Event_Name_Input").val(),
                'place': $("#Event_Place_Input").val(),
                'request_date': $("#Request_Date_Input").val(),
                'start_date': $("#Start_Date_Input").val(),
                'budget': $("#Event_Budget_Input").val(),
                'end_date': $("#End_Date_Input").val(),
                'note': $("#Note").val(),
                'assign_to': $("#Assign_To_Input").val(),
                'status': 2,
            },
            success: function (data) {
                $('.errorName').addClass('d-none');

                if (data.Status == "Success") {
                    $('#ModalAdUp').modal('hide');
                    $(".alertText").text('Data Saved! New event has been add with code ' + data.Name + '!');
                    $(".alert").addClass("show");
                    $("#table").bootstrapTable('refresh');

                } else if (data.Status == "Failed") {
                    $('#ModalAdUp').modal('hide');
                    $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                    $(".alert").addClass("show");
                } else if (data.Status == "Update") {
                    $('#ModalAdUp').modal('hide');
                    $(".alertText").text('Data Updated! Event with name ' + data.Name + ' has been updated!');
                    $(".alert").addClass("show");
                    $("#table").bootstrapTable('refresh');

                } else {
                    $(".addL").addClass("d-none");
                    $(".add").removeClass("d-none");
                    $(".cl").removeClass("d-none");
                    var result = JSON.parse(data);
                    if ((result.length > 0)) {
                        for (var i = 0; i < result.length; i++) {
                            console.log(result[i])
                            if (result[i]["key"] == "event_name") {
                                $('.errorEventName').removeClass('d-none');
                                $('.errorEventName').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "place") {
                                $('.errorEventPlace').removeClass('d-none');
                                $('.errorEventPlace').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "start_date") {
                                $('.errorStartDate').removeClass('d-none');
                                $('.errorStartDate').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "end_date") {
                                $('.errorEndDate').removeClass('d-none');
                                $('.errorEndDate').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "budget") {
                                $('.errorEventBudget').removeClass('d-none');
                                $('.errorEventBudget').text(result[i]["errors"]);
                            }
                        }
                    }
                }
            },
        });
    }
    else {
        $('.errorAssignTo').removeClass('d-none');
        $('.errorAssignTo').text("Assign employee is required");
    }
});

$('.modal-footer').on('click', '.reject', function () {
    $("#ModalReject").modal('show');
});

$('.modal-footer').on('click', '.closeRequest', function () {
    $("#ModalCloseReq").modal('show');
});

$('.modal-footer').on('click', '.rejectBtn', function () {
    removeValidationWarning();
    $(".add").addClass("d-none");

    $.ajax({
        type: 'POST',
        url: $(this).data('request-url'),
        data: {
            'id': $("#id").val(),
            'code': $("#Transaction_Code_Input").val(),
            'event_name': $("#Event_Name_Input").val(),
            'place': $("#Event_Place_Input").val(),
            'request_date': $("#Request_Date_Input").val(),
            'start_date': $("#Start_Date_Input").val(),
            'budget': $("#Event_Budget_Input").val(),
            'end_date': $("#End_Date_Input").val(),
            'note': $("#Note").val(),
            'reject_reason': $("#Reject_Reason").val(),
            'status': 0,
        },
        success: function (data) {
            $('.errorName').addClass('d-none');

            if (data.Status == "Failed") {
                $('#ModalReject').modal('hide');
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                $(".alert").addClass("show");
            } else if (data.Status == "Update") {
                $('#ModalReject').modal('hide');
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Updated! Event with name ' + data.Name + ' has been rejected!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');

            } else {
                $(".addL").addClass("d-none");
                $(".add").removeClass("d-none");
                $(".cl").removeClass("d-none");
                var result = JSON.parse(data);
                if ((result.length > 0)) {
                    for (var i = 0; i < result.length; i++) {
                        console.log(result[i])
                        if (result[i]["key"] == "event_name") {
                            $('.errorEventName').removeClass('d-none');
                            $('.errorEventName').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "place") {
                            $('.errorEventPlace').removeClass('d-none');
                            $('.errorEventPlace').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "start_date") {
                            $('.errorStartDate').removeClass('d-none');
                            $('.errorStartDate').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "end_date") {
                            $('.errorEndDate').removeClass('d-none');
                            $('.errorEndDate').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "budget") {
                            $('.errorEventBudget').removeClass('d-none');
                            $('.errorEventBudget').text(result[i]["errors"]);
                        }
                    }
                }
            }
        },
    });
});

$('.modal-footer').on('click', '.closeReqBtn', function () {
    removeValidationWarning();
    $(".add").addClass("d-none");

    $.ajax({
        type: 'POST',
        url: $(this).data('request-url'),
        data: {
            'id': $("#id").val(),
            'code': $("#Transaction_Code_Input").val(),
            'event_name': $("#Event_Name_Input").val(),
            'place': $("#Event_Place_Input").val(),
            'request_date': $("#Request_Date_Input").val(),
            'start_date': $("#Start_Date_Input").val(),
            'budget': $("#Event_Budget_Input").val(),
            'end_date': $("#End_Date_Input").val(),
            'note': $("#Note").val(),
            'status': 3,
        },
        success: function (data) {

            if (data.Status == "Failed") {
                $('#ModalCloseReq').modal('hide');
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                $(".alert").addClass("show");
            } else if (data.Status == "Update") {
                $('#ModalCloseReq').modal('hide');
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Updated! Event with name ' + data.Name + ' has been closed!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');

            } else {
                $(".addL").addClass("d-none");
                $(".add").removeClass("d-none");
                $(".cl").removeClass("d-none");
                var result = JSON.parse(data);
                if ((result.length > 0)) {
                    for (var i = 0; i < result.length; i++) {
                        console.log(result[i])
                        if (result[i]["key"] == "event_name") {
                            $('.errorEventName').removeClass('d-none');
                            $('.errorEventName').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "place") {
                            $('.errorEventPlace').removeClass('d-none');
                            $('.errorEventPlace').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "start_date") {
                            $('.errorStartDate').removeClass('d-none');
                            $('.errorStartDate').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "end_date") {
                            $('.errorEndDate').removeClass('d-none');
                            $('.errorEndDate').text(result[i]["errors"]);
                        }
                        if (result[i]["key"] == "budget") {
                            $('.errorEventBudget').removeClass('d-none');
                            $('.errorEventBudget').text(result[i]["errors"]);
                        }
                    }
                }
            }
        },
    });
});

$('.modal-footer').on('click', '.delete', function () {
    $(".deleteL").removeClass("d-none");
    $(".delete").addClass("d-none");
    $(".cl").addClass("d-none");
    var span_Text = document.getElementById("nameDel").innerText;
    $.ajax({
        type: 'POST',
        url: $(this).data('request-url'),
        data: {
            'id': $("#idDel").val(),
            'employee_number': span_Text
        },
        success: function (data) {
            $("#ModalDelete").modal('hide');
            $(".deleteL").addClass("d-none");
            $(".delete").removeClass("d-none");
            $(".cl").removeClass("d-none");

            if (data.Status == "Success") {
                $(".alertText").text('Data Deleted! Data employee with id ' + data.Name + ' has been deleted!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
            } else if (data.Status == "Failed") {
                $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                $(".alert").addClass("show");
            }
        },
    });
});

function cleanValue() {
    $(".addL").addClass("d-none");
    $(".add").removeClass("d-none");
    $(".cl").removeClass("d-none");
    $("#id").val("");
    $("#Transaction_Code_Input").val("");
    $("#Request_By_Input").val("");
    $("#Event_Name_Input").val("");
    $("#Event_Place_Input").val("");
    $("#Request_Date_Input").val("");
    $("#Start_Date_Input").val("");
    $("#Event_Budget_Input").val("");
    $("#End_Date_Input").val("");
    $("#Note").val("");

    removeValidationWarning();
}

function removeValidationWarning() {
    $('.errorEventName').addClass('d-none');
    $('.errorEventPlace').addClass('d-none');
    $('.errorStartDate').addClass('d-none');
    $('.errorEndDate').addClass('d-none');
    $('.errorEventBudget').addClass('d-none');
    $('.errorAssignTo').addClass('d-none');
}

function removeDisableProp() {
    $("#Event_Name_Input").prop("disabled", false);
    $("#Event_Place_Input").prop("disabled", false);
    $("#Event_Budget_Input").prop("disabled", false);
    $("#Start_Date_Input").prop("disabled", false);
    $("#End_Date_Input").prop("disabled", false);
    $("#Status_Input").prop("disabled", false);
    $("#Note").prop("disabled", false);
    $("#Assign_To_Input").prop("disabled", false);
}

$('.closeAlert').click(function() {
    $(".alert").removeClass("show");
})
