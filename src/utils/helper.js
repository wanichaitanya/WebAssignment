const PASSWORD_VALIDATION_MSG1 = "Confirm Password is not matched with Password";
const PASSWORD_VALIDATION_MSG2 = "Password must contain more than 8 characters";
const PASSWORD_VALIDATION_MSG3 = "Password and User ID should not be same";
const PASSWORD_VALIDATION_MSG4 = "Invalid password format";
const PASSWORD_VALIDATION_MSG5 = "Email and Password should not be same";
const INVALID_EMAIL_ID = "Invalid Email format!";
const EMAIL_ID_PASSWORD_VALIDATION_MSG = "Invalid Email and Password!";

export default class InputValidation
{
    static validateEmailId (emailId)
    {
        let response_text = "";
        let invalid_chars_pattern = /[^a-zA-Z0-9@_.-]/g;
        let special_char_occurance = /@{2,}/g;
        let special_char_occurance_at_end = /[^a-zA-Z]/g;
        let special_char_occurance_at_start = /[^a-zA-Z0-9_-]/g;
    
        let first_character = emailId.charAt(0);
        let last_character = emailId.charAt (emailId.length-1);
    
        let atposition = emailId.lastIndexOf ('@') ;
        let dotposition = emailId.lastIndexOf ('.') ;
    
        if (// emailId will have invalid charachters
            invalid_chars_pattern.test (emailId) ||
            // check if @ occured more than one time
            special_char_occurance.test (emailId) || 
            // check occurance of special characters at the begenning of emailId id
            special_char_occurance_at_start.test (first_character) || 
            // check occurance of special characters at the end of emailId id
            special_char_occurance_at_end.test (last_character) ||
            //characters are valid now check for the position of @ and .
            atposition === -1 || dotposition === -1 ||
            dotposition - atposition <= 2)
                response_text = INVALID_EMAIL_ID;    
        return response_text;
    }  

    static validatePassword (emailId, password, confirm_password)
    {
        let response_text = "";
        let valid_alphabate_pattern1 = /[a-z{1,}]/g;
        let valid_alphabate_pattern2 = /[A-Z{1,}]/g;
        let valid_numeric_pattern = /[0-9{1,}]/g;
        let valid_special_char_pattern = /[^a-zA-Z0-9{1,}]/g;
     
        if (password.length < 8)
            response_text = PASSWORD_VALIDATION_MSG2;
        else if (confirm_password !== null && password !== confirm_password)
            response_text = PASSWORD_VALIDATION_MSG1;
        else if (emailId.toLowerCase () === password.toLowerCase())
            response_text = PASSWORD_VALIDATION_MSG3;
        else if (!valid_alphabate_pattern1.test (password) ||
                 !valid_alphabate_pattern2.test (password) || 
                 !valid_numeric_pattern.test (password) || 
                 !valid_special_char_pattern.test (password))
            response_text = PASSWORD_VALIDATION_MSG4;
        else if (emailId === password)
            response_text = PASSWORD_VALIDATION_MSG5;
    
        return response_text;
    }

    static validateEmailIdAndPassword(emailId, password, confirm_password)
    {
        let response_text = '';
        const userIdValidationMsg = InputValidation.validateEmailId (emailId);
        const passwordValidationMsg = InputValidation.validatePassword (emailId, password, confirm_password);
    
        if (userIdValidationMsg.length > 0 && passwordValidationMsg.length === 0)
            return userIdValidationMsg;
  
        if (passwordValidationMsg.length > 0 && userIdValidationMsg.length === 0)
            return passwordValidationMsg;

        if(userIdValidationMsg.length > 0 && passwordValidationMsg.length > 0)
            return EMAIL_ID_PASSWORD_VALIDATION_MSG;
        
        return response_text;
    }
}
