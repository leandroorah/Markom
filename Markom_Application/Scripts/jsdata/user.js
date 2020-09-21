$(function () {
    refreshDataList();

    $.ajax({
        type: "post",
        url: "User/GetRoleList",
        success: function (response) {
            var i
            var data = JSON.parse(response)
            $('#Role_ID_Input').append("<option value=" + "" + ">- Select Role -</option>")
            for (i in data) {
                $('#Role_ID_Input').append("<option value=" + data[i].id + "> " + data[i].name + " </option>")
            }
        }
    });
});

function refreshDataList() {
    $('#Employee_Name_List').empty();
    $('#Role_Name_List').empty();
    $('#Company_Name_List').empty();
    $('#Employee_ID_Input').empty();

    $.ajax({
        type: "post",
        url: "User/GetEmployeeListParam",
        success: function (response) {
            var i
            var data = JSON.parse(response)
            for (i in data) {
                $('#Employee_Name_List').append("<option value='" + data[i].employee_name + "'>")
            }
        }
    });
    $.ajax({
        type: "post",
        url: "User/GetRoleListParam",
        success: function (response) {
            var i
            var data = JSON.parse(response)
            for (i in data) {
                $('#Role_Name_List').append("<option value='" + data[i].name + "'>")
            }
        }
    });
    $.ajax({
        type: "post",
        url: "User/GetCompanyListParam",
        success: function (response) {
            var i
            var data = JSON.parse(response)
            for (i in data) {
                $('#Company_Name_List').append("<option value='" + data[i].name + "'>")
            }
        }
    });
    $.ajax({
        type: "post",
        url: "User/GetEmployeeList",
        success: function (response) {
            var i
            var data = JSON.parse(response)
            $('#Employee_ID_Input').append("<option value=" + "" + ">- Select Employee -</option>")
            for (i in data) {
                $('#Employee_ID_Input').append("<option value=" + data[i].id + "> " + data[i].employee_name + " </option>")
            }
        }
    });
}

function queryParamsUser(params) {
        params.Employee_Name = $("#Employee_Name").val(),
            params.Role_Name = $("#Role_Name").val(),
            params.Company_Name = $("#Company_Name").val(),
            params.Username = $("#Username").val(),
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
    refreshDataList();
    $("#ModalAdUp").modal('show');
});

window.operateEvents = {
    'click .like': function (e, value, row, index) {
        cleanValue();
        removeDisableProp();
        refreshDataList();
        $('#Employee_ID_Input').append("<option value=" + row.m_employee_id + "> " + row.employee_name + " </option>")
        $(".modal-title").text('Edit ' + ViewBag);
        $("#ModalAdUp").modal('show');

        removeValidationWarning();

        $("#id").val(row.id);
        $("#Role_ID_Input").val(row.m_role_id);
        $("#Employee_ID_Input").val(row.m_employee_id);
        $("#Username_Input").val(row.username);
        $("#Username_Input_Second").val(row.username);
        $("#Password_Input").val(row.password);
        $("#Password_Input_Second").val(row.password);

    },

    'click .remove': function (e, value, row, index) {
        $(".cl").removeClass("d-none");
        $(".modal-title").text('Delete ' + ViewBag);
        $("#idDel").val(row.id);
        $("#nameDel").text(row.employee_name);
        $("#ModalDelete").modal('show');
    },

    'click .detail': function (e, value, row, index) {
        cleanValue();
        removeDisableProp();
        $(".modal-title").text('Edit ' + ViewBag);
        $("#ModalAdUp").modal('show');
        $('#Employee_ID_Input').append("<option value=" + row.m_employee_id + "> " + row.employee_name + " </option>")

        removeValidationWarning();

        $("#id").val(row.id);
        $("#Role_ID_Input").val(row.m_role_id).prop("disabled", true);
        $("#Employee_ID_Input").val(row.m_employee_id).prop("disabled", true);
        $("#Username_Input").val(row.username).prop("disabled", true);
        $("#Username_Input_Second").val(row.username).prop("disabled", true);
        $("#Password_Input").val(row.password).prop("disabled", true);
        $("#Password_Input_Second").val(row.password).prop("disabled", true);
        $('.add').addClass('d-none');
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
            'm_role_id': $("#Role_ID_Input").val(),
            'm_employee_id': $("#Employee_ID_Input").val(),
            'username': $("#Username_Input").val(),
            'username_second': $("#Username_Input_Second").val(),
            'password': $("#Password_Input").val(),
            'password_re_type': $("#Password_Input_Second").val()
        },
        success: function (data) {
            $('.errorName').addClass('d-none');

            if (data.Status == "Success") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Saved! New User has been add with username ' + data.Name + ' !');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();

            } else if (data.Status == "Failed") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                $(".alert").addClass("show");

            } else if (data.Status == "Update") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Updated! Data user with username ' + data.Name + ' has been updated!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();

            } else {
                $(".addL").addClass("d-none");
                $(".add").removeClass("d-none");
                $(".cl").removeClass("d-none");
                if (data.Status == "Already Exists") {
                    $('.errorUsername').removeClass('d-none');
                    $('.errorUsername').text('Username "' + data.Name + '" already used');
                }
                else if (data.Status == "Password Problem") {
                    $('.errorPassword_ReType').removeClass('d-none');
                    $('.errorPassword_ReType').text("Password and Re-type Password must be match");
                }
                else {
                    var result = JSON.parse(data);
                    if ((result.length > 0)) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i]["key"] == "m_role_id") {
                                $('.errorRole_ID').removeClass('d-none');
                                $('.errorRole_ID').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "username") {
                                $('.errorUsername').removeClass('d-none');
                                $('.errorUsername').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "m_employee_id") {
                                $('.errorEmployee_ID').removeClass('d-none');
                                $('.errorEmployee_ID').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "password") {
                                $('.errorPassword').removeClass('d-none');
                                $('.errorPassword').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "password_re_type") {
                                $('.errorPassword_ReType').removeClass('d-none');
                                $('.errorPassword_ReType').text(result[i]["errors"]);
                            }
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
            'username': span_Text
        },
        success: function (data) {
            $("#ModalDelete").modal('hide');
            $(".deleteL").addClass("d-none");
            $(".delete").removeClass("d-none");
            $(".cl").removeClass("d-none");

            if (data.Status == "Success") {
                $(".alertText").text('Data Deleted! User with username ' + data.Name + ' has been deleted!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();
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
    $("#Role_ID_Input").val("");
    $("#Employee_ID_Input").val("");
    $("#Username_Input").val("");
    $("#Username_Input_Second").val("");
    $("#Password_Input").val("");
    $("#Password_Input_Second").val("");


    removeValidationWarning();
}

function removeValidationWarning() {
    $('.errorRole_ID').addClass('d-none');
    $('.errorUsername').addClass('d-none');
    $('.errorEmployee_ID').addClass('d-none');
    $('.errorPassword').addClass('d-none');
    $('.errorPassword_ReType').addClass('d-none');
}

function removeDisableProp() {
    $("#Role_ID_Input").prop("disabled", false);
    $("#Employee_ID_Input").prop("disabled", false);
    $("#Username_Input").prop("disabled", false);
    $("#Password_Input").prop("disabled", false);
    $("#Password_Input_Second").prop("disabled", false);
}

$('.closeAlert').click(function () {
    $(".alert").removeClass("show");
})
