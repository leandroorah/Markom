$(function () {
    refreshDataList();
});

function refreshDataList() {
    $('#Role_Code_List').empty();
    $('#Role_Name_List').empty();
    $.ajax({
        type: "post",
        url: "Role/GetSelectedData",
        success: function (response) {
            if (response != '') {
                var i
                var data = JSON.parse(response)
                for (i in data) {
                    $('#Role_Code_List').append("<option value='" + data[i].code + "'>")
                    $('#Role_Name_List').append("<option value='" + data[i].name + "'>")
                }
            }
        }
    });
}

function queryParamsRole(params) {
    params.Role_Code = $("#Role_Code").val(),
        params.Role_Name = $("#Role_Name").val(),
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
        url: "Role/GetLastRoleCode",
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

                $("#Role_Code_Input").val(code_arr.join(''));
            }
            else {
                $("#Role_Code_Input").val('RO0001');
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
        $("#Role_Code_Input").val(row.code);
        $("#Role_Name_Input").val(row.name);
        $("#Role_Name_Input_Second").val(row.name);
        $("#Role_Description_Input").val(row.description);
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
        $("#Role_Code_Input").val(row.code);
        $("#Role_Name_Input").val(row.name).prop("disabled", true);
        $("#Role_Description_Input").val(row.description).prop("disabled", true);
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
            'code': $("#Role_Code_Input").val(),
            'name': $("#Role_Name_Input").val(),
            'name_second': $("#Role_Name_Input_Second").val(),
            'description': $("#Role_Description_Input").val()
        },
        success: function (data) {
            $('.errorName').addClass('d-none');
            console.log(data.Status);
            if (data.Status == "Success") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Saved! New Role has been add with code ' + data.Name + '!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();

            } else if (data.Status == "Failed") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                $(".alert").addClass("show");

            } else if (data.Status == "Update") {
                $('#ModalAdUp').modal('hide');
                $(".alertText").text('Data Updated! Data Role with code ' + data.Name + ' has been updated!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();

            } else {
                $(".addL").addClass("d-none");
                $(".add").removeClass("d-none");
                $(".cl").removeClass("d-none");
                if (data.Status == "Already Exists") {
                    $('.errorRole_Name').removeClass('d-none');
                    $('.errorRole_Name').text('Role name "' + data.Name + '" already used');
                }
                else {
                    var result = JSON.parse(data);
                    if ((result.length > 0)) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i]["key"] == "name") {
                                $('.errorRole_Name').removeClass('d-none');
                                $('.errorRole_Name').text(result[i]["errors"]);
                            }
                            if (result[i]["key"] == "description") {
                                $('.errorRole_Description').removeClass('d-none');
                                $('.errorRole_Description').text(result[i]["errors"]);
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
                $(".alertText").text('Data Deleted! Data role with code ' + data.Name + ' has been deleted!');
                $(".alert").addClass("show");
                $("#table").bootstrapTable('refresh');
                refreshDataList();
            } else if (data.Status == "Failed") {
                $(".alertText").text('Maaf, terjadi kesalahan pada sistem');
                $(".alert").addClass("show");
            } else if (data.Status == "No Changes") {
                $(".alertText").text('Tidak dapat menghapus role yang memiliki employee');
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
    $("#Role_Code_Input").val("");
    $("#Role_Name_Input").val("");
    $("#Role_Description_Input").val("");


    removeValidationWarning();
}

function removeValidationWarning() {
    $('.errorRole_Name').addClass('d-none');
    $('.errorRole_Description').addClass('d-none');
}

function removeDisableProp() {
    $("#Role_Name_Input").prop("disabled", false);
    $("#Role_Description_Input").prop("disabled", false);
}

$('.closeAlert').click(function () {
    $(".alert").removeClass("show");
})
