$(function () {
    refreshDataList();

    $.ajax({
        type: "post",
        url: "Employee/GetCompanyList",
        success: function (response) {
            var i
            var data = JSON.parse(response)
            for (i in data) {
                $('#Company_ID_Input').append("<option value=" + data[i].id + "> " + data[i].name + " </option>")
            }
        }
    });
});

function refreshDataList() {
    $('#Company_Name_List').empty();
    $.ajax({
        type: "post",
        url: "Employee/GetCompanyListParam",
        success: function (response) {
            var i
            var data = JSON.parse(response)
            for (i in data) {
                $('#Company_Name_List').append("<option value='" + data[i].name + "'>")
            }
        }
    });
}

function queryParamsEmployee(params) {
    params.Employee_ID_Number = $("#Employee_ID_Number").val(),
        params.Employee_Name = $("#Employee_Name").val(),
        params.Company_Name = $("#Company_Name").val(),
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
});

window.operateEvents = {
    'click .like': function (e, value, row, index) {
        cleanValue();
        removeDisableProp();
        $(".modal-title").text('Edit ' + ViewBag);
        $("#ModalAdUp").modal('show');

        removeValidationWarning();

        $("#id").val(row.id);
        $("#Employee_ID_Number_Input").val(row.employee_number);
        $("#Employee_ID_Number_Input_Second").val(row.employee_number);
        $("#Company_ID_Input").val(row.m_company_id);
        $("#Employee_First_Name_Input").val(row.first_name);
        $("#Employee_Last_Name_Input").val(row.last_name);
        $("#Employee_Email_Input").val(row.email);

    },

    'click .remove': function (e, value, row, index) {
        $(".cl").removeClass("d-none");
        $(".modal-title").text('Delete ' + ViewBag);
        $("#idDel").val(row.id);
        $("#nameDel").text(row.employee_number);
        $("#ModalDelete").modal('show');
    },

    'click .detail': function (e, value, row, index) {
        cleanValue();
        removeDisableProp();
        $(".modal-title").text('Edit ' + ViewBag);
        $("#ModalAdUp").modal('show');

        removeValidationWarning();

        $("#id").val(row.id);
        $("#Employee_ID_Number_Input").val(row.employee_number).prop("disabled", true);
        $("#Company_ID_Input").val(row.m_company_id).prop("disabled", true);
        $("#Employee_First_Name_Input").val(row.first_name).prop("disabled", true);
        $("#Employee_Last_Name_Input").val(row.last_name).prop("disabled", true);
        $("#Employee_Email_Input").val(row.email).prop("disabled", true);
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
            'employee_number': $("#Employee_ID_Number_Input").val(),
            'employee_number_second': $("#Employee_ID_Number_Input_Second").val(),
            'm_company_id': $("#Company_ID_Input").val(),
            'first_name': $("#Employee_First_Name_Input").val(),
            'last_name': $("#Employee_Last_Name_Input").val(),
            'email': $("#Employee_Email_Input").val(),
        },
        success: function (data) {
            $('.errorName').addClass('d-none');

            if (data.Status == "Success") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Saved! New employee has been add with id ' + data.Name + '!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();

            } else if (data.Status == "Failed") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                $(".alert").addClass("show");
            } else if (data.Status == "Update") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Updated! Data employee with id ' + data.Name + ' has been updated!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();

            } else {
                $(".addL").addClass("d-none");
                $(".add").removeClass("d-none");
                $(".cl").removeClass("d-none");
                if (data.Status == "Already Exists") {
                    $('.errorEmployee_ID').removeClass('d-none');
                    $('.errorEmployee_ID').text('Employee ID "' + data.Name + '" already used');
                }
                else {
                    var result = JSON.parse(data);
                    if ((result.length > 0)) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i]["key"] == "employee_number") {
                                $('.errorEmployee_ID').removeClass('d-none');
                                $('.errorEmployee_ID').text(result[i]["errors"]);
                            }

                            if (result[i]["key"] == "first_name") {
                                $('.errorFirstName').removeClass('d-none');
                                $('.errorFirstName').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "m_company_id") {
                                $('.errorCompany_ID').removeClass('d-none');
                                $('.errorCompany_ID').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "email") {
                                $('.errorEmail').removeClass('d-none');
                                $('.errorEmail').text(result[i]["errors"]);
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
    $("#Employee_ID_Number_Input").val("");
    $("#Company_ID_Input").val("");
    $("#Employee_First_Name_Input").val("");
    $("#Employee_Last_Name_Input").val("");
    $("#Employee_Email_Input").val("");


    removeValidationWarning();
}

function removeValidationWarning() {
    $('.errorEmployee_ID').addClass('d-none');
    $('.errorFirstName').addClass('d-none');
    $('.errorCompany_ID').addClass('d-none');
    $('.errorEmail').addClass('d-none');
}

function removeDisableProp() {
    $("#Employee_ID_Number_Input").prop("disabled", false);
    $("#Company_ID_Input").prop("disabled", false);
    $("#Employee_First_Name_Input").prop("disabled", false);
    $("#Employee_Last_Name_Input").prop("disabled", false);
    $("#Employee_Email_Input").prop("disabled", false);
}

$('.closeAlert').click(function () {
    $(".alert").removeClass("show");
})
