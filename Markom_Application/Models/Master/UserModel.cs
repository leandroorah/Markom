using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Markom_Application.Models.Master
{
    public class JsonUserModel
    {
        public int total { get; set; }
        public List<RowsUserModel> rows { get; set; }
    }
    public class UserLogin
    {
        [Required]
        [DisplayName("Username")]
        public string username { get; set; }
        [Required]
        [DisplayName("Password")]
        public string password { get; set; }
    }
    public class UserModel
    {
        public int? id { get; set; }
        [Required]
        [DisplayName("Username")]
        [RegularExpression("^(?=^.{1,}$)[a-zA-Z0-9_]*$", ErrorMessage = "Username minimum 8 characters and only contain letters or numbers")]
        public string username { get; set; }
        public string username_second { get; set; }
        [Required]
        [DisplayName("Password")]
        [RegularExpression("^(?=.*?[A-Z])(?=(.*[a-z]){0,}).{1,}$", ErrorMessage = "Password must contain uppercase")]
        public string password { get; set; }
        [Required]
        [DisplayName("Re-type Password")]
        public string password_re_type { get; set; }
        [Required]
        [DisplayName("Role Name")]
        public int m_role_id { get; set; }
        [Required]
        [DisplayName("Employee Name")]
        public int m_employee_id { get; set; }
        public string created_by { get; set; }
        public string updated_by { get; set; }
    }
    public class RowsUserModel
    {
        public int id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string m_role_id { get; set; }
        public string role_name { get; set; }
        public string m_employee_id { get; set; }
        public string employee_name { get; set; }
        public string first_name { get; set; }
        public string company_name { get; set; }
        public string is_delete { get; set; }
        public string created_by { get; set; }
        public string created_date { get; set; }
        public string updated_by { get; set; }
        public string updated_date { get; set; }
    }
    public class ParameterUser
    {
        public int PageNumber { get; set; }
        public int RowspPage { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string EmployeeName { get; set; }
        public string RoleName { get; set; }
        public string CompanyName { get; set; }
        public string Username { get; set; }
        public string GetType { get; set; }
        public string UsernameLogin { get; set; }
        public string PasswordLogin { get; set; }
    }
}