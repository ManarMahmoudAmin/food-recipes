//register
(
    function(){
        let userList = JSON.parse(localStorage.getItem("userList")) || []; // Retrieve users from localStorage or initialize an empty array

        var signupInput=document.querySelector("#signup-btn")
        var signinInput=document.querySelector("#signin-btn")
        var userName=document.querySelector("#username-input")
        var emailInput=document.querySelector("#Email-input")
        var passwordInput=document.querySelector("#Pass-input")
        var passwordConf=document.querySelector("#rePass-input")
        var profile_img=document.querySelector("#profile")

        // register
        if(signupInput)
        {
            signupInput.addEventListener("click", (e) => {
                e.preventDefault(); // Prevent form submission
                validinputs();
                const user = {
                    name: userName.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value.trim(),
                    profile: "imgs/persons/unknown.png",
                    favouriteitems:[]
                };
                console.log(user);
                
                // Input validation
                if (validateInputs(user)) {
                    
                    // Check for duplicate email
                    if (userList.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
                    
                       emailInput.classList.add("is-invalid") // Show duplicate error
                       emailInput.parentElement.querySelector('.invalid-feedback').innerHTML="Email already exists. Please use another email."+
                       "<button type='button' class='btn-close' ></button>"
                        return;
                    }
                    //check for confirming password
                    if(user.password!==passwordConf.value){
                        passwordConf.classList.add("is-invalid")
                        return
                    }
                    console.log(profile_img);
                    
                    if(profile_img.value)
                    {
                        var profile=profile_img.files[0]
                        console.log("upload profile_img");
                        console.log(profile.type);
                        
                        if(!profile.type.startsWith('image/'))
                        {
                            profile_img.classList.add("is-invalid")
                            return
                        }
                        else{
                            const reader=new FileReader()
                            reader.onload= function(d){
                                debugger
                                const base64Image=d.target.result;
                                user.profile=base64Image;
                                userList.push(user); // Add new user to userList
                                localStorage.setItem("userList", JSON.stringify(userList)); // Save updated userList to localStorage
                                setcookies("signInUser",JSON.stringify(user.email),1/2)
                                // console.log("userin",getcookies('signInUser'))
                
                                alert("Registration successful!");
                                
                                clearInputs(); // Clear form inputs
                                console.log(window.location.href);
                                
                                window.location.href = "index.html"

                            };
                            reader.readAsDataURL(profile);
                            return

                            
                        }

                    }
                    else{
                        userList.push(user); // Add new user to userList
                        localStorage.setItem("userList", JSON.stringify(userList)); // Save updated userList to localStorage
                        setcookies("signInUser",JSON.stringify(user.email),1)
                        // console.log("userin",getcookies('signInUser'))
        
                        alert("Registration successful!");
                        
                        clearInputs(); // Clear form inputs
                        console.log(window.location.href);
                        window.location.href = "index.html"
                        return

                    }
                    
                } 
                else
                {
                    if(!user.name)
                        userName.classList.add("is-invalid")
                    if(!user.email || !validEmail(user)){
                        emailInput.classList.add("is-invalid")
                        emailInput.parentElement.querySelector('.invalid-feedback').innerHTML="you should enter email in format name@email.com."+
                        "<button type='button' class='btn-close' ></button>"
                    }
                    if(!user.password)
                        passwordInput.classList.add("is-invalid")
                }
            });
    
        }
        
        function validateInputs(user) {
            
            return user.name && user.email && user.password && validEmail(user);
        }
        function validEmail(user){
            
            return /\S+@\S+\.\S+/.test(user.email)
        }
        function clearInputs() {
            userName.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            passwordConf.value = "";
            document.getElementById("profile").value = "";
        }
        function validinputs(){
        userName.classList.remove("is-invalid")
        emailInput.classList.remove("is-invalid")
        passwordInput.classList.remove("is-invalid")
        passwordConf.classList.remove("is-invalid")
        profile_img.classList.remove("is-invalid")
        
        }






        //login
        login(signinInput,userList)

        function login(signinInput,userList)
        {
            if(signinInput)
                {
                    signinInput.addEventListener("click", (e) => {
                        let signned=false
                        console.log("login clicked");
                        
                        e.preventDefault(); 
                        const registeredUser = {
                            email: emailInput.value.trim(),
                            password: passwordInput.value.trim(),
                        };
                        console.log(registeredUser);
                        
                        // Input validation
                        //check correct email &pass    
                        userList.forEach(u => {
                            if(u.email.toLowerCase() === registeredUser.email.toLowerCase() && u.password===registeredUser.password) {
                            setcookies("signInUser",JSON.stringify(u.email),1)
                            console.log("userin",getcookies('signInUser'))
                            alert("logined successful!");
                            signned=true
                            window.location.href = "index.html"
                            return
                        }
                           
                        });
                        if(!signned)
                        {
                            emailInput.classList.add("is-invalid")
                            emailInput.value="";
                            passwordInput.value = "";
                        }
        
                    });
            
            
            
                    
                }
        
        }
        
    }()
);


//6
//cookies

function setcookies(name, value, expirationHours) {
    const date = new Date();
    date.setTime(date.getTime() + (expirationHours * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    console.log(expires);
    console.log(name);
    console.log(value);
    
    
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    // Note: You cannot restrict access to this file only via cookie settings.
}

function getcookies(searchedpropetry)
{
    var objects=document.cookie.split(";")
    for(var object of objects)
    {
        var cookie=object.split("=")
        var prop=cookie[0]
        var value=cookie[1]
        if(prop==searchedpropetry)
        {
            // console.log("is existing\n","propetry= "+prop+", value= "+value)
            return value
        }

    }
    return null
}

  
function get_user_info(user_mail,userList)
{
    var user={};
    userList.forEach(u => {
        if(u.email.toLowerCase() ===user_mail.toLowerCase() )
            user=u;
    });
    return user
}
