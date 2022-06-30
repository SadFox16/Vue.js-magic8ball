new Vue ({
	el: '#app',
	data: {
        user_input: null,


        value: 1,
        doubleValue: 1
	},
    methods:{

        incremet (value) {
            this.value = value
            this.doubleValue = value * 2
        },

       sendQuestion () {
        fetch(`myserver.com/api/some_action/${this.user_input}`); //добавить взаимодействие с сервером
        //document.getElementById("input1").value="";
       }
    }
});