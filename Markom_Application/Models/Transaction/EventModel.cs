using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Markom_Application.Models.Transaction
{
    public class JsonEventModel
    {
        public int total { get; set; }
        public List<RowsEventModel> rows { get; set; }
    }
    public class EventModel
    {
        public int? id { get; set; }
        public string code { get; set; }
        [Required]
        [DisplayName("Event Name")]
        public string event_name { get; set; }
        [Required]
        [DisplayName("Place")]
        public string place { get; set; }
        [Required]
        [DisplayName("Start Date")]
        public string start_date { get; set; }
        [Required]
        [DisplayName("End Date")]
        public string end_date { get; set; }
        [Required]
        [DisplayName("Budget")]
        public string budget { get; set; }
        public int? request_by { get; set; }
        public string request_date { get; set; }
        public int? approved_by { get; set; }
        public string approved_date { get; set; }
        public int? assign_to { get; set; }
        public string note { get; set; }
        public string status { get; set; }
        public string reject_reason { get; set; }
        public string created_by { get; set; }
        public string updated_by { get; set; }
    }
    public class RowsEventModel
    {
        public int id { get; set; }
        public string code { get; set; }
        public string event_name { get; set; }
        public string start_date { get; set; }
        public string end_date { get; set; }
        public string place { get; set; }
        public string budget { get; set; }
        public string request_by { get; set; }
        public string request_by_name { get; set; }
        public string request_date { get; set; }
        public string approved_by { get; set; }
        public string approved_by_name { get; set; }
        public string approved_date { get; set; }
        public string assign_to { get; set; }
        public string assign_to_name { get; set; }
        public string closed_date { get; set; }
        public string note { get; set; }
        public string status { get; set; }
        public string reject_reason { get; set; }
        public string is_delete { get; set; }
        public string created_by { get; set; }
        public string created_date { get; set; }
        public string updated_by { get; set; }
        public string updated_date { get; set; }
    }
    public class ParameterEvent
    {
        public int PageNumber { get; set; }
        public int RowspPage { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string TransactionCode { get; set; }
        public string RequestBy { get; set; }
        public string RequestDate { get; set; }
        public string Status { get; set; }
        public string GetType { get; set; }
    }
}