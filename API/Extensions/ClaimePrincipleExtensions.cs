using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ClaimePrincipleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
             //Uzimamo username iz tokena koji api uzima za autentikaciju
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }
        public static int GetUserId(this ClaimsPrincipal user)
        {
             //Uzimamo username iz tokena koji api uzima za autentikaciju
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    }
}