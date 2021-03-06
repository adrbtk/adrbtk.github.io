var app = new Vue({
    el: '#app',
    data: {
        query_pinyin: '',
        result: '',
        pinyin: ''
    },
    methods: {
        onClick: function() {
            console.log(this.query_pinyin)
            axios.post('https://3.142.12.46/translate', {query: this.query_pinyin})
                .then(response => {
                    this.pinyin = response.data.pinyin
                    this.result = response.data.result
                    })
                .catch(error => {console.log(error)})
        },
        doCopy: function() {
            var el = document.querySelector('.result_ua');
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            try{
                document.execCommand('copy');
            }catch(error){
                console.log(error);
            }
        }
    }
});