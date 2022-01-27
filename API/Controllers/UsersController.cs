using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
        public class UsersController : BaseApiController
    {
        private readonly IPhotoService _photoService;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _maper;
        
        public UsersController(IPhotoService photoService, IUserRepository userRepository,IMapper maper)
        {
            this._maper = maper;
            this._photoService = photoService;
            this._userRepository = userRepository;

        }
        //putanja za pristu ovo dijelu: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers([FromQuery]UserParams userParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername = User.GetUsername();

            if(string.IsNullOrEmpty(userParams.Gender)){
                userParams.Gender = user.Gender =="male" ? "female":"male";
            }
            var users = await _userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);

            return Ok(users);
        }

        //api/users/2 - treba da vrati usera sa id=2
        [HttpGet("{username}",Name="GetUser")]
        public async Task<ActionResult<MemberDTO>> GetUser(string username)
        {
            var user = await _userRepository.GetMemberAsync(username);
            return user;
        }
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
           
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            //Da ne bi za svaki property od userra koristili
            //uer.City = memberUpdateDto.City...
            //koristimo auto maper koji sve to uradi umjesto nas
            //Funkcija Map mapira memeberUpdate ka user-u
            _maper.Map(memberUpdateDto,user);

            _userRepository.Update(user);

            if(await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update user");
        }
        
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file) 
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error != null) {
                return BadRequest(result.Error.Message);
            }
            var photo = new Photo{
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0) {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync()){
                //return _maper.Map<PhotoDto>(photo);
               // return CreatedAtRoute("GetUser",_maper.Map<PhotoDto>(photo)); - nije dobro jer 
               // ruta GetUser ima parametar username koji takodje moramo proslijediti
               //koristimo CreatedAtRoute(routeName,routeValue,value) 
               return CreatedAtRoute("GetUser",new {username = user.UserName},_maper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding photo");  
        }

        [HttpPut("set-main-photo/{photoId}")]

        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if(photo.IsMain) return BadRequest("This is alredy your main phto");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            if(currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo"); 
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if(photo == null) return NotFound();
            if(photo.IsMain) return BadRequest("You cannot delete youre main photo");
            if(photo.PublicId != null) {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if(await _userRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to delete photo");



        }
    }
}