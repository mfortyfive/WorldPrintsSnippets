using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Core;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserApiController : BaseApiController
    {
        private IUserService _userSvc;
        private IEmailService _emailSvc;
        private IAuthenticationService<int> _authSvc;
        IOptions<SecurityConfig> _options;

        public UserApiController(IUserService userSvc,
            IEmailService emailSvc,
            ILogger<UserApiController> logger,
            IAuthenticationService<int> authSvc,
            IOptions<SecurityConfig> options) : base(logger)
        {
            _userSvc = userSvc;
            _emailSvc = emailSvc;
            _authSvc = authSvc;
            _options = options;
        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<IUserAuthData>> GetCurrrent()
        {
            int code = 200;
            ItemResponse<IUserAuthData> response = new ItemResponse<IUserAuthData>();

            try
            {
                IUserAuthData user = _authSvc.GetCurrentUser();
                response.Item = user;
            }
            catch (Exception ex)
            {
                code = 401;
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse>> LoginAsync(UserLogInRequest model)
        {
            int code = 200;
            ItemResponse<object> response = new ItemResponse<object>();
            response.IsSuccessful = await _userSvc.LogInAsync(model.Email, model.Password);
            response.Item = _options;

            if (!response.IsSuccessful)
            {
                code = 401;
            }

            return StatusCode(code, response);
        }

        [HttpGet("logout")]
        public async Task<ActionResult<SuccessResponse>> LogoutAsync()
        {
            BaseResponse response = null;
            try
            {
                await _authSvc.LogOutAsync();
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return Ok200(response);
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult<ItemResponse<int>> NewUser(UserBaseAddRequest model)
        {
            ObjectResult result = null;
            Guid token;

            try
            {
                int id = _userSvc.Create(model);
                ItemResponse<int> response = new ItemResponse<int> { Item = id };
                if (id != 0)
                {
                    token = _userSvc.CreateRegToken(id);

                    _emailSvc.RegistrationEmail(model.Email, token);

                }
                result = Created201(response);
            }
            catch (Exception ex)
            {
                result = StatusCode(500, new ErrorResponse(ex.Message));
                base.Logger.LogError(ex.ToString());
            }

            return result;
        }

        [HttpGet("confirm/{token}")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> ConfirmRegToken(Guid token)
        {

            int code = 200;
            BaseResponse response = null;
            try
            {
                _userSvc.ConfirmRegToken(token);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }
    }
}
