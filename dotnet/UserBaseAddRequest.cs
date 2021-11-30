using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;

namespace Sabio.Models.Requests
{
    public class UserBaseAddRequest : UserLogInRequest
    {

        [Required]
        [Compare("Password", ErrorMessage = "Password does not match")]
        public string ConfirmPassword { get; set; }

        public int RoleId  { get; set; }


    }
}