class Chatbox {
    constructor() {
        this.args = { // these are class name in HTML template. Names should be equal.
            openButton: document.querySelector('.chatbox__button'), // open, close chat box
            chatBox: document.querySelector('.chatbox__support'),   
            sendButton: document.querySelector('.send__button') // sending message 
        }

        this.state = false; // default = close the box
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args; // arguments

        openButton.addEventListener('click', () => this.toggleState(chatBox)) // click open button, then execute this

        sendButton.addEventListener('click', () => this.onSendButton(chatBox)) // sending message 

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {     // keyup-> hit enter button will send message
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active') // this is connected to CSS file -> pretty
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;        // when its empty, do nothing
        }

        let msg1 = { name: "User", message: text1 } /* text input -> must use same key -> "message" */
        this.messages.push(msg1);
        
        // 원래 이 자리에 이거 있었음 'http://127.0.0.1:5000/predict -> local host'
        fetch( 'http://127.0.0.1:5000/predict', {
        //fetch( $SCRIPT_ROOT + '/predict', {  // predict function in app.py   // SCRIPT_ROOT is defined in HTML bottom!!!
            method: 'POST', // post method
            body: JSON.stringify({ message: text1 }), // make it as string
            mode: 'cors', 
            headers: {
              'Content-Type': 'application/json' // specify the file as json
            },
          })
        // this is end of sending request. Need to get response
          .then(r => r.json()) // extract json
          .then(r => {
            let msg2 = { name: "Sam", message: r.answer };  // this time bot will answer (bot name is Sam)
            this.messages.push(msg2);     // from response result -> app.py predict function
            this.updateChatText(chatbox) // update (separate function)
            textField.value = ''

        }).catch((error) => {   // if errir appears, then gives nothing
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) { // updating function for chatbot
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam") // if its chat bot
            { // define visiter section
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else // otherwise define operator section
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();
