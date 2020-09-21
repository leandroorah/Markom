using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Markom_Application.Models.Common
{
    public class CommonModel
    {
        public static string MarkomApp = ConfigurationManager.ConnectionStrings["MarkomApp"].ConnectionString;
    }
    public class ReturnData
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Name { get; set; }
    }
    public class ParameterAutoLoadData
    {
        public string GetType { get; set; }
    }
}