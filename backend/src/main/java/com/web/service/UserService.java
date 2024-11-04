package com.web.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.web.dto.CustomUserDetails;
import com.web.dto.LoginDto;
import com.web.dto.TokenDto;
import com.web.dto.UserDto;
import com.web.entity.Authority;
import com.web.entity.User;
import com.web.enums.UserType;
import com.web.exception.MessageException;
import com.web.jwt.JwtTokenProvider;
import com.web.mapper.UserMapper;
import com.web.repository.AuthorityRepository;
import com.web.repository.UserRepository;
import com.web.utils.CommonPage;
import com.web.utils.Contains;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.Date;
import java.util.*;

@Component
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CommonPage commonPage;


    
    public TokenDto login(LoginDto loginDto) throws Exception {
        Optional<User> users = userRepository.findByEmail(loginDto.getEmail());
        // check infor user
        checkUser(users);
        if(passwordEncoder.matches(loginDto.getPassword(), users.get().getPassword())){
            CustomUserDetails customUserDetails = new CustomUserDetails(users.get());
            String token = jwtTokenProvider.generateToken(customUserDetails);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setToken(token);
            tokenDto.setUser(userMapper.userToUserDto(users.get()));
            users.get().setLatitude(loginDto.getLatitude());
            users.get().setLongitude(loginDto.getLongitude());
            userRepository.save(users.get());
            return tokenDto;
        }
        else{
            throw new MessageException("Password incorrect", 400);
        }
    }


    
    public User regisUser(User user) {
        userRepository.findByEmail(user.getEmail())
                .ifPresent(exist->{
                    if(exist.getActivation_key() != null){
                        throw new MessageException("Account not active", 330);
                    }
                    throw new MessageException("Email used", 400);
                });
        user.setCreatedDate(new Date(System.currentTimeMillis()));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActived(false);
        user.setActivation_key(userUtils.randomKey());
        user.setUserType(UserType.EMAIL);
        Authority authority = authorityRepository.findById(Contains.ROLE_USER).get();
        user.setAuthorities(authority);
        User result = userRepository.save(user);
        mailService.sendEmail(user.getEmail(), "Confirm account",
                "Use this code to active account<br><br>" +
                "<a style=\"background-color: #2f5fad; padding: 10px; color: #fff; font-size: 18px; font-weight: bold;\">"+user.getActivation_key()+"</a>",false, true);
        return result;
    }

    
    public User addAccount(User user) {
        userRepository.findByEmail(user.getEmail())
                .ifPresent(exist->{
                    if(exist.getActivation_key() != null){
                        throw new MessageException("Account not active", 330);
                    }
                    throw new MessageException("Email used", 400);
                });
        user.setCreatedDate(new Date(System.currentTimeMillis()));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActived(true);
        Authority authority = authorityRepository.findById(Contains.ROLE_ADMIN).get();
        user.setAuthorities(authority);
        User result = userRepository.save(user);
        return result;
    }

    // kich hoat tai khoan
    
    public void activeAccount(String activationKey, String email) {
        Optional<User> user = userRepository.getUserByActivationKeyAndEmail(activationKey, email);
        user.ifPresent(exist->{
            exist.setActivation_key(null);
            exist.setActived(true);
            userRepository.save(exist);
            return;
        });
        if(user.isEmpty()){
            throw new MessageException("Email or confirmation code is incorrect", 404);
        }
    }

    
    public Boolean checkUser(Optional<User> users){
        if(users.isPresent() == false){
            throw new MessageException("Account not found", 404);
        }
        else if(users.get().getActivation_key() != null && users.get().getActived() == false){
            throw new MessageException("Account not acctive", 300);
        }
        else if(users.get().getActived() == false && users.get().getActivation_key() == null){
            throw new MessageException("Account locked", 500);
        }
        return true;
    }

    
    public Page<UserDto> getUserByRole(String role, Pageable pageable) {
        Page<User> page = null;
        if(role != null){
            page = userRepository.getUserByRole(role, pageable);
        }
        else{
            page = userRepository.findAll(pageable);
        }
        List<UserDto> list = userMapper.listUserToListUserDto(page.getContent());
        Page<UserDto> result = commonPage.restPage(page, list);
        return result;
    }

    
    public void changePass(String oldPass, String newPass) {
        User user = userUtils.getUserWithAuthority();
        if(isValidPassword(newPass) == false){
            throw new MessageException("Mật khẩu phải có ít nhất 1 chữ hoa, ký tự đặc biệt và chữ viết thường");
        }
        if(passwordEncoder.matches(oldPass, user.getPassword())){
            if(passwordEncoder.matches(newPass, user.getPassword())){
                throw new MessageException("Mật khẩu mới không được trùng với mật khảu cũ");
            }
            user.setPassword(passwordEncoder.encode(newPass));
            userRepository.save(user);
        }
        else{
            throw new MessageException("Invalid password", 500);
        }
    }

    public boolean isValidPassword(String password) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])\\S{8,}$";
        return password.matches(regex);
    }

    
    public void forgotPassword(String email) {
        Optional<User> users = userRepository.findByEmail(email);
        // check infor user
        checkUser(users);
        String randomPass = userUtils.randomPass();
        users.get().setPassword(passwordEncoder.encode(randomPass));
        userRepository.save(users.get());
        mailService.sendEmail(email, "Quên mật khẩu","Cảm ơn bạn đã tin tưởng và xử dụng dịch vụ của chúng tôi:<br>" +
                "Chúng tôi đã tạo một mật khẩu mới từ yêu cầu của bạn<br>" +
                "Tuyệt đối không được chia sẻ mật khẩu này với bất kỳ ai. Bạn hãy thay đổi mật khẩu ngay sau khi đăng nhập<br><br>" +
                "<a style=\"background-color: #2f5fad; padding: 10px; color: #fff; font-size: 18px; font-weight: bold;\">"+randomPass+"</a>",false, true);

    }

    
    public void guiYeuCauQuenMatKhau(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        checkUser(user);
        String random = userUtils.randomKey();
        user.get().setRememberKey(random);
        userRepository.save(user.get());

        mailService.sendEmail(email, "Forgot password",
                "Click below to reset your new password<br><br>" +
                "<a href='http://localhost:3000/resetpassword?email="+email+"&key="+random+"' style=\"background-color: #2f5fad; padding: 10px; color: #fff; font-size: 18px; font-weight: bold;\">Reset Password</a>",false, true);

    }

    
    public void xacNhanDatLaiMatKhau(String email, String password, String key) {
        Optional<User> user = userRepository.findByEmail(email);
        checkUser(user);
        if(user.get().getRememberKey().equals(key)){
            user.get().setPassword(passwordEncoder.encode(password));
            userRepository.save(user.get());
        }
        else{
            throw new MessageException("Activation key incorrect");
        }
    }

    
    public TokenDto loginWithGoogle(GoogleIdToken.Payload payload, Float latitude, Float longitude) {
        User user = new User();
        user.setEmail(payload.getEmail());
        user.setFullName(payload.get("name").toString());
        user.setActived(true);
        user.setAuthorities(authorityRepository.findByName(Contains.ROLE_USER));
        user.setCreatedDate(new Date(System.currentTimeMillis()));
        user.setLatitude(latitude);
        user.setLongitude(longitude);
        user.setUserType(UserType.GOOGLE);

        Optional<User> users = userRepository.findByEmail(user.getEmail());
        // check infor user

        if(users.isPresent()){
            if(users.get().getActived() == false){
                throw new MessageException("Account locked");
            }
            CustomUserDetails customUserDetails = new CustomUserDetails(users.get());
            String token = jwtTokenProvider.generateToken(customUserDetails);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setToken(token);
            tokenDto.setUser(userMapper.userToUserDto(users.get()));
            users.get().setLatitude(latitude);
            users.get().setLongitude(longitude);
            userRepository.save(users.get());
            return tokenDto;
        }
        else{
            User u = userRepository.save(user);
            CustomUserDetails customUserDetails = new CustomUserDetails(u);
            String token = jwtTokenProvider.generateToken(customUserDetails);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setToken(token);
            tokenDto.setUser(userMapper.userToUserDto(u));
            return tokenDto;
        }
    }
}
