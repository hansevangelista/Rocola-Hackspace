function render (template) {

    function render (data) {
        var html = template(data);
        return html;
    }

    return{
        render: render
    };
}
