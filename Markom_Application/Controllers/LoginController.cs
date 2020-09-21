using Markom_Application.Models.Common;
using Markom_Application.Models.Master;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Markom_Application.Controllers
{
    public class LoginController : Controller
    {
        ReturnData Hasil = new ReturnData();
        private List<JsonUserModel> listData = new List<JsonUserModel>();
        private List<RowsUserModel> listSession = new List<RowsUserModel>();
        // GET: Login
        public ActionResult Index()
        {
            if (Session["ID"] != null)
            {
                return RedirectToAction("Index", "Home");
                //return Redirect("/");
            }
            else
            {
                return PartialView();
            }
        }
        public ActionResult Login(ParameterUser Login)
        {
            if (Session["ID"] == null)
            {
                Login.PasswordLogin = CommonModelDB.Base64Encode(Login.PasswordLogin).ToString();
                Login.GetType = "LOGIN";

                var json = JsonConvert.SerializeObject(Login);
                string Sp = "SP_Get_M_User";

                string GetData = CommonModelDB.dbread(json, Sp);

                if (GetData != "")
                {
                    var settings = new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        MissingMemberHandling = MissingMemberHandling.Ignore
                    };

                    listSession = JsonConvert.DeserializeObject<List<RowsUserModel>>(GetData, settings);

                    Session["ID"] = listSession[0].id;
                    Session["EmployeeID"] = listSession[0].m_employee_id;
                    Session["Name"] = listSession[0].employee_name;
                    Session["Role"] = listSession[0].m_role_id;
                    Session["RoleName"] = listSession[0].role_name;

                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    TempData["Error"] = "Invalid username or password.";
                    return RedirectToAction("index", "login");
                }
            }
            else
            {
                return Redirect("/");
            }
        }
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            Session.Abandon();
            return Redirect("/");
        }
    }
}