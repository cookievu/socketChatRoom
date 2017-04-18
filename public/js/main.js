const socket = io.connect();

        let username;
        let roomName;

        $(document).ready(() => {

            //title for window chat
            $('.title').text('Chat room - Socket.Io');

            //on button sigin up click
            $('#btn-sign-up').click(() => {
                username = $('#txt-username').val();;
                socket.emit('NEW_USER_SIGN_UP', username); //emit new username to server
            });

            //got message from server for sigin up
            socket.on('SERVER_CONFIRM_USERNAME', isOK => {
                if (isOK) {
                    $('#login-page').hide();
                    $('#room-page').fadeIn();
                    $('.title').text(username + ' / Chat room - Socket.Io');
                } else {
                    $('#alert').text('Username exists or incorrect');
                }
            });

            //got message from server after join room
            socket.on('SERVER_WELCOME_TO_ROOM', msg => {
                console.log(msg);
            });

            //client submit new message
            $('#btn-send-message').click(() => {
                const message = $('#txt-message').val();
                $('#list-message').append(`<li class="right-align"><p class="message me">${message}</p> Me</li>`);
                socket.emit('CLIENT_SEND_MESSAGE', { username, roomName, message }); //emit obj{username, room name, message} to server
                $('#message-panel').scrollTop($('#message-panel').height());
                $('#txt-message').val('');
            });

            //room got message from a client send
            socket.on('GOT_CLIENT_MWSSAGE', msg => {
                const { username, message } = msg;
                $('#list-message').append(`<li class="left-align"><p class="message you"><b>${username}:</b> ${message}</p></li>`);
                $('#message-panel').scrollTop($('#message-panel').height());
            })

        });

        //////////////////////
        //click and joint room
        //////////////////////
        $('#list-room').on('click', 'li', (e) => {
            const $this = $(e.currentTarget);
            $('#list-room').find('li').removeClass('active');
            $this.addClass('active');
            const oldRoom = roomName
            roomName = $this.attr('id');
            $('#room-at').html('<p>' + $this.text() + '</p>');
            socket.emit('CLIENT_JOIN_ROOM', { oldRoom, roomName });
            $('#content-chat').fadeIn();
            $('#list-message').html('');
        });

        $(document).keypress(function (e) {
            if (e.which == 13) $('#btn-send-message').click();
        });