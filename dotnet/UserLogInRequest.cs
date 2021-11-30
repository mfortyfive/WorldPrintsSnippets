using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;

namespace Sabio.Models.Requests
{
    public class UserLogInRequest
    {

        [Required]
        [EmailAddress]
        [StringLength(100, MinimumLength = 7)]
        public string Email { get; set; }

        [Required]
        [RegularExpression(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", ErrorMessage = "Invalid Password")]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; }
    }
};