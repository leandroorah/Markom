using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Markom_Application.Models.Master
{
    public class JsonRoleModel
    {
        public int total { get; set; }
        public List<RowsRoleModel> rows { get; set; }
    }
    public class RoleModel
    {
        public int? id { get; set; }
        [Required]
        public string code { get; set; }
        [Required]
        [DisplayName("Role Name")]
        public string name { get; set; }
        public string name_second { get; set; }
        [Required]
        [DisplayName("Role Description")]
        public string description { get; set; }
        public string created_by { get; set; }
        public string updated_by { get; set; }
    }
    public class RowsRoleModel
    {
        public int id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string is_delete { get; set; }
        public string created_by { get; set; }
        public string created_date { get; set; }
        public string updated_by { get; set; }
        public string updated_date { get; set; }
    }
    public class ParameterRole
    {
        public int PageNumber { get; set; }
        public int RowspPage { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string RoleCode { get; set; }
        public string RoleName { get; set; }
        public string GetType { get; set; }
    }
}