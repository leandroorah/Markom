using Markom_Application.Models.Common;
using Markom_Application.Models.Master;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Markom_Application.Controllers
{
    public class CompanyController : Controller
    {
        ReturnData Hasil = new ReturnData();
        private List<JsonCompanyModel> listData = new List<JsonCompanyModel>();
        // GET: Company
        public ActionResult Index()
        {
            if (Session["ID"] != null)
            {
                ViewBag.TitleLeft = "Home";
                ViewBag.TitleMid = "Master";
                ViewBag.Title = "Company List";

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
                ParameterCompany param = new ParameterCompany();

                param.PageNumber = Convert.ToInt32(Request.QueryString["pageNumber"]);
                param.RowspPage = Convert.ToInt32(Request.QueryString["pageSize"]);
                param.GetType = "GetData";
                param.CompanyCode = Request.QueryString["Company_Code"];
                param.CompanyName = Request.QueryString["Company_Name"];
                param.CreatedDate = Request.QueryString["Created_Date"];
                param.CreatedBy = Request.QueryString["Created_By"];

                var json = JsonConvert.SerializeObject(param);
                string Sp = "SP_Get_M_Company";

                string GetData = CommonModelDB.dbread(json, Sp);

                if (GetData != "")
                {
                    var settings = new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        MissingMemberHandling = MissingMemberHandling.Ignore
                    };

                    listData = JsonConvert.DeserializeObject<List<JsonCompanyModel>>(GetData, settings);
                    if (listData.Count != 0)
                    {
                        return Json(listData[0], JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        JsonCompanyModel Baru = new JsonCompanyModel();
                        Baru.total = 0;
                        Baru.rows = new List<RowsCompanyModel>();
                        return Json(Baru, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    JsonCompanyModel Baru = new JsonCompanyModel();
                    Baru.total = 0;
                    Baru.rows = new List<RowsCompanyModel>();
                    return Json(Baru, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                ex.Message.ToString();
                JsonCompanyModel Baru = new JsonCompanyModel();
                Baru.total = 0;
                Baru.rows = new List<RowsCompanyModel>();
                return Json(Baru, JsonRequestBehavior.AllowGet);
            }
        }
        public string GetSelectedData()
        {
            try
            {
                ParameterAutoLoadData parameter = new ParameterAutoLoadData();

                parameter.GetType = "SELECTED";

                string jsonFormat = JsonConvert.SerializeObject(parameter);
                string data = CommonModelDB.dbread(jsonFormat, "SP_Get_M_Company");

                return data;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public string GetLastCompanyCode()
        {
            try
            {
                ParameterAutoLoadData parameter = new ParameterAutoLoadData();

                parameter.GetType = "SELECTED_LAST_COMPANY";

                string jsonFormat = JsonConvert.SerializeObject(parameter);
                string data = CommonModelDB.dbread(jsonFormat, "SP_Get_M_Company");

                return data;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public ActionResult AddUp(CompanyModel data)
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
                                ParameterCompany param = new ParameterCompany();
                                param.CompanyName = data.name;
                                param.GetType = "CEK_IF_EXISTS";

                                var jsonCheck = JsonConvert.SerializeObject(param);
                                string getData = CommonModelDB.dbread(jsonCheck, "SP_Get_M_Company");
                                var jArray = JObject.Parse(getData);
                                if (Convert.ToString(jArray["Status"]) == "Already Exists")
                                {
                                    Hasil.Status = "Already Exists";
                                    Hasil.Name = data.name;
                                    return Json(Hasil, JsonRequestBehavior.AllowGet);
                                }

                                var json = JsonConvert.SerializeObject(data);
                                string Insert = CommonModelDB.dbins(json, "SP_InsUp_M_Company");

                                dynamic jArray1 = JObject.Parse(Insert);
                                Hasil.Status = jArray1.Status;
                                Hasil.Message = jArray1.ID;
                                Hasil.Name = data.code;
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
                                if (data.name.ToLower() != data.name_second.ToLower())
                                {
                                    ParameterCompany param = new ParameterCompany();
                                    param.CompanyName = data.name;
                                    param.GetType = "CEK_IF_EXISTS";

                                    var jsonCheck = JsonConvert.SerializeObject(param);
                                    string getData = CommonModelDB.dbread(jsonCheck, "SP_Get_M_Company");
                                    var jArray = JObject.Parse(getData);
                                    if (Convert.ToString(jArray["Status"]) == "Already Exists")
                                    {
                                        Hasil.Status = "Already Exists";
                                        Hasil.Name = data.name;
                                        return Json(Hasil, JsonRequestBehavior.AllowGet);
                                    }
                                }

                                var json = JsonConvert.SerializeObject(data);
                                string Update = CommonModelDB.dbins(json, "SP_InsUp_M_Company");

                                dynamic jArray1 = JObject.Parse(Update);
                                Hasil.Status = jArray1.Status;
                                Hasil.Message = jArray1.ID;
                                Hasil.Name = data.code;
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
        public ActionResult Delete(CompanyModel model)
        {
            try
            {
                model.updated_by = Session["RoleName"].ToString();
                ViewBag.Title = "Delete Company";
                var json = JsonConvert.SerializeObject(model);
                string Delete = CommonModelDB.dbdelete(json.ToString(), "SP_Del_M_Company");

                var jArray = JObject.Parse(Delete);
                if (Convert.ToString(jArray["Status"]) == "Success")
                {
                    Hasil.Status = "Success";
                    Hasil.Name = model.code;
                    return Json(Hasil, JsonRequestBehavior.AllowGet);
                }
                else if (Convert.ToString(jArray["Status"]) == "No Changes")
                {
                    Hasil.Status = "No Changes";
                    Hasil.Name = model.code;
                    return Json(Hasil, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    Hasil.Status = "Failed";
                    Hasil.Name = model.code;
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