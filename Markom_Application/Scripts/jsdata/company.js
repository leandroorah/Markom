$(function () {
    refreshDataList();
});

function refreshDataList() {
    $('#Company_Code_List').empty();
    $('#Company_Name_List').empty();
    $.ajax({
        type: "post",
        url: "Company/GetSelectedData",
        success: function (response) {
            if (response != '') {
                var i
                var data = JSON.parse(response)
                for (i in data) {
                    $('#Company_Code_List').append("<option value='" + data[i].code + "'>")
                    $('#Company_Name_List').append("<option value='" + data[i].name + "'>")
                }
            }
        }
    });
}

function queryParamsCompany(params) {
    params.Company_Code = $("#Company_Code").val(),
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

    $.ajax({
        type: "post",
        url: "Company/GetLastCompanyCode",
        success: function (response) {
            if (response != '') {
                var data = JSON.parse(response)
                var code_arr = data[0].code.split('');
                if (code_arr[5] != 9) {
                    code_arr[5] = parseInt(code_arr[5]) + 1;
                }
                else if (code_arr[4] != 9) {
                    code_arr[4] = parseInt(code_arr[4]) + 1;
                    code_arr[5] = "0";
                }
                else if (code_arr[3] != 9) {
                    code_arr[3] = parseInt(code_arr[3]) + 1;
                    code_arr[4] = "0";
                    code_arr[5] = "0";
                }
                else if (code_arr[2] != 9) {
                    code_arr[2] = parseInt(code_arr[2]) + 1;
                    code_arr[3] = "0";
                    code_arr[4] = "0";
                    code_arr[5] = "0";
                }

                $("#Company_Code_Input").val(code_arr.join(''));
            }
            else {
                $("#Company_Code_Input").val('CP0001');
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
        $("#Company_Code_Input").val(row.code);
        $("#Company_Name_Input").val(row.name);
        $("#Company_Name_Input_Second").val(row.name);
        $("#Company_Email_Input").val(row.email);
        $("#Company_Phone_Input").val(row.phone);
        $("#Company_Address_Input").val(row.address);

    },

    'click .remove': function (e, value, row, index) {
        $(".cl").removeClass("d-none");
        $(".modal-title").text('Delete ' + ViewBag);
        $("#idDel").val(row.id);
        $("#nameDel").text(row.code);
        $("#ModalDelete").modal('show');
    },

    'click .detail': function (e, value, row, index) {
        cleanValue();
        removeDisableProp();
        $(".modal-title").text('Edit ' + ViewBag);
        $("#ModalAdUp").modal('show');

        removeValidationWarning();

        $("#id").val(row.id);
        $("#Company_Code_Input").val(row.code);
        $("#Company_Name_Input").val(row.name).prop("disabled", true);
        $("#Company_Email_Input").val(row.email).prop("disabled", true);
        $("#Company_Phone_Input").val(row.phone).prop("disabled", true);
        $("#Company_Address_Input").val(row.address).prop("disabled", true);
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
            'code': $("#Company_Code_Input").val(),
            'name': $("#Company_Name_Input").val(),
            'name_second': $("#Company_Name_Input_Second").val(),
            'address': $("#Company_Address_Input").val(),
            'phone': $("#Company_Phone_Input").val(),
            'email': $("#Company_Email_Input").val(),
        },
        success: function (data) {
            $('.errorName').addClass('d-none');

            if (data.Status == "Success") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Saved! New company has been add with code ' + data.Name + '!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();

            } else if (data.Status == "Failed") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                $(".alert").addClass("show");

            } else if (data.Status == "Update") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Updated! Data company with code ' + data.Name + ' has been updated!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();

            } else {
                $(".addL").addClass("d-none");
                $(".add").removeClass("d-none");
                $(".cl").removeClass("d-none");
                if (data.Status == "Already Exists") {
                    $('.errorCompany_Name').removeClass('d-none');
                    $('.errorCompany_Name').text('Company name "' + data.Name + '" already used');
                }
                else {
                    var result = JSON.parse(data);
                    if ((result.length > 0)) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i]["key"] == "name") {
                                $('.errorCompany_Name').removeClass('d-none');
                                $('.errorCompany_Name').text(result[i]["errors"]);
                            }

                            if (result[i]["key"] == "phone") {
                                $('.errorPhone').removeClass('d-none');
                                $('.errorPhone').text(result[i]["errors"]);
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
            'code': span_Text
        },
        success: function (data) {
            $("#ModalDelete").modal('hide');
            $(".deleteL").addClass("d-none");
            $(".delete").removeClass("d-none");
            $(".cl").removeClass("d-none");
            console.log(data);
            if (data.Status == "Success") {
                $(".alertText").text('Data Deleted! Data company with code ' + data.Name + ' has been deleted!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();
            } else if (data.Status == "Failed") {
                $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                $(".alert").addClass("show");
            } else if (data.Status == "No Changes") {
                $(".alertText").text('Tidak dapat menghapus company yang memiliki employee');
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
    $("#Company_Code_Input").val("");
    $("#Company_Name_Input").val("");
    $("#Company_Address_Input").val("");
    $("#Company_Phone_Input").val("");
    $("#Company_Email_Input").val("");


    removeValidationWarning();
}

function removeValidationWarning() {
    $('.errorCompany_Name').addClass('d-none');
    $('.errorPhone').addClass('d-none');
    $('.errorEmail').addClass('d-none');
}

function removeDisableProp() {
    $("#Company_Name_Input").prop("disabled", false);
    $("#Company_Email_Input").prop("disabled", false);
    $("#Company_Phone_Input").prop("disabled", false);
    $("#Company_Address_Input").prop("disabled", false);
}

$('.closeAlert').click(function () {
    $(".alert").removeClass("show");
})
