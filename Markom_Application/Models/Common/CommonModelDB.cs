using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace Markom_Application.Models.Common
{
    public class CommonModelDB
    {
        public static string dbread(string paraMeter, string storeProcedure)
        {
            try
            {
                if (paraMeter != null)
                {
                    using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["MarkomApp"].ConnectionString))
                    {
                        connection.Open();
                        SqlCommand command = new SqlCommand(storeProcedure, connection)
                        {
                            CommandTimeout = 0,
                            CommandType = CommandType.StoredProcedure,
                            //ExecuteNonQuery();
                        };

                        command.Parameters.AddWithValue("@parameter", paraMeter);
                        var jsonResult = new StringBuilder();
                        var Reader = command.ExecuteXmlReader();

                        if (Reader.HasValue)
                        {
                            return "";
                        }
                        else
                        {
                            while (Reader.Read())
                            {
                                var tes = Reader.Value.ToString();
                                return Convert.ToString(tes);
                            }
                        }
                    }
                }
                return "";
            }
            catch (SqlException e)
            {
                return e.ToString();
            }
        }
        public static string dbins(string paraMeter, string storeProcedure)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["MarkomApp"].ConnectionString))
                {
                    connection.Open();

                    SqlCommand command = new SqlCommand(storeProcedure, connection)
                    {
                        CommandTimeout = 0,
                        CommandType = CommandType.StoredProcedure,
                    };

                    command.Parameters.AddWithValue("@parameter", paraMeter);
                    var jsonResult = new StringBuilder();
                    var Reader = command.ExecuteXmlReader();

                    if (Reader.HasValue)
                    {
                        return "";
                    }
                    else
                    {
                        while (Reader.Read())
                        {
                            var tes = Reader.Value.ToString();
                            return Convert.ToString(tes);
                        }
                    }
                }
                return "";
            }
            catch (SqlException e)
            {
                return e.ToString();
            }
        }
        public static string dbdelete(string paraMeter, string storeProcedure)
        {
            try
            {
                if (paraMeter != null)
                {
                    using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["MarkomApp"].ConnectionString))
                    {
                        connection.Open();
                        SqlCommand command = new SqlCommand(storeProcedure, connection)
                        {
                            CommandTimeout = 0,
                            CommandType = CommandType.StoredProcedure,
                            //ExecuteNonQuery();
                        };

                        command.Parameters.AddWithValue("@parameter", paraMeter);
                        var jsonResult = new StringBuilder();
                        var Reader = command.ExecuteXmlReader();

                        if (Reader.HasValue)
                        {
                            return "";
                        }
                        else
                        {
                            while (Reader.Read())
                            {
                                var tes = Reader.Value.ToString();
                                return Convert.ToString(tes);
                            }
                        }
                    }
                }
                return "";
            }
            catch (SqlException e)
            {
                return e.ToString();
            }
        }
        public static string Base64Decode(string plainText)
        {
            byte[] data = Convert.FromBase64String(plainText);
            string plainBytesText = Encoding.UTF8.GetString(data);
            return plainBytesText;
        }
        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            return Convert.ToBase64String(plainTextBytes);
        }
    }
}