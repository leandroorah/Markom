using Markom_Application.Models.Common;
using Markom_Application.Models.Transaction;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Markom_Application.Controllers
{
    public class EventController : Controller
    {
        ReturnData Hasil = new ReturnData();
        private List<JsonEventModel> listData = new List<JsonEventModel>();
        // GET: Event
        public ActionResult Index()
        {
            if (Session["ID"] != null)
            {
                ViewBag.TitleLeft = "Home";
                ViewBag.TitleMid = "Transaction";
                ViewBag.Title = "List Event Request";

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
                ParameterEvent param = new ParameterEvent();

                param.PageNumber = Convert.ToInt32(Request.QueryString["pageNumber"]);
                param.RowspPage = Convert.ToInt32(Request.QueryString["pageSize"]);
                param.GetType = "GetData";
                param.TransactionCode = Request.QueryString["Transaction_Code"];
                param.RequestBy = Request.QueryString["Request_By"];
                param.RequestDate = Request.QueryString["Request_Date"];
                param.Status = Request.QueryString["Status"];
                param.CreatedDate = Request.QueryString["Created_Date"];
                param.CreatedBy = Request.QueryString["Created_By"];

                var json = JsonConvert.SerializeObject(param);
                string Sp = "SP_Get_T_Event";

                string GetData = CommonModelDB.dbread(json, Sp);

                if (GetData != "")
                {
                    var settings = new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        MissingMemberHandling = MissingMemberHandling.Ignore
                    };

                    listData = JsonConvert.DeserializeObject<List<JsonEventModel>>(GetData, settings);
                    if (listData.Count != 0)
                    {
                        return Json(listData[0], JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        JsonEventModel Baru = new JsonEventModel();
                        Baru.total = 0;
                        Baru.rows = new List<RowsEventModel>();
                        return Json(Baru, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    JsonEventModel Baru = new JsonEventModel();
                    Baru.total = 0;
                    Baru.rows = new List<RowsEventModel>();
                    return Json(Baru, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                ex.Message.ToString();
                JsonEventModel Baru = new JsonEventModel();
                Baru.total = 0;
                Baru.rows = new List<RowsEventModel>();
                return Json(Baru, JsonRequestBehavior.AllowGet);
            }
        }
        public string GetStaffList()
        {
            try
            {
                ParameterAutoLoadData parameter = new ParameterAutoLoadData();

                parameter.GetType = "GET_STAFF";

                string jsonFormat = JsonConvert.SerializeObject(parameter);
                string data = CommonModelDB.dbread(jsonFormat, "SP_Get_T_Event");

                return data;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public string GetLastEventCode()
        {
            try
            {
                ParameterAutoLoadData parameter = new ParameterAutoLoadData();

                parameter.GetType = "SELECTED_LAST_EVENT";

                string jsonFormat = JsonConvert.SerializeObject(parameter);
                string data = CommonModelDB.dbread(jsonFormat, "SP_Get_T_Event");

                return data;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public ActionResult AddUp(EventModel data)
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
                            data.created_by = "Administrator";
                            data.request_by = Convert.ToInt32(Session["EmployeeID"]);
                            try
                            {
                                var json = JsonConvert.SerializeObject(data);
                                string Insert = CommonModelDB.dbins(json, "SP_InsUp_T_Event");

                                dynamic jArray1 = JObject.Parse(Insert);
                                Hasil.Status = jArray1.Status;
                                Hasil.Message = jArray1.ID;
                                Hasil.Name = data.event_name;
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
                            data.updated_by = "Administrator";
                            if (data.status == "2")
                            {
                                data.approved_by = Convert.ToInt32(Session["EmployeeID"]);
                            }
                            try
                            {
                                var json = JsonConvert.SerializeObject(data);
                                string Update = CommonModelDB.dbins(json, "SP_InsUp_T_Event");

                                dynamic jArray1 = JObject.Parse(Update);
                                Hasil.Status = jArray1.Status;
                                Hasil.Message = jArray1.ID;
                                Hasil.Name = data.event_name;
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
        public ActionResult Delete(EventModel model)
        {
            try
            {
                model.updated_by = "Administrator";
                ViewBag.Title = "Delete Event";
                var json = JsonConvert.SerializeObject(model);
                string Delete = CommonModelDB.dbdelete(json.ToString(), "SP_Del_T_Event");

                var jArray = JObject.Parse(Delete);
                if (Convert.ToString(jArray["Status"]) == "Success")
                {
                    Hasil.Status = "Success";
                    Hasil.Name = model.event_name;
                    return Json(Hasil, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    Hasil.Status = "Failed";
                    Hasil.Name = model.event_name;
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