using Markom_Application.Models.Common;
using Markom_Application.Models.Master;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Markom_Application.Controllers
{
    public class UserController : Controller
    {
        ReturnData Hasil = new ReturnData();
        private List<JsonUserModel> listData = new List<JsonUserModel>();
        // GET: User
        public ActionResult Index()
        {
            if (Session["ID"] != null)
            {
                ViewBag.TitleLeft = "Home";
                ViewBag.TitleMid = "Master";
                ViewBag.Title = "User List";

                return View();
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }
        public ActionResult GetData()
        {
            try
            {
                ParameterUser param = new ParameterUser();

                param.PageNumber = Convert.ToInt32(Request.QueryString["pageNumber"]);
                param.RowspPage = Convert.ToInt32(Request.QueryString["pageSize"]);
                param.GetType = "GetData";
                param.EmployeeName = Request.QueryString["Employee_Name"];
                param.CompanyName = Request.QueryString["Company_Name"];
                param.RoleName = Request.QueryString["Role_Name"];
                param.Username = Request.QueryString["Username"];
                param.CreatedDate = Request.QueryString["Created_Date"];
                param.CreatedBy = Request.QueryString["Created_By"];

                var json = JsonConvert.SerializeObject(param);
                string Sp = "SP_Get_M_User";

                string GetData = CommonModelDB.dbread(json, Sp);

                if (GetData != "")
                {
                    var settings = new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        MissingMemberHandling = MissingMemberHandling.Ignore
                    };

                    listData = JsonConvert.DeserializeObject<List<JsonUserModel>>(GetData, settings);
                    if (listData.Count != 0)
                    {
                        for (int i = 0; i < listData[0].rows.Count(); i++)
                        {
                            listData[0].rows[i].password = CommonModelDB.Base64Decode(listData[0].rows[i].password);
                        }

                        return Json(listData[0], JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        JsonUserModel Baru = new JsonUserModel();
                        Baru.total = 0;
                        Baru.rows = new List<RowsUserModel>();
                        return Json(Baru, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    JsonUserModel Baru = new JsonUserModel();
                    Baru.total = 0;
                    Baru.rows = new List<RowsUserModel>();
                    return Json(Baru, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                ex.Message.ToString();
                JsonUserModel Baru = new JsonUserModel();
                Baru.total = 0;
                Baru.rows = new List<RowsUserModel>();
                return Json(Baru, JsonRequestBehavior.AllowGet);
            }
        }
        public string GetEmployeeListParam()
        {
            try
            {
                ParameterAutoLoadData parameter = new ParameterAutoLoadData();

                parameter.GetType = "SELECTED_EMPLOYEE";

                string jsonFormat = JsonConvert.SerializeObject(parameter);
                string data = CommonModelDB.dbread(jsonFormat, "SP_Get_M_User");

                return data;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public string GetCompanyListParam()
        {
            try
            {
                ParameterAutoLoadData parameter = new ParameterAutoLoadData();

                parameter.GetType = "SELECTED_COMPANY";

                string jsonFormat = JsonConvert.SerializeObject(parameter);
                string data = CommonModelDB.dbread(jsonFormat, "SP_Get_M_User");

                return data;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public string GetRoleListParam()
        {
            try
            {
                ParameterAutoLoadData parameter = new ParameterAutoLoadData();

                parameter.GetType = "SELECTED_ROLE";

                string jsonFormat = JsonConvert.SerializeObject(parameter);
                string data = CommonModelDB.dbread(jsonFormat, "SP_Get_M_User");

                return data;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public string GetRoleList()
        {
            try
            {
                ParameterAutoLoadData parameter = new ParameterAutoLoadData();

                parameter.GetType = "SELECT_ALL_ROLE";

                string jsonFormat = JsonConvert.SerializeObject(parameter);
                string data = CommonModelDB.dbread(jsonFormat, "SP_Get_M_User");

                return data;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public string GetEmployeeList()
        {
            try
            {
                ParameterAutoLoadData parameter = new ParameterAutoLoadData();

                parameter.GetType = "SELECT_ALL_EMPLOYEE";

                string jsonFormat = JsonConvert.SerializeObject(parameter);
                string data = CommonModelDB.dbread(jsonFormat, "SP_Get_M_User");

                return data;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public ActionResult AddUp(UserModel data)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errorModel = from x in ModelState.Keys
                                     where ModelState[x].Errors.Count > 0
                                     select new
                                     {
                                         key = x,
                                         errors = ModelState[x].Errors.Select(y => y.ErrorMessage).ToArray()
                                     };

                    string result = JsonConvert.SerializeObject(errorModel);

                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    if (data.id == null)
                    {
                        try
                        {
                            data.created_by = Session["RoleName"].ToString();
                            try
                            {
                                ParameterUser param = new ParameterUser();
                                param.Username = data.username;
                                param.GetType = "CEK_IF_EXISTS";

                                var jsonCheck = JsonConvert.SerializeObject(param);
                                string getData = CommonModelDB.dbread(jsonCheck, "SP_Get_M_User");
                                var jArray = JObject.Parse(getData);
                                if (Convert.ToString(jArray["Status"]) == "Already Exists")
                                {
                                    Hasil.Status = "Already Exists";
                                    Hasil.Name = data.username;
                                    return Json(Hasil, JsonRequestBehavior.AllowGet);
                                }

                                if (data.password != data.password_re_type)
                                {
                                    Hasil.Status = "Password Problem";
                                    return Json(Hasil, JsonRequestBehavior.AllowGet);
                                }

                                string base64 = data.password;
                                var encodeBase64 = Encoding.UTF8.GetBytes(base64);
                                string encodedText = Convert.ToBase64String(encodeBase64);
                                data.password = encodedText;

                                var json = JsonConvert.SerializeObject(data);
                                string Insert = CommonModelDB.dbins(json, "SP_InsUp_M_User");

                                dynamic jArray1 = JObject.Parse(Insert);
                                Hasil.Status = jArray1.Status;
                                Hasil.Message = jArray1.ID;
                                Hasil.Name = data.username;
                                return Json(Hasil, JsonRequestBehavior.AllowGet);
                            }
                            catch (Exception ex)
                            {
                                Hasil.Status = "Failed";
                                Hasil.Message = ex.Message.ToString();
                                return Json(Hasil, JsonRequestBehavior.AllowGet);
                            }
                        }
                        catch (Exception ex)
                        {
                            Hasil.Status = "Failed";
                            Hasil.Message = ex.Message.ToString();
                            return Json(Hasil, JsonRequestBehavior.AllowGet);
                        }
                    }
                    else
                    {
                        try
                        {
                            data.updated_by = Session["RoleName"].ToString();
                            try
                            {
                                if (data.username != data.username_second)
                                {
                                    ParameterUser param = new ParameterUser();
                                    param.Username = data.username;
                                    param.GetType = "CEK_IF_EXISTS";

                                    var jsonCheck = JsonConvert.SerializeObject(param);
                                    string getData = CommonModelDB.dbread(jsonCheck, "SP_Get_M_User");
                                    var jArray = JObject.Parse(getData);
                                    if (Convert.ToString(jArray["Status"]) == "Already Exists")
                                    {
                                        Hasil.Status = "Already Exists";
                                        Hasil.Name = data.username;
                                        return Json(Hasil, JsonRequestBehavior.AllowGet);
                                    }
                                }

                                if (data.password != data.password_re_type)
                                {
                                    Hasil.Status = "Password Problem";
                                    return Json(Hasil, JsonRequestBehavior.AllowGet);
                                }

                                if (data.password != "")
                                {
                                    string base64 = data.password;
                                    var encodeBase64 = Encoding.UTF8.GetBytes(base64);
                                    string encodedText = Convert.ToBase64String(encodeBase64);
                                    data.password = encodedText;

                                }

                                var json = JsonConvert.SerializeObject(data);
                                string Update = CommonModelDB.dbins(json, "SP_InsUp_M_User");

                                dynamic jArray1 = JObject.Parse(Update);
                                Hasil.Status = jArray1.Status;
                                Hasil.Message = jArray1.ID;
                                Hasil.Name = data.username;
                                return Json(Hasil, JsonRequestBehavior.AllowGet);
                            }
                            catch (Exception ex)
                            {
                                Hasil.Status = "Failed";
                                Hasil.Message = ex.Message.ToString();
                                return Json(Hasil, JsonRequestBehavior.AllowGet);
                            }
                        }
                        catch (Exception ex)
                        {
                            Hasil.Status = "Failed";
                            Hasil.Message = ex.Message.ToString();
                            return Json(Hasil, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Hasil.Status = "Failed";
                Hasil.Message = ex.Message.ToString();
                return Json(Hasil, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Delete(UserModel model)
        {
            try
            {
                model.updated_by = Session["RoleName"].ToString();
                ViewBag.Title = "Delete User";
                var json = JsonConvert.SerializeObject(model);
                string Delete = CommonModelDB.dbdelete(json.ToString(), "SP_Del_M_User");

                var jArray = JObject.Parse(Delete);
                if (Convert.ToString(jArray["Status"]) == "Success")
                {
                    Hasil.Status = "Success";
                    Hasil.Name = model.username;
                    return Json(Hasil, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    Hasil.Status = "Failed";
                    Hasil.Name = model.username;
                    return Json(Hasil, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                Hasil.Status = "Failed";
                Hasil.Message = ex.Message.ToString();
                return Json(Hasil, JsonRequestBehavior.AllowGet);
            }
        }
    }
}