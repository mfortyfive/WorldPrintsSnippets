using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class UserService : IUserService
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;

        public UserService(IAuthenticationService<int> authService, IDataProvider dataProvider)
        {
            _authenticationService = authService;
            _dataProvider = dataProvider;
        }

        public async Task<bool> LogInAsync(string email, string password)
        {
            bool isSuccessful = false;

            IUserAuthData response = Get(email, password);

            if (response != null)
            {
                await _authenticationService.LogInAsync(response);
                isSuccessful = true;
            }

            return isSuccessful;
        }

        public async Task<bool> LogInTest(string email, string password, int id, string[] roles = null)
        {
            bool isSuccessful = false;
            var testRoles = new[] { "User", "Super", "Content Manager" };

            var allRoles = roles == null ? testRoles : testRoles.Concat(roles);

            IUserAuthData response = new UserBase
            {
                Id = id
                ,
                Email = email
                ,
                Roles = allRoles
                ,
                TenantId = "WorldPrint"
            };

            Claim fullName = new Claim("CustomClaim", "Sabio Bootcamp");
            await _authenticationService.LogInAsync(response, new Claim[] { fullName });

            return isSuccessful;
        }

        public int Create(UserBaseAddRequest userModel)
        {

            int userId = 0;
          
            string procName = "[dbo].[Users_Insert_V2]";

            //make sure the password column can hold long enough string. put it to 100 to be safe
            //DB provider call to create user and get us a user id
            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Email", userModel.Email);
                    col.AddWithValue("@Password", GenerateSalt(userModel.Password));
                    col.AddWithValue("@RoleId", userModel.RoleId);

                    SqlParameter idOutput = new SqlParameter("@Id", SqlDbType.Int);
                    idOutput.Direction = ParameterDirection.Output;
                    col.Add(idOutput);
                },
                delegate (SqlParameterCollection col)
                {
                    object objectId = col["@Id"].Value;
                    int.TryParse(objectId.ToString(), out userId);
                });


            //be sure to store both salt and passwordHash
            //DO NOT STORE the original password value that the user passed us

            return userId;
        }

        public Guid CreateRegToken(int userId)
        {
            string procName = "[dbo].[UserToken_Insert_Registration]";
            Guid token = Guid.NewGuid();

            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@UserId", userId);
                    col.AddWithValue("@Token", token);
                });

            return token;
        }

        public void ConfirmRegToken(Guid token)
        {
            string procName = "[dbo].[Users_Confirm]";

            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Token", token);
                });
        }

        private string GenerateSalt(string password)
        {
            string salt = BCrypt.BCryptHelper.GenerateSalt();
            return  BCrypt.BCryptHelper.HashPassword(password, salt);
        }

        /// <summary>
        /// Gets the Data call to get a give user
        /// </summary>
        /// <param name="email"></param>
        /// <param name="passwordHash"></param>
        /// <returns></returns>
        private IUserAuthData Get(string email, string password)
        {
            //make sure the password column can hold long enough string. put it to 100 to be safe
            string passwordFromDb = "";
            UserBase authorizedUser = null;
            string procName = "[dbo].[Users_Select_ByEmail_Auth]";
            

            //get user object from db;
            _dataProvider.ExecuteCmd(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Email", email);
                },
                delegate (IDataReader reader, short set)
                {
                    bool isValidCredentials = false;
                    int idx = 0;
                    UserBase user = MapUser(reader, out passwordFromDb, idx);

                    isValidCredentials = BCrypt.BCryptHelper.CheckPassword(password, passwordFromDb);

                    if (isValidCredentials)
                    {
                        authorizedUser = user;
                    }
                });

            return authorizedUser;
        }

        private static UserBase MapUser(IDataReader reader, out string passwordFromDb, int idx)
        {
            UserBase user = new UserBase();
            user.Id = reader.GetSafeInt32(idx++);
            user.Email = reader.GetSafeString(idx++);
            passwordFromDb = reader.GetSafeString(idx++);
            user.Roles = new[] { reader.GetSafeString(idx++) };
            user.TenantId = "WorldPrint";
            return user;
        }
    }
}