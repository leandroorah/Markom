using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Markom_Application.Models.Master
{
    public class JsonCompanyModel
    {
        public int total { get; set; }
        public List<RowsCompanyModel> rows { get; set; }
    }
    public class CompanyModel
    {
        public int? id { get; set; }
        [Required]
        public string code { get; set; }
        [Required]
        [DisplayName("Company Name")]
        public string name { get; set; }
        public string name_second { get; set; }
        public string address { get; set; }
        [DisplayName("Phone Number")]
        [RegularExpression("^(?=^.{0,50}$)[0-9,-]*$", ErrorMessage = "Hanya boleh angka dan simbol '(,), -'")]
        public string phone { get; set; }
        [DisplayName("Email")]
        [RegularExpression("^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+[.])+[a-z]{2,5}$", ErrorMessage = "Format email Salah")]
        public string email { get; set; }
        public string created_by { get; set; }
        public string updated_by { get; set; }
    }
    public class RowsCompanyModel
    {
        public int id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string address { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string is_delete { get; set; }
        public string created_by { get; set; }
        public string created_date { get; set; }
        public string updated_by { get; set; }
        public string updated_date { get; set; }
    }
    public class ParameterCompany
    {
        public int PageNumber { get; set; }
        public int RowspPage { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public string GetType { get; set; }
    }
}