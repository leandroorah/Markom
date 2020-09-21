using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Markom_Application.Models.Master
{
    public class JsonEmployeeModel
    {
        public int total { get; set; }
        public List<RowsEmployeeModel> rows { get; set; }
    }
    public class EmployeeModel
    {
        public int? id { get; set; }
        [Required]
        [DisplayName("Employee ID Number")]
        [RegularExpression("^([0-9]{2}([.][0-9]{2})([.][0-9]{2})([.][0-9]{2})){1}?$", ErrorMessage = "Format ID salah (XX.XX.XX.XX)")]
        public string employee_number { get; set; }
        public string employee_number_second { get; set; }
        [Required]
        [DisplayName("Employee First Name")]
        public string first_name { get; set; }
        public string last_name { get; set; }
        [Required]
        [DisplayName("Employee Company Name")]
        public int m_company_id { get; set; }
        [DisplayName("Email")]
        [RegularExpression("^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+[.])+[a-z]{2,5}$", ErrorMessage = "Format email Salah")]
        public string email { get; set; }
        public string created_by { get; set; }
        public string updated_by { get; set; }
    }
    public class RowsEmployeeModel
    {
        public int id { get; set; }
        public string employee_number { get; set; }
        public string employee_name { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string company_name { get; set; }
        public string m_company_id { get; set; }
        public string email { get; set; }
        public string is_delete { get; set; }
        public string created_by { get; set; }
        public string created_date { get; set; }
        public string updated_by { get; set; }
        public string updated_date { get; set; }
    }
    public class ParameterEmployee
    {
        public int PageNumber { get; set; }
        public int RowspPage { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string EmployeeIDNumber { get; set; }
        public string EmployeeName { get; set; }
        public string CompanyName { get; set; }
        public string GetType { get; set; }
    }
}