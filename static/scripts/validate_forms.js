const USER_ID_VALIDATION_MSG = "Invaid User ID";
const PASSWORD_VALIDATION_MSG1 = "Confirm Password is not matched with Password";
const PASSWORD_VALIDATION_MSG2 = "Password must contain more than 8 characters";
const PASSWORD_VALIDATION_MSG3 = "Password and User ID should not be same";
const PASSWORD_VALIDATION_MSG4 = "Password and User Name should not be same";
const PASSWORD_VALIDATION_MSG5 = "Invalid password format";
const USER_ID_PASSWORD_VALIDATION_MSG = "Invalid User ID and Password";

response_text = ""
/*========================================================================================*/

function validate_login_form ()
{
    const form = document.getElementById ('login_form');
    const user_id = document.getElementById ('user_id');
    const password = document.getElementById ('password');
    const user_id_value = user_id.value.trim ();
    const password_value = password.value.trim ();
    if (!validate_user_id_and_password (user_id_value, password_value, null))
    {
        document.getElementById ('index_response').innerHTML = response_text;
        form.addEventListener ('submit', (event) =>
        {
            event.preventDefault ();
        });   
        return false; 
    }
    else
        document.forms['login_form'].submit();    
}

/*========================================================================================*/

function validate_signup_form ()
{
    response_text = "";
    const form = document.getElementById ('signup_form');
    const user_id = document.getElementById ('user_id');
    const password = document.getElementById ('password');
    const confirm_password = document.getElementById ('confirm_password');
    submit = document.getElementById ('signup');

    const user_id_value = user_id.value.trim ();
    const password_value = password.value.trim ();
    const confirm_password_value = confirm_password.value.trim ();

    if (!validate_user_id_and_password (user_id_value, password_value, confirm_password_value))
    {
        document.getElementById ('signup_response').innerHTML = response_text;
        form.addEventListener ('submit', (event) =>
        {
                event.preventDefault ();
        });
        return false;   
    }
    else
        document.forms['signup_form'].submit();
}

/*========================================================================================*/

function validate_user_id_and_password(user_id, password, confirm_password)
{
    var is_valid_user_id = validate_user_id (user_id);
    var is_valid_password = validate_password (user_id, password, confirm_password);

    if(!is_valid_user_id && !is_valid_password)
        response_text = USER_ID_PASSWORD_VALIDATION_MSG;

    return is_valid_user_id && is_valid_password;
}

/*========================================================================================*/

function validate_user_id (user_id)
{
    var invalid_chars_pattern = /[^a-zA-Z0-9@_.-]/g;
    var special_char_occurance = /@{2,}/g;
    var special_char_occurance_at_end = /[^a-zA-Z]/g;
    var special_char_occurance_at_start = /[^a-zA-Z0-9_-]/g;

    var first_character = user_id.charAt(0);
    var last_character = user_id.charAt (user_id.length-1);

    var atposition = user_id.lastIndexOf ('@') ;
    var dotposition = user_id.lastIndexOf ('.') ;

    if (// user_id will have invalid charachters
        invalid_chars_pattern.test (user_id) ||
        // check if @ occured more than one time
        special_char_occurance.test (user_id) || 
        // check occurance of special characters at the begenning of user_id id
        special_char_occurance_at_start.test (first_character) || 
        // check occurance of special characters at the end of user_id id
        special_char_occurance_at_end.test (last_character) ||
        //characters are valid now check for the position of @ and .
        atposition == -1 || dotposition == -1 ||
        dotposition - atposition <= 2)
        {
            response_text = USER_ID_VALIDATION_MSG;
            return false;
        }

    return true;
}

/*========================================================================================*/

function validate_password (user_id, password, confirm_password)
{
    var valid_alphabate_pattern1 = /[a-z{1,}]/g;
    var valid_alphabate_pattern2 = /[A-Z{1,}]/g;
    var valid_numeric_pattern = /[0-9{1,}]/g;
    var valid_special_char_pattern = /[^a-zA-Z0-9{1,}]/g;
    var is_valid_password = true;
 
    if (password.length < 8)
    {
        response_text = PASSWORD_VALIDATION_MSG2;
        is_valid_password = false;
    }
    else if ((confirm_password != null) && !(password === confirm_password))
    {
        response_text = PASSWORD_VALIDATION_MSG1;
        is_valid_password = false;
    }
    else if (user_id.toLowerCase () == password.toLowerCase())
    {
        response_text = PASSWORD_VALIDATION_MSG3;
        is_valid_password = false;
    }
    else if (!valid_alphabate_pattern1.test (password) ||
             !valid_alphabate_pattern2.test (password) || 
             !valid_numeric_pattern.test (password) || 
             !valid_special_char_pattern.test (password))
    {
        response_text = PASSWORD_VALIDATION_MSG5;
        is_valid_password = false;
    }

    return is_valid_password;
}